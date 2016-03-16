(function () {
  'use strict';

  angular
    .module('rentler.core')
	  .directive('rValidateMsg', ValidateMsgDirective);

  ValidateMsgDirective.$inject = [];

  function ValidateMsgDirective() {
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
            name = name || attrs.rValidateMsg,
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
      
      fieldName = fieldName || attrs.rValidateMsg;
      
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

      rValidatorCtrl.listeners.push(listener);
      
      function listener() {
        // Not submitted no validation
        if (!formCtrl.$submitted) return;
        
        // Add approriate classes
        scope.messages = _.has(validator.errors, fieldName) ? validator.errors[fieldName] : [];
      }
    }
  }

})();