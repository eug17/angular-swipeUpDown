if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'yswipe';
}
(function(angular) {
    'use strict';
    angular.module('yswipe', [])
        .directive('yswipe', [function() {
            return {
                restrict: "A",
                replace: true,
                scope: {
                    swipeUp: '&yswipeUp', // callback function
                    swipeDown: '&yswipeDown' // callback function
                },
                link: function(scope, element, attrs) {
                    var triggerStart, containerMove, outHeight, IsJsonString, default_settings;
                    var startMove = false;
                    var parent = element.parent().parent();
                    containerMove = parent[0].offsetHeight;
                    default_settings = {
                        up: '90vh',
                        initial: '30vh',
                        down: '0px',
                    };

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
                        // console.log('value', value)
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

                    element.bind('mousedown', function(e) {
                        startMove = true;
                    });

                    element.bind('touchstart', function(e) {
                        startMove = true;
                    });


                    parent.bind('mousemove', function(e) {
                        if (startMove && e.clientY < containerMove) {
                            outHeight = containerMove - e.clientY;
                            element[0].style.height = outHeight + 'px';

                        }
                    });

                    parent.bind('touchmove', function(e) {
                        // console.log(e);
                        // console.log('containerMove', containerMove);
                        if (startMove && e.changedTouches[0].clientY < containerMove) {
                            // console.log(e.clientY);
                            outHeight = containerMove - e.changedTouches[0].clientY;
                            element[0].style.height = outHeight + 'px';

                        }
                    });
                    element.bind('mouseup', function(e) {
                        if (startMove && outHeight) {
                            if ((containerMove * 0.55) <= outHeight) {
                                element[0].style.height = default_settings.up;
                                scope.swipeUp();
                            } else if ((outHeight >= (containerMove * 0.25)) && (outHeight <= (containerMove * 0.40))) {
                                element[0].style.height = default_settings.initial;
                            } else {
                                element[0].style.height = default_settings.down;
                                scope.swipeDown();
                            }
                        }
                        startMove = false;
                    });

                    element.bind('touchend', function(e) {
                        if (startMove && outHeight) {
                            if ((containerMove * 0.55) <= outHeight) {
                                element[0].style.height = default_settings.up;
                                scope.swipeUp();
                            } else if ((outHeight >= (containerMove * 0.25)) && (outHeight <= (containerMove * 0.40))) {
                                element[0].style.height = default_settings.initial;
                            } else {
                                element[0].style.height = default_settings.down;
                                scope.swipeDown();
                            }
                        }
                        startMove = false;
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
