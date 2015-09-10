(function () {
  'use strict';

  angular
  	.module('rentler.core')
	  .directive('rValidateClass', ValidateClassDirective);

  ValidateClassDirective.$inject = ['Validation'];

  function ValidateClassDirective(Validation) {
    var directive = {
      restrict: 'A',
      require: '^form',
      link: link
    };

    return directive;

    function link(scope, element, attrs, ctrl) {
      // Get binding
      var bind = attrs.rValidateClass;
      
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
        // Not submitted no validation
        if (!ctrl.$submitted || !_.has(model.validation.errors, fieldName)) return;
        
        // Get the number of errors for the field
        var length = model.validation.errors[fieldName].length;
        
        // Add approriate classes
        if (length === 0) element.removeClass(Validation.getClasses().error).addClass(Validation.getClasses().success);
        else if (length > 0) element.addClass(Validation.getClasses().error).removeClass(Validation.getClasses().success);
      }, true);
    }
  }

}());