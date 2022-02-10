'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('OpenOlitorRootController', ['$scope', '$rootScope',
    'ServerService', 'ProjektService', 'gettextCatalog', 'amMoment',
    '$location', 'msgBus', 'checkSize', '$anchorScroll', '$window', '$timeout', 'BUILD_NR',
    'ooAuthService', 'appConfig', '$cookies', 'dialogService', '$http',
    function($scope, $rootScope, ServerService, ProjektService,
      gettextCatalog, amMoment, $location, msgBus, checkSize, $anchorScroll, $window,
      $timeout, BUILD_NR, ooAuthService, appConfig,
      $cookies, dialogService, $http) {
      angular.element($window).bind('resize', function() {
        checkSize();
      });

      $scope.welcomeDisplayed = false;
      $scope.loaded = false;

      $scope.currentPathContains = function(pathJunk) {
        return $location.url().indexOf(pathJunk) !== -1;
      };

      //initial launch
      checkSize();

      $scope.connected = false;

      $scope.contactPermissionChange = function(value) {
         var copyUser = $scope.user;
         copyUser.contactPermission = value;
         $http
              .post(
                appConfig.get().API_URL + 'kundenportal/personContactVisibility/' + $scope.user.id
              )
              .then(
                function() {
                  alertService.addAlert(
                    'info',
                    gettext('This person contact information will not be available for other users')
                  );
                },
                function(error) {
                  alertService.addAlert(
                    'error',
                    gettext('Changing the contact information permission failed: ') +
                      error.status +
                      ':' +
                      error.statusText
                  );
                }
              );
      }


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
            $scope.initCheckLang();
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
      $scope.sendStats = false;

      $scope.loadAppConfig = function(count) {
        if(appConfig.isLoaded()) {
          $scope.env = appConfig.get().ENV;
          $scope.version = appConfig.get().version;
          $scope.API_URL = appConfig.get().API_URL;
          $scope.sendStats = appConfig.get().sendStats;
          $scope.loaded = true;
          //add project custom class
          var head = document.getElementsByTagName('HEAD')[0];
          var link = document.createElement('link');
          link.rel = 'stylesheet';

          link.type = 'text/css';

          link.href = $scope.API_URL + 'ressource/style/kundenportal';
          head.appendChild(link);

          ServerService.initialize();
        } else {
          if(count < 100) {
            $timeout(function() {
              $scope.loadAppConfig(count++);
            }, 100);
          }
        }
      };

      $scope.loadAppConfig(0);

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

      $scope.displayActiveLang = function() {
        switch(gettextCatalog.getCurrentLanguage()){
          case 'en_US': return 'en';
          case 'cs_CZ': return 'cs';
          case 'es_ES': return 'es';
          case 'hu_HU': return 'hu';
          default: return(gettextCatalog.getCurrentLanguage());
        }
      };

      $scope.activeLang = function() {
        return gettextCatalog.getCurrentLanguage();
      };

      $scope.storedActiveLang = function() {
        return $cookies.get('activeLang');
      };

      $scope.storeActiveLang = function(lang) {
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 3650);
        $cookies.put('activeLang', lang, {'expires':expireDate});
      };

      $scope.getContentLanguage = function() {
        if($scope.storedActiveLang()) {
          return $scope.storedActiveLang().replace('_', '-');
        } else {
          return 'en';
        }
      }

      $scope.initCheckLang = function() {
        if (angular.isUndefined($scope.storedActiveLang())) {
          var lang = $window.navigator.language || $window.navigator.userLanguage;
          debugger;
          if($scope.projekt && $scope.projekt.sprache) {
            //select the project-language as default
            var projLang = $scope.projekt.sprache.replace('_', '-');;
            if(['de-CH', 'de-DE', 'de-DO', 'fr-BE', 'fr-CH', 'en', 'es', 'cs', 'hu'].includes(projLang)) {
              lang = projLang;
            }
          }
          lang = lang.replace('_', '-');
          if (lang.startsWith('de-CH')) {
            $scope.changeLang('de_CH');
          } else if (lang.startsWith('de-DE')) {
            $scope.changeLang('de_DE');
          } else if (lang.startsWith('de-DO')) {
            $scope.changeLang('de_DO');
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
      };

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

      $scope.gotoAnchor = function(anchor) {
        if ($location.hash() !== anchor) {
          $location.hash(anchor);
        } else {
          $anchorScroll(anchor);
        }
      };

      $scope.$on('destroy', function() {
        unwatchLoggedIn();
        unwatchStaticServerInfo();
      });
    }
  ]);
