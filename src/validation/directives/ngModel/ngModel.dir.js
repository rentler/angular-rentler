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
          
      // No validation
      if (!rValidatorCtrl) return;

      // If there is no validator then return
      var validator = _.get(rValidatorCtrl, 'validator');
      if (!validator) return;
      
      // Find field name
      var fieldName = _.last(attrs.ngModel.split('.'));
      
      // ngRepeat
      if (_.has(scope, '$index')) {
        // TODO: Check field for '[]'
        
        // Get item binding
        var item = attrs.ngModel.split('.')[0];
        
        // Find ngRepeat collection
        var ngRepeatElem = element;
        var ngRepeatCollection, ngRepeatItem;
        do {
          ngRepeatElem = ngRepeatElem.parent();
          
          // No element
          if (!ngRepeatElem) break;
          
          // No ngRepeat
          if (!ngRepeatElem[0].hasAttribute('ng-repeat') &&
              !ngRepeatElem[0].hasAttribute('data-ng-repeat'))
            continue;
          
          // Get ngRepeat expression
          var ngRepeatExp = ngRepeatElem.attr('ng-repeat') || 
                            ngRepeatElem.attr('data-ng-repeat');
                            
          // Deconstrcut ngRepeat expression      
          var ngRepeatMatch = ngRepeatExp.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);
          
          // Get ngRepeat item
          var ngRepeatItemMatch = ngRepeatMatch[1].match(/^(?:(\s*[\$\w]+)|\(\s*([\$\w]+)\s*,\s*([\$\w]+)\s*\))$/);
          ngRepeatItem = ngRepeatItemMatch[3] || ngRepeatItemMatch[1];
          
          // Get ngRepeat collection
          ngRepeatCollection = _.last(ngRepeatMatch[2].split('.'));
        } while (ngRepeatItem !== item);
        
        fieldName = ngRepeatCollection + '[' + scope.$index + '].' + fieldName;
      }
      
      // Not in validator schema
      // if (!_.has(validator.schema, fieldName))
      //   return;
      
      // Watch for changes on the field
      scope.$watch(attrs.ngModel, function () {
        // Validate
        validator.validate();

        // Get the number of errors for the field
        var length = validator.errors[fieldName].length;
        var isValid = length === 0;
        
        // Set validity
        ngModelCtrl.$setValidity('', isValid);
      });
    }
  }

}());