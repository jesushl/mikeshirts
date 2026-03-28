# Mike Shirts

## What This Is

E-commerce de playeras geek con estilo mexicano, marca propia. Una tienda online donde los clientes pueden explorar y comprar playeras de diseños originales que combinan cultura geek con identidad mexicana. Opera con un modelo híbrido: inventario fijo de poco stock más producción on-demand interna cuando se agota o se lanzan diseños nuevos.

## Core Value

Un cliente puede encontrar una playera, pagarla con Mercado Pago y recibir un ticket de venta y envío — sin fricción, desde cualquier dispositivo, en México.

## Requirements

### Validated (v1.0 — 2026-03-28)

Scope del hito v1.0 entregado en código (API + SPA). Validación de negocio en producción pendiente de deploy y tráfico real.

- Catálogo con variantes, stock, carrito, checkout Mercado Pago, pedidos y tickets
- Auth (JWT + OAuth Google + email), perfil y direcciones
- Panel admin por roles (`/gestion`), inventario, analítica y funnel
- SEO base (meta, OG, sitemap, robots, JSON-LD), páginas legales
- Frontend responsive: home, catálogo, producto, carrito, checkout, pedidos, legal

### Active (post-v1 / operación)

- [ ] Deploy producción (hosting, PostgreSQL, media persistente S3/Cloudinary)
- [ ] Email transaccional SMTP (confirmación de pedido, etc.)
- [ ] Suite de tests automatizados (Django + frontend)
- [ ] Validación en staging: flujo de pago MP end-to-end con credenciales de prueba

### Out of Scope

- **Personalización de diseño por el cliente** — el on-demand es decisión interna del equipo, no customización pública
- **Pagos internacionales / multi-moneda** — solo México, solo MXN
- **Integración directa con API de Meta Ads** — v1 solo genera imágenes en formatos compatibles; la publicación es manual
- **App móvil nativa** — v1 es web responsive solamente
- **Integración automática con paqueterías (API de Estafeta, DHL, etc.)** — v1 maneja envíos de forma manual/flexible

## Context

- Negocio nuevo, sin base de clientes previa
- Diseños propios con temática geek-mexicana (anime, videojuegos, cómics + cultura mexicana)
- Referencia visual: geeksoutfit.com
- Equipo pequeño: los mismos roles admin operan todo (ventas, producción, envíos)
- Stock bajo por naturaleza — no es warehouse grande, es producción controlada
- La analítica de tráfico es clave para medir ROI de publicaciones en redes sociales

## Constraints

- **Tech stack**: Django REST Framework (backend) + React (frontend) + SQLite (dev local)
- **Pagos**: Mercado Pago — único procesador, solo MXN
- **Geografía**: Solo envíos dentro de México
- **Auth**: OAuth 2.0 para clientes (Google + Facebook + Instagram + email fallback)
- **Almacenamiento**: Imágenes de productos necesitan hosting (definir: local vs S3 vs Cloudinary)
- **Base de datos dual**: una para la app principal (inventario, pedidos, usuarios), otra para analítica (visitas, cookies, conversiones)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Mercado Pago como procesador de pagos | Único mercado es México, MP tiene la mayor penetración y soporta OXXO, tarjeta, SPEI | Integrado v1.0; validar en prod |
| Django + React separados (API + SPA) | Permite escalar frontend y backend independientemente; React facilita formatos para Meta | Entregado v1.0 |
| SQLite para dev local | Simplicidad para desarrollo; migración a PostgreSQL en producción será directa con Django ORM | `prod.py` usa Postgres |
| Base de datos de analítica separada | No mezclar datos transaccionales con tracking; permite consultas pesadas sin afectar la tienda | Router + DB `analytics` en dev |
| Sistema de envíos manual/flexible | No hay proveedor definido; el sistema debe permitir agregar cualquiera sin cambios de código | Panel envíos v1.0 |
| Modelo híbrido stock + on-demand | Negocio nuevo con poco capital; on-demand reduce riesgo de inventario muerto | Lógica en API + UI disponibilidad |

---
*Last updated: 2026-03-28 — milestone v1.0 complete-milestone*
