(function () {
  'use strict';

  angular
  	.module('rentler.core')
	  .directive('rValidateClass', ValidateClassDirective);

  ValidateClassDirective.$inject = ['Validation'];

  function ValidateClassDirective(Validation) {
    var directive = {
      restrict: 'A',
      require: ['^form', '^rValidator'],
      link: link
    };

    return directive;

    function link(scope, element, attrs, ctrls) {
      // Get controllers
      var formCtrl = ctrls[0],
          rValidatorCtrl = ctrls[1];

      // Get binding
      var bind = attrs.rValidateClass;
      
      // Find field name
      var fieldName = _.last(bind.split('.'));
      
      // ngRepeat
      if (_.has(scope, '$index')) {
        // Get item binding
        var item = attrs.rValidateClass.split('.')[0];
        
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
      
      // Build path to errors
      var path = rValidatorCtrl.attr;
      
      // Get validator
      var validator = rValidatorCtrl.validator;

      scope.$watch(path, function () {
        // Not submitted no validation
        if (!formCtrl.$submitted || !_.has(validator.errors, fieldName)) return;
        
        // Get the number of errors for the field
        var length = validator.errors[fieldName].length;
        
        // Add approriate classes
        if (length === 0) element.removeClass(Validation.getClasses().error).addClass(Validation.getClasses().success);
        else if (length > 0) element.addClass(Validation.getClasses().error).removeClass(Validation.getClasses().success);
      }, true);
    }
  }

}());