(function($) {
  var TimeZoneManager = {
    savedZones: [],

    initialize: function() {
      var localZones = localStorage.allTimeZones;
      if (localZones) {
        this.zonesLoaded(JSON.parse(localZones));
      } else {
        this.fetchZones(function(zones) {
          localStorage.allTimeZones = JSON.stringify(zones);
        });
      }
    },

    fetchZones: function(completion) {
      var successFunction = _.bind(function(data) {
        this.zonesLoaded(data);
        if (completion) completion(data);
      }, this);

      $.ajax({
        url: 'http://localhost:3000/clock/time_zones',
        headers: {Accept: 'application/json'},
        success: successFunction
      });
    },

    zonesLoaded: function(zones) {
      this.zones = zones;
    },

    allZones: function() {
      return this.zones;
    },

    allSavedZones: function(includeCurrent) {
      var zones = [].concat(this.savedZones);

      if (includeCurrent) {
        var refDate = new Date();
        var offsetMinutes = refDate.getTimezoneOffset();
        zones.push({
          name: 'Current',
          zone_name: 'Current',
          offset: -offsetMinutes * 60,
          formatted_offset: this.formatOffsetMinutes(-offsetMinutes),
          isCurrent: true
        });
      }

      return zones;
    },

    saveZoneAtIndex: function(index) {
      var zone = this.zones[index];
      this.savedZones.push(zone);
    },

    deleteZoneAtIndex: function(index) {
      this.savedZones.splice(index, 1);
    },

    formatOffsetMinutes: function(offsetMinutes) {
      var offsetHours = offsetMinutes / 60;
      offsetHours = Math.abs(offsetHours).toString() + ':00';
      if (offsetMinutes < 600) offsetHours = '0' + offsetHours;
      if (offsetMinutes < 0) offsetHours = '-' + offsetHours;
      return offsetHours;
    },

    createClocksIn: function(list) {
      var zones = this.allSavedZones(true);
      _.each(zones, function(zone) {
        var item = $('<li class="clock"/>');
        $(list).append(item);
      });
    }
  };

  $.app.register('managers.TimeZoneManager', TimeZoneManager);
})(jQuery);
