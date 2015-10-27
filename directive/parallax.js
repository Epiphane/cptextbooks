angular.module('cpslobooks').factory('parallax', function($state, $rootScope) {
	var parallax = {};
	var bg = {
		name: null,
		light: 'dark'
	};

	var dark = ['contact', 'home', 'resume'];
	var light = ['games'];

	parallax.setParallax = function(name) {
		$rootScope.navlight = 'dark';

		if(dark.indexOf(name) !== -1) {
			bg.name = name;
		}
		else if(light.indexOf(name) !== -1) {
			bg.name = name;
			$rootScope.navlight = 'light';
		}
		else {
			bg.name = null;
		}

		return bg;
	};

	parallax.getBackground = function() {
		return bg;
	};

	return parallax;
});

angular.module('cpslobooks').directive('parallaxHeader', function(parallax, $state) {
	return {
		restrict: 'E',
		resolve: {
			parallax: 'parallax'
		},
		controller: function($scope) {
			$scope.$watch(function() { return $state.current; },
				function(newValue, oldValue) {
					if ( newValue !== oldValue ) {
						$scope.bg = parallax.setParallax(newValue.data.banner);
						$scope.title = newValue.data.title;
					}
				}
			);

			$scope.bg = parallax.setParallax($state.current.data.banner);
			$scope.title = $state.current.data.title;
		},
		templateUrl: 'directive/parallax.html'
	};
});

angular.module('cpslobooks').directive('parallaxImage', function($rootScope, $window) {
	return {
		restrict: 'C',
		link: function(scope, element, attributes) {
			var window = angular.element($window);

			// Disable Parallax on iOS
			if(!(/iPhone|iPad|iPod|Mobile/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
				var updateParallax = function() {
	        var translate = 'translate3d(0, ' + $window.pageYOffset * 2 / 3 + 'px, 0)';
					element.css({
						'-webkit-transform': translate,
						'ms-transform': translate,
						'transform': translate
					});
				};

				updateParallax();
				window.bind('scroll', updateParallax);
			}
		}
	};
});
