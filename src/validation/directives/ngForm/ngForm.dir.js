(function () {
  'use strict';
  
  angular
  	.module('rentler.core')
	.directive('ngForm', FormDirective);
	
  FormDirective.$inject = ['$parse'];
  
  function FormDirective($parse) {
	  var directive = {
      restrict: 'EA',
      require: 'form',
      link: link
    };
    
    return directive;
    
    function link(scope, elem, attrs, ctrl) {
      // Find submit button
      var btns = [elem.find('button'), elem.find('input')];
      
      var submitBtn = _.find(btns, function (btn) {
        for (var i = 0; i < btn.length; i++)
          return btn[i].type.toLowerCase() === 'submit';
      });
      
      // Submit button clicked
      angular.element(submitBtn).bind('click', function (e) {
        e.preventDefault();
        
        if (!attrs.ngSubmit || !_.isUndefined(angular.element(this).attr('ng-click')))
          return;
        
        submit();
        
        return;
      });
      
      // Enter key
      elem.bind('keydown', function (e) {
        var keyCode = e.keyCode || e.which;
        
        if (keyCode !== 13) return;
        
        if (attrs.ngSubmit) submit();
        
        if (submitBtn) submitBtn.click();
      });
      
      // Submit handler
      elem.on('submit', function () {
        submit();
      });
      
      // Submit
      function submit() {
        ctrl.$submitted = true;
        $parse(attrs.ngSubmit)(scope);
      }
    }
  }
  
})();