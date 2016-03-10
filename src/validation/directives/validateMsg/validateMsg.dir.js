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
      
      // Build path to field error
      var path = rValidatorCtrl.attr + '.errors';
      
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