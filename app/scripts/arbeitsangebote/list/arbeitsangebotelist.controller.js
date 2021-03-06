'use strict';

/**
 */
angular
  .module('openolitor-kundenportal')
  .controller('ArbeitsangeboteListController', [
    '$scope',
    'NgTableParams',
    'ArbeitsangeboteListModel',
    '$uibModal',
    '$log',
    'alertService',
    'gettext',
    '$http',
    '$filter',
    'appConfig',
    'ooAuthService',
    'msgBus',
    function(
      $scope,
      NgTableParams,
      ArbeitsangeboteListModel,
      $uibModal,
      $log,
      alertService,
      gettext,
      $http,
      $filter,
      appConfig,
      ooAuthService,
      msgBus
    ) {
      $scope.arbeitsangebotTableParams = undefined;

      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};
      $scope.maxEntries = 10;

      ArbeitsangeboteListModel.query(function(data) {
        $scope.entries = data;
        if ($scope.arbeitsangebotTableParams) {
          $scope.arbeitsangebotTableParams.reload();
        }
      });

      if (!$scope.arbeitsangebotTableParams) {
        $scope.arbeitsangebotTableParams = new NgTableParams(
          {
            // jshint ignore:line
            counts: [],
            sorting: {
              zeitVon: 'asc'
            }
          },
          {
            getData: function(params) {
              if (!$scope.entries) {
                return;
              }
              var orderedData = params.sorting
                ? $filter('orderBy')($scope.entries, params.orderBy())
                : $scope.entries;

              params.total(orderedData.length);
              return orderedData;
            }
          }
        );
      }

      $scope.statusClass = function(arbeitsangebot) {
        if (angular.isDefined(arbeitsangebot)) {
          switch (arbeitsangebot.status) {
            case 'Erstellt':
            case 'Verschickt':
            case 'MahnungVerschickt':
              if (arbeitsangebot.faelligkeitsDatum < new Date()) {
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
          templateUrl:
            'scripts/arbeitsangebote/list/arbeitsangebot-participate.html',
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

        modalInstance.result.then(
          function(data) {
            data.kundeId = ooAuthService.getUser().kundeId;
            data.personId = ooAuthService.getUser().id;
            $http.post(appConfig.get().API_URL + 'kundenportal/arbeitsangebote', data).then(
              function() {
                alertService.addAlert(
                  'info',
                  gettext('Erfolgreich in Arbeitsangebot eingeschrieben')
                );
              },
              function(error) {
                alertService.addAlert(
                  'error',
                  gettext('Das Einschreiben war nicht erfolgreich: ') +
                    error.status +
                    ':' +
                    error.statusText
                );
              }
            );
          },
          function() {
            $log.info('Modal dismissed at: ' + new Date());
          }
        );
      };

      $scope.isParticipating = function(arbeitsangebot) {
        return !angular.isUndefined($scope.getArbeitseinsatz(arbeitsangebot));
      };

      $scope.getArbeitseinsatz = function(arbeitsangebot) {
        if ($scope.arbeitseinsatzList) {
          var ret = undefined;
          angular.forEach($scope.arbeitseinsatzList, function(arbeitseinsatz) {
            if (arbeitseinsatz.arbeitsangebotId === arbeitsangebot.id) {
              ret = arbeitseinsatz;
            }
          });
          return ret;
        }
        return undefined;
      };

      $scope.edit = function(arbeitsangebot) {
        var arbeitseinsatz = $scope.getArbeitseinsatz(arbeitsangebot);
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl:
            'scripts/arbeitsangebote/list/arbeitsangebot-participate.html',
          controller: 'ArbeitsangebotParticipateController',
          resolve: {
            arbeitsangebot: function() {
              return undefined;
            },
            arbeitseinsatz: function() {
              return arbeitseinsatz;
            }
          }
        });

        modalInstance.result.then(
          function(data) {
            arbeitseinsatz.bemerkungen = data.bemerkungen;
            arbeitseinsatz.anzahlPersonen = data.anzahlPersonen;
            $http
              .post(
                appConfig.get().API_URL + 'kundenportal/arbeitseinsaetze/' + arbeitseinsatz.id,
                arbeitseinsatz
              )
              .then(
                function() {
                  alertService.addAlert(
                    'info',
                    gettext('Arbeitseinsatz erfolgreich verändert.')
                  );
                },
                function(error) {
                  alertService.addAlert(
                    'error',
                    gettext('Arbeitseinsatz ändern nicht erfolgreich: ') +
                      error.status +
                      ':' +
                      error.statusText
                  );
                }
              );
          },
          function() {
            $log.info('Modal dismissed at: ' + new Date());
          }
        );
      };

      $scope.sameDay = function(date1, date2) {
        return date1.toDateString() === date2.toDateString();
      };

      msgBus.onMsg('ArbeitseinsatzListLoaded', $scope, function(event, msg) {
        $scope.arbeitseinsatzList = msg.list;
      });

      $scope.showMore = function() {
        $scope.maxEntries = Number.MAX_SAFE_INTEGER;
        if($scope.arbeitsangebotTableParams) {
          $scope.arbeitsangebotTableParams.reload();
        }
      };
    }
  ]);
