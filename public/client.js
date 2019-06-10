$(function() {
    console.log("client initialized");

    var socket = io();

    socket.on("setPhase", function(data) {

    })

    /* When nameForm is submitted (new name to be sent to server) */
    $('#nameform').submit(function(e) {
        /* Prevent page reloading */
        e.preventDefault();

        /* Send the new name to the server */
        var newName = $('#name').val();
        socket.emit('set name', {
            "newName": newName
        });

        /* Clear the textbox and set header text */
        $('.header-title').text(newName);
        $('#name').val('');
        return false;
    });

    
});