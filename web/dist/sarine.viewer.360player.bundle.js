
/*!
sarine.viewer - v0.3.6 -  Sunday, February 4th, 2018, 4:49:26 PM 
 The source code, name, and look and feel of the software are Copyright © 2015 Sarine Technologies Ltd. All Rights Reserved. You may not duplicate, copy, reuse, sell or otherwise exploit any portion of the code, content or visual design elements without express written permission from Sarine Technologies Ltd. The terms and conditions of the sarine.com website (http://sarine.com/terms-and-conditions/) apply to the access and use of this software.
 */

(function() {
  var Viewer;

  Viewer = (function() {
    var error, rm;

    rm = ResourceManager.getInstance();

    function Viewer(options) {
      console.log("");
      this.first_init_defer = $.Deferred();
      this.full_init_defer = $.Deferred();
      this.src = options.src, this.element = options.element, this.autoPlay = options.autoPlay, this.callbackPic = options.callbackPic;
      this.id = this.element[0].id;
      this.element = this.convertElement();
      Object.getOwnPropertyNames(Viewer.prototype).forEach(function(k) {
        if (this[k].name === "Error") {
          return console.error(this.id, k, "Must be implement", this);
        }
      }, this);
      this.element.data("class", this);
      this.element.on("play", function(e) {
        return $(e.target).data("class").play.apply($(e.target).data("class"), [true]);
      });
      this.element.on("stop", function(e) {
        return $(e.target).data("class").stop.apply($(e.target).data("class"), [true]);
      });
      this.element.on("cancel", function(e) {
        return $(e.target).data("class").cancel().apply($(e.target).data("class"), [true]);
      });
    }

    error = function() {
      return console.error(this.id, "must be implement");
    };

    Viewer.prototype.first_init = Error;

    Viewer.prototype.full_init = Error;

    Viewer.prototype.play = Error;

    Viewer.prototype.stop = Error;

    Viewer.prototype.convertElement = Error;

    Viewer.prototype.cancel = function() {
      return rm.cancel(this);
    };

    Viewer.prototype.loadImage = function(src) {
      return rm.loadImage.apply(this, [src]);
    };

    Viewer.prototype.loadAssets = function(resources, onScriptLoadEnd) {
      var element, resource, scripts, scriptsLoaded, _i, _len;
      if (resources !== null && resources.length > 0) {
        scripts = [];
        for (_i = 0, _len = resources.length; _i < _len; _i++) {
          resource = resources[_i];
          if (resource.element === 'script') {
            scripts.push(resource.src + cacheVersion);
          } else {
            element = document.createElement(resource.element);
            element.href = resource.src + cacheVersion;
            element.rel = "stylesheet";
            element.type = "text/css";
            $(document.head).prepend(element);
          }
        }
        scriptsLoaded = 0;
        scripts.forEach(function(script) {
          return $.getScript(script, function() {
            if (++scriptsLoaded === scripts.length) {
              return onScriptLoadEnd();
            }
          });
        });
      }
    };

    Viewer.prototype.setTimeout = function(delay, callback) {
      return rm.setTimeout.apply(this, [this.delay, callback]);
    };

    return Viewer;

  })();

  this.Viewer = Viewer;
  
  class Sarine360Player extends Viewer {
	constractor(options) 
	{

	}
	
	first_init () {
			return new Promise((resolve, reject) => {
				resolve()
        })
    }
	
	full_init () {
		/*this.loadImages(true);
		return new Promise((resolve, reject) => {
			resolve();
		});*/
		debugger;
		var assets = [
			{element:'script',src: '/content/viewers/atomic/v1/js/sarine.plugin.imgplayer.min.js'},
		];
		
		var self = this;

		self.loadAssets(assets,() => {
			var webP = new Image();
			webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
			webP.onload = webP.onerror = function () {                        
				return self.loadImages(webP.height == 2); // if true then WebP
			};
		});

	}
		
	play () {
        return
    }

	stop (){
        return    
	}
	
	convertElement (){
		return
	}
	loadImages (isWebP) {
		 return new Promise((resolve, reject) => { 
        debugger; 
		var path = isWebP ? 'webp_' : 'jpeg_';
		var format = isWebP ? '.jpg.webp': '.jpg';
		var url = 'https://d3oayecwxm3wp6.cloudfront.net/qa3/demo/new_loupe_poc/' + path + '318_80/Image_{num}' + format;

		$('#360Player')
			.imgplay({
				totalImages: 318,
				imageName: 'Image_{num}' + format,                            
				urlDir: url,
				rate: 30,
				height: 225,
				width: 250,
				autoPlay: true 
			})
			.on("play", function (event, plugin) {
			})
			.on("pause", function (event, plugin) {
			})
			.on("stop", function (event, plugin) {                           
			});
		// play on demand
		// make sure that imgplay option autoPlay is false 
		// $('#imageplayer').data('imgplay').play();    
		 });
	}
}

window.Sarine360Player = Sarine360Player;

}).call(this);
