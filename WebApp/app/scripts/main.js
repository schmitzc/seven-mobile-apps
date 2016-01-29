(function($) {
  window.app = {};
  $.app = window.app;
  $.app.namespaces = {};

  $.app.register = function(namespace, object) {
    var leaf = _.reduce(namespace.split('.'), function(context, name) {
      context[name] = context[name] || {};
      context = context[name]
      return context;
    }, $.app.namespaces);

    $.extend(leaf, object);
  };

  $(document).ready(function() {
    var tzManager = app.namespaces.managers.TimeZoneManager;
    var clock = app.namespaces.models.Clock;

    tzManager.fetchTimeZones(function(zones) {
      tzManager.createClocksIn($('#clock-list'));
      clock.start();
    });
  });
})(jQuery);
