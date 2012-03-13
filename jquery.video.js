/*
* Simple video controls for html 5 video
* hung@ditto.me
*
* Based on http://dev.opera.com/articles/view/custom-html5-video-player-with-css3-and-jquery/
* 
* Example:
* HTML: <video width="490" height="218" id="video">...</video>
* JS:   $("#video").video()
*
* Sample CSS:
* jquery.video.css
*/
(function($) {
	// plugin definition
	$.fn.video = function(options) {		
		// build main options before element iteration	
		// TODO: add options	
		var defaults = {

		};
		var options = $.extend(defaults, options);
		// iterate and reformat each matched element
		return this.each(function() {
			var video = this;
			
			//create html structure
			//main wrapper
			var video_wrap = $('<div></div>').addClass('video-player');
			//controls wraper
			var template = 
			  '<div class="video-controls">' +
  			  '<a class="video-play" title="Play/Pause"></a>' +
  			  '<div class="video-seek"></div>' + 
  			  '<div class="video-timer">00:00</div>' +
  			  '<div class="volume-box">' +
  			    '<div class="volume-slider"></div>' +
  			    '<a class="volume-button" title="Mute/Unmute"></a>' +
  			  '</div>' +
  		  '</div>';
			var video_controls = $(template);
			$(video).wrap(video_wrap);
			$(video).after(video_controls);
			
			//get new elements
			var video_container = $(video).parent('.video-player');
			var video_controls = $('.video-controls', video_container);
			var play_btn = $('.video-play', video_container);
			var video_seek = $('.video-seek', video_container);
			var video_timer = $('.video-timer', video_container);
			var volume = $('.volume-slider', video_container);
			var volume_btn = $('.volume-button', video_container);
			var video_fullscreen = $('.video-fullscreen', video_container);
			
			video_controls.show(); // keep the controls hidden
			video.play();
			
			var play = function() {
				if($(video).prop('paused') == false) {
					video.pause();					
				} else {					
					video.play();				
				}
			};
			
			play_btn.click(play);
			$(video).click(play);
			
			$(video).bind('play', function() {
				play_btn.addClass('paused-button');
			});
			
			$(video).bind('pause', function() {
				play_btn.removeClass('paused-button');
			});
			
			$(video).bind('ended', function() {
				play_btn.removeClass('paused-button');
			});
			
			var seeksliding;			
			var createSeek = function() {
				if($(video).prop('readyState')) {
					var video_duration = $(video).prop('duration');
					video_seek.slider({
						value: 0,
						step: 0.01,
						orientation: "horizontal",
						range: "min",
						max: video_duration,
						animate: true,					
						slide: function(){							
							seeksliding = true;
						},
						stop:function(e,ui){
							seeksliding = false;						
							$(video).prop("currentTime",ui.value);
						}
					});
					video_controls.show();					
				} else {
					setTimeout(createSeek, 150);
				}
			};

			createSeek();
		
			var gTimeFormat=function(seconds){
				var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
				var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
				return m+":"+s;
			};
			
			var seekUpdate = function() {
				var currenttime = $(video).prop('currentTime');
				if(!seeksliding) video_seek.slider('value', currenttime);
				video_timer.text(gTimeFormat(currenttime));							
			};
			
			$(video).bind('timeupdate', seekUpdate);
			
			var video_volume = 1;
			volume.slider({
				value: 1,
				orientation: "vertical",
				range: "min",
				max: 1,
				step: 0.05,
				animate: true,
				slide:function(e,ui){
						$(video).prop('muted',false);
						video_volume = ui.value;
						$(video).prop('volume',ui.value);
					}
			});
			
			var muteVolume = function() {
				if($(video).prop('muted')==true) {
					$(video).prop('muted', false);
					volume.slider('value', video_volume);
					
					volume_btn.removeClass('volume-mute');					
				} else {
					$(video).prop('muted', true);
					volume.slider('value', '0');
					
					volume_btn.addClass('volume-mute');
				};
			};
			
			volume_btn.click(muteVolume);
			
			$(video).removeAttr('controls');
			
		});
	};

})(jQuery);