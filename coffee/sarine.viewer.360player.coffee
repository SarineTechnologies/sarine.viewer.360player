
class Sarine360Player extends Viewer
	
	constructor: (options) -> 		
		super(options)	

		baseUrl = options.baseUrl + "atomic/v1/js/"
	convertElement : () ->
		@element		

	first_init : ()->
		defer = $.Deferred()
		_t = @
		# load plugin assets
		assets = [
			{element:'script',src: 'http://localhost:3000/content/viewers/atomic/v1/js/sarine.plugin.imgplayer.min.js'}
		]

		_t.loadAssets(assets,() ->
			path = 'webp_'
			format = '.jpg.webp'
			url = 'https://d3oayecwxm3wp6.cloudfront.net/qa3/demo/new_loupe_poc/' + path + '318_80/Image_{num}' + format

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
				.on("play", (event, plugin) ->
				)
				.on("pause", (event, plugin) ->
				)
				.on("stop", (event, plugin) ->                          
				)  
		)
					
		#_t.loadNoStoneImage(_t)
		defer.resolve(_t)

		defer

	full_init : ()-> 
		defer = $.Deferred()
		if(@element.find('.no_stone').length > 0)				
			# notify the parent there are no assets - for hiding the buttons navigation for example
			@element.trigger('noStone')
		defer.resolve(@)
		defer
	play : () -> return		
	stop : () -> return
	loadNoStoneImage : (_t)->
		_t.loadImage(_t.callbackPic).then (img)->
			canvas = $("<canvas >")
			canvas.attr({"class": "no_stone" ,"width": img.width, "height": img.height}) 
			canvas[0].getContext("2d").drawImage(img, 0, 0, img.width, img.height)
			_t.element.append(canvas)
		
		return
    


@Sarine360Player = Sarine360Player
		
