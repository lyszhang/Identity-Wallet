'use strict';

function SkMessageDirective($timeout) {
	'ngInject';

	return {
		restrict: 'E',
		scope: {
			type: '@',
			sizeClass: '@',
			message: '@',
			closeAfter: '@'
		},
		link: (scope, element) => {
			let isClosed = false;
			let closeTimeout;
			let closeAfterTimeout;

			scope.close = event => {
				isClosed = true;
				element.addClass('fade-out');
				closeTimeout = $timeout(() => {
					element.remove();
				}, 500);
			};

			if (scope.closeAfter && !isClosed) {
				closeAfterTimeout = $timeout(() => {
					if (!isClosed) {
						element.addClass('fade-out');
						$timeout(() => {
							element.remove();
						}, 500);
					}
				}, scope.closeAfter);
			}

			element.on('$destroy', function() {
				if (closeTimeout) $timeout.cancel(closeTimeout);
				if (closeAfterTimeout) $timeout.cancel(closeAfterTimeout);
			});
		},
		replace: true,
		templateUrl: 'common/directives/sk-message.html'
	};
}
SkMessageDirective.$inject = ['$timeout'];
module.exports = SkMessageDirective;
