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

      // Find field name in ngRepeat
      while (!_.isEmpty(ngRepeat)) {
        var index = ngRepeat.index,
            itemName = ngRepeat.itemName,
            collectionName = ngRepeat.collectionName,
            name = name || attrs.ngModel,
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
      
      fieldName = fieldName || attrs.ngModel;
      
      // Remove model path from fieldName
      var modelPath = _.findKey(validator.scope, function (o) { return o === validator.model; });
      var modelPathIndex = fieldName.indexOf(modelPath);
      fieldName = _.drop(fieldName, modelPathIndex + modelPath.length).join('');
      fieldName = _.trim(fieldName, '.');

      // Not in schema
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
    }
  }

}());