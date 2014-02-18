/*

Todo:

-Set the csstext template into a separate function

*/


// Function to change CSS field text
var changeCSSText = function(hex, url) {
    var css = "background-color: " + hex + ";\n" +
              "background-image: " + url + ";";
    return css;
};

// Start off with a random background color
var colors = ["#851400", "#cc8800", "#878c00", "#338c00", "#008c41", "#008c8c",
              "#004f8c", "#00238c", "#25008a", "#5c008a", "#8a008a", "#8a005e",
              "#8a0027"];

var default_background = colors[Math.floor(Math.random() * colors.length)];
var default_pattern_array = patterns[Math.floor(Math.random() * patterns.length)];
var default_pattern = default_pattern_array[1];
var default_pattern_title = default_pattern_array[0];

// Load color & image from randomly chosen values
$('body').css({
    'background-image' : 'url("'+default_pattern+'")',
    'background-color' : default_background
});

// Instantiate the colorpicker, cache of jQuery selectors & set backgrounds
$('.colorpicker').minicolors(
    {
        inline: true,
        control: 'saturation',
        defaultValue: default_background,
        // Contains all actions that are triggered
        // by changing the colorpicker:
        change: function(hex, opacity) {
            $('body,.clickable').css('background-color', hex);
            $('.hexbox').val(hex);
            $("#cssfield").val(changeCSSText(hex, $('body').css('background-image')));
        },
        changeDelay: 10
    });

$('.hexbox').val(default_background);

// Intantiate: lazy loading
$("div.lazy").lazyload({threshold : 1000, effect: "fadeIn"});

// Set the clickable items to be the same background color as the body
$('.clickable').css('background-color', default_background);

// Initial CSS box text
var hex = $('.hexbox').val();
var url = $('body').css('background-image');
$("#cssfield").val(changeCSSText(hex, url));

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
    var hex = $('.hexbox').val();
    var url = $('body').css('background-image');
    $("#cssfield").val(changeCSSText(hex, url));
});

//Filter patterns via search box
function filter(element) {
    $('body,html').scroll();
    var value = $(element).val().toLowerCase();

    $("#post-list > li").each(function() {
        if ($(this).text().toLowerCase().search(value) > -1) {
            $(this).show();
        }
        else {
            $(this).hide();
        }
    });
}

// Highlight all code in #cssfield on hover
$("#cssfield").hover(
    function () {
       $(this).select();
    },
    function() {
        window.getSelection().removeAllRanges();
    }
);
