
class Sarine360Player extends Viewer
	
	baseUrl = ""
	baseImagesUrl = ""
	atomName = ""
	imageTypes = {girdle : "girdle" , pavilion : "pavilion"}
	supportedWidths = {small: 152 , medium: 252 , large: 452 }
	filesConfiguration = { webP: {path : '_webp' , format: '.webp'} , fallback: {path: '_jpg' , format: '.jpg'}}
	isLocal = ""
	transparentConfiguration = false 

	constructor: (options) -> 		
		super(options)
		atomName = options.element[0].classList[1]

		atomConfig = configuration.experiences.filter((exp)-> exp.atom == atomName)[0]
		
		baseUrl = options.baseUrl + 'atomic/v1/assets/'
		baseImagesUrl = options.baseUrl + 'atomic/v1/js/images/sarine.viewer.360player/'
		supportedWidths = if atomConfig.widths then atomConfig.widths else supportedWidths; 
		filesConfiguration = if atomConfig.files then atomConfig.files else filesConfiguration; 
		
		# check atom's extraData.transparent (eg. in Mars, transparency is true by default)
		transparentConfiguration = if options.extraData && options.extraData.transparent then options.extraData.transparent else false; 
		
		# check atom's configuration transparent property (in Widget, transparency is false by default, but can be overridden)
		transparentConfiguration = if typeof(atomConfig.transparent) != 'undefined' then atomConfig.transparent else transparentConfiguration; 
		
		qs = new queryString()
		isLocal = qs.getValue("isLocal") == "true"
		
		
	convertElement : () ->
		@element		

	first_init : ()->
		defer = $.Deferred()
		defer.resolve(@)
		defer

	full_init : ()-> 
		defer = $.Deferred()
		_t = @
		# load plugin assets

		ext = '.min.js'
		try
			if(parent.location.hash.indexOf('debug') > 0)
				ext = '.js'
		catch e
			console.warn 'Unminified sarine.plugin.imgplayer script not allowed from accessing a cross-origin frame', e

		assets = [
			{element:'script',src: baseUrl + 'sarine.plugin.imgplayer' + ext},
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
		playerConfig = null
		if(window.configuration.experiences != undefined)
			configArray = window.configuration.experiences.filter((i)-> return i.atom == atomName)
			if (configArray.length != 0)
				playerConfig = configArray[0]

		$curElement = $('.viewer.' + atomName) 
		#decide on image size
		containerSize = $curElement.width()
		if (containerSize == 0)
			containerSize = Math.min($(window).height(), $(window).width())

		#console.log('container width -------------------------------------- ' , containerSize)
		playerWidthHeight = 0
		if (containerSize <= supportedWidths.small)
			playerWidthHeight = supportedWidths.small
		else if (supportedWidths.small < containerSize < supportedWidths.large)
			playerWidthHeight = supportedWidths.medium
		else
			playerWidthHeight = supportedWidths.large

		#auto play - take from configuration
		isAutoPlay = true
		if(playerConfig != null)
			if(playerConfig.autoPlay != undefined)
				isAutoPlay = playerConfig.autoPlay

		path = null
		if (isWebP == true)
			path = filesConfiguration.webP.path
			format = filesConfiguration.webP.format
		else
			path = filesConfiguration.fallback.path
			format = filesConfiguration.fallback.format

		domainUrl = null
		domainFileUrl = null
		if(isLocal)
			if (atomName.toLowerCase().indexOf(imageTypes.pavilion) != -1)
				domainUrl = if transparentConfiguration && window.stones[0].viewers.loupePavilionTransparencyViewImageLocal then window.stones[0].viewers.loupePavilionTransparencyViewImageLocal else window.stones[0].viewers.loupePavilionViewImageLocal
				domainFileUrl = if transparentConfiguration && window.stones[0].viewers.loupePavilionTransparencyViewFileLocal then window.stones[0].viewers.loupePavilionTransparencyViewFileLocal else window.stones[0].viewers.loupePavilionViewFileLocal
			
			if (atomName.toLowerCase().indexOf(imageTypes.girdle) != -1)
				domainUrl = window.stones[0].viewers.loupeGirdleViewImageLocal
				domainFileUrl = window.stones[0].viewers.loupeGirdleViewFileLocal
		else
			if (atomName.toLowerCase().indexOf(imageTypes.pavilion) != -1)
				domainUrl = if transparentConfiguration && window.stones[0].viewers.loupePavilionTransparencyViewImage then window.stones[0].viewers.loupePavilionTransparencyViewImage else window.stones[0].viewers.loupePavilionViewImage
			
			if (atomName.toLowerCase().indexOf(imageTypes.girdle) != -1)
				domainUrl = window.stones[0].viewers.loupeGirdleViewImage
		#add for testing
		#domainUrl = 'https://d3oayecwxm3wp6.cloudfront.net/qa3/demo/new_loupe_poc/convention/Pavilion/' #'http://d3oayecwxm3wp6.cloudfront.net/qa3/demo/new_loupe_poc/'
		# remove for testing
		if (domainUrl == null)
			_t.loadNoStoneImage(_t)
			onPluginLoadEnd();
			return
		totalImages = 0	
		
		if(isLocal)
			imageNameLocal = 'img{num}.jpg'
			url = domainUrl + imageNameLocal
			$.ajax	domainFileUrl + 'ImpressionShootingParameters.json/application/json',
			type: 'GET'
			dataType: 'json'
			success: (data, textStatus, jqXHR) ->
				totalImages = data.TotalImageCount
				$curElement.imgplay({
						totalImages: totalImages,
						imageName: imageNameLocal,                            
						urlDir: url,
						height: containerSize,
						width: containerSize,
						autoPlay: isAutoPlay 
				})
				$curElement.on("play", (event, plugin) ->
				)
				$curElement.on("pause", (event, plugin) ->
				)
				$curElement.on("stop", (event, plugin) ->                          
				)
				$curElement.append('<img class="_360Image" id="360Image" src="' + baseImagesUrl + 'interactive.png" style="position: absolute; bottom: 0; left: 0; z-index: 1;" />')
				onPluginLoadEnd();
				return
		else
			url = domainUrl + playerWidthHeight + path + '/img{num}' + format
			$.ajax	domainUrl + playerWidthHeight + path + '/ImpressionShootingParameters.json',
			type: 'GET'
			dataType: 'json'
			success: (data, textStatus, jqXHR) ->
				totalImages = data.TotalImageCount
				$curElement.imgplay({
					totalImages: totalImages,
					imageName: 'img{num}' + format,                            
					urlDir: url,
					height: containerSize,
					width: containerSize,
					autoPlay: isAutoPlay,
					sharding: if isLocal then false else true  
				})
				$curElement.on("play", (event, plugin) ->
				)
				$curElement.on("pause", (event, plugin) ->
				)
				$curElement.on("stop", (event, plugin) ->                          
				)
				$curElement.append('<img class="_360Image" id="360Image" src="' + baseImagesUrl + 'interactive.png" style="position: absolute; bottom: 0; left: 0; z-index: 1;" />')
				onPluginLoadEnd();
				return
    
@Sarine360Player = Sarine360Player
		
### Query string hepler ###
class window.queryString
  constructor: (url) ->
    __qsImpl = new queryStringImpl(url)

    @getValue = (key) ->
      result = __qsImpl.params[key]
      if not result?
        result = __qsImpl.canonicalParams[key.toLowerCase()]
      return result
  
    @count = () ->
      __qsImpl.count

    @hasKey = (key) ->
      return key of __qsImpl.params || key.toLowerCase() of __qsImpl.canonicalParams

class queryStringImpl
  constructor: (url)->
    qsPart = queryStringImpl.getQueryStringPart(url)
    [@params, @canonicalParams, @count] = queryStringImpl.initParams qsPart

  @getQueryStringPart: (url) ->
    if url?
      index = url.indexOf '?'
      return if index > 0 then url.substring index else ''
    return window.location.search

  @initParams: (qsPart) ->
    params = {}
    canonicalParams = {}
    count = 0
    a = /\+/g  #// Regex for replacing addition symbol with a space
    r = /([^&=]+)=?([^&]*)/g
    d = (s) -> 
      decodeURIComponent(s.replace(a, " "))
    q = qsPart.substring(1)

    while (e = r.exec(q))
      key = d(e[1])
      value = d(e[2])
      params[key] = value
      canonicalParams[key.toLowerCase()] = value
      count += 1
    return [params, canonicalParams, count]