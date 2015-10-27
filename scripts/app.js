angular.module('cpslobooks', [
	'ui.router', 'facebook', 'ui.select'
]);

angular.module('cpslobooks').config(function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise('/');

	$stateProvider.state('home', {
		url: '/',
		templateUrl: '/partials/home.html',
		data: {
			title: ''
		},
		controller: function($rootScope) {
			$rootScope.navlight = 'dark';
		}
	})
	.state('pages', {
		templateUrl: '/partials/pages.html'
	})
	.state('pages.buy', {
		url: '^/buy',
		templateUrl: '/partials/buy.html'
	})
	.state('pages.sell', {
		url: '^/sell',
		templateUrl: '/partials/sell.html'
	})
	.state('pages.mybooks', {
		url: '^/me',
		templateUrl: '/partials/mybooks.html'
	})
	.state('pages.book', {
		url: '^/book/:hash',
		templateUrl: '/partials/book.html'
	})
	.state('pages.privacy', {
		url: '^/privacy',
		templateUrl: '/partials/privacy.html'
	});
});

angular.module('cpslobooks').controller('IndexCtrl', function($scope, $state, $rootScope, account) {
	$rootScope.$on('$stateChangeError', function(event) {
		$state.go('404');
	});

	$rootScope.$on('account.change', function() {
		$rootScope.$apply();
	});

	$scope.noMoreError = function() {
		$rootScope.error = false;
	};
});
