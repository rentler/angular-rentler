(function () {
  'use strict';

  angular
  	.module('rentler.core')
	  .directive('rValidateClass', ValidateClassDirective);

  ValidateClassDirective.$inject = ['Validation'];

  function ValidateClassDirective(Validation) {
    var directive = {
      restrict: 'A',
      require: ['^form', '^rValidator', '?^ngRepeat'],
      link: link
    };

    return directive;

    function link(scope, element, attrs, ctrls) {
      // Get controllers
      var formCtrl = ctrls[0],
          rValidatorCtrl = ctrls[1],
          ngRepeatCtrl = ctrls[2];
          
      // No validation
      if (!rValidatorCtrl) return;
      
      // Get validator
      var validator = _.get(rValidatorCtrl, 'validator');
      
      // Initialize field name
      var fieldName = '';
      var fieldNameOptions = {
        attrFieldName: attrs.rValidateClass,
        ngRepeatCtrl: ngRepeatCtrl,
        validator: validator
      };
      assignFieldName();
      
      // Watch field name for collections
      if (ngRepeatCtrl) ngRepeatCtrl.listeners.push(assignFieldName);
      
      function assignFieldName() {
        fieldName = Validation.getFieldName(fieldNameOptions);
      }

      // Verify field is in schema
      var schemaFieldName = fieldName.replace(/\[\d+\]/g, '.collection');
      if (!_.has(validator.schema, schemaFieldName)) return;
      
      // Add to validation listeners
      rValidatorCtrl.listeners.push(listener);
      
      function listener() {
        // Not submitted no validation
        if (!formCtrl.$submitted || !_.has(validator.errors, fieldName)) return;
        
        // Get errors length
        var length = validator.errors[fieldName].length;
        
        // Add approriate classes
        if (length === 0) element.removeClass(Validation.getClasses().error).addClass(Validation.getClasses().success);
        else if (length > 0) element.addClass(Validation.getClasses().error).removeClass(Validation.getClasses().success);
      }
      
      // Cleanup
      scope.$on('$destroy', function () {
        _.pull(rValidatorCtrl.listeners, listener);
        if (ngRepeatCtrl) _.pull(ngRepeatCtrl.listeners, assignFieldName);
      });
    }
  }

})();