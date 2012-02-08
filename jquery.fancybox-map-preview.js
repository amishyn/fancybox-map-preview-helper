 /*!
 * MapPreview helper for fancyBox
 * version: 0.0.1
 * @requires fancyBox v2.0 or later
 *
 * Usage: 
 *     $(".fancybox").fancybox({
 *         map_preview: {
 *             width	: 50,
 *             height	: 50
 *             icon: 'some url',
 *             current_icon: 'some url',
 *             beforeMapLoad: null,
 *             afterMapAfter: null,
 *             map_zoom: 10
 *         }
 *     });
 * 
 * Options:
 *     width - map width
 *     height - map height
 * 
 */
(function ($) {
	//Shortcut for fancyBox object
	var F = $.fancybox;

	//Add helper object
	F.helpers.map_preview = {
		map_popup: null,
		wrap: null,
		content: null,
		width: 0,
    locations: [],
    icon: null,
    current_icon: null,
    beforeMapLoad: null,
    afterMapAfter: null,

		lat_lng: function (el) {
			var img = $(el).find('img');
			var lat = jQuery(img[0]).attr('lat');
			var lng = jQuery(img[0]).attr('lng');

      return new google.maps.LatLng(lat, lng);
		},

		init: function (opts) {
			var that = this,
				content,
				blockWidth = opts.width || 200,
				blockHeight = opts.height || 200;
				lat_lng = this.lat_lng;
        this.icon = opts.icon;
        this.current_icon = opts.current_icon;
        this.afterMapLoad = opts.afterMapLoad;
        this.beforeMapUnload = opts.beforeMapUnload;
        map_zoom = opts.map_zoom || 14;

			//Build content structure
			content = '<div><div id="map_canvas_popup" style="width: '+blockWidth+'px; height: '+blockHeight+'px"></div></div>';
			this.wrap = $('<div id="fancybox-map-preview"></div>').addClass(opts.position || 'bottom').appendTo('body');
			this.content = $(content).appendTo(this.wrap);

			jQuery('#map_canvas_popup').show();
			var myOptions = {
				zoom: map_zoom,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			this.map_popup = new google.maps.Map(document.getElementById("map_canvas_popup"), myOptions);
      if (this.afterMapLoad)
        this.afterMapLoad(that.map_popup);


			$.each(F.group, function (i) {
				var position = lat_lng(this);

        var marker = new google.maps.Marker({
          position: position,
          map: that.map_popup
        });
        that.locations.push(marker);

			});

			this.content.width(blockWidth).css('left', 10);
		},

		//Center content
		update: function (opts) {
      if (this.locations.length >= 1){
        for(var i =0; i< this.locations.length; i++)
          if (F.current.index != i)
            this.locations[i].setOptions({icon: this.icon});
      }
		},

		beforeLoad: function (opts) {
			F.coming.margin[ opts.position === 'top' ? 0 : 2 ] = 50 + 30;
		},

		afterShow: function (opts) {
			//Check if exists and create or update content
			if (this.content) {
				this.update(opts);
			} else {
				this.init(opts);
			}

      var marker = this.locations[F.current.index];
      this.map_popup.setOptions({center: marker.position});
      marker.setOptions({icon: this.current_icon});
		},

		onUpdate: function () {
			this.update();
		},

		beforeClose: function () {
      if (this.beforeMapUnload)
        this.beforeMapUnload();
			if (this.wrap) {
				this.wrap.remove();
			}

			this.wrap = null;
			this.content = null;
			this.width = 0;
      this.locations = [];
		}
	}

}(jQuery));

