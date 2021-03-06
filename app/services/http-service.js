// Authored by kenhowardpdx

(function () {
	'use strict';

	angular.module('app')
		// .service('httpService', ['$http','CONFIG','$rootScope', function($http, CONFIG, $rootScope) {
		.service('httpService', httpService);

	httpService.$inject = ['$http','$rootScope'];
	function httpService($http, $rootScope) {

			// var baseApiUrl = CONFIG.API_URL + 'api/';
			var baseApiUrl = 'https://csgprohackathonapi.azurewebsites.net/api/';

			return ({
				setAuthHeader: setAuthHeader,
				getCollection: getCollection,
				getItem: getItem,
				createItem: createItem,
				updateItem: updateItem,
				deleteItem: deleteItem
			});

			function setAuthHeader(authStr) {
			  	// Setting Authentication Header
				$http.defaults.headers.common.Authorization = authStr;
			}

			function getCollection(entity) {

				var url = baseApiUrl + entity;

				var request = $rootScope.loadingData = $http({
					method: "get",
					url: url
				});

				return (request.then(handleSuccess, handleError));

			}

			function getItem(entity,id) {

				var url = baseApiUrl + entity + '/' + id;

				var request = $rootScope.loadingData = $http({
					method: "get",
					url: url
				});

				return (request.then(handleSuccess, handleError));
			}

			function createItem(entity,data) {

				var url = baseApiUrl + entity;

				var request = $rootScope.loadingData = $http({
					method: "post",
					url: url,
					data: data
				});

				return (request.then(handleSuccess, handleError));
			}

			function updateItem(entity,id,data) {

				var url = baseApiUrl + entity + '/' + id;

				var request = $rootScope.loadingData = $http({
					method: "put",
					url: url,
					data: data
				});

				return (request.then(handleSuccess, handleError));
			}

			function deleteItem(entity,id) {

				var url = baseApiUrl + entity + '/' + id;

				var request = $rootScope.loadingData = $http({
					method: "delete",
					url: url
				});

				return (request.then(handleSuccess, handleError));
			}

			function handleError(response) {
				return (response.message);
			}

			function handleSuccess(response) {
				return (response.data);
			}
		}
})();