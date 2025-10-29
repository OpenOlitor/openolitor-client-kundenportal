# Bower to npm Migration Notes

This document describes the migration from Bower to npm for dependency management.

## Changes Made

### 1. Removed Bower
- Removed `bower` and `bower-npm-resolver` from devDependencies
- Removed `postinstall` script that ran `bower install`
- Removed `grunt-wiredep` plugin (Bower-specific)

### 2. Moved Dependencies to npm
All Bower dependencies from `bower.json` have been moved to `package.json` as regular npm dependencies.

Most packages are available on npm registry with compatible versions:
- Angular 1.8.0 and all its modules
- Bootstrap 3.3.7
- jQuery 3.2.1
- Moment.js, Lodash, and other utilities

### 3. Packages Not Available on npm

The following packages are not available on npm registry or only have incompatible versions. They have been **commented out** in `app/index.html` with installation instructions:

#### angular-hamburger-toggle
- **Original Bower version**: ~0.2.0
- **Status**: Not available on npm
- **Manual install**: `npm install --save github:subzerobo/angular-hamburger-toggle`
- **Files affected**: 
  - CSS: `app/index.html` line ~27
  - JS: `app/index.html` line ~165

#### angular-css-injector  
- **Original Bower version**: ^1.4.0
- **Status**: Only version 1.0.4 available on npm
- **Manual install**: `npm install --save github:Alignan/angular-css-injector`
- **Files affected**: 
  - JS: `app/index.html` line ~178

#### ng-table-export
- **Original Bower version**: *
- **Status**: Not available on npm
- **Manual install**: `npm install --save github:esvit/ng-table-export`
- **Files affected**:
  - JS: `app/index.html` line ~159

#### angular-piwik
- **Original Bower version**: ^1.3.2
- **Status**: Not available on npm
- **Manual install**: `npm install --save github:Mike96Angelo/angular-piwik`
- **Files affected**:
  - JS: `app/index.html` line ~182

### 4. Updated Paths
- Changed all `bower_components` references to `../node_modules` in `app/index.html`
- Updated Gruntfile.js to use `node_modules` instead of `bower_components`
- Updated sass include paths from `app/bower_components` to `node_modules`

### 5. Version Adjustments
Some packages had their versions adjusted to what's available on npm:
- `ng-lodash`: 0.5.0 → 0.2.3 (only version available)
- `ng-password-strength`: 0.2.2 → 0.3.0
- `angularjs-color-picker`: 3.0.3 → 3.0.0

## Installation

```bash
npm install --legacy-peer-deps
```

Note: `--legacy-peer-deps` is needed due to peer dependency conflicts with older Grunt packages.

## Optional: Install GitHub Packages

If you need the commented-out packages, install them manually:

```bash
npm install --legacy-peer-deps --save \
  github:subzerobo/angular-hamburger-toggle \
  github:Alignan/angular-css-injector \
  github:esvit/ng-table-export \
  github:Mike96Angelo/angular-piwik
```

Then uncomment the corresponding lines in `app/index.html`.

## Build Commands

The build system still uses Grunt. New npm scripts have been added for convenience:

```bash
npm run build    # Run grunt build
npm run serve    # Run grunt serve (dev server)
npm run citest   # Run grunt citest (CI tests)
npm test         # Run unit tests
```

## Files Modified

- `package.json` - Added all frontend dependencies, removed Bower
- `Gruntfile.js` - Removed wiredep tasks, updated paths
- `app/index.html` - Updated all dependency paths from bower_components to node_modules
- `.gitignore` - Already excluded node_modules (no changes needed)

## Files That Can Be Removed

The following files are no longer needed but have been left in place for reference:
- `bower.json` - Can be removed after verifying migration
- `.bowerrc` - Can be removed after verifying migration

## Known Issues

1. **Deprecated warnings**: Many Angular 1.x packages show deprecation warnings. This is expected as AngularJS has reached end-of-life.

2. **Security vulnerabilities**: npm audit shows vulnerabilities in dev dependencies (Grunt plugins). These don't affect production builds.

3. **PhantomJS**: The test runner uses PhantomJS which is deprecated. Consider migrating to Puppeteer or Headless Chrome.

## Testing

After migration, test the following:
1. Development server: `npm run serve`
2. Build process: `npm run build`
3. Unit tests: `npm test`
4. Verify all UI features work, especially:
   - Color picker
   - File uploads
   - Table exports
   - QR codes
   - Analytics (Piwik)
