# Mike Shirts E-commerce — Design
_Brainstorm session: 2026-03-27_

## Context

E-commerce de playeras geek con estilo mexicano. Marca propia, modelo híbrido (stock fijo + on-demand). Backend Django REST API + Frontend React SPA. Mercado Pago para pagos (México, MXN). Equipo pequeño que opera todos los roles.

## Approaches Considered

### Option A: Monolito modular Django + SPA React separada (CHOSEN)
- **Pros:** Rápido de desarrollar, un solo deploy, Django ORM maneja transacciones atómicas fácilmente, admin y tienda comparten componentes React
- **Cons:** Bundle del frontend incluye código admin (mitigado con lazy loading)
- **Trade-offs:** No escala a millones de requests, pero no necesita hacerlo en v1

### Option B: Microservicios Django + React
- **Pros:** Escala independiente por servicio
- **Cons:** Overengineering para equipo pequeño, complejidad operativa alta, transacciones distribuidas complejas
- **Trade-offs:** Solo vale la pena con 15+ devs y >50M revenue

### Option C: Django fullstack (templates) sin React
- **Pros:** Más simple, menos moving parts
- **Cons:** No genera formatos Meta fácilmente, no es SPA, peor UX en carrito/checkout
- **Trade-offs:** Sacrifica demasiada flexibilidad de frontend

## Chosen Approach

**Option A — Monolito modular Django + SPA React**

## Design

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React SPA (Vite)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Tienda       │  │  Mi Cuenta   │  │  Admin Panel   │  │
│  │  (público)    │  │  (auth)      │  │  (roles)       │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬───────┘  │
│         └─────────────────┼───────────────────┘          │
│                           │ Axios + JWT                   │
└───────────────────────────┼──────────────────────────────┘
                            │
                    ┌───────▼───────┐
                    │  Django DRF    │
                    │  REST API      │
                    │  :8000         │
                    └───┬───────┬───┘
                        │       │
              ┌─────────▼─┐ ┌──▼──────────┐
              │ DB App     │ │ DB Analytics │
              │ (SQLite)   │ │ (SQLite)     │
              └────────────┘ └─────────────┘
```

### Authentication

**Providers:**
- Google OAuth 2.0
- Facebook OAuth 2.0 (Meta)
- Instagram OAuth 2.0 (Meta — via Facebook Login for Business)
- Email + password (fallback)

**Stack:**
- `drf-social-oauth2` — bridges `python-social-auth` + `django-oauth-toolkit`
- Social backends: `social_core.backends.google.GoogleOAuth2`, `social_core.backends.facebook.FacebookOAuth2`, `social_core.backends.instagram.InstagramOAuth2`
- JWT via `djangorestframework-simplejwt` for session management

**Flow:**
1. React shows login buttons (Google, Facebook, Instagram, Email)
2. User clicks social login → redirects to provider
3. Provider returns auth code → React sends to `/auth/convert-token`
4. `drf-social-oauth2` exchanges code for provider token, creates/finds user, returns JWT
5. Access token (15min) in memory (Zustand), refresh token (7 days) in httpOnly cookie
6. Axios interceptor auto-refreshes on 401

**Facebook/Instagram specifics:**
- Both use Meta's Facebook Login platform
- Instagram login requires Facebook Login for Business (same app, different scope)
- Scopes: `email`, `public_profile` for Facebook; `user_profile`, `user_media` for Instagram
- Requires Meta App Review for production (can use test mode during development)

**Post-auth "complete profile" gate:**
- After first social login, check if profile is complete (phone, address)
- If not → redirect to `/cuenta/completar-perfil`
- Block checkout until profile is complete

### Data Flow: Purchase

```
Cliente navega catálogo
  → Agrega al carrito (session cookie si anónimo)
  → Login/registro (Google / Facebook / Instagram / email)
  → Merge carrito anónimo → DB
  → Checkout paso 1: selecciona/confirma dirección
  → Checkout paso 2: redirect a Mercado Pago
  → MP procesa pago
  → Webhook POST /api/payments/webhook/
      │
      ├─ approved  → Order "pagado" + SaleTicket + ShipTicket/ProductionTicket + email
      ├─ pending   → Order "pendiente_pago", esperar siguiente webhook
      └─ rejected  → Order "rechazado", notificar cliente
```

### Data Model (key entities)

```
User (AbstractUser)
├── email, phone, rfc_optional
├── role: customer | admin | ventas | envios | produccion
├── auth_provider: google | facebook | instagram | email
└── addresses: [Address]

Product
├── name, slug, description, category, base_price
├── size_chart: JSON
├── allows_on_demand: True (always in v1)
├── production_days: int
└── variants: [Variant]
     ├── size, color, sku
     ├── stock_quantity, low_stock_threshold
     └── images: [ProductImage]

Cart → CartItem (variant + quantity)

Order
├── user, status, total, shipping_address
├── mp_preference_id, mp_payment_id
└── items: [OrderItem]

SaleTicket    (1:1 con Order aprobada)
ShipTicket    (1:1 con Order)
ProductionTicket (1:N con OrderItem cuando stock insuficiente)

── DB Analytics ──
Visit (session_id, cookie, utm_source/medium/campaign, referrer, timestamp)
PageView (visit, url, timestamp)
FunnelEvent (visit, step: view|cart|checkout|purchase, timestamp)
```

### Admin Panel (protected routes)

```
/admin/            → redirect según rol
/admin/ventas      → pedidos, tickets de venta, métricas
/admin/produccion  → tickets de producción
/admin/envios      → tickets de envío, captura de guía
/admin/catalogo    → CRUD productos (solo admin)
/admin/usuarios    → gestión cuentas (solo admin)
/admin/analytics   → funnel, visitas, fuentes (solo admin)
```

### Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Stock 0 behavior | Client can buy → production ticket | Never block a sale; on-demand is core business model |
| Admin panel | Same React app, role-protected routes | One deploy; lazy loading mitigates bundle size |
| Images (dev) | MEDIA_ROOT local | No external deps; migrate to S3 for production |
| Anonymous cart | Session cookie → merge to DB on login | select_for_update() on merge to prevent race conditions |
| Webhooks MP | Validate signature + handle all states | Idempotent by mp_payment_id; atomic transactions |
| Auth providers | Google + Facebook + Instagram + email | Meta social login captures users coming from Meta ads |

### Critical Risk: Webhook Chain

The webhook → tickets → stock pipeline must be:
1. **Idempotent:** store `mp_payment_id`, reject duplicate webhooks
2. **Atomic:** entire block in `transaction.atomic()` + `select_for_update()` on stock
3. **Retry-safe:** return 200 to MP even if processing fails internally (queue for retry)

## Open Questions

1. **Meta App Review timeline** — Facebook/Instagram OAuth requires app review for production. Need to apply early (can take 1-4 weeks).
2. **Email service** — What sends confirmation emails? Django's built-in SMTP? SendGrid? Resend? (Can decide in Phase 3)
3. **Image hosting in production** — S3 vs Cloudinary. Not needed for v1 dev but needs decision before deploy.
