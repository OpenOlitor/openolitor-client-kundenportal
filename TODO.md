# Migration TODO List

## High Priority - Core Functionality

### Services
- [ ] **ServerService** - WebSocket connection and messaging
  - Port from `app-angularjs-backup/scripts/server/server.service.js`
  - Implement WebSocket connection management
  - Message bus integration
  
- [ ] **MessagesService** - Application message bus
  - Port from `app-angularjs-backup/scripts/services/oo-messages.service.js`
  - Event pub/sub system
  
- [ ] **DialogService** - Modal dialogs
  - Port from `app-angularjs-backup/scripts/components/oo-dialog.service.js`
  - Use ng-bootstrap modal or custom implementation

### Feature Modules

#### Abos (Subscriptions)
- [ ] Create `AbosModule`
- [ ] **AbosListComponent**
  - Port from `app-angularjs-backup/scripts/abos/list/aboslist.controller.js`
  - Port template from `aboslist.html`
  - Create AbosService
  - Create Abo model
- [ ] **AbwesenheitenComponent** (Absences)
  - Port from `app-angularjs-backup/scripts/abos/list/abwesenheiten/`
  - Create AbwesenheitenService
- [ ] **LieferungenComponent** (Deliveries)
  - Port from `app-angularjs-backup/scripts/abos/list/lieferungen/`
  - Create LieferungenService

#### Rechnungen (Invoices)
- [ ] Create `RechnungenModule`
- [ ] **RechnungenListComponent**
  - Port from `app-angularjs-backup/scripts/rechnungen/list/`
  - Create RechnungenService
  - Create Rechnung model

#### Arbeitsangebote (Work Offers)
- [ ] Create `ArbeitsangeboteModule`
- [ ] **ArbeitsangeboteListComponent**
  - Port from `app-angularjs-backup/scripts/arbeitsangebote/list/`
  - Create ArbeitsangeboteService
- [ ] **ArbeitsangebotParticipateComponent**
  - Port from `arbeitsangebot-participate.controller.js`

#### Arbeitseinsaetze (Work Assignments)
- [ ] Create `ArbeitseinsaetzeModule`
- [ ] **ArbeitseinsaetzeListComponent**
  - Port from `app-angularjs-backup/scripts/arbeitseinsaetze/list/`
  - Create ArbeitseinsaetzeService

### Authentication & User Management
- [ ] **Login Settings Page**
  - Port from `app-angularjs-backup/scripts/login/login_settings.html`
  - Second factor authentication UI
- [ ] **Change Password Page**
  - Port from `app-angularjs-backup/scripts/login/change_password.html`
- [ ] **Password Reset Page**
  - Port from `app-angularjs-backup/scripts/login/passwordreset.html`
- [ ] **OTP Reset Page**
  - Port from `app-angularjs-backup/scripts/login/reset_otp.html`
- [ ] **Access Activation Page**
  - Port from `app-angularjs-backup/scripts/login/zugangaktivieren.html`
- [ ] **Forbidden Page**
  - Port from `app-angularjs-backup/scripts/login/forbidden.html`

### Public Pages
- [ ] **Last Delivery Plans**
  - Port from `app-angularjs-backup/scripts/open/lastlieferplanungen.controller.js`
  - Public (non-authenticated) access

## Medium Priority - Shared Components

### Shared Components
- [ ] **OoDialogOkAbortComponent**
  - Port from `app-angularjs-backup/scripts/components/oo-dialogokabort.directive.js`
  - Confirmation dialog component

- [ ] **OoDropdownComponent**
  - Port from `app-angularjs-backup/scripts/util/ooDropdown/`
  - Dropdown directive

- [ ] **OverviewFilterGeschaeftsJahreComponent**
  - Port from `app-angularjs-backup/scripts/util/overviewfiltergeschaeftsjahre/`
  - Business year filter

### Directives
- [ ] **AutoFocusDirective**
  - Port from `app-angularjs-backup/scripts/util/auto-focus.directive.js`

### Pipes (Filters)
- [ ] **CurrencyPipe**
  - Port from `app-angularjs-backup/scripts/filters/oo-currency.filter.js`
  - Custom currency formatting

- [ ] **DateRangePipe**
  - Port from `app.js` dateRange filter

- [ ] **FromNowPipe**
  - Port from `app.js` fromNow filter

- [ ] **NotInPipe**
  - Port from `app.js` notIn filter

- [ ] **UnsafePipe**
  - Port from `app.js` unsafe filter (for HTML sanitization)

### Utility Services
- [ ] **FileUtilService**
  - Port from `app-angularjs-backup/scripts/util/file.util.js`
  - File operations

- [ ] **GeschaeftsjahrUtilService**
  - Port from `app-angularjs-backup/scripts/util/geschaeftsjahr.util.js`
  - Business year utilities

- [ ] **EnumUtilService**
  - Port from `app-angularjs-backup/scripts/util/enum.util.js`
  - Enum helpers

## Low Priority - Enhancements

### Table Components
- [ ] **NgTableCountController replacement**
  - Port from `app-angularjs-backup/scripts/ngtable/oo-ngtable-count.controller.js`
  - Consider using Angular Material Table

- [ ] **NgTableExportController replacement**
  - Port from `app-angularjs-backup/scripts/ngtable/oo-ngtable-export.controller.js`
  - Export to CSV/Excel functionality

### Translations
- [ ] Complete German (CH) translations
- [ ] Complete German (DE) translations
- [ ] Complete German (DO) translations
- [ ] Complete English translations
- [ ] Complete French (CH) translations
- [ ] Complete French (BE) translations
- [ ] Complete Spanish translations
- [ ] Complete Czech translations
- [ ] Complete Hungarian translations

### Testing
- [ ] Unit tests for all services
- [ ] Unit tests for all components
- [ ] Integration tests
- [ ] E2E tests

### Build Optimizations
- [ ] Reduce bundle size (current: 684KB, target: <500KB)
- [ ] Replace moment.js with date-fns (ESM compatible)
- [ ] Implement lazy loading for feature modules
- [ ] Optimize images
- [ ] Enable service worker for PWA

### Styling
- [ ] Complete Bootstrap 5 migration
- [ ] Theme customization
- [ ] Custom CSS for specific features
- [ ] Responsive design improvements
- [ ] Accessibility improvements (WCAG compliance)

### Documentation
- [ ] API documentation (JSDoc/TypeDoc)
- [ ] Component documentation
- [ ] Service documentation
- [ ] Update developer guide
- [ ] Create deployment guide

## Technical Debt
- [ ] Remove moment.js dependency (use date-fns)
- [ ] Implement proper error handling
- [ ] Add loading states for all async operations
- [ ] Implement retry logic for failed HTTP requests
- [ ] Add request caching where appropriate
- [ ] Implement offline support
- [ ] Add performance monitoring

## Infrastructure
- [ ] Update CI/CD pipeline for Angular CLI
- [ ] Docker configuration updates
- [ ] Update deployment scripts
- [ ] Environment configuration management
- [ ] Logging and monitoring setup

## Notes

### Migration Priority Order
1. Core services (auth, config, project) ✅
2. Basic components (login, dashboard) ✅
3. Feature modules (abos, rechnungen, etc.) - IN PROGRESS
4. Shared components and utilities
5. Translations and i18n
6. Testing
7. Optimizations

### Estimated Effort
- Core infrastructure: ✅ DONE (2-3 days)
- Feature modules: 🔄 IN PROGRESS (2-3 weeks)
- Shared components: 1-2 weeks
- Testing: 1-2 weeks
- Optimizations: 1 week
- **Total**: 6-8 weeks for complete migration

### Dependencies to Replace

| Old (AngularJS) | New (Angular 20) | Status |
|----------------|------------------|--------|
| ng-table | Angular Material Table | Not started |
| angular-bootstrap | @ng-bootstrap/ng-bootstrap | ✅ Installed |
| angular-gettext | @ngx-translate | ✅ Implemented |
| angular-moment | moment + pipes | ✅ Installed (needs optimization) |
| angular-file-saver | file-saver | ✅ Installed |
| ng-file-upload | Custom implementation | Not started |
| angular-qrcode | qrcode lib | ✅ Installed |
| ngclipboard | Clipboard API | Not started |
| ng-iban | Custom validator | Not started |
| angular-piwik | Custom implementation | Not started |

### Breaking Changes
- Complete UI rewrite
- All routes changed (using Angular router)
- API integration needs verification
- All components are standalone
- New state management approach
- Build process completely different
