# AngularJS to Angular 20 Migration Guide

## Overview

This document describes the migration from AngularJS 1.8 to Angular 20 for the OpenOlitor Kundenportal application.

## Migration Status

### ✅ Completed

#### Project Setup
- [x] Angular CLI 20.0.0 installed and configured
- [x] New project structure created
- [x] Package.json updated with Angular 20 dependencies
- [x] TypeScript configuration files created
- [x] Angular.json build configuration set up
- [x] Build system working (npm run build)
- [x] Development server working (npm start)

#### Core Architecture
- [x] Standalone components architecture (Angular 20 best practice)
- [x] Functional route guards
- [x] Functional HTTP interceptors
- [x] RxJS-based state management
- [x] Service-based architecture

#### Services Migrated
- [x] **AuthService** - User authentication and session management
- [x] **ConfigService** - Application configuration
- [x] **ProjektService** - Project/organization data
- [x] **AlertService** - Alert/notification system
- [x] **TranslationService** - i18n/l10n support

#### Components Migrated
- [x] **App** - Root component with navbar and footer
- [x] **DashboardComponent** - Main dashboard view
- [x] **LoginComponent** - User login form

#### Routing
- [x] Basic routing configured with Angular Router
- [x] Auth guard protecting authenticated routes
- [x] Role-based access control

#### Infrastructure
- [x] HTTP client configured
- [x] HTTP interceptor for auth errors
- [x] Translation system (@ngx-translate)
- [x] Assets copied (images, fonts, environment config)

### 🔄 In Progress / Remaining

#### Feature Modules to Migrate
- [ ] **Abos Module** - Subscription management
  - [ ] AbosListComponent
  - [ ] AbwesenheitenDirective (absences)
  - [ ] LieferungenDirective (deliveries)
  - [ ] Related models and services

- [ ] **Rechnungen Module** - Invoice management
  - [ ] RechnungenListComponent
  - [ ] Related models and services

- [ ] **Arbeitsangebote Module** - Work offer management
  - [ ] ArbeitsangeboteListComponent
  - [ ] ArbeitsangebotParticipateController
  - [ ] Related models and services

- [ ] **Arbeitseinsaetze Module** - Work assignment tracking
  - [ ] ArbeitseinsaetzeListComponent
  - [ ] Related models and services

#### Additional Components
- [ ] Login settings page
- [ ] Password change page
- [ ] Password reset page
- [ ] OTP reset page
- [ ] Access activation page
- [ ] Forbidden page
- [ ] Not found page
- [ ] Last delivery plans (open access)

#### Services to Create
- [ ] ServerService - Server/websocket communication
- [ ] MessagesService - Message bus
- [ ] DialogService - Modal dialogs
- [ ] FileUtilService - File operations

#### Shared Components/Directives
- [ ] Dialog components
- [ ] Dropdown directive
- [ ] Auto-focus directive
- [ ] Table components (replacing ng-table)
- [ ] Date/time picker components

#### Filters/Pipes
- [ ] Currency filter → pipe
- [ ] Date range filter → pipe
- [ ] Other custom filters

#### Styling
- [ ] Complete Bootstrap 5 integration
- [ ] Custom theme styles
- [ ] Responsive design updates

#### i18n
- [ ] Complete translation files for all languages:
  - [ ] de_CH (German - Switzerland)
  - [ ] de_DE (German - Germany)
  - [ ] de_DO (German - Dollinger)
  - [ ] en_US (English)
  - [ ] fr_CH (French - Switzerland)
  - [ ] fr_BE (French - Belgium)
  - [ ] es_ES (Spanish)
  - [ ] cs_CZ (Czech)
  - [ ] hu_HU (Hungarian)

#### Testing
- [ ] Unit tests for services
- [ ] Component tests
- [ ] E2E tests
- [ ] Integration tests

#### Build Optimizations
- [ ] Fix bundle size warning (currently 684KB vs 500KB target)
- [ ] Replace moment.js with date-fns (ESM compatible)
- [ ] Code splitting for lazy-loaded modules
- [ ] AOT compilation optimization

#### Documentation
- [ ] Update README.md
- [ ] API documentation
- [ ] Component documentation
- [ ] Developer guide

## Architecture Changes

### AngularJS → Angular 20 Mapping

| AngularJS Concept | Angular 20 Equivalent |
|------------------|----------------------|
| `angular.module()` | Standalone components / NgModules |
| `$scope` | Component properties |
| `$rootScope` | Services with BehaviorSubject |
| Controllers | Components |
| `.service()` | `@Injectable()` services |
| `.factory()` | `@Injectable()` services |
| `.filter()` | Pipes (`@Pipe()`) |
| `.directive()` | Components/Directives |
| `$http` | HttpClient |
| `$q` | RxJS Observables |
| `$routeProvider` | RouterModule |
| `.config()` | `provideXXX()` functions |
| `.run()` | APP_INITIALIZER |
| `ng-repeat` | `*ngFor` |
| `ng-if` | `*ngIf` |
| `ng-show/ng-hide` | `*ngIf` or `[hidden]` |
| `ng-model` | `[(ngModel)]` |
| `ng-click` | `(click)` |
| Two-way binding `{{ }}` | `{{ }}` (one-way) or `[(ngModel)]` |

### Dependency Replacements

| AngularJS Library | Angular 20 Replacement |
|------------------|----------------------|
| angular-bootstrap (ui-bootstrap) | @ng-bootstrap/ng-bootstrap |
| angular-gettext | @ngx-translate/core |
| ng-table | Angular Material Table / Custom |
| angular-moment | moment + custom pipe / date-fns |
| angular-file-saver | file-saver (standalone) |
| ng-file-upload | Custom file upload / ngx-file-drop |
| angular-qrcode | qrcode (standalone library) |
| angular-sanitize | DomSanitizer |
| ng-lodash | lodash-es |
| angular-cookie | Cookie service (custom) |
| ngclipboard | Clipboard API / Custom |

## File Structure

### Old (AngularJS)
```
app/
├── scripts/
│   ├── app.js
│   ├── root.js
│   ├── abos/
│   ├── rechnungen/
│   ├── services/
│   └── ...
├── styles/
└── index.html
```

### New (Angular 20)
```
app/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── services/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── abos/
│   │   ├── rechnungen/
│   │   └── ...
│   ├── shared/
│   │   ├── components/
│   │   ├── directives/
│   │   └── pipes/
│   ├── app.ts
│   ├── app.html
│   ├── app.config.ts
│   └── app.routes.ts
├── index.html
├── main.ts
└── styles.scss
```

## Key Technical Decisions

### 1. Standalone Components
- Using standalone components (Angular 20 best practice)
- No NgModules except for third-party libraries
- Simpler dependency management

### 2. RxJS for State Management
- Services use BehaviorSubject for state
- Observables for async operations
- No external state management library needed for this app size

### 3. Functional Guards and Interceptors
- Using functional guards (`CanActivateFn`)
- Using functional HTTP interceptors (`HttpInterceptorFn`)
- More modern and tree-shakeable

### 4. Translation System
- @ngx-translate/core for i18n
- JSON-based translation files
- Language switching support

### 5. Styling Approach
- Bootstrap 5 CSS (up from Bootstrap 3)
- SCSS for component styles
- Custom theming maintained

## Build and Run

### Development
```bash
npm install
npm start
# App runs on http://localhost:4200
```

### Production Build
```bash
npm run build
# Output in dist/openolitor-kundenportal/
```

### Testing
```bash
npm test
```

## Migration Checklist for Remaining Components

For each AngularJS component to migrate:

1. [ ] Create Angular component file (`*.component.ts`)
2. [ ] Create template file (`*.component.html`)
3. [ ] Create styles file (`*.component.scss`)
4. [ ] Update template syntax (AngularJS → Angular)
5. [ ] Create/update service if needed
6. [ ] Create/update models (TypeScript interfaces)
7. [ ] Update routing configuration
8. [ ] Add translations
9. [ ] Write tests
10. [ ] Test functionality

## Common Migration Patterns

### Controllers → Components
```javascript
// AngularJS
angular.module('app')
  .controller('MyCtrl', function($scope, MyService) {
    $scope.data = [];
    $scope.load = function() {
      MyService.getData().then(function(data) {
        $scope.data = data;
      });
    };
  });
```

```typescript
// Angular 20
@Component({
  selector: 'app-my-component',
  standalone: true,
  template: '...'
})
export class MyComponent implements OnInit {
  private myService = inject(MyService);
  data: any[] = [];
  
  ngOnInit(): void {
    this.load();
  }
  
  load(): void {
    this.myService.getData().subscribe(data => {
      this.data = data;
    });
  }
}
```

### Services
```javascript
// AngularJS
angular.module('app')
  .factory('MyService', function($http) {
    return {
      getData: function() {
        return $http.get('/api/data').then(function(response) {
          return response.data;
        });
      }
    };
  });
```

```typescript
// Angular 20
@Injectable({
  providedIn: 'root'
})
export class MyService {
  private http = inject(HttpClient);
  
  getData(): Observable<any[]> {
    return this.http.get<any[]>('/api/data');
  }
}
```

## Notes

- **Old code preserved** in `app-angularjs-backup/` directory
- **Incremental migration** recommended - feature by feature
- **Testing** essential after each feature migration
- **Breaking changes** expected - this is a major version upgrade
- **Training needed** for team on Angular 20 concepts

## Resources

- [Angular Official Docs](https://angular.dev)
- [Angular Upgrade Guide](https://v17.angular.io/guide/upgrade)
- [RxJS Documentation](https://rxjs.dev)
- [Angular Style Guide](https://angular.dev/style-guide)
