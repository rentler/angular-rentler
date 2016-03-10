(function () {
  'use strict';

  angular
    .module('rentler.core')
    .directive('ngModel', ValidateDirective);

  ValidateDirective.$inject = [];

  function ValidateDirective() {
    var directive = {
      restrict: 'A',
      require: ['ngModel', '?^rValidator'],
      link: link
    };

    return directive;

    function link(scope, element, attrs, ctrls) {
      // Get controllers
      var ngModelCtrl = ctrls[0],
          rValidatorCtrl = ctrls[1];

      // If there is no validator then return
      var validator = _.get(rValidatorCtrl, 'validator');
      
      if (!validator) return;
      
      // Watch for changes on the field
      scope.$watch(attrs.ngModel, function () {
        // Validate
        validator.validate();
        
        // Find field name
        var fieldName = _.last(attrs.ngModel.split('.'));
        
        // Get the number of errors for the field
        var length = validator.errors[fieldName].length;
        var isValid = length === 0;
        
        // Set validity
        ngModelCtrl.$setValidity('', isValid);
      });
    }
  }

}());