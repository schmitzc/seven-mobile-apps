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
          clickHandler = _.bind(this.zoneClicked, this);

        _.each(zones, function(zone, index) {
          var item = $('<li class="zone"/>');
          item.data('zone-index', index);
          item.text(zone.name);
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
      clockList.empty();
      timeZoneManager.createClocksIn(clockList);
      clock.tick();
    }
  };

  $.app.register('controllers.MainViewController', MainViewController);
})(jQuery);
