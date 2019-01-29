'use strict';

angular.module('openolitor-kundenportal').controller('ooDialogOkAbortModalInstanceCtrl', function ($scope, $uibModalInstance, message, title, dismissOnly, dismissButtonTitle) {

  $scope.title = title;
  $scope.message = message;
  $scope.dismissOnly = dismissOnly;
  $scope.dismissButtonTitle = dismissButtonTitle;

  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
