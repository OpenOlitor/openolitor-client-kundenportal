'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('LastLieferplanungenController', ['$scope', 'NgTableParams', 'LastLieferplanungenModel', 'lodash',
    'LIEFEREINHEIT',
    function($scope, NgTableParams, LastLieferplanungenModel, lodash, LIEFEREINHEIT) {
      $scope.entries = [];
      $scope.shownEntries = 1;

      $scope.liefereinheiten = LIEFEREINHEIT;

      LastLieferplanungenModel.query(function(data) {
        $scope.entries = data;
      });

      $scope.calculatePreis = function(korbprodukt) {
        if(angular.isUndefined(korbprodukt)) {
          return '';
        }
        korbprodukt.preis = (korbprodukt.preisEinheit * korbprodukt.menge);
        return korbprodukt.preis;
      };

      $scope.showMore = function() {
        $scope.shownEntries = $scope.shownEntries + 2;
      };

      $scope.hasBemerkungenPreview = function(planung) {
        if(planung && planung.bemerkungen && planung.bemerkungen.length > 0 && planung.bemerkungen.split('<div>').length > 3) {
          if(!angular.isUndefined(planung.bemerkungenPreview)) {
            return planung.bemerkungenPreview;
          } else {
            planung.bemerkungenPreview = true;
            var bemSplit = planung.bemerkungen.split('<div>');
            planung.bemerkungenShort = bemSplit[0] + '<div>' + bemSplit[1];
            return planung.bemerkungenPreview;
          }
        } else {
          return false;
        }
      };

      $scope.hasBemerkungenFullview = function(planung) {
        if(planung && planung.bemerkungen && planung.bemerkungen.length > 0 && planung.bemerkungen.split('<div>').length > 3) {
          return !planung.bemerkungenPreview;
        } else {
          return !angular.isUndefined(planung.bemerkungen);
        }
      };

      $scope.toggleBemerkungenPreview = function(planung) {
        planung.bemerkungenPreview = !planung.bemerkungenPreview;
      };

      $scope.hasCommonLieferdatum = function(planung) {
        if(!angular.isUndefined(planung.commonLieferdatum)) {
          return true;
        }
        var commonDate;
        var retValue = true;
        angular.forEach(planung.lieferungen, function(lieferung) {
          if(angular.isUndefined(commonDate) ||
            (!angular.isUndefined(lieferung.datum) && lieferung.datum.getTime() === commonDate.getTime())) {
            commonDate = lieferung.datum;
          } else {
            retValue = false;
          }
        });
        if(retValue) {
          planung.commonLieferdatum = commonDate;
        }
        return retValue;
      };
    }
  ]);
