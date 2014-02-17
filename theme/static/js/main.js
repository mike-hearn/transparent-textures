// Start off with a random background color

var colors = ["#851400", "#cc8800", "#878c00", "#338c00", "#008c41", "#008c8c",
              "#004f8c", "#00238c", "#25008a", "#5c008a", "#8a008a", "#8a005e",
              "#8a0027"];

var default_background = colors[Math.floor(Math.random() * colors.length)];
var default_pattern = patterns[Math.floor(Math.random() * patterns.length)];


//Instantiate the colorpicker and set backgrounds

var colorpicker = $('.colorpicker');
var inputbox = $('.colorpicker-inputbox');
var clickable = $('.clickable');
var body = $('body');

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


//When a user changes the colorpicker color, set the body & pattern background
//colors to match.
colorpicker.change(function() {
    var background_color = colorpicker.val();
    $('body,.clickable').css('background-color', background_color);
    inputbox.val(background_color);
});

inputbox.change(function() {
    var value = inputbox.val();
    colorpicker.minicolors('value', value);
});

clickable.click( function() {
    background = $(this).css('background-image');
    body.css('background-image', background);
});