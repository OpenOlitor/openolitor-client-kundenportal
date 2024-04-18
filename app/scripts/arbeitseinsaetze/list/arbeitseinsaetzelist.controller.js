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
    'appConfig',
    'ooAuthService',
    'lodash',
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
      appConfig,
      ooAuthService,
      lodash
    ) {
      $scope.arbeitseinsatzTableParams = undefined;
      $scope.contactsVisible = [];
      $scope.entries = [];
      $scope.model = {};
      $scope.maxEntries = 10;
      var today = new Date();

      $scope.initArbeitseinsaetzeTableParams = function(){
        ArbeitseinsaetzeListModel.query({
          g: /^\d+$/.test($scope.geschaeftsjahr)?$scope.geschaeftsjahr:''
        },(function(data) {
          $scope.limitDateForDeletion = today.setDate(today.getDate()+1);
          $scope.entries = _(data).groupBy('arbeitsangebotId')
            .map(function(items, arbeitsangebotId) {
              $scope.contactsVisible[arbeitsangebotId] = false;
              return {
                arbeitsangebotId: parseInt(arbeitsangebotId),
                id: _.find(items, o => { return o.personId === ooAuthService.getUser().id;}).id,
                contactPermission: _.find(items, o => { return o.personId === ooAuthService.getUser().id;}).contactPermission,
                kundeId: _.find(items, o => { return o.personId === ooAuthService.getUser().id;}).kundeId,
                zeitBis: items[0].zeitBis,
                zeitVon: items[0].zeitVon,
                arbeitsangebotTitel: items[0].arbeitsangebotTitel,
                anzahlPersonen: _.find(items, o => { return o.personId === ooAuthService.getUser().id;}).anzahlPersonen,
                anzahlEingeschriebene: _.find(items, o => { return o.personId === ooAuthService.getUser().id;}).arbeitsangebot.anzahlEingeschriebene,
                bemerkungen: _.find(items, o => { return o.personId === ooAuthService.getUser().id;}).bemerkungen,
                coworkers: _.map(items, function(item){
                  if (item.personId != ooAuthService.getUser().id) {
                    return [item.personName, item.email];
                  }  
                }).filter(item =>item) 
              };
            }).value();
          if ($scope.arbeitseinsatzTableParams) {
            $scope.arbeitseinsatzTableParams.reload();
          }
          var msg = {
            type: 'ArbeitseinsatzListLoaded',
            list: $scope.entries
          };
          msgBus.emitMsg(msg);
        }));
      }

      var existingGJ = $location.search().g;
      if (existingGJ) {
        $scope.geschaeftsjahr = existingGJ;
      }

      $scope.selectGeschaeftsjahr = function(gj) {
        if(angular.isDefined(gj)) {
          $scope.geschaeftsjahr = gj;
        } else {
          $scope.geschaeftsjahr = undefined;
        }
        $scope.initGJ = true;
        $scope.maxEntries = 10;
        $scope.initArbeitseinsaetzeTableParams();
        return false;
      }

      $scope.initArbeitseinsaetzeTableParams();
      if (!$scope.arbeitseinsatzTableParams) {
        $scope.arbeitseinsatzTableParams = new NgTableParams(
          {
            // jshint ignore:line
            counts: [],
            sorting: {
              zeitVon: 'asc'
            }
          },{
            filterDelay: 0,
            groupOptions: {
              isExpanded: true
            },
            exportODSModel: ArbeitseinsaetzeListModel,
            exportODSFilter: function() {
              return {
                g: $scope.geschaeftsjahr
              };
            },
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
            appConfig.get().API_URL + 'kundenportal/arbeitseinsaetze/' + arbeitseinsatz.id
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
            arbeitseinsatz.contactPermission = data.contactPermission;
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

      $scope.displayContacts = function(arbeitsangebot) {
        $scope.contactsVisible[arbeitsangebot] = !$scope.contactsVisible[arbeitsangebot];
      };

      msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
        if (
          msg.entity === 'Arbeitseinsatz' &&
          msg.data.personId === ooAuthService.getUser().id
        ) {
          $scope.entries.push(msg.data);
          $scope.$apply();
          $scope.initArbeitseinsaetzeTableParams();
        }
      });
      
      msgBus.onMsg('EntityModified', $scope, function(event, msg) {
        if (
          msg.entity === 'Arbeitseinsatz' &&
          msg.data.personId === ooAuthService.getUser().id
        ) {
          $scope.entries.push(msg.data);
          $scope.$apply();
          $scope.initArbeitseinsaetzeTableParams();
        }
      });

      msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
        if (
          msg.entity === 'Arbeitseinsatz' &&
          msg.data.personId === ooAuthService.getUser().id
        ) {
          $scope.entries.splice($scope.entries.indexOf(event.data), 1);
          $scope.$apply();
          $scope.initArbeitseinsaetzeTableParams();
        }
      });

      $scope.showMore = function() {
        $scope.maxEntries = Number.MAX_SAFE_INTEGER;
        if($scope.arbeitseinsatzTableParams) {
          $scope.initArbeitseinsaetzeTableParams();
          $scope.arbeitseinsatzTableParams.reload();
        }
      };
    }
  ]);
