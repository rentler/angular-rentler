(function() {
  'use strict';

  angular
    .module('rentler.core')
    .provider('Validation', ValidationProvider);

  ValidationProvider.$inject = [];

  function ValidationProvider() {
    var classes = {
      success: 'has-success',
      warning: 'has-warning',
      error: 'has-error'
    };
    
    // Provider definition
    this.$get = Validation;
    this.setClasses = setClasses;
    
    function setClasses(opts) {
      opts = _.pick(opts, _.keys(classes));
      _.merge(classes, opts);
    }
    
    // Service definition
    function Validation() {
      var service = {
        getClasses: getClasses,
        getFieldName: getFieldName
      };

      return service;

      function getClasses() {
        return classes;
      }
      
      function getFieldName(options) {
        var fieldName = '';
        var attrFieldName = options.attrFieldName;
        var ngRepeat = options.ngRepeatCtrl;
        var validator = options.validator;

        // Find field name in ngRepeat
        while (!_.isEmpty(ngRepeat)) {
          var index = ngRepeat.index,
              itemName = ngRepeat.itemName,
              collectionName = ngRepeat.collectionName,
              name = name || attrFieldName,
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

        fieldName = fieldName || attrFieldName;

        // Remove model path from fieldName
        var modelPath = _.findKey(validator.scope, function (o) { return o === validator.model; });
        var modelPathIndex = fieldName.indexOf(modelPath);
        fieldName = _.drop(fieldName, modelPathIndex + modelPath.length).join('');
        fieldName = _.trim(fieldName, '.');

        return fieldName;
      }
    }
  }

})();