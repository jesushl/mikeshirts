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

## [21:40] Django Groups vs. campo role vs. modelo Role custom

**Context:** Definiendo cómo asignar roles admin (ventas, envíos, producción, admin) a los usuarios del panel de Mike Shirts. El equipo es pequeño — una persona puede cubrir múltiples roles. Los roles determinan qué secciones del admin panel ve cada usuario.

**Paths considered:**
- **A — Django Groups:** Nativo del framework. Un usuario pertenece a N groups. Permisos asignados por group. `user.groups.filter(name='ventas')` para verificar. Admin UI incluida. La comunidad lo mantiene y testea.
- **B — Campo `role` CharField con choices:** Simple de implementar (`role = CharField(choices=ROLES)`). Pero: un usuario solo puede tener un rol. Agregar roles requiere migración. No tiene sistema de permisos granulares built-in.
- **C — Modelo Role custom (ManyToMany):** Máximo control. Pero reinventa lo que Django Groups ya resuelve — misma tabla ManyToMany, sin la integración con el admin ni el sistema de permisos.

**Chosen:** A — Django Groups

**Rationale:** Groups es parte del framework con trabajo hecho por la comunidad — se extiende a más funciones sin tocar el modelo User. El campo role CharField agregaría un posible fallo futuro: cada rol nuevo requiere migración y un solo rol por usuario no refleja la realidad del equipo pequeño. El modelo Role custom reimplementa lo que Groups ya hace sin beneficio adicional.

**Expected consequences:**
- **Más fácil:** agregar roles nuevos sin migraciones (solo crear Group en admin/fixture), múltiples roles por usuario, permisos granulares por group, `has_perm()` funciona out of the box
- **Más difícil:** los Groups no tienen metadata custom (descripción, color, ícono) — si se necesita eso, habrá que crear un modelo GroupProfile auxiliar
- **Riesgo:** si los Groups iniciales no se crean en un fixture/migration, el primer deploy puede tener usuarios sin roles

**Outcome (to fill later):** _pending_

---
