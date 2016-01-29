(function($) {
  var Clock = {
    tick: function() {
      var date = new Date();
      $('.clock').text(this.formatTime(date, true));
    },

    formatTime: function(date, hour12) {
      var options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: hour12
      };

      return new Intl.DateTimeFormat('en-US', options).format(date);
    }
  };

  $.app.register('models.Clock', Clock);
})(jQuery);
