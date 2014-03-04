function changeCSSTextField(hex, url) {
    var css = "background-color: " + hex + ";\n" +
              "background-image: " + url + ";\n" +
              "/* This is mostly intended for prototyping; " +
              "please download the pattern and re-host for " +
              "production environments. Thank you! */";
    $("#cssfield").val(css);
}

function filterPatterns(element) {
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
                          '<div class="pattern clickable lazy" data-original="/theme/images/patterns/' + val.slug + '.png" ' +
                          'style="background-image: url(/theme/images/transparent.png);">' + //todo: escape data.html slashes
                          '<div class="pattern-info">' +
                          '<h4 class="pattern-title">' + val.title + '</h4>' +
                          '<p>Made by <a href="' + val.authorsite + '" target="_blank">' + val.author + '</a></p>' +
                          '<a href="/theme/images/patterns/tree-bark.png" class="pattern-download" download><i class="fa fa-download"></i> Download</a>' +
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
    $('.colorpicker').minicolors(
    {
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

    // Start off with a random background color
    var colors = ["#851400", "#cc8800", "#878c00", "#338c00", "#008c41", "#008c8c",
                  "#004f8c", "#00238c", "#25008a", "#5c008a", "#8a008a", "#8a005e",
                  "#8a0027"];

    var default_background = colors[Math.floor(Math.random() * colors.length)],
        default_pattern_title,
        default_pattern;

    if ($('body').is('.base')) {
        var default_pattern_array = pattern_data.data[Math.floor(Math.random() * pattern_data.data.length)];
        default_pattern = default_pattern_array.png;
        default_pattern_title = default_pattern_array.title;
    }

    if ( $('body').is('.article') ) {
        default_pattern = pattern;
        default_pattern_title = pattern_title;
    }

    // Load color & image from randomly chosen values
    $('body').css({
        'background-image' : 'url("'+default_pattern+'")',
        'background-color' : default_background
    });

    //Set the hexbox color to the background
    $('.hexbox').val(default_background);

    return [default_background, default_pattern, default_pattern_title];

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

var colors_and_patterns = setBGColorAndPattern();
var default_background = colors_and_patterns[0],
    default_pattern = colors_and_patterns[1],
    default_pattern_title = colors_and_patterns[2];

var $initial_state = $("#pattern-list").children();

instantiateColorpicker(default_background);
instantiateClickablePatterns();
instantiateLazyLoading();

// Initial CSS box text
var hex = $('.hexbox').val(),
    url = $('body').css('background-image');
changeCSSTextField(hex, url);

// Listen for search input
$('#search').on('input', function() {
    filterPatterns(this);
});

// Initial 'Current pattern is...' text
$(".current-pattern").text(default_pattern_title);

// On user input to color input box, change the colorpicker as well
$('.hexbox').change(function() {
    var value = $(this).val();
    $('.colorpicker').minicolors('value', value);
});

// Highlight all code in #cssfield on hover
$("#cssfield").hover(
    function () {
       $(this).select();
    },
    function() {
        window.getSelection().removeAllRanges();
    }
);

// Copy to clipboard code; copied almost straight from ZeroClipboard's example
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

