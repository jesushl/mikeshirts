# Pitfalls Research — Mike Shirts

## 1. Mercado Pago — Errores Comunes

| Pitfall | Prevención |
|---------|------------|
| **IPN deprecado** — Muchos tutoriales usan IPN (Instant Payment Notification) pero MP lo está discontinuando | Usar **Webhooks** desde el inicio, nunca IPN |
| **Credenciales test vs prod mezcladas** — MP requiere cuentas de prueba separadas; usar tokens de prod en test causa errores silenciosos | Separar settings por environment; nunca hardcodear tokens |
| **No validar webhooks** — Cualquiera puede hacer POST a tu endpoint | Verificar firma del webhook con el secret de MP |
| **No manejar estados pendientes** — OXXO y SPEI no confirman al instante; muchos devs solo manejan "approved" | Implementar estados: pending → approved/rejected/cancelled |
| **No usar la herramienta de calidad** — MP lanzó en 2026 un quality checker obligatorio antes de producción | Correr el quality check de MP antes de ir a prod |
| **Redirect URLs mal configuradas** — El usuario paga pero no regresa a la tienda | Configurar success/failure/pending URLs y testear cada flujo |

## 2. Django + React Separados

| Pitfall | Prevención |
|---------|------------|
| **CORS mal configurado** — React en :3000 no puede hablar con Django en :8000 | Instalar django-cors-headers desde el día 1; whitelist explícita |
| **JWT expiration mal manejada** — Token expira mid-session, usuario pierde carrito | Implementar refresh token rotation; interceptor Axios para auto-refresh |
| **No migrar carrito anónimo** — Usuario agrega items, hace login, carrito vacío | Merge explícito: session cart → user cart al autenticarse |
| **N+1 queries en catálogo** — Listar productos con variantes + imágenes sin select_related | Usar select_related/prefetch_related en los ViewSets del catálogo |
| **Imágenes pesadas sin optimizar** — Fotos de playeras de 5MB+ destruyen el performance | Resize en upload (max 1200px), WebP format, lazy loading en React |

## 3. Modelo Híbrido Stock + On-Demand

| Pitfall | Prevención |
|---------|------------|
| **Race condition en stock** — Dos usuarios compran la última unidad al mismo tiempo | select_for_update() en Django ORM al decrementar stock |
| **No definir umbral de on-demand** — ¿Cuándo se manda a producir? ¿A stock 0? ¿A stock 2? | Campo `low_stock_threshold` por variante; ticket automático al cruzarlo |
| **Tiempo de producción no comunicado** — Cliente espera 3 días, producción tarda 2 semanas | Mostrar "disponible" vs "se produce en X días" claramente en el frontend |
| **Ticket de producción sin seguimiento** — Se crea pero nadie lo ve | Dashboard de producción con tickets pendientes, alertas, fechas límite |

## 4. OAuth2 / Auth

| Pitfall | Prevención |
|---------|------------|
| **Solo Google OAuth** — ¿Qué pasa si el usuario no tiene Google? | Ofrecer registro con email/password como fallback |
| **No pedir datos faltantes post-OAuth** — Google da nombre y email, pero no teléfono ni dirección | Flujo de "completar perfil" obligatorio antes del primer checkout |
| **Token storage inseguro** — Guardar JWT en localStorage es vulnerable a XSS | httpOnly cookies para refresh token; access token en memoria |

## 5. Analítica

| Pitfall | Prevención |
|---------|------------|
| **Tracking bloqueado por adblockers** — Los pixels del frontend no llegan | Tracking server-side (middleware Django) como fuente primaria; frontend como complemento |
| **No capturar UTM en primera visita** — El usuario llega desde Instagram, navega, compra después; se pierde la atribución | Guardar UTM en cookie al primer hit; vincular a la sesión de analítica |
| **Base de analítica crece sin límite** — Cada pageview es un row | Retention policy: agregar datos viejos y purgar raw data >90 días |
| **No separar DB desde el inicio** — "Después la separo" nunca pasa | Configurar DATABASE_ROUTERS desde el primer commit |

## 6. General E-commerce México

| Pitfall | Prevención |
|---------|------------|
| **No mostrar precio con IVA incluido** — En México el precio al consumidor debe incluir IVA | Todos los precios en la tienda son finales (IVA incluido) |
| **Costo de envío sorpresa en checkout** — Primera causa de abandono de carrito | Mostrar estimado de envío lo antes posible (página de producto o carrito) |
| **No tener política de devoluciones clara** — Obligatorio por PROFECO | Página de políticas visible desde el footer y el checkout |
| **Mobile-last** — El 70%+ del tráfico es móvil en México | Diseñar mobile-first; testear en dispositivos reales |
