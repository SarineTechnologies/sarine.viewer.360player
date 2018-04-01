(function($) {

    $.imgplay = function(element, options) {
        var defaults = {
            totalImages: null,
            imageName: null,                            
            urlDir: null,
            rate: null,
            height: null,
            width: null,
            autoPlay: true
        };

        var el = element;
        var $el = $(element);

        var $canvas = null;
        var screen = null;
        var playing = false;
        var direction = 'forward';
        var page = 1;
        var total = 0;
        var index = 0;
        var playTimer = null;
        var loadProgress = 0;
        var playProgress = 0;

        var plugin = this;
        plugin.settings = {};
        plugin.frames = [];

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            
            // Check plugin options
            Object.keys(plugin.settings).map(function(key, index) {
                if (plugin.settings[key] === null) {
                    console.error('Sarine imageplayer error: ' + key + ' is undefined in plugin configuration');
                }
            });

            if (plugin.settings.urlDir.indexOf('{num}') === -1) {
                console.error('Sarine imageplayer error: urlDir should contain {num} string in the image name, like: Image_{num}.jpg');
            }

            // Load images
            var img;
            total = plugin.settings.totalImages;
            for (var i=1; i<=plugin.settings.totalImages; ++i) {
                img = '<img class="imageplay_loaded" src="' + plugin.settings.urlDir.replace('{num}', i) + '" />';
                $el.append(img);
                plugin.frames[i] = $(img).get(0);
            }
            
            $el.addClass('sarine_imgplay');
            $el.css({height: options.height, width: options.width});

            // Create canvas
            $canvas = $('<canvas class="imgplay-canvas">');
            $canvas.prop({height: options.height, width: options.width});
            
            screen = $canvas.get(0).getContext('2d');
            $el.append($canvas);
            
            initEvents();

            // remove images from DOM
            $el.find('img.imageplay_loaded').detach();

            // default frame rate
            if ( ! plugin.settings.rate ) {
                plugin.settings.rate = parseInt(plugin.frames.length / 10);
            }

            // max rate is 100 fps and min rate is 0.001 fps
            plugin.settings.rate = (plugin.settings.rate < 0.001) ? 0.001 : plugin.settings.rate;
            plugin.settings.rate = (plugin.settings.rate > 100) ? 100 : plugin.settings.rate;

            if (plugin.settings.autoPlay) {
                plugin.play();
            }
            else {
                plugin.toFrame(1);
            }
        };

        plugin.play = function() {
            playing = true;
            if(playTimer != null) {
                clearTimeout(playTimer);
            }

            drawFrame();
            $el.trigger('play');
        };

        plugin.pause = function() {
            playing = false;
            if(playTimer != null) {
                clearTimeout(playTimer);
            }
            $el.trigger('pause');
        };

        plugin.stop = function() {
            playing = false;
            index = 0;
            plugin.play();
            $el.trigger('stop', plugin);
        };

        plugin.toFrame = function(i) {
            i = i < 0 ? 0 : i;

            if (plugin.frames[i]) {
                index = i;
                drawFrame();
                return $.Deferred().resolve();
            }            
        };

        var initEvents = function() {
            
            var progress = $('<div class="imgplay-progress" id="imgplay_move">');
            var playBar = $('<div class="imgplay-play-bar">');
          
            function getCurrentPoint (target, e) {
                
                var touch = null, pageX = null;
                if (e.originalEvent && e.originalEvent.touches) {
                    touch = e.originalEvent && e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                    pageX = touch.pageX;
                }
                else {
                    pageX = e.pageX;
                }

                return pageX - target.offset().left;
            }

            function startMove (e) {
                plugin.pause();                    
                progressOnMouseDown = true;
                mousePosOnMouseDown = getCurrentPoint(progress, e); 
                indexOnMouseDown = index;                
            }

            function move (e) {
                if ( ! progressOnMouseDown) return;

                var target = progress;
                var curPosX = getCurrentPoint(target, e);
                                            
                var width = target.width();
                var frame = Math.floor(curPosX / width * total);
                
                isRightDirection = curPosX >= prevPosX;
                if (isRightDirection) {
                    direction = 'forward';
                }
                else {
                    direction = 'backward';
                }
                
                var mousePosOnMouseDownFrame = Math.floor(total / width * mousePosOnMouseDown);
                var curPosXFrame = Math.floor(total / width * curPosX);
                var offset;

                if (curPosXFrame >= mousePosOnMouseDown) {
                    offset = Math.floor(curPosXFrame - mousePosOnMouseDownFrame); 
                    index = indexOnMouseDown + offset;
                }
                else {
                    offset = Math.floor(mousePosOnMouseDownFrame - curPosXFrame);
                    index = indexOnMouseDown - offset;
                }

                if (index > total) {
                    index = index - total;                                
                }
                else if (index < 1) {
                    index = total + index;
                }

                plugin.toFrame(index);        
                prevPosX = curPosX;
            }

            function finishMove () {
                plugin.play();
                progressOnMouseDown = false;
            }

            var progressOnMouseDown = false,
                indexOnMouseDown = -1;
                mousePosOnMouseDown = -1,
                curPosX = 0,
                prevPosX = 0,
                isRightDirection = false;

            progress
                .on('mousedown touchstart', function(e) {
                    e.preventDefault();
                    startMove(e);                  
                })
                .on('mousemove touchmove', function(e) {
                    e.preventDefault();
                    move(e);
                })
                .on('mouseleave mouseup touchend', function(e) {
                    finishMove(e);
                });

            progress.append(playBar);
            $el.append(progress);
        };

        var drawFrame = function() {
            if (screen != null) {
                var img = plugin.frames[index];
                var $img = $(img);

                if (img && $img.prop('naturalHeight') > 0) {
                    var cw = $canvas.width();
                    var ch = $canvas.height();
                    var iw = img.width;
                    var ih = img.height;
                    var vw = 0;
                    var vh = 0;

                    if (cw >= ch) {
                        vw = iw * (ch/ih);
                        vh = ch;
                    } else {
                        vw = cw;
                        vh = ih * (cw/iw);
                    }
                    screen.clearRect(0, 0, cw, ch);
                    screen.drawImage(img, (cw - vw) / 2, (ch - vh) / 2, vw, vh);                    
                } 

                if (index > plugin.frames.length) {
                    plugin.stop();
                    return;
                }

                if (playing) {
                    if (direction == 'forward') {
                        index++;
                    } 
                    else {
                        index--;

                        if (index < 0) {
                            index = plugin.frames.length + index;
                        }
                    }

                    playTimer = setTimeout(drawFrame, Math.ceil(1000 / plugin.settings.rate));
                }

                drawProgress();
            }
        };

        var drawProgress = function() {
            loadProgress = ((plugin.frames.length / total) * 100);
            playProgress = ((index / plugin.frames.length) * 100);

            loadProgress = loadProgress > 100 ? 100 : loadProgress;
            playProgress = playProgress > 100 ? 100 : playProgress;

            $el.find('.imgplay-play-bar').css('width',  playProgress + '%');
        };

        plugin.init();
    };

    $.fn.imgplay = function(options) {
        this.each(function() {
            if($(this).data('imgplay') == undefined) {
                var plugin = new $.imgplay(this, options);
                $(this).data('imgplay', plugin);
            }
        });

        return this;
    };
})(jQuery);