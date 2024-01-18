'use strict';

/**
 */
angular
  .module('openolitor-kundenportal')
  .controller('ArbeitsangeboteListController', [
    '$scope',
    'NgTableParams',
    'ArbeitsangeboteModel',
    'ArbeitseinsaetzeListModel',
    '$uibModal',
    '$log',
    'alertService',
    'gettext',
    '$http',
    '$filter',
    'appConfig',
    'ooAuthService',
    '$location',
    'EnumUtil',
    'ZEITRAUM',
    'msgBus',
    'gettextCatalog',
    'localeSensitiveComparator',
    'lodash',
    function(
      $scope,
      NgTableParams,
      ArbeitsangeboteModel,
      ArbeitseinsaetzeListModel,
      $uibModal,
      $log,
      alertService,
      gettext,
      $http,
      $filter,
      appConfig,
      ooAuthService,
      $location,
      EnumUtil,
      ZEITRAUM,
      msgBus,
      gettextCatalog, 
      localeSensitiveComparator,
      lodash
    ) {
      $scope.arbeitsangebotTableParams = undefined;

      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};
      $scope.maxEntries = 10;

      if (!$scope.arbeitsangebotTableParams) {
        $scope.arbeitsangebotTableParams = new NgTableParams(
          {
            // jshint ignore:line
            counts: [],
            sorting: {
              zeitVon: 'asc'
            },
            filter:{zeitVonF:'D'}
          },
          {
            filterDelay: 0,
            groupOptions: {
              isExpanded: true
            },
            exportODSModel: ArbeitsangeboteModel,
            exportODSFilter: function() {
              return {
                g: $scope.geschaeftsjahr
              };
            },
            getData: function(params) {
              if (!$scope.entries) {
                return;
              }
              var f = params.filter();
              var data = $scope.entries;
              if(f.zeitVonF && f.zeitVonF !== null) {
                var from, to;
                if(f.zeitVonF === 'D') {
                  from = moment().startOf('day').toDate();
                  to = new Date(8640000000000000);
                } else if(f.zeitVonF === 'd') {
                  from = moment().startOf('day').toDate();
                  to = moment().endOf('day').toDate();
                } else if(f.zeitVonF === 'w') {
                  from = moment().startOf('week').toDate();
                  to = moment().endOf('week').toDate();
                } else if(f.zeitVonF === 'M') {
                  from = moment().startOf('month').toDate();
                  to = moment().endOf('month').toDate();
                } else if(f.zeitVonF === 'V') {
                  from =new Date(-8640000000000000);
                  to = moment().startOf('day').toDate();
                } else {
                  from =new Date(-8640000000000000);
                  to = new Date(8640000000000000);
                }
                data = $filter('dateRange') (
                    data,
                    from,
                    to,
                    'zeitVon'
                  );
              }
              // use build-in angular filter
              var filteredData = $filter('filter')(
                data,
                $scope.search.query
              );
              f = params.filter(true);
              delete f.zeitVonF;
              var orderedData = $filter('filter')(
                filteredData,
                f
              );
              if (orderedData){
              orderedData = params.sorting ? $filter('orderBy')(
                    orderedData,
                    params.orderBy(),
                    false,
                    localeSensitiveComparator
                  )
                : orderedData;

              params.total(orderedData.length);
              return orderedData.slice(0,$scope.maxEntries);
              } else {
                return [];
              }
            }
          }
        );
      }

      $scope.search = {
        query: '',
      };

      $scope.loadArbeitsangebotTableParams= function(){
        $scope.entries = ArbeitsangeboteModel.query({
            g: /^\d+$/.test($scope.geschaeftsjahr)?$scope.geschaeftsjahr:''
        }, function() {
          $scope.arbeitsangebotTableParams.reload();
            $scope.loading = false;
        });
      };

      $scope.loadArbeitsangebotTableParams();

      $scope.$watch(
        'search.query',
        function() {
          $scope.loadArbeitsangebotTableParams();
        },
        true
      );

      $scope.zeitraumLAsArray = EnumUtil.asArray(ZEITRAUM);
      $scope.zeitraumL = [];
      angular.forEach(lodash.sortBy($scope.zeitraumLAsArray, function(zr){
          return gettextCatalog.getString(zr.label).toLowerCase();
      }), function(value, key) {
        $scope.zeitraumL.push({
          'id': value.id,
          'title': gettextCatalog.getString(value.label)
        });
      });

      var existingGJ = $location.search().g;
      if (existingGJ) {
        $scope.geschaeftsjahr = existingGJ;
      }

      $scope.hasData = function() {
        return $scope.entries !== undefined;
      };

      $scope.selectGeschaeftsjahr = function(gj) {
        if(angular.isDefined(gj)) {
          $scope.geschaeftsjahr = gj;
        } else {
          $scope.geschaeftsjahr = undefined;
        }
        $scope.initGJ = true;
        $scope.maxEntries = 10;
        $scope.loadArbeitsangebotTableParams();
        return false;
      }

      $scope.availableVacancies = function(arbeitsangebot) {
        if ((arbeitsangebot.anzahlPersonen-arbeitsangebot.anzahlEingeschriebene) <= 0) {
          return false;
        } else {
          return true;
        }
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

      $scope.sameDay = function(date1, date2) {
        return date1.toDateString() === date2.toDateString();
      };

      msgBus.onMsg('ArbeitseinsatzListLoaded', $scope, function(event, msg) {
         ArbeitseinsaetzeListModel.query(function(data) {
          $scope.arbeitseinsatzList = _(data).groupBy('arbeitsangebotId')
            .map(function(items, arbeitsangebotId) {
              return {
                arbeitsangebotId: parseInt(arbeitsangebotId),
                id: _.find(items, o => { return o.personId === ooAuthService.getUser().id;}).id,
                contactPermission: _.find(items, o => { return o.personId === ooAuthService.getUser().id;}).contactPermission,
                kundeId: _.find(items, o => { return o.personId === ooAuthService.getUser().id;}).kundeId,
                zeitBis: items[0].zeitBis,
                zeitVon: items[0].zeitVon,
                arbeitsangebotTitel: items[0].arbeitsangebotTitel,
                anzahlPersonen: _.find(items, o => { return o.personId === ooAuthService.getUser().id;}).anzahlPersonen,
                anzahlEingeschriebene : _.find(items, o => { return o.personId === ooAuthService.getUser().id;}).anzahlEingeschriebene,
                bemerkungen: _.find(items, o => { return o.personId === ooAuthService.getUser().id;}).bemerkungen,
              };
            }).value();
         });
        $scope.loadArbeitsangebotTableParams();
      });

      $scope.showMore = function() {
        $scope.maxEntries = $scope.maxEntries + 10;
        if($scope.arbeitsangebotTableParams) {
          $scope.arbeitsangebotTableParams.reload();
        }
      };
    }
  ]);
