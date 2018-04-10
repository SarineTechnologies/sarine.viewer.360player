
class Sarine360Player extends Viewer
	
	baseUrl = ""
	baseImagesUrl = ""
	atomName = ""
	imageTypes = {girdle : 1 , pavilion : 2}
	supportedWidths = {small: 152 , medium: 252 , large: 452 }
	filesConfiguration = { webP: {path : '_webp' , format: '.webp'} , jpg: {path: '_jpg' , format: '.jpg'}}

	constructor: (options) -> 		
		super(options)

		baseUrl = options.baseUrl + 'atomic/v1/js/'
		baseImagesUrl = options.baseUrl + 'atomic/v1/assets/images/sarine.viewer.360player/'
		atomName = options.element[0].classList[1]
	convertElement : () ->
		@element		

	first_init : ()->
		defer = $.Deferred()
		_t = @
		# load plugin assets
		#TO DO - decide where from take the plugin and his css
		assets = [
			{element:'script',src: baseUrl + 'sarine.plugin.imgplayer.min.js'},
			{element:'link',src: baseUrl + 'sarine.plugin.imgplayer.min.css'}
		]

		_t.loadAssets(assets,() ->
			webP = new Image();
			webP.onload = ->
				_t.loadImages(_t , webP.height == 2 , () ->
					defer.resolve(_t)
				)
			webP.onerror = ->
				_t.loadImages(_t , webP.height == 2 , () ->
					defer.resolve(_t)
				)
			webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
		)
					
		#_t.loadNoStoneImage(_t)

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
	loadImages:(_t,isWebP , onPluginLoadEnd)->
		#take move - pavilian/girdle
		configArray = window.configuration.experiences.filter((i)-> return i.atom == atomName)
		playerConfig = null
		if (configArray.length != 0)
			playerConfig = configArray[0]

		$curElement = $('.viewer.' + atomName)
		#decide on image size
		containerWidth = $curElement.width()
		console.log('view port width -------------------------------------- ' , containerWidth)
		playerWidthHeight = 0
		if (containerWidth <= supportedWidths.small)
			playerWidthHeight = supportedWidths.small
		else if (supportedWidths.small < containerWidth < supportedWidths.large)
			playerWidthHeight = supportedWidths.medium
		else
			playerWidthHeight = supportedWidths.large

		#auto play - take from configuration
		isAutoPlay = true
		if(playerConfig.autoPlay != undefined)
			isAutoPlay = playerConfig.autoPlay

		path = null
		if (isWebP == true)
			path = filesConfiguration.webP.path
			format = filesConfiguration.webP.format
		else
			path = filesConfiguration.jpg.path
			format = filesConfiguration.jpg.format

		domainUrl = null
		if (atomName.toLowerCase().indexOf(imageTypes.pavilion) != -1)
			domainUrl = window.stones[0].viewers.loupePavilionViewImage
		if (atomName.toLowerCase().indexOf(imageTypes.girdle) != -1)
			domainUrl = window.stones[0].viewers.loupeGirdleViewImage
		#add for testing
		domainUrl = 'https://d3oayecwxm3wp6.cloudfront.net/qa3/demo/new_loupe_poc/convention/Pavilion/' #'http://d3oayecwxm3wp6.cloudfront.net/qa3/demo/new_loupe_poc/'
		# remove for testing
		#if (domainUrl == null)
		#	_t.loadNoStoneImage(_t)
		#	onPluginLoadEnd();
		#	return

		# TO DO - take domainUrl + playerWidthHeight + path
		url = domainUrl + playerWidthHeight + path + '/img{num}' + format
		totalImages = 0	
		$.ajax	domainUrl + playerWidthHeight + path + '/viewer.json',
			type: 'GET'
			dataType: 'json'
			success: (data, textStatus, jqXHR) ->
				totalImages = data.images
				$curElement.imgplay({
						totalImages: totalImages,
						imageName: 'img{num}' + format,                            
						urlDir: url,
						rate: 30,
						height: playerWidthHeight,
						width: playerWidthHeight,
						autoPlay: isAutoPlay 
				})
				$curElement.on("play", (event, plugin) ->
				)
				$curElement.on("pause", (event, plugin) ->
				)
				$curElement.on("stop", (event, plugin) ->                          
				)
				$curElement.append('<img id="360Image" src="' + baseImagesUrl + 'interactive.png" style="position: absolute; bottom: 0; left: 0;" />')
				onPluginLoadEnd();
				return
    


@Sarine360Player = Sarine360Player
		
