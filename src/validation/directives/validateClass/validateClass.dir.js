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
      
      // Get validator
      var validator = _.get(rValidatorCtrl, 'validator');
      
      var ngRepeat = ngRepeatCtrl;
      
      // Find field name
      var fieldName = '';

      // Find field name in ngRepeat
      while (!_.isEmpty(ngRepeat)) {
        var index = ngRepeat.index,
            itemName = ngRepeat.itemName,
            collectionName = ngRepeat.collectionName,
            name = name || attrs.rValidateClass,
            nameParts = name.split('.'),
            tempFieldName = '';
        
        if (itemName === _.first(nameParts)) {
          tempFieldName = collectionName;
          
          tempFieldName += '[' + index + ']';
          
          if (nameParts.length > 1) {
            tempFieldName += '.' + _.tail(nameParts).join('.');
          }
          if (ngRepeat.ngRepeat) {
            tempFieldName = _.trimStart(tempFieldName, ngRepeat.ngRepeat.itemName);
          }
          
          name = _.first(collectionName.split('.'));
        }
        
        fieldName = tempFieldName + '.' + fieldName;
        fieldName = _.trim(fieldName, '.');
        
        ngRepeat = ngRepeat.ngRepeat;
      }
      
      fieldName = fieldName || attrs.rValidateClass;
      
      // Remove model path from fieldName
      var modelPath = _.findKey(validator.scope, function (o) { return o === validator.model; });
      var modelPathIndex = fieldName.indexOf(modelPath);
      fieldName = _.drop(fieldName, modelPathIndex + modelPath.length).join('');
      fieldName = _.trim(fieldName, '.');

      // Not in schema
      var schemaFieldName = fieldName.replace(/\[\d+\]/g, '.collection');
      if (!_.has(validator.schema, schemaFieldName)) return;
      
      // Add listener
      rValidatorCtrl.listeners.push(listener);
      
      // Cleanup
      scope.$on('$destroy', function () {
        _.pull(rValidatorCtrl.listeners, listener);
      });
      
      function listener() {
        // Not submitted no validation
        if (!formCtrl.$submitted || !_.has(validator.errors, fieldName)) return;
        
        // Get errors length
        var length = validator.errors[fieldName].length;
        
        // Add approriate classes
        if (length === 0) element.removeClass(Validation.getClasses().error).addClass(Validation.getClasses().success);
        else if (length > 0) element.addClass(Validation.getClasses().error).removeClass(Validation.getClasses().success);
      }
    }
  }

}());