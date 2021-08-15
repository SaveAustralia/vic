"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

angular.module('app', ['ui.router']).config(function ($urlRouterProvider, $urlMatcherFactoryProvider, $httpProvider, $sceDelegateProvider, $locationProvider, $compileProvider) {
  $compileProvider.debugInfoEnabled(false);
  $compileProvider.commentDirectivesEnabled(false);
  $urlRouterProvider.otherwise('/'); // make a trailing slashe optional

  $urlMatcherFactoryProvider.strictMode(false);
  $sceDelegateProvider.resourceUrlWhitelist(['self']);
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
    rewriteLinks: false
  });
}).run();
angular.module('app').config(function ($stateProvider) {
  var states = [];

  var templateUrl = function templateUrl(url) {
    return "".concat(url, "?ts=1624506995262");
  };

  states.push({
    name: 'main',
    url: '/',
    data: {},
    templateUrl: templateUrl('templates/main.html'),
    controller: 'MainController as $ctrl',
    resolve: {}
  });
  states.push({
    name: 'checkedIn',
    url: '/checked-in',
    data: {},
    templateUrl: templateUrl('templates/checked-in/checked-in.html'),
    controller: 'CheckedInController as $ctrl',
    resolve: {}
  });
  angular.forEach(states, function (state) {
    $stateProvider.state(state);
  });
});
angular.module('app').filter('unsafe', function ($sce) {
  return $sce.trustAsHtml;
});
angular.module('app').factory('$localStorage', function ($window) {
  return {
    set: function set(key, value) {
      $window.localStorage[key] = value;
    },
    get: function get(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    getOnce: function getOnce(key, defaultValue) {
      var value = $window.localStorage[key] || defaultValue;
      delete $window.localStorage[key];
      return value;
    },
    setObject: function setObject(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function getObject(key) {
      try {
        return JSON.parse($window.localStorage[key]);
      } catch (error) {
        return null;
      }
    },
    getObjectOnce: function getObjectOnce(key) {
      try {
        var value = JSON.parse($window.localStorage[key]);
        delete $window.localStorage[key];
        return value;
      } catch (error) {
        return undefined;
      }
    },
    getObjectProperty: function getObjectProperty(key, property) {
      try {
        return JSON.parse($window.localStorage[key])[property];
      } catch (error) {
        return undefined;
      }
    },
    isSet: function isSet(key) {
      return typeof $window.localStorage[key] !== 'undefined';
    },
    unset: function unset(key) {
      delete $window.localStorage[key];
    }
  };
});
angular.module('app').controller('MainController', function ($state, $localStorage) {
  var vm = this;
  vm.locations = $localStorage.getObject('locations') || [];

  vm.setLocation = function (location) {
    vm.location = location;
    $('#check-in').focus();
  };

  vm.checkIn = function () {
    vm.locations = vm.locations.filter(function (l) {
      return l !== vm.location;
    }).slice(0, 4);
    vm.locations.unshift(vm.location);
    $localStorage.setObject('locations', vm.locations);
    $state.go('checkedIn', {}, {
      location: false
    });
  };
});
angular.module('app').controller('CheckedInController', function ($state, $localStorage) {
  var vm = this;
  vm.locations = $localStorage.getObject('locations') || [];

  var _vm$locations = _slicedToArray(vm.locations, 1);

  vm.location = _vm$locations[0];
  var ts = new Date();
  var day = ts.getDate().toString().padStart(2, 0);
  var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][ts.getMonth()];
  var year = ts.getFullYear();
  var hours = ts.getHours().toString().padStart(2, 0);
  var minutes = ts.getMinutes().toString().padStart(2, 0);
  vm.timestamp = "".concat(day, " ").concat(month, " ").concat(year, " at ").concat(hours, ":").concat(minutes);

  vm.goBack = function () {
    $state.go('main', {}, {
      location: false
    });
  };
});