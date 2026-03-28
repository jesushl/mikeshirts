# Research Summary — Mike Shirts

## Recommended Stack

- **Backend**: Django 5.1+ / Django REST Framework 3.15+ / SQLite (dev) → PostgreSQL (prod)
- **Auth**: drf-social-oauth2 (Google OAuth2) + django-simplejwt + registro email/password como fallback
- **Pagos**: Mercado Pago Checkout Pro (redirect flow) + webhooks para confirmación
- **Frontend**: React 18+ / Vite 5+ / Tailwind CSS 3+ / Zustand (state) / React Router 6+
- **Analytics**: django-attribution para UTM + middleware server-side + DB separada con DATABASE_ROUTERS
- **Arquitectura**: Monolito modular Django con SPA React separada

## Table Stakes (no negociables para v1)

1. Catálogo con fotos de calidad, filtros, tabla de tallas
2. Carrito persistente + checkout en <3 pasos
3. Pagos con Mercado Pago (tarjeta, OXXO, SPEI)
4. Confirmación por email + seguimiento de pedido básico
5. Mobile-first responsive
6. Precios con IVA incluido + políticas claras (PROFECO)

## Key Architecture Decisions

1. **Monolito modular** — no microservicios; equipo pequeño, negocio nuevo
2. **DB dual desde el día 1** — app principal + analítica separada con DATABASE_ROUTERS
3. **Carrito session-based para anónimos** — migra a DB al login
4. **Webhooks de MP, nunca IPN** — IPN está siendo discontinuado
5. **Tracking server-side como fuente primaria** — los adblockers bloquean el pixel del frontend
6. **Build order**: Auth → Catálogo → Carrito → Pagos → Tickets → Admin → Analytics → Polish

## Top Pitfalls to Avoid

1. **Race condition en stock** — usar `select_for_update()` al decrementar
2. **No validar webhooks de MP** — verificar firma siempre
3. **No migrar carrito anónimo al login** — merge explícito session → DB
4. **Estados pendientes de MP** — OXXO/SPEI no confirman al instante; manejar pending
5. **Mobile-last** — 70%+ del tráfico es móvil en México
6. **No capturar UTM en primera visita** — guardar en cookie al primer hit
