if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
	module.exports = 'yswipe';
}
(function(angular) {
	'use strict';
	angular.module('yswipe', [])
		.directive('yswipe', ['$timeout', function($timeout) {
			return {
				restrict: "EA",
				scope: {
					swipeUp: '&yswipeUp', // callback function
					swipeDown: '&yswipeDown' // callback function
				},
				link: function(scope, element, attrs) {
					var triggerStart, containerMove, compare_time, IsJsonString, default_settings, startPlace, startTime, endTime, stackMove, stackLenght, initial_top;
					var startMove = false;

					var parent = element.parent().parent();
					containerMove = parent[0].offsetHeight;
					default_settings = {
						up: '10vh',
						down: '0px',
					};

					element[0].style.position = 'fixed';
					element[0].style.transitionProperty = 'top';
					element[0].style.transitionTimingFunction = 'ease';

					IsJsonString = function(str) {
						try {
							JSON.parse(str);
						} catch (e) {
							return false;
						}
						return true;
					}

					if (attrs.yswipe) {
						var value = attrs.yswipe;
						if (IsJsonString(value)) {
							value = JSON.parse(value);
							if (value.up) {
								default_settings.up = value.up
							}
							if (value.down) {
								default_settings.down = value.down
							}
						}
					}

					$timeout(function() {
						default_settings.initial = element[0].clientHeight;
						initial_top = containerMove - default_settings.initial;
						element[0].style.top = initial_top + 'px';
						element[0].style.height = '100%';
					});


					element.bind('mousedown', function(e) {
						startMove = true;
						stackMove = [];
						stackLenght = 0;
						startTime = e.timeStamp;
						startPlace = e.clientY;

					});

					element.bind('touchstart', function(e) {
						startMove = true;
						stackMove = [];
						stackLenght = 0;
						startTime = e.timeStamp;
						startPlace = e.changedTouches[0].clientY;
					});


					parent.bind('mousemove', function(e) {
						if (startMove && e.clientY < containerMove) {
							stackLenght = stackMove.push({
								move: e.clientY,
								time: e.timeStamp
							});
							element[0].style.transitionDuration = '0s';
							element[0].style.top = e.clientY + 'px';

						}
					});

					parent.bind('touchmove', function(e) {
						if (startMove && e.changedTouches[0].clientY < containerMove) {
							// element[0].style.height = '100vh';
							stackLenght = stackMove.push({
								move: e.changedTouches[0].clientY,
								time: e.timeStamp
							});
							element[0].style.transitionDuration = '0s';
							element[0].style.top = e.changedTouches[0].clientY + 'px';

						}
					});
					element.bind('mouseup', function(e) {
						if (startMove) {
							element[0].style.transitionDuration = '0.9s';

							if (stackLenght > 1) {
								var point = parseInt(stackLenght * 0.75) - 1;
								compare_time = stackMove[stackLenght - 1].time - stackMove[point].time;
								if (compare_time < 200) {
									element[0].style.transitionDuration = '0.4s';
								}
							}

							if ((initial_top >= (e.clientY * 0.95)) && (initial_top <= (e.clientY * 1.1))) {
								element[0].style.top = initial_top + 'px';
							} else if (startPlace > e.clientY) {
								element[0].style.top = default_settings.up;
								scope.swipeUp();
							} else if (stackLenght > 1) {
								element[0].style.top = default_settings.down;
								scope.swipeDown();
							}
						}
						stackMove = [];
						startMove = false;
						startPlace = false;
					});

					element.bind('touchend', function(e) {
						if (startMove) {
							element[0].style.transitionDuration = '0.9s';
							if (stackLenght > 1) {
								var point = parseInt(stackLenght * 0.75) - 1;
								compare_time = stackMove[stackLenght - 1].time - stackMove[point].time;
								if (compare_time < 200) {
									element[0].style.transitionDuration = '0.4s';
								}
							}

							if ((initial_top >= (e.changedTouches[0].clientY * 0.95)) && (initial_top <= (e.changedTouches[0].clientY * 1.1))) {
								element[0].style.top = initial_top + 'px';
							} else if (startPlace > e.changedTouches[0].clientY) {
								element[0].style.top = default_settings.up;
								scope.swipeUp();
							} else if (stackLenght > 1) {
								element[0].style.top = default_settings.down;
								scope.swipeDown();
							}
						}
						stackMove = [];
						startMove = false;
						startPlace = false;
					});

					// unbind listeners
					element.on('$destroy', function() {
						element.unbind("mousedown");
						parent.unbind("mousemove");
						element.unbind("mouseup");
						element.unbind("touchstart");
						parent.unbind("touchmove");
						element.unbind("touchend");
					})
				}
			};
		}]);

})(angular);
