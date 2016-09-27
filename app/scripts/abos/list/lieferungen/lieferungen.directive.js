'use strict';

angular.module('openolitor-kundenportal').directive('ooAboKorbinhalt', [
  function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        abo: '='
      },
      transclude: true,
      templateUrl: 'scripts/abos/list/lieferungen/lieferungen.html',
      controller: function($scope, NgTableParams, LieferungenListModel) {
        $scope.lastLieferung = undefined;

        $scope.showLoading = function() {
          return $scope.loading || $scope.template.creating > 0;
        };

        var unwatch = $scope.$watch('abo', function(abo) {
          if (abo) {
            LieferungenListModel.getLast({abotypId: abo.abotypId}, function(data) {
              $scope.lastLieferung = data;
            });

            if ($scope.lieferungenTableParams) {
              $scope.lieferungenTableParams.reload();
            }
          }
        });
        $scope.$on('destroy', function() {
          unwatch();
        });

        if (!$scope.lieferungenTableParams) {
          //use default tableParams
          $scope.lieferungenTableParams = new NgTableParams({ // jshint ignore:line
            counts: [],
            sorting: {
              datum: 'asc'
            }
          }, {
            getData: function(params) {
              if (!$scope.lastLieferung) {
                return;
              }
              params.total($scope.lastLieferung.lieferpositionen.length);
              return $scope.lastLieferung.lieferpositionen;
            }

          });
        }


      }
    };
  }
]);
