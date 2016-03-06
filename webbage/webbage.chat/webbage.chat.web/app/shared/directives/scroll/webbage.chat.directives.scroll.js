(function() {
	'use strict';

	angular.module('webbage.chat.directives.scroll', []).directive('scroll', ['$timeout', function ($timeout) {
		return {
			restrict: 'A',
			link: function (scope, ele, attrs) {
				scope.$watchCollection(attrs.scroll, function (newVal) {
					$timeout(function () {
						ele[0].scrollTop = ele[0].scrollHeight;
					})
				});
			}
		}
	}]);
})();