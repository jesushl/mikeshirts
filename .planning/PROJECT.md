# Mike Shirts

## What This Is

E-commerce de playeras geek con estilo mexicano, marca propia. Una tienda online donde los clientes pueden explorar y comprar playeras de diseños originales que combinan cultura geek con identidad mexicana. Opera con un modelo híbrido: inventario fijo de poco stock más producción on-demand interna cuando se agota o se lanzan diseños nuevos.

## Core Value

Un cliente puede encontrar una playera, pagarla con Mercado Pago y recibir un ticket de venta y envío — sin fricción, desde cualquier dispositivo, en México.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Catálogo de productos con variantes (talla, color) y estado de stock
- [ ] Carrito de compra persistente con flujo completo hasta checkout
- [ ] Integración de pagos con Mercado Pago (MXN)
- [ ] Registro/login de clientes vía OAuth 2.0 con perfil completo (nombre, email, teléfono, dirección de envío, RFC opcional)
- [ ] Generación de tickets de venta tras pago exitoso
- [ ] Generación de tickets de envío vinculados al ticket de venta
- [ ] Generación de tickets de producción on-demand cuando el stock no alcanza
- [ ] Panel administrativo con roles: admin, ventas, envíos, producción
- [ ] Gestión de inventario (stock actual, umbral bajo, estado por variante)
- [ ] Gestión de diseños/catálogo por el equipo interno (subir imágenes, mockups, descripciones)
- [ ] Frontend React responsive, con imágenes adaptables a formatos de publicidad Meta (1:1, 4:5, 9:16)
- [ ] Backend Django REST API con SQLite para desarrollo local
- [ ] Base de datos de analítica separada: cookies, tracking de visitas, fuente de tráfico (red social, directo, referral), funnel de conversión (visita → carrito → compra)
- [ ] Sistema de envíos flexible sin proveedor fijo (campos manuales: guía, paquetería, costo, estatus)

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
- **Auth**: OAuth 2.0 para clientes (Google como mínimo)
- **Almacenamiento**: Imágenes de productos necesitan hosting (definir: local vs S3 vs Cloudinary)
- **Base de datos dual**: una para la app principal (inventario, pedidos, usuarios), otra para analítica (visitas, cookies, conversiones)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Mercado Pago como procesador de pagos | Único mercado es México, MP tiene la mayor penetración y soporta OXXO, tarjeta, SPEI | — Pending |
| Django + React separados (API + SPA) | Permite escalar frontend y backend independientemente; React facilita formatos para Meta | — Pending |
| SQLite para dev local | Simplicidad para desarrollo; migración a PostgreSQL en producción será directa con Django ORM | — Pending |
| Base de datos de analítica separada | No mezclar datos transaccionales con tracking; permite consultas pesadas sin afectar la tienda | — Pending |
| Sistema de envíos manual/flexible | No hay proveedor definido; el sistema debe permitir agregar cualquiera sin cambios de código | — Pending |
| Modelo híbrido stock + on-demand | Negocio nuevo con poco capital; on-demand reduce riesgo de inventario muerto | — Pending |

---
*Last updated: 2026-03-27 after new-project questioning*
