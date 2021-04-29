'use strict';

var regexIso8601 =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?$/;
// Matches YYYY-MM-ddThh:mm:ss.sssZ where .sss is optional

function convertDateStringsToDates(input) {
  // Ignore things that aren't objects.
  if (typeof input !== 'object') {
    return input;
  }

  for (var key in input) {
    if (!input.hasOwnProperty(key)) {
      continue;
    }

    var value = input[key];
    var match;
    // Check for string properties which look like dates.
    if (typeof value === 'string' && (match = value.match(regexIso8601))) {
      var milliseconds = Date.parse(match[0]);
      if (!isNaN(milliseconds)) {
        input[key] = new Date(milliseconds);
      }
    } else if (typeof value === 'object') {
      // Recurse into object
      input[key] = convertDateStringsToDates(value);
    }
  }
  return input;
}
function addExtendedEnumValue(id, labelLong, labelShort, value) {
  return {
    id: id,
    label: {
      long: labelLong,
      short: labelShort
    },
    value: value
  };
}

/* This is a pseudo-function in order to enable gettext-extractor to find the translations that need to be done in the constants.
   As described in https://github.com/rubenv/angular-gettext/issues/67
*/
function gettext(string) {
  return string;
}

/**
 */
angular
  .module('openolitor-kundenportal', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngTable',
    'ngFileSaver',
    'ngCookies',
    'ngPasswordStrength',
    'ngMessages',
    'angular.filter',
    'ui.bootstrap',
    'ui.bootstrap.datetimepicker',
    'color.picker',
    'ipCookie',
    'frapontillo.bootstrap-switch',
    'gettext',
    'ngHamburger',
    'angularMoment',
    'ngFileUpload',
    'ngLodash',
    'openolitor-core',
    'angular-sortable-view',
    'ngclipboard',
    'mm.iban',
    'piwik'
  ])
  .constant('BUILD_NR', '@@BUILD_NR')
  .constant('LIEFEREINHEIT', {
    STUECK: addExtendedEnumValue('Stueck', gettext('Stück'), gettext('St.')),
    BUND: addExtendedEnumValue('Bund', gettext('Bund'), gettext('Bu.')),
    GRAMM: addExtendedEnumValue('Gramm', gettext('Gramm'), gettext('gr')),
    KILOGRAMM: addExtendedEnumValue('Kilogramm', gettext('Kilogramm'),
      gettext('kg')),
    LITER: addExtendedEnumValue('Liter', gettext('Liter'), gettext('l')),
    PORTION: addExtendedEnumValue('Portion', gettext('Portion'), gettext('Por.'))
  })
  .constant('USER_ROLES', {
    Guest: 'Guest',
    Administrator: 'Administrator',
    Kunde:'Kunde'
  })
  .run(function($rootScope, $location, $anchorScroll) {
    $rootScope.location = $location;
    $anchorScroll.yOffset = 50;

    $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
      if($location.hash()) $anchorScroll();
    });
  })
  .constant('WAEHRUNG', {
    CHF: addExtendedEnumValue('CHF', gettext('Schweizer Franken'), gettext(
      'CHF')),
    EUR: addExtendedEnumValue('EUR', gettext('Euro'), gettext('EUR')),
    USD: addExtendedEnumValue('USD', gettext('US Dollar'), gettext('USD')),
    GBP: addExtendedEnumValue('GBP', gettext('Britisches Pfund'), gettext(
      'GBP')),
    CAD: addExtendedEnumValue('CAD', gettext('Kanadischer Dollar'), gettext(
      'CAD'))
  })
  .service('appConfig', function() {
    var loaded = false;
    var configData = {
    };
    configData = getConfig();
    loaded = true;
    return {
      get: function() {
        return configData;
      },
      isLoaded: function() {
        return loaded;
      }
    };
  })
  .run(function(appConfig) {
    appConfig.get();
  })
  .factory('checkSize', ['$rootScope', '$window', function($rootScope, $window) {
    return function() {
      if ($window.innerWidth >= 1200) {
        $rootScope.tgState = true;
      }
    };
  }])
  .factory('convertDateStringsToDatesFct', function() {
    return function(input) {
      return convertDateStringsToDates(input);
    };
  })
  .config(['$provide', function($provide) {
    $provide.decorator('$exceptionHandler', ['$log', '$injector',
      function($log, $injector) {
        return function(exception) {
          // using the injector to retrieve services, otherwise circular dependency
          var alertService = $injector.get('alertService');
          alertService.addAlert('error', exception.message);
          // log error default style
          $log.error.apply($log, arguments);
        };
      }
    ]);
  }])
  .factory('errbitErrorInterceptor', function($q, $injector) {
    return {
      responseError: function(rejection) {
        var appConfig = $injector.get('appConfig');
        /*jshint -W117 */
        var airbrake = new airbrakeJs.Client({
          projectId: 1,
          host: appConfig.get().AIRBREAK_URL,
          projectKey: appConfig.get().AIRBREAK_API_KEY
        });
        /*jshint +W117 */
        airbrake.addFilter(function(notice) {

          notice.context.environment = appConfig.get().ENV;
          notice.context.version = appConfig.get().version;
          return notice;
        });
        var message = gettext('Error: ');
        if (!angular.isUndefined(rejection.config) && !angular.isUndefined(rejection.config.url)) {
          message += rejection.config.url;
        }
        airbrake.notify(message);
        return $q.reject(rejection);
      }
    };
  })
  .factory('msgBus', [
    '$rootScope',
    function($rootScope) {
      var msgBus = {};
      msgBus.emitMsg = function(msg) {
        $rootScope.$emit(msg.type, msg);
      };
      msgBus.onMsg = function(msg, scope, func) {
        var unbind = $rootScope.$on(msg, func);
        scope.$on('$destroy', unbind);
      };
      return msgBus;
    }
  ])
  .run(['ooClientMessageService', '$timeout', function(clientMessageService, $timeout) {
    $timeout(function() {
      console.log('Start clientMessageService');
      clientMessageService.start();
    }, 1000);
  }])
  .factory('loggedOutInterceptor', function($q, alertService) {
    return {
      responseError: function(rejection) {
        var status = rejection.status;
        if (status === 401) {
          alertService.removeAllAlerts();
          window.location = '#/logout';
          return;
        }
        return $q.reject(rejection);
      }
    };
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.transformResponse.push(function(responseData) {
      return convertDateStringsToDates(responseData);
    });
  }])
  .filter('unsafe', [
        '$sce',
        function($sce) {
            return function(value) {
                return $sce.trustAsHtml(value);
            };
        }
    ])

  .filter('dateRange', function(moment) {
    function isMidnight(mom) {
      // The moment at midnight
      var mmtMidnight = mom.clone().startOf('day');

      // Difference in minutes == 0 => midnight
      return mom.diff(mmtMidnight, 'minutes') === 0;
    }

    return function(items, from, to, attribute) {
      if (!angular.isUndefined(items) && items.length > 0) {
        var toPlusOne = to;
        var momTo = moment(to);
        if (isMidnight(momTo)) {
          toPlusOne = momTo.add(1, 'days');
        }
        var result = [];
        for (var i = 0; i < items.length; i++) {
          var itemDate = items[i][attribute];
          if (!angular.isUndefined(attribute)) {
            itemDate = items[i][attribute];
          }
          if (angular.isUndefined(to) && angular.isUndefined(from)) {
            result.push(items[i]);
          } else if (angular.isUndefined(to) && itemDate >= from) {
            result.push(items[i]);
          } else if (angular.isUndefined(from) && itemDate <= toPlusOne) {
            result.push(items[i]);
          } else if (itemDate >= from && itemDate <= toPlusOne) {
            result.push(items[i]);
          }
        }
        return result;
      }
    };
  })
  .filter('fromNow', function(moment) {
    return function(input) {
      return moment(input).fromNow();
    };
  })
  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('loggedOutInterceptor');
    $httpProvider.interceptors.push('errbitErrorInterceptor');
  }])
  .config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('');
  }])
  .config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
  }])
  .filter('notIn', function() {
    return function(items, property, elements) {
      var filtered = [];
      if (!items) {
        return filtered;
      }
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var val = item[property];
        if (elements.indexOf(val) < 0) {
          filtered.push(item);
        }
      }
      return filtered;
    };
  })
  .config(function($routeProvider, USER_ROLES) {
    $routeProvider
      .when('/', {
        redirectTo: '/dashboard',
        access: USER_ROLES.Guest
      })
      .when('/dashboard', {
        templateUrl: 'scripts/dashboard/dashboard.html',
        controller: 'DashboardController',
        name: 'Dashboard',
        access: [USER_ROLES.Administrator, USER_ROLES.Kunde]
      })
      .when('/open/lastlieferplanungen', {
        templateUrl: 'scripts/open/lastlieferplanungen.html',
        controller: 'LastLieferplanungenController',
        name: 'LastLieferplanungen',
        access: [USER_ROLES.Guest, USER_ROLES.Administrator, USER_ROLES.Kunde]
      })
      .when('/login', {
        templateUrl: 'scripts/login/login.html',
        controller: 'LoginController',
        name: 'Login',
        access: USER_ROLES.Guest
      })
      .when('/passwd', {
        templateUrl: 'scripts/login/change_password.html',
        controller: 'LoginController',
        name: 'Passwortwechsel',
        access: [USER_ROLES.Administrator, USER_ROLES.Kunde]
      })
      .when('/logout', {
        templateUrl: 'scripts/login/logout.html',
        controller: 'LoginController',
        logout: true,
        name: 'Logout',
        access: USER_ROLES.Guest
      })
      .when('/forbidden', {
        templateUrl: 'scripts/login/forbidden.html',
        controller: 'LoginController',
        name: 'Forbidden',
        access: USER_ROLES.Guest
      })
      .when('/zugangaktivieren', {
        templateUrl: 'scripts/login/zugangaktivieren.html',
        controller: 'LoginController',
        name: 'Einladung',
        access: USER_ROLES.Guest
      })
      .when('/passwordreset', {
        templateUrl: 'scripts/login/passwordreset.html',
        controller: 'LoginController',
        name: 'PasswordReset',
        access: USER_ROLES.Guest
      })
      .otherwise({
        templateUrl: 'scripts/not-found.html',
        access: USER_ROLES.Guest
      });
  });
