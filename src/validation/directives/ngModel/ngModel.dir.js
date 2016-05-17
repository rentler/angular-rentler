(function () {
  'use strict';

  angular
    .module('rentler.core')
    .directive('ngModel', Directive);

  Directive.$inject = ['Validation'];

  function Directive(Validation) {
    var directive = {
      restrict: 'A',
      require: ['ngModel', '?^rValidator', '?^ngRepeat'],
      link: link
    };

    return directive;

    function link(scope, element, attrs, ctrls) {
      // Get controllers
      var ngModelCtrl = ctrls[0],
          rValidatorCtrl = ctrls[1],
          ngRepeatCtrl = ctrls[2];
          
      // No validation
      if (!rValidatorCtrl) return;
      
      // Get validator
      var validator = _.get(rValidatorCtrl, 'validator');
      
      // Get field name
      var fieldName = '';
      var fieldNameOptions = {
        attrFieldName: attrs.ngModel,
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
        // Get the number of errors for the field
        var length = validator.errors[fieldName].length;
        var isValid = length === 0;
        
        // Set validity
        ngModelCtrl.$setValidity('', isValid);
      }
      
      // Cleanup
      scope.$on('$destroy', function () {
        _.pull(rValidatorCtrl.listeners, listener);
        if (ngRepeatCtrl) _.pull(ngRepeatCtrl.listeners, assignFieldName);
      });
    }
  }

}());