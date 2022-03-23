'use strict';

angular.module('openolitor-kundenportal').filter('ooCurrency', ['$filter', 'gettextCatalog',function($filter, gettextCatalog) {
  return function(value, currency, showTag) {
    var result = '';
    var symbol = undefined;
    result += $filter('number')(value, 2);
    if(showTag) {
      let symbol = undefined;
      if (currency === 'USD') {
        symbol = '$';
      } else if (currency === 'CAD'){
        symbol = '$';
      } else if (currency === 'EUR'){
        symbol = '€';
      } else if (currency === 'GBP' ){
        symbol = '£';
      } else {
        symbol = currency;
      }

      if ((gettextCatalog.getCurrentLanguage() === 'en_US') ||
         (gettextCatalog.getCurrentLanguage() === 'de_DE') ||
         (gettextCatalog.getCurrentLanguage() === 'fr_CH') ||
         (gettextCatalog.getCurrentLanguage() === 'de_CH')) {
        result = symbol + ' ' + result;
      } else {
        result = result + ' ' + symbol;
      }
    }
    return result;
  };
}]);
