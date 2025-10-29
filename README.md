
[![Build Status](https://travis-ci.com/OpenOlitor/openolitor-client-kundenportal.svg?branch=prod)](https://travis-ci.com/OpenOlitor/openolitor-client-kundenportal)
[![Code Climate](https://codeclimate.com/github/OpenOlitor/openolitor-client-kundenportal/badges/gpa.svg)](https://codeclimate.com/github/OpenOlitor/openolitor-client-kundenportal)

# OpenOlitor Client Kundenportal

Frontend des OpenOlitor Kundenportals - Migrated to **Angular 20** ✨

## 🚀 Migration Status

This application has been migrated from AngularJS 1.8 to Angular 20. See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed migration documentation.

**Current Status**: Core infrastructure and services migrated ✅

## Prerequisites

- Node.js >= 20.x
- npm >= 10.x

## Development Setup

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you change source files.

### Build for Production
```bash
npm run build
# or
ng build
```

Build artifacts will be stored in the `dist/` directory.

### Running Tests
```bash
npm test
# or
ng test
```

## Project Structure

```
app/
├── app/                      # Application source code
│   ├── core/                # Core services, guards, interceptors
│   ├── features/            # Feature modules (dashboard, login, etc.)
│   ├── shared/              # Shared components, directives, pipes
│   ├── app.ts               # Root component
│   ├── app.config.ts        # Application configuration
│   └── app.routes.ts        # Routing configuration
├── index.html               # Main HTML file
├── main.ts                  # Application entry point
└── styles.scss              # Global styles

public/                      # Static assets
├── images/                  # Images and icons
├── fonts/                   # Custom fonts
├── i18n/                    # Translation files
└── environments/            # Environment configurations

app-angularjs-backup/        # Original AngularJS code (preserved)
```

## Technology Stack

### Core
- **Angular 20** - Modern web framework
- **TypeScript 5.8** - Type-safe JavaScript
- **RxJS 7.8** - Reactive programming
- **Bootstrap 5** - UI framework

### Key Dependencies
- **@ngx-translate** - Internationalization
- **@ng-bootstrap** - Bootstrap components for Angular
- **moment** - Date manipulation (to be replaced with date-fns)
- **qrcode** - QR code generation
- **file-saver** - File download functionality

## Features

- ✅ User authentication and authorization
- ✅ Multi-language support (DE, EN, FR, ES, CS, HU)
- ✅ Responsive design
- 🔄 Subscription management (in progress)
- 🔄 Invoice management (in progress)
- 🔄 Work assignments (in progress)
- 🔄 Member portal (in progress)

## Configuration

Application configuration is loaded from `public/environments/config.js`. This file defines:
- API endpoint URL
- Environment name
- Version information
- Feature flags

## Internationalization

The application supports multiple languages using @ngx-translate:
- German (Switzerland, Germany, Dollinger variant)
- English (US)
- French (Switzerland, Belgium)
- Spanish
- Czech
- Hungarian

Translation files are located in `public/i18n/`.

## Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## Documentation

- [Migration Guide](./MIGRATION_GUIDE.md) - Detailed migration documentation
- [Wiki](https://github.com/OpenOlitor/OpenOlitor/wiki/) - OpenOlitor project wiki

## License

Code until April 2018 was published under [GPL v3](LICENSE_legacy). Since April 2018, OpenOlitor is released under [AGPL v3](LICENSE).

## Links

- [OpenOlitor Homepage](https://openolitor.org)
- [GitHub Organization](https://github.com/OpenOlitor)
- [Angular Documentation](https://angular.dev)

## Version Bump

Use `./bumpversion.sh` (`./bumpversion.sh -v 1.0.x`) to update the version in `package.json`.
With the `-c/--commit` flag, a git commit and tag will be created automatically.

---

**Note**: This is an Angular 20 application. The original AngularJS code is preserved in the `app-angularjs-backup/` directory for reference.
