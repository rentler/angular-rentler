(function () {
  'use strict';

  angular
    .module('rentler.core')
	  .directive('rValidateMsg', ValidateMsgDirective);

  ValidateMsgDirective.$inject = [];

  function ValidateMsgDirective() {
    var directive = {
      restrict: 'A',
      require: '^form',
      scope: true,
      link: link,
      replace: true,
      templateUrl: 'validation/directives/validateMsg/validateMsg.html'
    };

    return directive;

    function link(scope, element, attrs, ctrl) {
      // Get the field binding
      var bind = attrs.rValidateMsg;

      // Find validation
      var i = _.lastIndexOf(bind, '.'), path, model;
      while (_.lastIndexOf(bind, '.', i) > -1 &&
             !_.has(model, 'validation')) {
        i = _.lastIndexOf(bind, '.', i) - 1;
        path = bind.substring(0, i + 1);
        model = _.result(scope, path);
      }

      // No validation
      if (!_.has(model, 'validation')) return;

      // Find field name
      var fieldName = _.last(bind.split('.'));

      // Get path to validation
      path += '.validation';

      scope.$watch(path, function () {
        // Not sumbitted
        if (!ctrl.$submitted) return;

        // Set messages
        scope.messages = _.has(model.validation.errors, fieldName) ? model.validation.errors[fieldName] : [];
      }, true);
    }
  }

}());