# Decision Journal — 2026-03-27

## [21:30] AbstractUser extendido vs. User default + Profile separado

**Context:** Definiendo el modelo de usuario para Mike Shirts, un e-commerce Django donde los usuarios tienen datos de perfil (phone, rfc, auth_provider, direcciones) y necesitan ser trazables en una base de datos de analítica separada. La decisión se toma antes de la primera migración — después de eso, cambiar el User model es destructivo.

**Paths considered:**
- **A — AbstractUser extendido:** Agregar campos directamente al User (phone, rfc, auth_provider). Una sola tabla, queries directas, sin JOINs obligatorios. Más rígido si se quieren campos opcionales masivos en el futuro.
- **B — User default + Profile (OneToOneField):** User de Django intacto, datos extra en tabla Profile. Más "separación de concerns". Pero: cada query necesita `select_related('profile')`, riesgo de User sin Profile (bug silencioso), formularios escriben en dos tablas, la analítica necesita resolver el JOIN para identificar al usuario completo.

**Chosen:** A — AbstractUser extendido

**Rationale:** Consistencia sólida: una tabla, un objeto, sin riesgo de desincronización. El Profile separado aumentaría el mantenimiento sin beneficio real para un modelo de datos que ya se conoce (los campos phone, rfc, auth_provider son conocidos y estables). Además, para analítica, un User con todos sus campos en una tabla permite identificar y diferenciar objetos de usuario sin JOINs — más limpio para queries de tracking.

**Expected consequences:**
- **Más fácil:** queries de usuario simples, formularios de perfil sin lógica dual, analítica con referencia directa al User, serializers DRF más limpios
- **Más difícil:** si en el futuro se necesitan 20+ campos opcionales de perfil, la tabla User crece — pero para un e-commerce de playeras esto es improbable
- **Riesgo:** si se olvida definir `AUTH_USER_MODEL` en settings antes de la primera migración, hay que recrear la DB desde cero

**Outcome (to fill later):** _pending_

---
