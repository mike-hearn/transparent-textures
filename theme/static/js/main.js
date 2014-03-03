function changeCSSTextField(hex, url) {
    var css = "background-color: " + hex + ";\n" +
              "background-image: " + url + ";\n" +
              "/* This is mostly intended for prototyping; " +
              "please download the pattern and re-host for " +
              "production environments. Thank you! */";
    $("#cssfield").val(css);
}

function filterPatterns(element) {
    var value = $(element).val().toLowerCase();

    if (value.length > 2) {

        $("#pattern-list > li").each(function() {
            if ($(this).text().toLowerCase().search(value) > -1) {
                $(this).show();
            }
            else {
                $(this).hide();
            }
        });
        $('body,html').scroll();
    }
    else {
        $("#pattern-list > li").hide();
        $("#pattern-list > .featured").show();
    }

    if (value == "all") {
        $("#pattern-list > li").show();
        $('body,html').scroll();
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

    var default_background = colors[Math.floor(Math.random() * colors.length)];
    var default_pattern_title, default_pattern;
    if ($('body').is('.base')) {
        var default_pattern_array = patterns[Math.floor(Math.random() * patterns.length)];
        default_pattern = default_pattern_array[1];
        default_pattern_title = default_pattern_array[0];
    }

    if ($('body').is('.article')) {
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
    // Set the clickable items to be the same background color as the body
    $('.clickable').css('background-color', default_background);

    return [default_background, default_pattern, default_pattern_title];

}

var colors_and_patterns = setBGColorAndPattern();
var default_background = colors_and_patterns[0],
    default_pattern = colors_and_patterns[1],
    default_pattern_title = colors_and_patterns[2];

instantiateColorpicker(default_background);


// Intantiate: lazy loading
$("div.lazy").lazyload({threshold : 1000, effect: "fadeIn"});

// Initial CSS box text
var hex = $('.hexbox').val(),
    url = $('body').css('background-image');
changeCSSTextField(hex, url);

// Initial 'Current pattern is...' text
$(".current-pattern").text(default_pattern_title);

// On user input to color input box, change the colorpicker as well
$('.hexbox').change(function() {
    var value = $(this).val();
    $('.colorpicker').minicolors('value', value);
});

// All actions after a pattern is clicked on
$('.clickable').click( function() {

    background = $(this).css('background-image');

    // Set the body background equal to the pattern clicked on
    $('body').css('background-image', background);

    //Set the 'current pattern' text
    $('.current-pattern').text($(this).find('.pattern-title').text());

    //Update the css text box
    var hex = $('.hexbox').val(),
        url = $('body').css('background-image');
    changeCSSTextField(hex, url);
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

