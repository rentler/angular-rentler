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
      // ng-model="vm.user.name.first.abbreviation"
      if (ngRepeat === null)
        fieldName = attrs.rValidateClass;
      
      // Find field name in ngRepeat
      while (ngRepeat !== null) {
        var index = ngRepeat.index,
            itemName = ngRepeat.itemName,
            collectionName = ngRepeat.collectionName,
            name = name || attrs.rValidateClass,
            nameParts = name.split('.'),
            tempFieldName = '';
        
        if (name.indexOf(itemName) > -1) {
          tempFieldName = collectionName;
        }
        
        if (itemName === _.first(nameParts)) {
          
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
      
      // Remove model prefix from field name
      var i = 0, parts = fieldName.split('.'), modelPath = '';
      do {
        modelPath = modelPath + '.' + parts[i];
        modelPath = _.trim(modelPath, '.');
        
        if (_.result(scope, modelPath) === validator.model)
          break;
          
        i++;
      } while (i <= parts.length);

      fieldName = _.replace(fieldName, modelPath, '');
      fieldName = _.trim(fieldName, '.');

      // TODO: Check if field is in schema
      
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
    }
  }

}());