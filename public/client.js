$(function() {
    console.log("client initialized");

    var socket = io();

    $('form').submit(function(e) {
        e.preventDefault(); // prevent page reloading
        console.log("form submitted");
        socket.emit('set name', $('#name').val());
        $('#name').val('');
        return false;
    });

    
});