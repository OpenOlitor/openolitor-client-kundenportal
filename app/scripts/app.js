'use strict';

var userRoles = {
  Guest: 'Guest',
  Administrator: 'Administrator',
  Kunde: 'Kunde'
};

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
    'angular-sortable-view',
    'openolitor-core',
    'ngclipboard'
  ])
  .constant('API_URL', '@@API_URL')
  .constant('API_WS_URL', '@@API_WS_URL')
  .constant('BUILD_NR', '@@BUILD_NR')
  .constant('ENV', '@@ENV')
  .constant('VERSION', '@@VERSION')
  .constant('AIRBREAK_API_KEY', '@@AIRBREAK_API_KEY')
  .constant('AIRBREAK_URL', '@@AIRBREAK_URL')
  .constant('LIEFEREINHEIT', {
    STUECK: addExtendedEnumValue('Stueck', gettext('Stück'), gettext('St.')),
    BUND: addExtendedEnumValue('Bund', gettext('Bund'), gettext('Bu.')),
    GRAMM: addExtendedEnumValue('Gramm', gettext('Gramm'), gettext('gr')),
    KILOGRAMM: addExtendedEnumValue('Kilogramm', gettext('Kilogramm'),
      gettext('kg')),
    LITER: addExtendedEnumValue('Liter', gettext('Liter'), gettext('l')),
    PORTION: addExtendedEnumValue('Portion', gettext('Portion'), gettext('Por.'))
  })
  .run(function($rootScope, $location) {
    $rootScope.location = $location;
  })
  .factory('checkSize', ['$rootScope', '$window', function($rootScope, $window) {
    return function() {
      if ($window.innerWidth >= 1200) {
        $rootScope.tgState = true;
      }
    };
  }])
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
  .factory('errbitErrorInterceptor', function($q, ENV, VERSION, AIRBREAK_API_KEY, AIRBREAK_URL) {
    return {
      responseError: function(rejection) {
        /*jshint -W117 */
        var airbrake = new airbrakeJs.Client({
          projectId: 1,
          host: AIRBREAK_URL,
          projectKey: AIRBREAK_API_KEY
        });
        /*jshint +W117 */
        airbrake.addFilter(function(notice) {
          notice.context.environment = ENV;
          notice.context.version = VERSION;
          return notice;
        });
        var message = 'Error: ';
        if (!angular.isUndefined(rejection.config) && !angular.isUndefined(rejection.config.url)) {
          message += rejection.config.url;
        }
        airbrake.notify(message);
        return $q.reject(rejection);
      }
    };
  })
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
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/dashboard'
      })
      .when('/dashboard', {
        templateUrl: 'scripts/dashboard/dashboard.html',
        controller: 'DashboardController',
        name: 'Dashboard',
        access: [userRoles.Administrator, userRoles.Kunde]
      })
      .when('/open/lastlieferplanungen', {
        templateUrl: 'scripts/open/lastlieferplanungen.html',
        controller: 'LastLieferplanungenController',
        name: 'LastLieferplanungen',
        access: [userRoles.Guest, userRoles.Administrator, userRoles.Kunde]
      });
  });
