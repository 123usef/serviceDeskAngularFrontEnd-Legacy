# LEGACY-AUDIT.md — Trainer Cheat-Sheet

Every intentional legacy pattern in this codebase, grouped by the training day that fixes it.

---

## Day 2 — Migrate to Modern Angular

### NgModules (→ standalone components)
Every component is declared in an NgModule. There are 13 module files:
- `src/app/app.module.ts` (root)
- `src/app/core/core.module.ts` (import-once guard)
- `src/app/shared/shared.module.ts`
- `src/app/layout/layout.module.ts`
- `src/app/features/auth/auth.module.ts`
- `src/app/features/auth/auth-routing.module.ts`
- `src/app/features/dashboard/dashboard.module.ts`
- `src/app/features/dashboard/dashboard-routing.module.ts`
- `src/app/features/tickets/tickets.module.ts`
- `src/app/features/tickets/tickets-routing.module.ts`
- `src/app/features/admin/admin.module.ts`
- `src/app/features/admin/admin-routing.module.ts`
- `src/app/app-routing.module.ts`

### *ngIf / *ngFor / [ngSwitch] (→ @if / @for / @switch)
Used in 16 template files across all features. Key examples:
- `sidebar.component.html` — `*ngIf` for role-based menu visibility
- `ticket-list.component.html` — `*ngFor` on ticket rows (no trackBy — see Day 4)
- `ticket-detail.component.html` — `*ngIf` for conditional sections
- `login.component.html` — `*ngIf` for loading state
- `dashboard-home.component.html` — `*ngFor` on stat cards
- All admin management templates — `*ngIf` / `*ngFor`

### Constructor injection (→ inject() function)
All services and components use `constructor(private ...)` pattern:
- `src/app/core/services/auth.service.ts`
- `src/app/core/services/ticket.service.ts`
- `src/app/core/services/comment.service.ts`
- `src/app/core/services/lookup.service.ts`
- `src/app/core/services/dashboard.service.ts`
- `src/app/core/guards/auth.guard.ts`
- `src/app/core/guards/role.guard.ts`
- `src/app/layout/sidebar/sidebar.component.ts`
- `src/app/layout/header/header.component.ts`
- All feature page components

### @Input() / @Output() decorators (→ input() / output() signals)
Used in 11 component files:
- `src/app/shared/components/status-badge/status-badge.component.ts`
- `src/app/shared/components/page-header/page-header.component.ts`
- `src/app/shared/components/data-table/data-table.component.ts`
- `src/app/shared/components/confirm-dialog/confirm-dialog.component.ts`
- `src/app/shared/components/empty-state/empty-state.component.ts`
- `src/app/shared/components/search-input/search-input.component.ts`
- `src/app/features/dashboard/components/stats-card/stats-card.component.ts`
- `src/app/features/dashboard/components/recent-tickets/recent-tickets.component.ts`
- `src/app/features/tickets/components/ticket-form/ticket-form.component.ts`
- `src/app/features/tickets/components/comment-list/comment-list.component.ts`
- `src/app/features/tickets/components/comment-form/comment-form.component.ts`

### Module-based lazy loading (→ loadComponent standalone)
All four feature modules lazy-loaded via `loadChildren` in:
- `src/app/app-routing.module.ts` (lines 16, 20, 25, 36)

### No signals anywhere
Zero usage of `signal()`, `computed()`, `effect()`, `toSignal()`, `toObservable()`.
State is managed via class properties and `BehaviorSubject` + `asObservable()`.

### HttpClientModule in NgModule (→ provideHttpClient)
- `src/app/core/core.module.ts` — imports `HttpClientModule`

### platformBrowserDynamic bootstrap (→ bootstrapApplication)
- `src/main.ts` — `platformBrowserDynamic().bootstrapModule(AppModule)`

---

## Day 3 — Secure & Centralize

### No HTTP interceptors (manual Bearer header everywhere)
The `src/app/core/interceptors/` folder contains only a README.md placeholder.
Every service that calls the API builds auth headers manually via a `getAuthHeaders()`
private method. Marked with `// LEGACY: manual auth header — interceptor added in Day 3`:
- `src/app/core/services/auth.service.ts` (me() method)
- `src/app/core/services/ticket.service.ts`
- `src/app/core/services/comment.service.ts`
- `src/app/core/services/lookup.service.ts`
- `src/app/core/services/dashboard.service.ts`
- `src/app/features/admin/services/admin.service.ts`

### Class-based guards (→ functional guards)
- `src/app/core/guards/auth.guard.ts` — `class AuthGuard implements CanActivate`
- `src/app/core/guards/role.guard.ts` — `class RoleGuard implements CanActivate`

### Duplicated catchError in every service method
Every HTTP method has its own `catchError` → `NotificationService.error()` block.
Marked with `// LEGACY: duplicated error handling — centralized in Day 3 error interceptor`:
- `src/app/core/services/auth.service.ts` (2 methods)
- `src/app/core/services/ticket.service.ts` (9 methods)
- `src/app/core/services/comment.service.ts` (3 methods)
- `src/app/core/services/lookup.service.ts` (3 methods)
- `src/app/core/services/dashboard.service.ts` (1 method)
- `src/app/features/admin/services/admin.service.ts` (6 methods)

### Token stored in localStorage (insecure)
- `src/app/core/services/auth.service.ts` — `localStorage.setItem('sd_token', ...)` and
  `localStorage.setItem('sd_user', ...)`. No httpOnly cookie, no encryption.

### Ad-hoc role checks in templates (→ *appHasRole directive)
Role checks done inline with `*ngIf` comparisons instead of a structural directive:
- `src/app/layout/sidebar/sidebar.component.html` — `*ngIf="currentUser?.role === UserRole.Admin"`
- `src/app/features/tickets/pages/ticket-detail/ticket-detail.component.html` — `*ngIf="isAdmin"`, `*ngIf="isAdminOrTechnician"`
- `src/app/features/tickets/components/ticket-form/ticket-form.component.html` — `*ngIf="isAdmin"`
- `src/app/shared/directives/README.md` — placeholder for `*appHasRole`

---

## Day 4 — Optimize Performance

### Default change detection (→ OnPush)
Every component uses the default `ChangeDetectionStrategy.Default`. None declare
`changeDetection: ChangeDetectionStrategy.OnPush`.

### Missing trackBy on ticket *ngFor
- `src/app/features/tickets/pages/ticket-list/ticket-list.component.html` — `*ngFor="let ticket of tickets"` with NO `trackBy` function. Every re-render recreates all DOM rows.
- Also missing from: `my-tickets`, `assigned-tickets`, `recent-tickets`, all admin tables.

### Intentional subscription leak in TicketDetailComponent
- `src/app/features/tickets/pages/ticket-detail/ticket-detail.component.ts`
  - Subscribes to `authService.currentUser$` in ngOnInit — never unsubscribed
  - Subscribes to `ticketService.getTicketById()` — never unsubscribed
  - Subscribes to `commentService.getComments()` — never unsubscribed
  - Class does NOT implement `OnDestroy`, has NO `ngOnDestroy()` method
  - Each subscription marked: `// LEGACY-LEAK: intentional missing unsubscribe — DO NOT FIX`

### No @defer / no lazy component loading
All components are eagerly loaded within their respective modules. No `@defer` blocks,
no dynamic `import()` of components.

---

## Day 5 — Test

### Untouched CLI spec files
Only the default scaffold spec remains. No custom tests were written:
- `src/app/app.component.spec.ts` (default CLI-generated, tests "should create the app")

No specs exist for any service, guard, pipe, component, or feature module.
