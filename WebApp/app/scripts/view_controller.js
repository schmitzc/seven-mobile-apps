(function($) {
  var namespaces = $.app.namespaces,
    clock = namespaces.models.Clock,
    timeZoneManager = namespaces.managers.TimeZoneManager,
    clockList = $('#clock-list'),
    zoneList = $('#zone-list'),
    addClockButton = $('#add-clock'),
    editButton = $('#edit-clocks'),
    toggleCurrentTimeButton = $('#toggle-current-time'),
    formatClockButton = $('#format-clock');

  var MainViewController = {
    initialize: function() {
      this.openZoneListFunction = _.bind(this.addClockClicked, this);
      this.closeZoneListFunction = _.bind(this.dismissZoneList, this);
      this.editFunction = _.bind(this.editClicked, this);
      this.doneEditingFunction = _.bind(this.doneClicked, this);
      this.deleteClockFunction = _.bind(this.deleteClockClicked, this);
      this.toggleCurrentTimeFunction = _.bind(this.toggleCurrentTimeClicked, this);
      this.formatClockFunction = _.bind(this.formatClockClicked, this);

      addClockButton.click(this.openZoneListFunction);
      editButton.click(this.editFunction);
      toggleCurrentTimeButton.click(this.toggleCurrentTimeFunction);
      formatClockButton.click(this.formatClockFunction);

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

    zoneClicked: function(event) {
      var item = $(event.currentTarget),
        index = item.data('zone-index');

      timeZoneManager.saveZoneAtIndex(index);

      this.dismissZoneList();
      this.refreshClockList();
    },

    presentEditMode: function() {
      $('.delete-clock').show();
      editButton.text('Done');
      editButton.off('click')
        .click(this.doneEditingFunction);
    },

    dismissEditMode: function() {
      $('.delete-clock').hide();
      editButton.text('Edit');
      editButton.off('click')
        .click(this.editFunction);
    },

    editClicked: function() {
      this.presentEditMode();
    },

    doneClicked: function() {
      this.dismissEditMode();
    },

    toggleCurrentTimeClicked: function() {
      var currentTime = $(clockList[0]);
      currentTime.toggle();

      var shownKey = 'shown';
      var shown = toggleCurrentTimeButton.data(shownKey);
      var buttonText = (shown) ? 'Show Current Time' : 'Hide Current Time';

      toggleCurrentTimeButton.text(buttonText)
        .data(shownKey, !shown);
    },

    formatClockClicked: function() {
      var buttonText = (clock.hour12) ? '12 Hour' : '24 hour';
      formatClockButton.text(buttonText);

      clock.hour12 = !clock.hour12;
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
      var item = $(Mustache.render(template, zone)),
        deleteButton = item.find('.delete-clock');

      if (zone.isCurrent) {
        deleteButton.remove();
      } else {
        deleteButton.data('clock-index', index - 1);
        deleteButton.click(this.deleteClockFunction);
      }

      clockList.append(item);
    },

    deleteClockClicked: function(event) {
      var clickedButton = $(event.currentTarget),
        index = clickedButton.data('clock-index'),
        parentDiv = clickedButton.parents('.clock');

      timeZoneManager.deleteZoneAtIndex(index);
      parentDiv.remove();
    }
  };

  $.app.register('controllers.MainViewController', MainViewController);
})(jQuery);
