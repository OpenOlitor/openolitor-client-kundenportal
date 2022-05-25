'use strict';

angular.module('openolitor-kundenportal').directive('ooAboAbwesenheiten', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        abo: '='
      },
      transclude: true,
      templateUrl: 'scripts/abos/list/abwesenheiten/abwesenheiten.html',
      controller: function(
        $scope,
        $rootScope,
        NgTableParams,
        AbwesenheitenListModel,
        msgBus,
        lodash,
        GeschaeftsjahrUtil,
        moment,
        alertService,
        gettext
      ) {
        $scope.projekt = $rootScope.projekt;

        $scope.templateObject = {};
        $scope.templateObject.showOnlyPending = true;
        $scope.deletingAbwesenheit = {};
        $scope.template = {
          creating: 0
        };

        $scope.abwesenheitsDaten = function() {
          if (!$scope.abwesenheiten) {
            return [];
          }
          return $scope.abwesenheiten.map(function(i) {
            return i.lieferungId;
          });
        };

        $scope.deletingAbwesenheit = function(abw) {
          return $scope.deletingAbwesenheit[abw.id];
        };

        $scope.deleteAbwesenheit = function(abw) {
          $scope.deletingAbwesenheit[abw.id] = true;
          abw.$delete();
        };

        $scope.addAbwesenheit = function(abo, lieferung) {
          var newModel = new AbwesenheitenListModel({
            datum: lieferung.datum,
            lieferungId: lieferung.id,
            aboId: $scope.abo.id,
            kundeId: $scope.abo.kundeId
          });
          newModel.$save(function() {
            abo.lieferdaten.filter(function(lieferdat) {
              return lieferdat.datum !=  lieferung.datum;
            })
          }, function(error) {
            alertService.addAlert(
              'error',
              gettext('Die Abwesenheit konnte nicht eingetragen werden.')
            );
          });
          $scope.template.creating = $scope.template.creating + 1;
        };

        $scope.showLoading = function() {
          return $scope.loading || $scope.template.creating > 0;
        };

        $scope.isLieferungOpen = function(abw) {
          var lieferung = lodash.filter($scope.abo.lieferdaten, function(l) {
            return l.id === abw.lieferungId;
          });
          return (
            lieferung && lieferung.length === 1 && !lieferung[0].lieferplaningId
          );
        };

        $scope.isAboRunning = function(abo) {
          return (
            angular.isUndefined(abo.ende) || moment(abo.ende).isAfter(moment())
          );
        };

        if (!$scope.abwesenheitenTableParams) {
          //use default tableParams
          $scope.abwesenheitenTableParams = new NgTableParams(
            {
              // jshint ignore:line
              counts: [],
              sorting: {
                datum: 'asc'
              }
            },
            {
              getData: function(params) {
                if (!$scope.abwesenheiten) {
                  return;
                }
                params.total($scope.abwesenheiten.length);
                return $scope.abwesenheiten;
              }
            }
          );
        }

        $scope.filterIfLieferungOpen = function(item) {
          if ($scope.isLieferungOpen(item)) {return item; } else { return ''; }
        };

        var unwatchRoot = $rootScope.$watch('projekt', function(projekt) {
          if(projekt) {
            $scope.isInCurrentOrLaterGJ = GeschaeftsjahrUtil.isInCurrentOrLaterGJ(projekt,new Date());
          }
        });

        $scope.getCurrentAbsences = function() {
          return ($scope.isInCurrentOrLaterGJ && !angular.isUndefined($scope.currentlyMatchingGJItem) && !angular.isUndefined($scope.currentlyMatchingGJItem.value)) ? $scope.currentlyMatchingGJItem.value : 0;
        };

        function updateGJValues() {
          $scope.currentlyMatchingGJItem = GeschaeftsjahrUtil.getMatchingGJItem(
            $scope.abo.anzahlAbwesenheiten,
            $scope.projekt
          );

          var date = new Date();
          if (typeof $scope.currentlyMatchingGJItem.key !== 'number') {
            var dateArray = $scope.currentlyMatchingGJItem.key.split('/');
            date.setYear(dateArray[1]);
            date.setMonth(dateArray[0], 1);
          } else {
            date.setYear($scope.currentlyMatchingGJItem.key);
            date.setMonth(1, 1);
          }
        }

        $scope.getAbwesenheitenTooltip = function(abo) {
          var ret = '';
          angular.forEach(abo.anzahlAbwesenheiten, function(gj) {
            ret += gj.key + ': ' + gj.value + '<br />';
          });

          return ret;
        };

        msgBus.onMsg('EntityCreated', $scope, function(event, msg) {
          if (msg.entity === 'Abwesenheit') {
            if (msg.data.aboId === $scope.abo.id) {
              $scope.template.creating = $scope.template.creating - 1;
              msg.data.kundeId = $scope.abo.kundeId;
              $scope.abwesenheiten.push(new AbwesenheitenListModel(msg.data));
              updateGJValues();
            }

            $scope.$apply();
          }
        });

        msgBus.onMsg('EntityDeleted', $scope, function(event, msg) {
          if (msg.entity === 'Abwesenheit') {
            $scope.deletingAbwesenheit[msg.data.id] = undefined;

            angular.forEach($scope.abwesenheiten, function(abw) {
              if (abw.id === msg.data.id) {
                var index = $scope.abwesenheiten.indexOf(abw);
                if (index > -1) {
                  $scope.abwesenheiten.splice(index, 1);
                  updateGJValues();
                }
              }
            });

            $scope.$apply();
          }
        });

        var unwatchCollection = $scope.$watchCollection(
          'abo.anzahlAbwesenheiten',
          function(newAbwesenheiten) {
            if (newAbwesenheiten) {
              updateGJValues();
            }
          }
        );

        var unwatch = $scope.$watch('abo', function(abo) {
          if (abo) {
            $scope.abwesenheiten = $scope.abo.abwesenheiten.map(function(abw) {
              abw.kundeId = $scope.abo.kundeId;
              return new AbwesenheitenListModel(abw);
            });
            updateGJValues();
            if ($scope.abwesenheitenTableParams) {
              $scope.abwesenheitenTableParams.reload();
            }
          }
        });
        $scope.$on('destroy', function() {
          unwatch();
          unwatchCollection();
          unwatchRoot();
        });
      }
    };
  }
]);
