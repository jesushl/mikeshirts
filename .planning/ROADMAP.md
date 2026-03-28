# Roadmap — Mike Shirts

## Milestone: v1.0 — Tienda Online Mike Shirts

**Estado:** **COMPLETADO** — 2026-03-28 (`complete-milestone`). Backend fases 1–5 + frontend fases 6–8 ejecutadas.

**5 phases** | **37 requirements** | All v1 requirements covered ✓

---

### Phase 1 — Foundation & Auth

**Goal:** Usuario puede registrarse con Google o email, completar su perfil con dirección de envío, y mantener sesión persistente.

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04

**Success criteria:**
1. Un usuario nuevo puede registrarse con Google OAuth y con email/password
2. El perfil exige nombre, teléfono y al menos una dirección antes de poder comprar
3. JWT con refresh token mantiene la sesión activa entre visitas
4. La estructura del proyecto (Django + React + Vite) está scaffoldeada y corriendo

---

### Phase 2 — Catálogo & Inventario

**Goal:** Admin puede gestionar productos con variantes e imágenes; cliente puede navegar, filtrar, buscar playeras y ver disponibilidad de stock.

**Requirements:** CAT-01, CAT-02, CAT-03, CAT-04, CAT-05, CAT-06, CAT-07, INV-01, INV-02, INV-03, ADM-05, ADM-06

**Success criteria:**
1. Admin puede crear un producto con variantes (talla/color), imágenes y tabla de tallas
2. Cliente ve el catálogo con filtros funcionales y búsqueda por texto
3. Cada producto tiene su landing page con URL shareable
4. El stock se muestra como "disponible" o "se produce en X días"

---

### Phase 3 — Carrito, Pagos & Pedidos

**Goal:** Cliente puede agregar al carrito, pagar con Mercado Pago, y recibir confirmación con tickets de venta, envío y producción generados automáticamente.

**Requirements:** CART-01, CART-02, CART-03, CART-04, PAY-01, PAY-02, PAY-03, ORD-01, ORD-02, ORD-03, ORD-04, ORD-05

**Success criteria:**
1. Carrito persiste para anónimos (session) y se migra al login
2. Checkout en 3 pasos con estimado de envío visible
3. Pago con Mercado Pago funciona (tarjeta, OXXO, SPEI) con webhooks
4. Tras pago aprobado se generan ticket de venta + ticket de envío (+ producción si aplica)
5. Cliente recibe email de confirmación y puede ver estado del pedido

---

### Phase 4 — Panel Admin & Operaciones

**Goal:** Cada rol (ventas, envíos, producción) tiene su dashboard con las herramientas para operar el negocio día a día.

**Requirements:** ADM-01, ADM-02, ADM-03, ADM-04

**Success criteria:**
1. Dashboard de ventas muestra pedidos recientes, tickets de venta, métricas básicas
2. Dashboard de producción muestra tickets pendientes con fechas y permite marcar completados
3. Dashboard de envíos permite capturar guía, paquetería, costo y marcar como enviado
4. Cada rol solo ve su sección; admin ve todo

---

### Phase 5 — Analítica, SEO & Polish

**Goal:** Tracking de visitas y conversiones funcional; sitio optimizado para Google, LLMs y redes sociales; cumple con regulación mexicana.

**Requirements:** ANA-01, ANA-02, ANA-03, ANA-04, ANA-05, FE-01, FE-02, FE-03, FE-04, FE-05

**Success criteria:**
1. Base de datos de analítica separada registra visitas, pageviews y fuente UTM
2. Funnel de conversión visible en dashboard admin
3. Sitio tiene meta tags, Open Graph, sitemap.xml, robots.txt, JSON-LD y llms.txt
4. Imágenes de producto disponibles en formatos Meta (1:1, 4:5, 9:16)
5. Páginas legales publicadas (envío, devoluciones, privacidad)
6. Responsive mobile-first verificado en dispositivos reales

---

## Frontend Phases (backend API complete)

### Phase 6 — Frontend Scaffold & Auth UI

**Goal:** SPA React corriendo con Vite + Tailwind, conectada al backend API. Auth flow completo: login, register, perfil, direcciones, rutas protegidas.

**Requirements:** FE-01 (base), AUTH-01..04 (UI)

**Success criteria:**
1. Vite + React + TypeScript + Tailwind + React Router + Zustand scaffoldeado
2. API client con interceptors JWT (access en memory, refresh via cookie)
3. Login/register funcionan y persisten sesión
4. Mi Cuenta: editar perfil, gestionar direcciones
5. Layout responsive: header con nav, footer, mobile menu

---

### Phase 7 — Catálogo, Producto & Carrito UI

**Goal:** Cliente puede navegar el catálogo, ver un producto con variantes/stock/tallas, y gestionar su carrito.

**Requirements:** CAT-05..07, CART-01..02, INV-03 (UI)

**Success criteria:**
1. Home con hero y productos destacados
2. Catálogo con filtros (categoría, talla, color, precio), búsqueda, paginación
3. Página de producto con galería, tabla de tallas, selector de variante, disponibilidad
4. Carrito drawer con agregar/editar/eliminar, subtotal, envío, total
5. Eventos de analítica enviados al backend (product_view, add_to_cart)

---

### Phase 8 — Checkout, Pedidos, Admin Panel & Polish

**Goal:** Flujo de compra completo, panel admin por roles, páginas legales, SEO, responsive final.

**Requirements:** CART-03..04, FE-01..05, ADM-01..04 (UI)

**Success criteria:**
1. Checkout 3 pasos: dirección → MP redirect → confirmación
2. Páginas post-pago: success, failure, pending
3. Mis pedidos + detalle con tickets y status
4. Panel admin con dashboards por rol
5. Páginas legales (envío, devoluciones, privacidad)
6. Meta tags, Open Graph, responsive mobile-first verificado

---
*Last updated: 2026-03-28 — milestone v1.0 marked complete*
