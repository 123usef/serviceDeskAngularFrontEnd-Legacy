# ServiceDesk Legacy — Angular 15 Training Project

A deliberately legacy Angular 15 application for enterprise training. Trainees modernize
this codebase over a 5-day course (migrate to standalone, add interceptors, optimize
change detection, add tests).

## Prerequisites

- **Node 18** (required — Angular 15 does not support Node 20+)
- nvm-windows installed (see SETUP.md for details)

## Quick Start

```powershell
# 1. Switch to Node 18
nvm use 18
node -v   # must show v18.x

# 2. Install dependencies
npm install

# 3. Point at the ServiceDesk API
#    Edit src/environments/environment.ts and set apiUrl to your hosted API:
#    apiUrl: 'https://your-api-host.com/api'

# 4. Start the dev server
ng serve

# 5. Open http://localhost:4200 — you will be redirected to /auth/login
```

## Build

```powershell
ng build
```

Build artifacts are written to `dist/servicedesk-legacy/`.

## Project Structure

```
src/app/
  core/       CoreModule — singleton services, guards, models, constants
  shared/     SharedModule — presentational components, pipes
  layout/     LayoutModule — MainLayout (sidebar+header), AuthLayout
  features/   Lazy-loaded feature modules: auth, dashboard, tickets, admin
```

## API Configuration

The app consumes a .NET ServiceDesk API. All endpoints are defined in
`src/app/core/constants/api-endpoints.ts`. The base URL is set in
`src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://your-api-host.com/api'   // <-- set this
};
```

## Training Notes

This codebase contains intentional legacy patterns. See `LEGACY-AUDIT.md` for the full
list, grouped by the training day that addresses each one.
