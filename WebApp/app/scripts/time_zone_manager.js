(function($) {
  var TimeZoneManager = {
    savedZones: function(includeCurrent) {
      var zones = [];

      if (includeCurrent) {
        var refDate = new Date();
        var offsetMinutes = refDate.getTimezoneOffset();
        zones.push({
          name: 'Current',
          zone_name: 'Current',
          offset: -offsetMinutes * 60,
          formatted_offset: this.formatOffsetMinutes(-offsetMinutes)
        });
      }

      return zones;
    },

    formatOffsetMinutes: function(offsetMinutes) {
      var offsetHours = offsetMinutes / 60;
      offsetHours = Math.abs(offsetHours).toString() + ':00';
      if (offsetMinutes < 600) offsetHours = '0' + offsetHours;
      if (offsetMinutes < 0) offsetHours = '-' + offsetHours;
      return offsetHours;
    },

    createClocksIn: function(list) {
      var zones = this.savedZones(true);
      _.each(zones, function(zone) {
        var item = $('<li class="clock"/>');
        $(list).append(item);
      });
    },

    fetchTimeZones: function(completion) {
      $.ajax({
        url: 'http://localhost:3000/clock/time_zones',
        headers: {Accept: 'application/json'},
        success: function(data) {
          completion(data);
        }
      });
    }
  };

  $.app.register('managers.TimeZoneManager', TimeZoneManager);
})(jQuery);
