(function () {
  'use strict';

  angular
    .module('rentler.core')
    .directive('ngModel', Directive);

  Directive.$inject = [];

  function Directive() {
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
      
      var ngRepeat = ngRepeatCtrl;
      
      // Find field name
      var fieldName = '';
      // ng-model="vm.user.name.first.abbreviation"
      if (ngRepeat === null)
        fieldName = attrs.ngModel;
      
      // Find field name in ngRepeat
      while (ngRepeat !== null) {
        var index = ngRepeat.index,
            itemName = ngRepeat.itemName,
            collectionName = ngRepeat.collectionName,
            name = name || attrs.ngModel,
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
      
      // Add to validation listeners
      rValidatorCtrl.listeners.push(listener);

      function listener() {
        // Get the number of errors for the field
        var length = validator.errors[fieldName].length;
        var isValid = length === 0;
        
        // Set validity
        ngModelCtrl.$setValidity('', isValid);
      }
    }
  }

}());