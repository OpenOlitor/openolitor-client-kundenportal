'use strict';

var userRoles = {
  Guest: 'Guest',
  Administrator: 'Administrator',
  Kunde: 'Kunde'
};

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
    'angular.css.injector',
    'openolitor-core'
  ])
  .constant('API_URL', '@@API_URL')
  .constant('API_WS_URL', '@@API_WS_URL')
  .constant('BUILD_NR', '@@BUILD_NR')
  .constant('ENV', '@@ENV')
  .constant('VERSION', '@@VERSION')
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
      });
  });
