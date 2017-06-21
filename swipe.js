if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
	module.exports = 'yswipe';
}
(function(angular) {
	'use strict';
	angular.module('yswipe', [])
		.directive('yswipe', [function() {
			return {
				restrict: "EA",
				scope: {
					swipeUp: '&yswipeUp', // callback function
					swipeDown: '&yswipeDown' // callback function
				},
				link: function(scope, element, attrs) {
					var triggerStart, containerMove, outHeight, IsJsonString, default_settings, startPlace, startTime, endTime, stackMove, stackLenght;
					var startMove = false;
					var parent = element.parent().parent();
					containerMove = parent[0].offsetHeight;
					default_settings = {
						up: '90vh',
						initial: '30vh',
						down: '0px',
					};


					element[0].style.transitionDuration = '0.9s';
					element[0].style.transitionProperty = 'height';
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
							if (value.initial) {
								default_settings.initial = value.initial
							}
							if (value.down) {
								default_settings.down = value.down
							}
						}
					}


					var initial;
					if (default_settings.initial.indexOf('px') > -1) {
						default_settings.initial = containerMove - parseFloat(default_settings.initial)
					} else if (default_settings.initial.indexOf('vh') > -1) {
						default_settings.initial = containerMove * (parseFloat(default_settings.initial) / 100)
					} else {
						default_settings.initial = containerMove * 0.3;
					}


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
							outHeight = containerMove - e.clientY;
							element[0].style.transitionDuration = '0s';
							element[0].style.height = outHeight + 'px';

						}
					});

					parent.bind('touchmove', function(e) {
						if (startMove && e.changedTouches[0].clientY < containerMove) {
							stackLenght = stackMove.push({
								move: e.changedTouches[0].clientY,
								time: e.timeStamp
							});
							element[0].style.transitionDuration = '0s';
							outHeight = containerMove - e.changedTouches[0].clientY;
							element[0].style.height = outHeight + 'px';

						}
					});
					element.bind('mouseup', function(e) {
						if (startMove && outHeight) {
							var point = parseInt(stackLenght * 0.75) - 1;
							if ((point > 0) && ((stackMove[point].time - stackMove[stackLenght - 1].time) < 130) && (point != (stackLenght - 1))) {
								element[0].style.transitionDuration = '0.4s';
							}
							if ((outHeight >= (default_settings.initial * 0.1)) && (outHeight <= (default_settings.initial * 1.1))) {
								element[0].style.height = default_settings.initial + 'px';
							} else if (startPlace > e.clientY) {
								element[0].style.height = default_settings.up;
								scope.swipeUp();
							} else if (stackLenght > 1) {
								element[0].style.height = default_settings.down;
								scope.swipeDown();
							}
						}
						stackMove = [];
						startMove = false;
						startPlace = false;
					});

					element.bind('touchend', function(e) {
						if (startMove && outHeight) {
							var point = parseInt(stackLenght * 0.75) - 1;
							if ((point > 0) && ((stackMove[point].time - stackMove[stackLenght - 1].time) < 150) && (point != (stackLenght - 1))) {
								element[0].style.transitionDuration = '0.4s';
							}
							if ((outHeight >= (default_settings.initial * 0.1)) && (outHeight <= (default_settings.initial * 1.1))) {
								element[0].style.height = default_settings.initial + 'px';
							} else if (startPlace > e.changedTouches[0].clientY) {
								element[0].style.height = default_settings.up;
								scope.swipeUp();
							} else if (stackLenght > 1) {
								element[0].style.height = default_settings.down;
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
