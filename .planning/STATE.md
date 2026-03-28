# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-27)

**Core value:** Un cliente puede encontrar una playera, pagarla con Mercado Pago y recibir un ticket de venta y envío — sin fricción, desde cualquier dispositivo, en México.
**Current focus:** All phases complete — v1.0 ready

## Current Position

Phase: 8 of 8 (Checkout, Pedidos, Admin Panel & Polish) — COMPLETE
Plan: 08-01, 08-02, 08-03, 08-04 executed (4 waves)
Status: **Phase 8 DONE**. All 4 waves executed. Full frontend SPA complete.
Last activity: 2026-03-28 — Phase 8 executed (all 27 tasks)

Progress: [██████████] 100% (backend) / [██████████] 100% (frontend)

## Performance Metrics

**Velocity:**
- Total plans completed: 16 (01-01..05-02, 06-01, 07-01..07-03, 08-01..08-04)
- Average duration: ~1 session each
- Total execution time: ~10 sessions

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Mercado Pago como procesador (México, OXXO/SPEI/tarjeta)
- Monolito modular Django + SPA React separada
- SQLite dev, PostgreSQL prod
- DB dual: app + analítica separada
- Color/Size como CharField choices (no modelos)
- Slug auto desde nombre, editable en admin
- Shipping flat rate $249 MXN en settings
- Stock se deduce en webhook (post-pago), no en checkout
- Email console backend en dev, SMTP pendiente para prod
- Dirección de envío como JSON snapshot en Order
- **Frontend:** Vite 6 + React 18 + TypeScript + Tailwind CSS 4
- **Auth:** Access token en Zustand (memoria), refresh en httpOnly cookie, interceptor Axios auto-refresh
- **Paleta:** #0a0a0a fondo, #e11d48 accent, #06b6d4 cyan, #f5f5f5 texto
- **Logo:** Calavera de ratón estilo Día de Muertos mexicano con colores de marca
- **Referencia visual:** geeksoutfit.com (dark, bold, urbano)
- **Filtros mobile:** Sheet/modal con botón "Filtros" (estilo geeksoutfit)
- **Galería producto:** Thumbnails laterales (desktop) + swipe (mobile)
- **Productos destacados:** Campo `is_featured` en Product model (requiere migración)
- **Cart UI:** Drawer slide-over + página completa /carrito
- **Admin panel:** UI completa y pulida, mismo nivel que la tienda
- **Admin route:** `/gestion/*` (español, consistente)
- **Meta tags:** react-helmet-async para SEO dinámico
- **Legal pages:** Contenido real basado en PROFECO y LFPDPPP

### Pending Todos

None yet.

### Blockers/Concerns

- Node.js 22.9.0 no compatible con Vite 8 — usando Vite 6 como workaround.

## Session Continuity

Last session: 2026-03-28
Stopped at: Phase 8 COMPLETE. All 8 phases executed. v1.0 Tienda Online Mike Shirts ready.
Resume file: N/A — all phases done. Next: QA, deploy, or iteration.
