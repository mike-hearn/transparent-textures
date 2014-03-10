function changeCSSTextField(hex, url) {
    if (url.indexOf('http') < 0) {
        url = 'http://' + window.location.host + url;
    }

    if (url.indexOf('url') < 0) {
        url = 'url(' + url + ')';
    }

    var css = "background-color: " + hex + ";\n" +
              "background-image: " + url + ";\n" +
              "/* This is mostly intended for prototyping; " +
              "please download the pattern and re-host for " +
              "production environments. Thank you! */";
    $("#cssfield").val(css);
}

function filterPatterns(element, $initial_state) {
/* Filter the items based on searched text of > 2 characters */

    $('.searched').remove();

    var value = $(element).val().toLowerCase();

    if (value.length > 2) {
        $initial_state.hide();

        $.getJSON('/data.json', function(data) {
            var matched_objects = data.data.filter(function(pattern) {
                return pattern.search_string.toLowerCase().indexOf(value) > -1;});

            var li_list = [];

            $(matched_objects).each(function(idx, val) {

                var element = '<li class="pattern-container col-sm-6 searched">' +
                          '<div class="pattern clickable lazy" data-original="/patterns/' + val.slug + '.png" ' +
                          'style="background-image: url(/theme/images/transparent.png);">' + //todo: escape data.html slashes
                          '<div class="pattern-info">' +
                          '<h4 class="pattern-title">' + val.title + '</h4>' +
                          '<p>Made by <a href="' + val.authorsite + '" target="_blank">' + val.author + '</a></p>' +
                          '<a href="/patterns/' + val.slug + '.png" class="pattern-download" download><i class="fa fa-download"></i> Download</a>' +
                          '<a href="' + val.slug + '.html" class="pattern-link"><i class="fa fa-link"></i> Link</a>' +
                          '</div></div></li>';

                li_list.push(element);
            });

            $("#pattern-list").append(li_list);
            instantiateClickablePatterns();
            instantiateLazyLoading();
        });
    }
    else {
        $initial_state.show();
    }
}

function instantiateColorpicker(color) {
    $('.colorpicker').minicolors({
        inline: true,
        control: 'saturation',
        defaultValue: color,
        /* Contains all actions that are triggered
        by changing the colorpicker: */
        change: function(hex, opacity) {
            $('body,.clickable').css('background-color', hex);
            $('.hexbox').val(hex);
            changeCSSTextField(hex, $('body').css('background-image'));
        },
        changeDelay: 10
    });
}

function setBGColorAndPattern() {
/* Set background color and choose random pattern */

    $body = $('body');

    var colors = ["#851400", "#cc8800", "#878c00", "#338c00", "#008c41", "#008c8c",
                  "#004f8c", "#00238c", "#25008a", "#5c008a", "#8a008a", "#8a005e",
                  "#8a0027"];

    var default_background_color = colors[Math.floor(Math.random() * colors.length)],
        default_pattern_array,
        default_pattern,
        default_pattern_title,
        default_pattern_url;

    if ($body.is('.base')) {
        default_pattern_array = $('#pattern-list li');
        default_pattern = default_pattern_array[Math.floor((Math.random() * default_pattern_array.length))];
        default_pattern_url = $(default_pattern).find('.pattern').data('original');
        default_pattern_title = $(default_pattern).find('.pattern-title').text();
    }

    if ($body.is('.article')) {
        default_pattern_url = pattern;
        default_pattern_title = pattern_title;
    }

    $body.css({
        'background-image' : 'url('+default_pattern_url+')',
        'background-color' : default_background_color
    });

    $('.hexbox').val(default_background_color);
    $(".current-pattern").text(default_pattern_title);

    instantiateColorpicker(default_background_color);
    changeCSSTextField(default_background_color, default_pattern_url);

    return [default_background_color, default_pattern_url, default_pattern_title];

}

function instantiateClickablePatterns() {
// All actions after a pattern is clicked on
    var bg = $('body').css('background-color');
    $('.clickable')
        .css('background-color', bg)
        .click( function() {

            // Set the body background equal to the pattern clicked on
            var bg_image = $(this).css('background-image');
            $('body').css('background-image', bg_image);

            //Set the 'current pattern' text
            $('.current-pattern').text($(this).find('.pattern-title').text());

            //Update the css text box
            var hex = $('.hexbox').val(),
                url = $('body').css('background-image');
            changeCSSTextField(hex, url);
        });
}

function instantiateLazyLoading() {
    $("div.lazy").lazyload({threshold : 1000, effect: "fadeIn"});
    $('body, html').scroll();
}

function createCanvasWallpaper(pattern, color, width, height, attachToAnchorCallback) {
/* Draw canvas with background color and transparent PNG pattern overlay */

    var can = document.createElement('canvas');
    can.width = width;
    can.height = height;
    var ctx = can.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,height);
    ctx.lineTo(width,height);
    ctx.lineTo(width,0);
    ctx.fillStyle = color;
    ctx.fill();

    var imageObj = new Image();
    function drawPattern() {
        var pattern = ctx.createPattern(imageObj, "repeat");
        ctx.fillStyle = pattern;
        ctx.fill();

        var p = $('body').append(can);
        $('canvas').hide();
        var canvas_element = document.getElementsByTagName('canvas')[0];
        attachToAnchorCallback(canvas_element);
    }

    imageObj.src = pattern;
    imageObj.onload = drawPattern;

}

function instantiateHiddenCanvas(color) {
/* Create a canvas based on current background/color */
    $('canvas').remove();

    var width = $('#wallpaper_width').val(),
        height = $('#wallpaper_height').val(),
        pattern = $('body').css('background-image').replace(/\(|\)|(^url)|"|'/g, ''),
        title = $('.pattern-title').text().toLowerCase().replace(/[^A-z0-9]/g, '-');

    createCanvasWallpaper(pattern, color, width, height, function(canvas) {
        var base64 = canvas.toDataURL('image/png');
        $('.save-wallpaper-button').attr({
            'href' : base64,
            'download' : title + '-' + width + 'x' + height + '.png'
        });
    });

}

function instantiateSWFCopyButton() {
/* Copy to clipboard code; copied almost straight from ZeroClipboard's example */

    ZeroClipboard.config( { moviePath: '/theme/swf/ZeroClipboard.swf' } );
    var client = new ZeroClipboard($('#copy-button'));

    client.on( "load", function(client) {
    } );

    client.on( "complete", function(client, args) {
        $('.copy-success').text('Copied!');
        $('.copy-success').show();
        $('.copy-success').fadeOut(2000);
    } );

    client.on( "noflash", function (client) {
        $('#copy-button').hide();
    } );

    client.on( "wrongFlash", function (client,args) {
        $('#copy-button').hide();
    } );
}

$(document).ready(function() {

    var colors_and_patterns = setBGColorAndPattern();
    var default_background = colors_and_patterns[0],
        default_pattern = colors_and_patterns[1],
        default_pattern_title = colors_and_patterns[2];
    var $initial_state = $("#pattern-list").children();

    instantiateClickablePatterns();
    instantiateLazyLoading();
    instantiateSWFCopyButton();

    /* Declare event listeners */

    $('#search').on('input', function() {
        filterPatterns(this, $initial_state);
    });

    $('.hexbox').change(function() {
        var value = $(this).val();
        $('.colorpicker').minicolors('value', value);
    });

    $("#cssfield").hover(
        function () {
           $(this).select();
        },
        function() {
            window.getSelection().removeAllRanges();
        }
    );

    if ($('body').is('.article')) {

        instantiateHiddenCanvas(default_background);

        $('.hexbox, .minicolors-panel, #wallpaper_width, #wallpaper_height')
            .on('input mouseleave mouseup touchend', function() {
                var color = $('.hexbox').val();
                instantiateHiddenCanvas(color);
        });

        $('#device_resolution').change(function() {

            function changeResolutionandIcon(width, height, icon) {
                $("#wallpaper_width").val(width);
                $("#wallpaper_height").val(height);
                $('.wallpaper-example').attr({
                    'src' : '/theme/images/' + icon + '.png'
                });
            }

            var callResChange = {
                hd       : function() {changeResolutionandIcon(1920,1080,'monitor');},
                iphone5  : function() {changeResolutionandIcon(640,1136,'iphone5');},
                iphone4  : function() {changeResolutionandIcon(640,960,'iphone4');},
                twitter  : function() {changeResolutionandIcon(520,260,'twitter');},
                facebook : function() {changeResolutionandIcon(851,315,'facebook');},
                ipad     : function() {changeResolutionandIcon(1536,2048,'ipad');},
            };

            var value = $(this).val();
            callResChange[value]();

            var color = $('.hexbox').val();
            instantiateHiddenCanvas(color);


        });
    }

});
