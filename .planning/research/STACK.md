# Stack Research — Mike Shirts

## Backend

| Componente | Recomendación | Versión | Notas |
|------------|---------------|---------|-------|
| Framework | Django | 5.1+ | LTS, ORM maduro, admin built-in |
| API | Django REST Framework | 3.15+ | Estándar de facto para APIs Django |
| Auth (OAuth2) | drf-social-oauth2 | 3.1+ | Puente entre python-social-auth y django-oauth-toolkit; endpoint `/auth/convert-token` para exchange de tokens sociales |
| Auth alternativa | django-allauth | 65+ | Más battle-tested, soporte nativo para Google, One Tap Sign-In |
| Pagos | mercadopago SDK oficial | 2.x | SDK Python oficial de Mercado Pago; preferir sobre wrappers de terceros para soporte directo |
| Django MP helper | django-mercadopago-integration | 1.0+ | Plug-and-play: webhooks, logs automáticos, split payments |
| UTM/Analytics | django-attribution | 0.1.6 | Tracking de UTM, cookies para anónimos, touchpoints de marketing |
| DB dev | SQLite | 3.x | Desarrollo local; Django ORM permite migrar a PostgreSQL sin cambios |
| DB producción | PostgreSQL | 16+ | Recomendado para producción (fuera de v1 scope pero preparar migrations) |
| Imágenes | Pillow + django-imagekit | - | Resize/thumbnails automáticos; almacenamiento local en dev, S3/Cloudinary en prod |
| CORS | django-cors-headers | 4.x | Necesario para SPA React separada |
| Tareas async | django-q2 o Celery | - | Para webhooks de MP, emails, generación de tickets (v2, no v1) |

## Frontend

| Componente | Recomendación | Versión | Notas |
|------------|---------------|---------|-------|
| Framework | React | 18+ | SPA, separado del backend |
| Build tool | Vite | 5+ | Rápido, mejor DX que CRA |
| Router | React Router | 6+ | Estándar para SPAs React |
| State | Zustand o React Context | - | Zustand para carrito/global; Context para auth |
| HTTP client | Axios o fetch nativo | - | Axios si se necesitan interceptors para tokens |
| UI Components | Tailwind CSS + Headless UI | 3.x / 2.x | Flexible, responsive, buen performance |
| Analytics frontend | Pixel tracking custom | - | Enviar eventos al backend Django para la DB de analítica |
| Imágenes Meta | Canvas API o sharp (build) | - | Generar formatos 1:1, 4:5, 9:16 para Meta ads |

## Qué NO usar

| Tecnología | Razón |
|------------|-------|
| Django templates para frontend | Imposibilita la separación API/SPA y los formatos Meta |
| Create React App (CRA) | Deprecated, Vite es el estándar |
| GraphQL | Overengineering para este tamaño de proyecto; REST es suficiente |
| Microservicios | Equipo pequeño, negocio nuevo; monolito modular es la opción correcta |
| Firebase/Supabase como DB | Se pierde el control del ORM Django y la lógica de negocio |
| Stripe | No tiene penetración en México; Mercado Pago soporta OXXO, SPEI, tarjeta |
