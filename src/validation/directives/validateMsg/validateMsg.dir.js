(function () {
  'use strict';

  angular
    .module('rentler.core')
	  .directive('rValidateMsg', ValidateMsgDirective);

  ValidateMsgDirective.$inject = [];

  function ValidateMsgDirective() {
    var directive = {
      restrict: 'A',
      require: ['^form', '^rValidator'],
      scope: true,
      link: link,
      replace: true,
      templateUrl: 'validation/directives/validateMsg/validateMsg.html'
    };

    return directive;

    function link(scope, element, attrs, ctrls) {
      // Get controllers
      var formCtrl = ctrls[0],
          rValidatorCtrl = ctrls[1];

      // Get binding
      var bind = attrs.rValidateMsg;
      
      // Find field name
      var fieldName = _.last(bind.split('.'));
      
      // ngRepeat
      if (_.has(scope.$parent, '$index')) {
        // Get item binding
        var item = attrs.rValidateMsg.split('.')[0];
        
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
      
      // Build path to field error
      var path = rValidatorCtrl.attr;
      
      // Get validator
      var validator = rValidatorCtrl.validator;

      scope.$watch(path, function () {
        // Not submitted no validation
        if (!formCtrl.$submitted) return;
        
        // Add approriate classes
        scope.messages = _.has(validator.errors, fieldName) ? validator.errors[fieldName] : [];
      }, true);
    }
  }

})();