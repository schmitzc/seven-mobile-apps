(function($) {
  var TimeZoneManager = {
    savedZones: [],

    initialize: function() {
      this.loadSavedTimeZones();

      if (navigator.onLine) {
        var completion = _.bind(function(zones) {
          this.storeTimeZonesLocally(zones);
        }, this);
        this.fetchZones(completion);
      } else {
        this.loadLocalTimeZones();
      }
    },

    fetchZones: function(completion) {
      var successFunction = _.bind(function(data) {
        this.zonesLoaded(data);
        if (completion) completion(data);
      }, this);

      var errorFunction = _.bind(function() {
        this.loadLocalTimeZones();
      }, this);

      $.ajax({
        url: 'http://localhost:3000/clock/time_zones',
        headers: {Accept: 'application/json'},
        success: successFunction,
        error: errorFunction
      });
    },

    loadSavedTimeZones: function() {
      var localSavedTimeZones = localStorage.savedTimeZones;
      if (localSavedTimeZones) {
        this.savedZones = JSON.parse(localSavedTimeZones);
      }
    },

    loadLocalTimeZones: function() {
      var localZones = localStorage.allTimeZones;
      if (localZones) {
        this.zonesLoaded(JSON.parse(localZones));
      } else {
        alert('Unable to fetch time zones list.');
      }
    },

    storeTimeZonesLocally: function(zones) {
      localStorage.allTimeZones = JSON.stringify(zones);
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
      this.storeSavedTimeZonesLocally();
    },

    deleteZoneAtIndex: function(index) {
      this.savedZones.splice(index, 1);
      this.storeSavedTimeZonesLocally();
    },

    storeSavedTimeZonesLocally: function() {
      localStorage.savedTimeZones = JSON.stringify(this.savedZones);
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
