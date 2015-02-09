(function() {
  'use strict';

  angular
    .module('app')
    .factory('Auth', Auth);

  Auth.$inject = ['$cookieStore', 'httpService'];
  function Auth($cookieStore, httpService){
    // initialize to whatever is in the cookie, if anything
    httpService.setAuthHeader('Basic ' + $cookieStore.get('authdata'));

    var service = {
      setCredentials:setCredentials,
      clearCredentials:clearCredentials,
      readCredentials:readCredentials
    };

    return service;

    function setCredentials(username, password) {
      var encoded = btoa(username + ':' + password);
      httpService.setAuthHeader('Basic ' + encoded);
      $cookieStore.put('authdata', encoded);
    }
    function clearCredentials() {
      document.execCommand('ClearAuthenticationCache');
      $cookieStore.remove('authdata');
      httpService.setAuthHeader('');
    }
    function readCredentials() {
      var decoded = btoa($cookieStore.get('authdata'));
      return $cookieStore.get('authdata') + ' ---- ' + decoded;
    }
  }
})();