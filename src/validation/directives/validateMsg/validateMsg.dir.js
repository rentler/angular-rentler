(function () {
  'use strict';

  angular
    .module('rentler.core')
	  .directive('rValidateMsg', ValidateMsgDirective);

  ValidateMsgDirective.$inject = ['Validation'];

  function ValidateMsgDirective(Validation) {
    var directive = {
      restrict: 'A',
      require: ['^form', '^rValidator', '?^ngRepeat'],
      scope: true,
      link: link,
      replace: true,
      templateUrl: 'validation/directives/validateMsg/validateMsg.html'
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
      
      // Get field name
      var fieldName = '';
      var fieldNameOptions = {
        attrFieldName: attrs.rValidateMsg,
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
        if (!formCtrl.$submitted) return;
        
        // Add approriate classes
        scope.messages = _.has(validator.errors, fieldName) ? validator.errors[fieldName] : [];
      }
      
      // Cleanup
      scope.$on('$destroy', function () {
        _.pull(rValidatorCtrl.listeners, listener);
        if (ngRepeatCtrl) _.pull(ngRepeatCtrl.listeners, assignFieldName);
      });
    }
  }

})();