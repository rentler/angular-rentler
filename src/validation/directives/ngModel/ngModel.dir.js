(function () {
  'use strict';

  angular
    .module('rentler.core')
    .directive('ngModel', ValidateDirective);

  ValidateDirective.$inject = [];

  function ValidateDirective() {
    var directive = {
      restrict: 'A',
      require: 'ngModel',
      link: link
    };

    return directive;

    function link(scope, element, attrs, ctrl) {
      // Find validatable
      var i = _.lastIndexOf(attrs.ngModel, '.'), path, model;
      while (_.lastIndexOf(attrs.ngModel, '.', i) > -1 &&
             !_.has(model, 'validate') &&
             !_.isFunction(model, 'validate')) {
        i = _.lastIndexOf(attrs.ngModel, '.', i) - 1;
        path = attrs.ngModel.substring(0, i + 1);
        model = _.result(scope, path);
      }
      
      // Not validatable
      if (!_.has(model, 'validate')) return;

      scope.$watch(attrs.ngModel, function () {
        // Validate
        model.validate();
        
        // Find field name
        var fieldName = _.last(attrs.ngModel.split('.'));
        
        // Get the number of errors for the field
        var length = model.validation.errors[fieldName].length;
        var isValid = length === 0;
        
        // Set validity
        ctrl.$setValidity('', isValid);
      });
    }
  }

}());