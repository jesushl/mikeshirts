# Phase 1: Foundation & Auth — Research

## Don't Hand-Roll

### OAuth2 / Social Auth
- **Don't build your own OAuth2 flow** — use `drf-social-oauth2` (bridges `python-social-auth` + `django-oauth-toolkit`). Handles token exchange, user creation, pipeline customization.
- **Don't manage social tokens manually** — `python-social-auth` stores them in `social_auth_usersocialauth` table automatically. Use `social_django.models.UserSocialAuth` to query.
- **Don't write your own JWT** — use `djangorestframework-simplejwt`. Handles access/refresh rotation, blacklisting, and token verification.
- For Facebook/Instagram: both use Meta's Facebook Login platform. Instagram OAuth requires Facebook Login for Business — same Meta app, different scope. Use `social_core.backends.facebook.FacebookOAuth2` and `social_core.backends.instagram.InstagramOAuth2`.

### CORS
- **Don't configure CORS manually** — use `django-cors-headers`. Add `corsheaders.middleware.CorsMiddleware` BEFORE `CommonMiddleware` in MIDDLEWARE (order matters — breaks silently if wrong).
- Dev config: `CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]`

### React Project
- **Don't use Create React App** — deprecated. Use `npm create vite@latest frontend -- --template react-ts` for TypeScript + Vite.
- **Don't build a custom HTTP client wrapper** — use Axios with interceptors for JWT refresh. One file, reusable across the app.

## Common Pitfalls

### Django Custom User Model
- **Must define `AUTH_USER_MODEL = 'accounts.User'` in settings BEFORE the first `migrate`**. If you forget and run migrations with the default User, you'll need to recreate the database. There is no fix for this after the fact.
- **Must create the accounts app and User model BEFORE any other app model that references User**. Django resolves foreign keys at migration time.
- AbstractUser already includes `username`, `email`, `first_name`, `last_name`, `is_staff`, `is_active`, `date_joined`. Don't re-declare these.

### drf-social-oauth2 Setup
- Requires creating an `Application` object in the database (via admin or fixture) with `client_type: confidential` and `authorization_grant_type: authorization-code`. Without this, `/auth/convert-token` returns 400 silently.
- The `SOCIAL_AUTH_PIPELINE` must include `social_core.pipeline.social_auth.associate_by_email` for auto-merge of accounts with same email. Without it, a user who registers with email and later tries Google login gets a duplicate account.
- **Instagram OAuth caveat:** Instagram Basic Display API was deprecated in 2024. Use Instagram Graph API via Facebook Login for Business. Scope: `instagram_basic`, `pages_show_list`.

### JWT + httpOnly Cookies
- Access token in memory (Zustand store) is lost on page refresh. The refresh token in httpOnly cookie survives. On app load, the first action must be: call `/api/auth/refresh/` — if it returns a new access token, the user is still logged in.
- Set `SIMPLE_JWT['AUTH_COOKIE_SAMESITE'] = 'Lax'` (not `Strict`) or the cookie won't be sent on OAuth redirect callbacks.
- `SIMPLE_JWT['ROTATE_REFRESH_TOKENS'] = True` + `BLACKLIST_AFTER_ROTATION = True` prevents refresh token reuse attacks.

### React + Vite + Django CORS
- Vite dev server runs on :5173 by default. Django on :8000. Without CORS headers, every API call fails silently in the browser (no error in Django logs, only in browser console).
- Vite proxy (`vite.config.js` → `server.proxy`) is an alternative to CORS in dev, but then CORS issues only surface in production. Better to configure CORS from day 1.

### Django Groups for Roles
- Groups must be created before they can be assigned. Use a data migration or management command:
  ```python
  # In accounts/management/commands/setup_groups.py
  Group.objects.get_or_create(name='ventas')
  Group.objects.get_or_create(name='envios')
  Group.objects.get_or_create(name='produccion')
  Group.objects.get_or_create(name='admin_full')
  ```
- `user.groups.filter(name='ventas').exists()` is O(1) with proper indexing. Don't cache groups in the User model.

### Proxy Models (Customer / StaffUser)
- Proxy models share the same database table. `Customer.objects.all()` returns only users matching the proxy's custom manager filter.
- The custom manager must filter on a reliable criterion. Since we use Groups: `StaffUser` = users in any staff group; `Customer` = users in no staff group.
- **Gotcha:** `isinstance(user, Customer)` always returns `True` for any User because proxy models share the same Python class hierarchy. Use the manager, not isinstance.

## Existing Patterns

- **No existing code** — greenfield project.
- `.gitignore` exists with `.claude/` excluded.
- `.planning/` structure established with config, PROJECT, REQUIREMENTS, ROADMAP, STATE.
- Git initialized with 7 commits of planning artifacts.

## Recommended Approach

### Build Order for Phase 1
1. **Django scaffold** — project structure, settings split, requirements.txt
2. **Custom User model + migrations** — MUST be first app created
3. **OAuth + JWT endpoints** — social auth + email/password + token management
4. **React scaffold** — Vite + routing + Axios + auth store
5. **Auth UI** — login/register pages + profile completion flow

This order is non-negotiable: the User model must exist before any other model can reference it, and the backend must be running before the frontend can authenticate against it.
