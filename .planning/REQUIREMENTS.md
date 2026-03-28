# Requirements — Mike Shirts

## v1 Requirements

### A. Autenticación y Usuarios

- [ ] **AUTH-01** — Registro/login con Google OAuth 2.0
- [ ] **AUTH-02** — Registro/login con email y password (fallback)
- [ ] **AUTH-03** — Perfil completo: nombre, email, teléfono, dirección(es) de envío, RFC opcional
- [ ] **AUTH-04** — Flujo "completar perfil" obligatorio antes del primer checkout

### B. Catálogo y Productos

- [ ] **CAT-01** — CRUD de productos con nombre, descripción, precio (IVA incluido), categoría temática
- [ ] **CAT-02** — Variantes por producto (talla, color)
- [ ] **CAT-03** — Múltiples imágenes por producto con imagen principal
- [ ] **CAT-04** — Tabla de tallas con medidas en cm
- [ ] **CAT-05** — Filtros: talla, color, precio, categoría
- [ ] **CAT-06** — Búsqueda por texto
- [ ] **CAT-07** — Landing page individual por producto (URL shareable)

### C. Inventario

- [ ] **INV-01** — Stock por variante (cantidad disponible)
- [ ] **INV-02** — Umbral de stock bajo configurable por variante
- [ ] **INV-03** — Estado visible: "disponible" vs "se produce en X días"

### D. Carrito y Checkout

- [ ] **CART-01** — Carrito persistente (session para anónimos, DB para autenticados)
- [ ] **CART-02** — Merge de carrito al login
- [ ] **CART-03** — Checkout en 3 pasos: dirección → pago → confirmación
- [ ] **CART-04** — Estimado de costo de envío visible desde el carrito

### E. Pagos

- [ ] **PAY-01** — Integración Mercado Pago Checkout Pro (tarjeta, OXXO, SPEI)
- [ ] **PAY-02** — Webhooks para confirmación de pago (no IPN)
- [ ] **PAY-03** — Manejo de estados: pending, approved, rejected, cancelled

### F. Pedidos y Tickets

- [ ] **ORD-01** — Generación de ticket de venta tras pago aprobado
- [ ] **ORD-02** — Generación de ticket de envío vinculado a la venta
- [ ] **ORD-03** — Generación de ticket de producción cuando stock no alcanza
- [ ] **ORD-04** — Seguimiento de pedido: pagado → en producción → enviado → entregado
- [ ] **ORD-05** — Confirmación de compra por email

### G. Panel Administrativo

- [ ] **ADM-01** — Dashboard por rol (admin, ventas, envíos, producción)
- [ ] **ADM-02** — Ventas: ver pedidos, tickets de venta, métricas básicas
- [ ] **ADM-03** — Producción: ver/gestionar tickets de producción
- [ ] **ADM-04** — Envíos: capturar guía, paquetería, costo, marcar enviado
- [ ] **ADM-05** — Admin: gestión de catálogo, usuarios, configuración
- [ ] **ADM-06** — Gestión de diseños (subir imágenes, mockups, descripciones)

### H. Analítica

- [ ] **ANA-01** — Base de datos separada para analítica
- [ ] **ANA-02** — Tracking de visitas y pageviews (server-side)
- [ ] **ANA-03** — Captura de UTM / fuente de tráfico en primera visita
- [ ] **ANA-04** — Funnel de conversión: visita → producto → carrito → checkout → compra
- [ ] **ANA-05** — Dashboard de analítica para admin

### I. Frontend y Meta

- [ ] **FE-01** — Diseño responsive mobile-first
- [ ] **FE-02** — Imágenes de producto en formatos Meta (1:1, 4:5, 9:16)
- [ ] **FE-03** — Páginas legales: envío, devoluciones, privacidad (PROFECO)
- [ ] **FE-04** — SEO para robots de búsqueda: meta tags, Open Graph, sitemap.xml, robots.txt, URLs canónicas, structured data (JSON-LD Product schema)
- [ ] **FE-05** — SEO para LLMs: llms.txt con descripción estructurada de la tienda, catálogo y productos

## v2 Requirements

- Wishlist / favoritos
- Reviews y ratings de clientes
- Chat en vivo / soporte
- Programa de lealtad / puntos
- Integración directa con API de Meta Ads (publicación automática)
- Integración automática con APIs de paqueterías (Estafeta, DHL, 99Minutos)
- App móvil nativa
- Multi-idioma
- Notificaciones push (stock disponible, ofertas)
- Cupones y códigos de descuento

## Out of Scope

- **Personalización de diseño por el cliente** — el on-demand es decisión interna, no customización pública
- **Pagos internacionales / multi-moneda** — solo México, solo MXN
- **Suscripción / caja mensual** — modelo de negocio diferente
- **Comparador de productos** — no aplica para playeras
- **Marketplace de terceros** — solo marca propia

---
*Last updated: 2026-03-27 after new-project research*
