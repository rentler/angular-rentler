(function () {
  'use strict';
  
  angular
    .module('rentler.core')
    .directive('rValidator', Directive);
    
  Directive.$inject = [];
  
  function Directive() {
    var directive = {
      restrict: 'EA',
      scope: {
        rValidator: '='
      },
      controller: Ctrl
    };
    
    return directive;
  }
  
  Ctrl.$inject = ['$scope', '$attrs', '$timeout'];
  
  function Ctrl($scope, $attrs, $timeout) {
    var vm = this;
    
    vm.attr = $attrs.rValidator;
    vm.validator = $scope.rValidator;
    vm.listeners = [];
    
    // TODO: More Checks
    if (!_.has($scope.rValidator, 'validate') &&
        !_.isFunction($scope.rValidator.validate))
      throw 'Invalid Validator.';
    
    // Watch for model changes
    $scope.$watch('rValidator.model', function () {
      $timeout(function () {
        // Validate
        vm.validator.validate();
        
        // Fire listeners
        _.forEach(vm.listeners, function (listener) {
          listener();
        });
      });

    }, true);
  }
    
})();