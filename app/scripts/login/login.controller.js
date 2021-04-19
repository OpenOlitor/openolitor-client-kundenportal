'use strict';

/**
 */
angular.module('openolitor-kundenportal').controller('LoginController', [
  '$scope',
  '$rootScope',
  '$http',
  'appConfig',
  'gettext',
  '$rootElement',
  'alertService',
  '$timeout',
  '$location',
  '$route',
  '$routeParams',
  'ooAuthService',
  '$interval',
  '$window',
  function(
    $scope,
    $rootScope,
    $http,
    appConfig,
    gettext,
    $rootElement,
    alertService,
    $timeout,
    $location,
    $route,
    $routeParams,
    ooAuthService,
    $interval,
    $window
  ) {
    $scope.loginData = {};
    $scope.resetPasswordData = {};
    $scope.secondFactorData = {};
    $scope.changePwd = {
      neu: undefined,
      alt: undefined,
      neuConfirmed: undefined
    };
    $scope.initPassword = {
      neu: undefined,
      neuConfirmed: undefined,
      token: undefined
    };
    $scope.status = 'login';
    $scope.env = appConfig.get().ENV;
    var getSecondFactorCountdownDate = function(scope) {
      return moment().add(scope.secondFactorCountdown, 'seconds');
    }
    var startSecondFactorCountdownTimer = function(scope) {
      if (scope.cancelSecondFactorTimer) {
        $interval.cancel(scope.cancelSecondFactorTimer);
      }
      scope.secondFactorCountdown = 600;  
      scope.cancelSecondFactorTimer = $interval(function() {
        scope.secondFactorCountdown--;
        if(scope.secondFactorCountdown === 0) {
          $interval.cancel(scope.cancelSecondFactorTimer);
          scope.resetForm();
        }
      }, 1000, 0);
    }
    $scope.secondFactorCountdownDate = function() {
      return getSecondFactorCountdownDate($scope);
    };

    $scope.originalTgState = $rootScope.tgState;
    $rootScope.tgState = false;

    var showWelcomeMessage = function(token, person) {
      //show welcome message
      alertService.addAlert(
        'info',
        gettext('Willkommen') + ' ' + person.vorname + ' ' + person.name
      );
      $timeout(function() {
        $location.path('/');
        $scope.status = 'login';
        $rootScope.tgState = $scope.originalTgState;
      }, 1000);

      ooAuthService.loggedIn(token);
    };

    var showGoodbyeMessage = function(usr) {
      if (!angular.isUndefined(usr)) {
        alertService.addAlert(
          'info',
          gettext('Aufwiedersehen') + ' ' + usr.vorname + ' ' + usr.name
        );
      }
    };

    $scope.appName = $rootElement.attr('ng-app');

    var doLogout = function(showMessage, msg) {
      var usr = ooAuthService.getUser();
      $http.post(appConfig.get().API_URL + 'auth/logout').then(function() {
        $scope.loginData.message = undefined;

        ooAuthService.loggedOut();
        if (showMessage) {
          showGoodbyeMessage(usr);
        }

        $timeout(function() {
          $scope.status = 'login';
          if (msg && msg !== '') {
            $location.path('/login').search('msg', msg);
          } else {
            $location.path('/login');
          }
        }, 1000);
      });
    };

    var showPasswordChangedMessage = function() {
      //show welcome message
      alertService.addAlert(
        'info',
        gettext(
          'Passwort wurde erfolgreich geändert, Sie werden automatisch ausgelogged.'
        )
      );

      doLogout(
        false,
        gettext(
          'Passwort wurde erfolgreich geändert, Sie wurden automatisch ausgelogged. Bitte loggen Sie sich mit dem neuen Passwort erneut an.'
        )
      );
    };

    var showPasswordSetMessage = function() {
      alertService.addAlert(
        'info',
        gettext(
          'Das Passwort wurde erfolgreich gesetzt. Sie können sich nun anmelden.'
        )
      );

      $timeout(function() {
        $location.path('/login');
      }, 1000);
    };

    var showPasswordResetMessage = function() {
      alertService.addAlert(
        'info',
        gettext(
          'Anweisungen um Ihr Passwort neu zu setzten wurden Ihnen an Ihre Email-Adresse gesendet.'
        )
      );

      $timeout(function() {
        $location.path('/');
      }, 1000);
    };

    var logout = $route.current.$$route.logout;
    if (logout) {
      doLogout(true);
    }
    var msg = $routeParams.msg;
    if (msg && msg !== '') {
      $scope.loginData.message = msg;
    }

    var sanitizeSecretBase32 = function(secretBase32) {
      // replace base32 padding signs to make it work for all clients
      return secretBase32.replace('=', '');
    }

    var getOtpUrl = function(username, secretBase32) {
      return (
        'otpauth://totp/' +
        $window.location.hostname +
        ':' +
        username +
        '?secret=' +
        sanitizeSecretBase32(secretBase32) +
        '&algorithm=SHA1&digits=6&period=30'
      );
    };

    $scope.login = function() {
      if ($scope.loginForm.$valid) {
        $http.post(appConfig.get().API_URL + 'auth/login', $scope.loginData).then(
          function(result) {
            $scope.loginData.message = undefined;

            //check result
            if (result.data.status === 'SecondFactorRequired') {
              //redirect to second factor authentication
              $scope.status = result.data.secondFactorType == 'email'?'emailTwoFactor':'otpTwoFactor';
              $scope.person = result.data.person;
              $scope.secondFactorType = result.data.secondFactorType;
              if (result.data.otpSecret) {
                $scope.otpSecret = getOtpUrl(result.data.person.email, result.data.otpSecret);
              }
              $scope.secondFactorData.token = result.data.token;

              startSecondFactorCountdownTimer($scope);
            } else {
              showWelcomeMessage(result.data.token, result.data.person);
            }
          },
          function(error) {
            $scope.loginData.message = gettext(error.data);
          }
        );
      }
    };

    $scope.secondFactorLogin = function() {
      if ($scope.secondFactorForm.$valid) {
        $http.post(appConfig.get().API_URL + 'auth/secondFactor', $scope.secondFactorData).then(
          function(result) {
            $scope.secondFactorData.message = undefined;
            if ($scope.cancelSecondFactorTimer) {
              $interval.cancel($scope.cancelSecondFactorTimer);
            }
            showWelcomeMessage(result.data.token, result.data.person);
          },
          function(error) {
            $scope.secondFactorData.message = gettext(error.data);
          }
        );
      }
    };

    $scope.changePassword = function() {
      if ($scope.changePwdForm.$valid) {
        $http.post(appConfig.get().API_URL + 'auth/passwd', $scope.changePwd).then(
          function(result) {
            if (result.data.status === 'Ok') {
              $scope.changePwd.message = undefined;
              showPasswordChangedMessage();
            }
            else if (result.data.status === 'SecondFactorRequired') {
              //redirect to second factor authentication
              $scope.status = result.data.secondFactorType == 'email'?'emailTwoFactor':'otpTwoFactor';
              $scope.person = result.data.person;
              $scope.changePwd.secondFactorAuth = {
                token: result.data.token
              };

              startSecondFactorCountdownTimer($scope);
            }
          },
          function(error) {
            $scope.changePwd.message = gettext(error.data);
          }
        );
      }
    };

    $scope.setPassword = function() {
      if ($scope.setPasswordForm.$valid) {
        $scope.initPassword.token = $routeParams.token;
        $http.post(appConfig.get().API_URL + 'auth/zugangaktivieren', $scope.initPassword).then(
          function() {
            $scope.initPassword.message = undefined;
            showPasswordSetMessage();
          },
          function(error) {
            $scope.initPassword.message = gettext(error.data);
          }
        );
      }
    };

    $scope.resetPassword = function() {
      if ($scope.resetPasswordForm.$valid) {
        $http
          .post(appConfig.get().API_URL + 'auth/passwordreset', $scope.resetPasswordData)
          .then(
            function() {
              $scope.resetPasswordData.message = undefined;
              showPasswordResetMessage();
            },
            function(error) {
              $scope.resetPasswordData.message = gettext(error.data);
            }
          );
      }
    };

    $scope.resetForm = function() {
      $scope.loginData = {};
      $scope.status = 'login';
    };
  }
]);
