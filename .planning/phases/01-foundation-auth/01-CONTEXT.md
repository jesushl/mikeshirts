# Phase 1: Foundation & Auth - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold completo del proyecto (Django backend + React frontend) y sistema de autenticación funcional con OAuth social (Google, Facebook, Instagram) y email/password. Al terminar esta fase, un usuario puede registrarse, loguearse, y tener sesión persistente con JWT.

</domain>

<decisions>
## Implementation Decisions

### Estructura Django
- App unificada `accounts` para User model, OAuth, perfiles, direcciones
- `AbstractUser` extendido desde el día 1 (phone, rfc, auth_provider)
- Settings split: `mike_shirts/settings/base.py`, `dev.py`, `prod.py`
- Proyecto raíz: `mike_shirts/` (convención Django default)

### Flujo OAuth Frontend
- Redirect completo (no popup) — más compatible con móviles, sin problemas de popups bloqueados
- Auto-merge de cuentas: si el email ya existe, se vincula la cuenta social automáticamente (`SOCIAL_AUTH_PIPELINE`)
- Registro disponible en cualquier momento (botón visible en header), no solo en checkout
- Post-login: banner persistente "Completa tu perfil" si faltan datos; bloqueo solo al intentar checkout

### Modelo de User y Roles
- Django Groups para roles admin (ventas, envíos, producción, admin)
- Un usuario puede tener múltiples roles (equipo pequeño, una persona cubre varias funciones)
- Modelos proxy: `Customer` y `StaffUser` sobre el mismo User — managers separados sin tablas extra
- Solo el superadmin crea usuarios admin desde el panel React (`/admin/usuarios`)

### Scaffold Frontend React
- Routing con 3 niveles + lazy loading desde el día 1:
  - Público: `/`, `/catalogo`, `/producto/:slug`, `/login`, `/registro`
  - Autenticado: `/cuenta/*`, `/carrito`, `/checkout`
  - Admin: `/admin/*` (lazy loaded)
- Tema oscuro con acentos de color vibrante (referencia: geeksoutfit.com)
- Tipografía: Inter o Plus Jakarta Sans (body) + display bold (headings), Google Fonts
- Header fijo estándar: logo izquierda, búsqueda centro, carrito + cuenta + menú móvil derecha

### Auth Stack
- `drf-social-oauth2` — bridges python-social-auth + django-oauth-toolkit
- Backends: Google, Facebook, Instagram (via Facebook Login for Business)
- `djangorestframework-simplejwt` para JWT
- Access token: 15min, en memoria (Zustand)
- Refresh token: 7 días, httpOnly cookie
- Axios interceptor para auto-refresh en 401

### Claude's Discretion
- Estructura exacta de carpetas dentro de `apps/accounts/`
- Configuración específica de `SOCIAL_AUTH_PIPELINE` steps
- Nombres de endpoints de la API auth (convención REST estándar)
- Componentes internos del formulario "completar perfil"

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Ninguno — proyecto greenfield, no hay código existente

### Established Patterns
- Ninguno — esta fase establece los patrones base que todas las demás seguirán

### Integration Points
- Django CORS headers necesario desde el inicio (React :5173 → Django :8000)
- DATABASE_ROUTERS setup desde el inicio (aunque analytics DB se usa en Phase 5)
- `.gitignore` ya existe con `.claude/` excluido

</code_context>

<specifics>
## Specific Ideas

- Referencia visual: geeksoutfit.com — tema oscuro, estética geek
- Los providers de OAuth deben incluir Google + Facebook + Instagram (Meta)
- El banner de "completar perfil" debe ser visible pero no bloqueante hasta checkout

</specifics>

<deferred>
## Deferred Ideas

- Mega-header con categorías visibles — evaluar cuando el catálogo crezca (Phase 2+)
- Elección final de colores de acento — refinar en Phase 5 (polish)

</deferred>

---
*Phase: 01-foundation-auth*
*Context gathered: 2026-03-27*
