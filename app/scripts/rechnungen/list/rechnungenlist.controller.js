'use strict';

/**
 */
angular.module('openolitor-kundenportal')
  .controller('RechnungenListController', ['$scope', 'NgTableParams', 'RechnungenListModel',
    'FileUtil', '$location', '$anchorScroll',
    function($scope, NgTableParams, RechnungenListModel, FileUtil, $location, $anchorScroll) {
      $scope.rechungenTableParams = undefined;

      $scope.entries = [];
      $scope.loading = false;
      $scope.model = {};

      RechnungenListModel.query(function(data) {
        $scope.entries = data;
        if($scope.rechungenTableParams) {
          $scope.rechungenTableParams.reload();
        }
      });

      if (!$scope.rechungenTableParams) {
        $scope.rechungenTableParams = new NgTableParams({ // jshint ignore:line
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

      $scope.downloadRechnung = function(rechnung) {
        rechnung.isDownloading = true;
        FileUtil.downloadGet('kundenportal/rechnungen/' + rechnung.id +
          '/aktionen/downloadrechnung', 'Rechnung ' + rechnung.id,
          'application/pdf',
          function() {
            rechnung.isDownloading = false;
          });
      };

      $scope.downloadMahnung = function(rechnung, fileId) {
        rechnung.isDownloadingMahnung = true;
        FileUtil.downloadGet('kundenportal/rechnungen/' + rechnung.id +
          '/aktionen/download/' + fileId, 'Rechnung ' + rechnung.id + ' Mahnung',
          'application/pdf',
          function() {
            rechnung.isDownloadingMahnung = false;
          });
      };

      $scope.statusClass = function(rechnung) {
        if(angular.isDefined(rechnung)) {
          switch(rechnung.status) {
            case 'Erstellt':
            case 'Verschickt':
            case 'MahnungVerschickt':
              if(rechnung.faelligkeitsDatum < new Date()) {
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


      $scope.getKontoNr = function(rechnung) {
        if(angular.isUndefined(rechnung.esrNummer)) {
          return '';
        } else {
          var nr = rechnung.esrNummer.split('+')[0];
          return nr + ' NNN' + nr.substr(0, 2) + '-' + nr.substr(2, -1) + '-' +  nr.substr(-1, 1);
        }
      };

      $scope.gotoAbo = function(aboId) {
        $location.hash('abo' + aboId);
        $anchorScroll();
      };
    }
  ]);
