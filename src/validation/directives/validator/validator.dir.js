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
  
  Ctrl.$inject = ['$scope', '$attrs'];
  
  function Ctrl($scope, $attrs) {
    var vm = this;
    
    if (!_.has($scope.rValidator, 'validate') &&
        !_.isFunction($scope.rValidator.validate))
      throw 'Invalid Validator.';
    
    vm.attr = $attrs.rValidator;
    vm.validator = $scope.rValidator;
  }
    
})();