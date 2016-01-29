(function($) {
  var Clock = {
    start: function() {
      this.tick();

      var tickFunction = _.bind(this.tick, this);
      setInterval(tickFunction, 1000);
    },

    tick: function() {
      var date = new Date();
      var timeZoneManager = app.namespaces.managers.TimeZoneManager;
      var zones = timeZoneManager.allSavedZones(true);

      var updateClockAtIndex = function(index, element) {
        var zone = zones[index];
        var formattedTime = this.convertAndFormatTime(zone.offset, date);
        $(element).text(formattedTime);
      };
      updateClockAtIndex = _.bind(updateClockAtIndex, this)

      $('.clock-time').each(updateClockAtIndex);
    },

    convertAndFormatTime: function(offset, date) {
      var localTime = date.getTime();
      var localOffset = date.getTimezoneOffset() * 60000;

      var utcTime = localTime + localOffset;

      var offsetMilliseconds = offset * 1000;
      var convertedTime = utcTime + offsetMilliseconds;

      return this.formatTime(new Date(convertedTime), true);
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
