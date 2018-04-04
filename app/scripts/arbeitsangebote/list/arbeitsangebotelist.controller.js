'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('ArbeitsangeboteListController', ['$scope', 'NgTableParams', 'ArbeitsangeboteListModel', '$uibModal',
    '$log', 'alertService', 'gettext', '$http', 'API_URL', 'ooAuthService',
    function($scope, NgTableParams, ArbeitsangeboteListModel, $uibModal, $log, alertService, gettext,
      $http, API_URL, ooAuthService) {
      $scope.arbeitsangebotTableParams = undefined;

      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};

      ArbeitsangeboteListModel.query(function(data) {
        $scope.entries = data;
        if($scope.arbeitsangebotTableParams) {
          $scope.arbeitsangebotTableParams.reload();
        }
      });

      if (!$scope.arbeitsangebotTableParams) {
        $scope.arbeitsangebotTableParams = new NgTableParams({ // jshint ignore:line
          counts: [],
          sorting: {
            datum: 'asc'
          }
        }, {
          getData: function(params) {
            if (!$scope.entries) {
              return;
            }
            params.total($scope.entries.length);
            return $scope.entries;
          }

        });
      }

      $scope.statusClass = function(arbeitsangebot) {
        if(angular.isDefined(arbeitsangebot)) {
          switch(arbeitsangebot.status) {
            case 'Erstellt':
            case 'Verschickt':
            case 'MahnungVerschickt':
              if(arbeitsangebot.faelligkeitsDatum < new Date()) {
                return 'fa-circle-o red';
              } else {
                return 'fa-circle-o';
              }
              break;
            case 'Bezahlt':
              return 'fa-check-circle-o';
            case 'Storniert':
              return 'fa-times-circle-o';
          }
        }
        return '';
      };

      $scope.participate = function(arbeitsangebot) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: 'scripts/arbeitsangebote/list/arbeitsangebot-participate.html',
          controller: 'ArbeitsangebotParticipateController',
          resolve: {
            arbeitsangebot: function() {
              return arbeitsangebot;
            },
            arbeitseinsatz: function() {
              return undefined;
            }
          }
        });

        modalInstance.result.then(function(data) {
          data.kundeId = ooAuthService.getUser().kundeId;
          $http.post(API_URL + 'kundenportal/arbeitsangebote/',
            data).then(function() {
            alertService.addAlert('info', gettext(
              'Erfolgreich in Arbeitsangebot eingeschrieben'));
          }, function(error) {
            alertService.addAlert('error', gettext(
                'Das Einschreiben war nicht erfolgreich: ') +
              error.status + ':' + error.statusText);
          });
        }, function() {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };

      $scope.sameDay = function(date1, date2) {
        return date1.toDateString() === date2.toDateString();
      }
    }
  ]);
