MapPreview
----------

Shows Map with photos from gallery.

Tested with fancyBox v2.0
 
Usage 
-----

Add lat and lng attributes to image tag:

  <img src='/images/p0000.jpg' lat='30.232' lng='50.423' />

And init gallery with:

  $(".fancybox").fancybox({
      map_preview: {
          width	: 50,
          height	: 50
          icon: 'some url',
          current_icon: 'some url',
          beforeMapLoad: function(map_preview){alert('loaded'},
          afterMapAfter: null
      }
  });
 
