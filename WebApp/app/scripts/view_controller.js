(function($) {
  var namespaces = $.app.namespaces,
    clock = namespaces.models.Clock,
    timeZoneManager = namespaces.managers.TimeZoneManager,
    clockList = $('#clock-list'),
    zoneList = $('#zone-list'),
    addClockButton = $('#add-clock');

  var MainViewController = {
    initialize: function() {
      this.openZoneListFunction = _.bind(this.addClockClicked, this);
      this.closeZoneListFunction = _.bind(this.dismissZoneList, this);
      addClockButton.click(this.openZoneListFunction);

      zoneList.hide();
      this.refreshClockList();
      clock.start();

      timeZoneManager.fetchZones();
    },

    addClockClicked: function() {
      if (zoneList.children().length === 0) {
        var zones = timeZoneManager.allZones(),
          clickHandler = _.bind(this.zoneClicked, this),
          template = $('#time-zone-template').text();

        _.each(zones, function(zone, index) {
          var item = $(Mustache.render(template, zone));
          item.data('zone-index', index);
          item.click(clickHandler);
          zoneList.append(item);
        });
      }

      this.presentZoneList();
    },

    zoneClicked: function(event) {
      var item = $(event.currentTarget),
        index = item.data('zone-index');

      timeZoneManager.saveZoneAtIndex(index);

      this.dismissZoneList();
      this.refreshClockList();
    },

    presentZoneList: function() {
      addClockButton.text('Cancel');
      addClockButton.click(this.closeZoneListFunction);
      zoneList.show();
    },

    dismissZoneList: function() {
      addClockButton.text('Add Clock');
      addClockButton.click(this.openZoneListFunction);
      zoneList.hide();
    },

    refreshClockList: function() {
      var zones = timeZoneManager.allSavedZones(true),
        template = $('#clock-template').text();

      clockList.empty();

      _.each(zones, function(zone, index) {
        this.createClock(zone, index, template);
      }, this);

      clock.tick();
    },

    createClock: function(zone, index, template) {
      var item = $(Mustache.render(template, zone));
      clockList.append(item);
    }
  };

  $.app.register('controllers.MainViewController', MainViewController);
})(jQuery);
