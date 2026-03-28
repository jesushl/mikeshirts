# Architecture Research — Mike Shirts

## Decisión: Monolito Modular

Para un equipo pequeño, negocio nuevo, y <1M visitas/mes, un **monolito modular** es la arquitectura correcta:

- Una sola instancia Django sirve toda la API
- React SPA separada consume la API vía REST
- Dos bases de datos: app principal (SQLite dev / PostgreSQL prod) + analítica (SQLite separada)
- Sin service mesh, sin message queues, sin containers orquestados en v1

## Estructura de Apps Django

```
mike_shirts/
├── backend/
│   ├── config/              ← Settings, URLs, WSGI
│   ├── apps/
│   │   ├── accounts/        ← User model, OAuth2, perfiles, direcciones
│   │   ├── catalog/         ← Productos, diseños, variantes, imágenes
│   │   ├── inventory/       ← Stock por variante, umbrales, movimientos
│   │   ├── cart/            ← Carrito (session-based para anónimos, DB para auth)
│   │   ├── orders/          ← Pedidos, tickets de venta
│   │   ├── payments/        ← Integración Mercado Pago, webhooks
│   │   ├── shipping/        ← Tickets de envío, tracking manual
│   │   ├── production/      ← Tickets de producción on-demand
│   │   ├── admin_panel/     ← Vistas y permisos por rol (admin, ventas, envíos, producción)
│   │   └── analytics/       ← Tracking de visitas, UTM, cookies, funnel
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/           ← Home, Catálogo, Producto, Carrito, Checkout, MiCuenta
│   │   ├── components/      ← ProductCard, CartDrawer, SizeChart, etc.
│   │   ├── hooks/           ← useCart, useAuth, useAnalytics
│   │   ├── services/        ← API client (axios), auth service
│   │   ├── store/           ← Zustand stores (cart, auth, ui)
│   │   └── utils/           ← Formatters, image helpers, Meta format generators
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── docs/
```

## Data Flow Principal

```
Cliente (React SPA)
  │
  ├── GET /api/catalog/products/     → Lista de productos
  ├── POST /api/cart/items/          → Agregar al carrito
  ├── POST /api/orders/checkout/     → Crear orden + redirect a Mercado Pago
  │
  │   Mercado Pago (externo)
  │   │
  │   └── POST /api/payments/webhook/  → Notificación de pago
  │       │
  │       ├── Actualizar orden → "pagado"
  │       ├── Generar ticket de venta
  │       ├── Si hay stock → Generar ticket de envío
  │       └── Si NO hay stock → Generar ticket de producción
  │
Admin Panel (React SPA, misma app con rutas protegidas)
  │
  ├── Ventas: ver pedidos, tickets de venta, métricas
  ├── Producción: ver tickets de producción, marcar completados
  ├── Envíos: ver tickets de envío, capturar guía/paquetería
  └── Admin: todo lo anterior + gestión de catálogo, usuarios, config
```

## Base de Datos Dual

```
DB Principal (default):          DB Analítica (analytics):
├── accounts_user                ├── analytics_visit
├── accounts_address             ├── analytics_pageview
├── catalog_product              ├── analytics_event
├── catalog_variant              ├── analytics_utmsource
├── catalog_productimage         ├── analytics_session
├── inventory_stock              └── analytics_funnel
├── cart_cart
├── cart_cartitem
├── orders_order
├── orders_orderitem
├── orders_saleticket
├── shipping_shipticket
├── production_prodticket
└── payments_transaction
```

Django soporta múltiple databases nativamente con `DATABASE_ROUTERS`.

## Componentes Clave

| Componente | Patrón |
|------------|--------|
| Auth | JWT (access + refresh tokens) vía drf-social-oauth2 para OAuth, simplejwt para session |
| Carrito anónimo | Session-based (cookie); se migra a DB al hacer login |
| Pagos | Checkout Pro de Mercado Pago (redirect); webhook para confirmar |
| Imágenes | Upload al backend, resize con Pillow, servir estáticos en dev |
| Permisos admin | Django groups + custom permissions per app |
| Analítica | Middleware Django para server-side + eventos desde React vía API |

## Build Order Sugerido

1. **Accounts + Auth** — sin usuarios no hay nada
2. **Catalog + Inventory** — sin productos no hay tienda
3. **Cart + Checkout** — sin compra no hay negocio
4. **Payments (Mercado Pago)** — cierra el ciclo de venta
5. **Orders + Tickets** — venta, envío, producción
6. **Admin Panel** — gestión por roles
7. **Analytics** — tracking y funnel
8. **Meta formats + polish** — imágenes para redes, SEO, responsive final
