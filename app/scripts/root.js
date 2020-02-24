'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('OpenOlitorRootController', ['$scope', '$rootScope',
    'ServerService', 'ProjektService', 'gettextCatalog', 'amMoment',
    '$location', 'msgBus', 'checkSize', '$window', '$timeout', 'BUILD_NR',
    'ENV', 'VERSION',
    'ooAuthService', 'API_URL', '$cookies', 'dialogService',
    function($scope, $rootScope, ServerService, ProjektService,
      gettextCatalog, amMoment, $location, msgBus, checkSize, $window,
      $timeout, BUILD_NR, ENV, VERSION, ooAuthService, API_URL,
      $cookies, dialogService) {
      angular.element($window).bind('resize', function() {
        checkSize();
      });

      $scope.welcomeDisplayed = false;

      $scope.currentPathContains = function(pathJunk) {
        return $location.url().indexOf(pathJunk) !== -1;
      };

      //initial launch
      checkSize();

      $scope.connected = false;

      var unwatchLoggedIn = $scope.$watch(function() {
        return ooAuthService.getUser();
      }, function(user) {
        $scope.loggedIn = ooAuthService.isUserLoggedIn(user);
        $scope.user = user;

        if ($scope.loggedIn) {
          ProjektService.resolveProjekt(false).then(function(projekt) {
            $scope.projekt = projekt;
            $rootScope.projekt = projekt;
            $scope.checkWelcomeMessage();
          });
        } else {
          ProjektService.resolveProjekt(true).then(function(projekt) {
            $scope.projekt = projekt;
            $rootScope.projekt = projekt;
          });
        }
      });

      var unwatchStaticServerInfo = $scope.$watch(ServerService.getStaticServerInfo,
        function(info) {
          if (!angular.isUndefined(info)) {
            $scope.serverInfo = info;
            $scope.connected = true;
          }
        });

      $scope.buildNr = BUILD_NR;
      $scope.env = ENV;
      $scope.version = VERSION;

      msgBus.onMsg('WebSocketClosed', $rootScope, function(event, msg) {
        $scope.connected = false;
        $scope.messagingSocketClosedReason = msg.reason;
        $timeout(function() {
          $scope.showConnectionErrorMessage = true;
        }, 30000);
        $scope.$apply();
      });

      msgBus.onMsg('WebSocketOpen', $rootScope, function() {
        $scope.connected = true;
        $scope.showConnectionErrorMessage = false;
        $scope.messagingSocketClosedReason = '';
        $scope.$apply();
      });

      $scope.changeLang = function(lang) {
        if (!angular.isUndefined(lang)) {

          msgBus.emitMsg({
            type: 'ChangeLang',
            reason: lang
          });
          $scope.storeActiveLang(lang);
          $scope.$emit('languageChanged');
        }
      };

      msgBus.onMsg('ChangeLang', $rootScope, function(event, msg) {
        gettextCatalog.setCurrentLanguage(msg.reason);
      });

      $scope.activeLang = function() {
        return gettextCatalog.getCurrentLanguage();
      };

      $scope.storedActiveLang = function() {
        return $cookies.get('activeLang');
      };

      $scope.storeActiveLang = function(lang) {
        $cookies.put('activeLang', lang);
      };

      if (angular.isUndefined($scope.storedActiveLang())) {
        var lang = $window.navigator.language || $window.navigator.userLanguage;
        if (lang.startsWith('de-CH')) {
          $scope.changeLang('de_CH');
        } else if (lang.startsWith('de-DE')) {
          $scope.changeLang('de_DE');
        } else if (lang.startsWith('de')) {
          $scope.changeLang('de_DE');
        } else if (lang.startsWith('fr-BE')) {
          $scope.changeLang('fr_BE');
        } else if (lang.startsWith('fr-CH')) {
          $scope.changeLang('fr_CH');
        } else if (lang.startsWith('fr')) {
          $scope.changeLang('fr_CH');
        } else if (lang.startsWith('en')) {
          $scope.changeLang('en');
        } else if (lang.startsWith('es')) {
          $scope.changeLang('es');
        } else if (lang.startsWith('cs')) {
          $scope.changeLang('cs');
        } else if (lang.startsWith('hu')) {
          $scope.changeLang('hu');
        } else {
          $scope.changeLang('en');
        }
      } else {
        $scope.changeLang($scope.storedActiveLang());
      }


      $scope.checkWelcomeMessage = function() {
        if (!$scope.welcomeDisplayed) {
          $scope.welcomeDisplayed = true;
          if ($scope.projekt.welcomeMessage2) {
            dialogService.displayDialogOkAbort(
              $scope.projekt.welcomeMessage2,
              function() {},
              'Mitteilung',
              true,
              'Schliessen'
            );
          }
        }
      };

      $scope.$on('destroy', function() {
        unwatchLoggedIn();
        unwatchStaticServerInfo();
      });
    }
  ]);
