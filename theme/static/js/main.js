/*

Todo:

-Set the csstext template into a separate function

*/



// Start off with a random background color

var colors = ["#851400", "#cc8800", "#878c00", "#338c00", "#008c41", "#008c8c",
              "#004f8c", "#00238c", "#25008a", "#5c008a", "#8a008a", "#8a005e",
              "#8a0027"];

var default_background = colors[Math.floor(Math.random() * colors.length)];
var default_pattern_array = patterns[Math.floor(Math.random() * patterns.length)];
var default_pattern = default_pattern_array[1];
var default_pattern_title = default_pattern_array[0];


//Instantiate the colorpicker, cache of jQuery selectors & set backgrounds

var colorpicker = $('.colorpicker');
var inputbox = $('.colorpicker-inputbox');
var clickable = $('.clickable');
var body = $('body');
var cssfield = $('#cssfield');

colorpicker.minicolors(
    {
        inline: true,
        control: 'saturation',
        defaultValue: default_background
    });

inputbox.val(default_background);

body
    .css('background-image','url("'+default_pattern+'")')
    .css('background-color', default_background);


//Set the clickable items to be the same background color as the body
clickable.css('background-color', default_background);

//Initial CSS Box
cssfield.text(
    "body {\n  background: url(" + default_pattern + ") " + default_background + ";\n}");

//Initial 'Current pattern is...' text
$(".current-pattern").text(default_pattern_title);

//When a user changes the colorpicker color, set the body & pattern background
//colors to match.
colorpicker.change(function() {
    var background_color = colorpicker.val();
    $('body,.clickable').css('background-color', background_color);
    inputbox.val(background_color);
    cssfield.text(
        "body {\n  background: " + body.css('background-image') + " " + colorpicker.val() + ";\n}");
});

//On user input to color input box, change the colorpicker as well
inputbox.change(function() {
    var value = inputbox.val();
    colorpicker.minicolors('value', value);
});

//All actions after a pattern is clicked on
clickable.click( function() {

    background = $(this).css('background-image');

    //Set the body background equal to the pattern clicked on
    body.css('background-image', background);
    //Set the 'current pattern' text
    $('.current-pattern').text($(this).find('.pattern-title').text());
    //Update the css text box
    cssfield.text(
        "body {\n  background: " + body.css('background-image') + " " + colorpicker.val() + ";\n}");
});

//Filter patterns via search box
function filter(element) {
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

/*****************

Utility functions

******************/

// Highlight all code #cssfield focus

cssfield.hover(
    function () {
       $(this).select();
    },
    function() {
        window.getSelection().removeAllRanges();
    }
);
