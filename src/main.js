//import {imageplayer} from "./test"

class Sarine360Player extends Viewer {
	constractor()
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