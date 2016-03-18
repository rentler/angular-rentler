(function () {
  'use strict';
  
  angular
    .module('rentler.core')
    .directive('rValidator', Directive);
    
  Directive.$inject = [];
  
  function Directive() {
    var directive = {
      restrict: 'EA',
      require: 'form',
      scope: {
        rValidator: '='
      },
      controller: Ctrl
    };
    
    return directive;
  }
  
  Ctrl.$inject = ['$scope', '$element', '$attrs', '$timeout'];
  
  function Ctrl($scope, $element, $attrs, $timeout) {
    var vm = this;
    
    vm.attr = $attrs.rValidator;
    vm.validator = $scope.rValidator;
    vm.listeners = [];
    
    // TODO: More Checks
    if (!_.has($scope.rValidator, 'validate') &&
        !_.isFunction($scope.rValidator.validate))
      throw 'Invalid Validator.';
    
    // Watch for model changes and validate
    $scope.$watch('rValidator.model', validate, true);
    
    // Watch for form submits and validte
    var formCtrl = $element.controller('form');
    $scope.$watch(function () { return formCtrl.$submitted; }, validate);
    
    function validate() {
      $timeout(function () {
        // Validate
        vm.validator.validate();
        
        // Fire listeners
        _.forEach(vm.listeners, function (listener) {
          listener();
        });
      });
    }
  }
    
})();