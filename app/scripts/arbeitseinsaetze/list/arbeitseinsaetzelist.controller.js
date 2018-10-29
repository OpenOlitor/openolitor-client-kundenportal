'use strict';

/**
 */
angular
  .module('openolitor-kundenportal')
  .controller('ArbeitseinsaetzeListController', [
    '$scope',
    '$rootScope',
    'NgTableParams',
    'ArbeitseinsaetzeListModel',
    'FileUtil',
    '$location',
    '$anchorScroll',
    '$uibModal',
    'alertService',
    'msgBus',
    'gettext',
    '$http',
    '$filter',
    'API_URL',
    'ooAuthService',
    function(
      $scope,
      $rootScope,
      NgTableParams,
      ArbeitseinsaetzeListModel,
      FileUtil,
      $location,
      $anchorScroll,
      $uibModal,
      alertService,
      msgBus,
      gettext,
      $http,
      $filter,
      API_URL,
      ooAuthService
    ) {
      $scope.arbeitseinsatzTableParams = undefined;

      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};

      ArbeitseinsaetzeListModel.query(function(data) {
        $scope.entries = data;
        if ($scope.arbeitseinsatzTableParams) {
          $scope.arbeitseinsatzTableParams.reload();
        }
        var msg = {
          type: 'ArbeitseinsatzListLoaded',
          list: $scope.entries
        };
        msgBus.emitMsg(msg);
      });

      if (!$scope.arbeitseinsatzTableParams) {
        $scope.arbeitseinsatzTableParams = new NgTableParams(
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

      $scope.statusClass = function(arbeitseinsatz) {
        if (angular.isDefined(arbeitseinsatz)) {
          switch (arbeitseinsatz.status) {
            case 'Erstellt':
            case 'Verschickt':
            case 'MahnungVerschickt':
              if (arbeitseinsatz.faelligkeitsDatum < new Date()) {
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

      $scope.gotoAbo = function(aboId) {
        $location.hash('abo' + aboId);
        $anchorScroll();
      };

      $scope.sameDay = function(date1, date2) {
        return date1.toDateString() === date2.toDateString();
      };

      $scope.highlightAngebot = function(arbeitsangebotId) {
        $location.hash('arbeitsangebot' + arbeitsangebotId);
        $anchorScroll();
      };

      $scope.quit = function(arbeitseinsatz) {
        $http
          .delete(
            API_URL + 'kundenportal/arbeitseinsaetze/' + arbeitseinsatz.id
          )
          .then(
            function() {
              alertService.addAlert(
                'info',
                gettext('Arbeitsangebot erfolgreich gelöscht.')
              );
            },
            function(error) {
              alertService.addAlert(
                'error',
                gettext('Arbeitsangebot löschen nicht erfolgreich: ') +
                  error.status +
                  ':' +
                  error.statusText
              );
            }
          );
      };

      $scope.edit = function(arbeitseinsatz) {
        var modalInstance = $uibModal.open({
          animation: true,
          template: require('../../arbeitsangebote/list/arbeitsangebot-participate.html'),
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
                API_URL + 'kundenportal/arbeitseinsaetze/' + arbeitseinsatz.id,
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

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (
          msg.entity === 'Arbeitseinsatz' &&
          msg.data.personId === ooAuthService.getUser().id
        ) {
          $scope.entries.push(msg.data);
          $scope.$apply();
          $scope.arbeitseinsatzTableParams.reload();
        }
      });

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (
          msg.entity === 'Arbeitseinsatz' &&
          msg.data.personId === ooAuthService.getUser().id
        ) {
          $scope.entries.splice($scope.entries.indexOf(event.data), 1);
          $scope.$apply();
          $scope.arbeitseinsatzTableParams.reload();
        }
      });
    }
  ]);
