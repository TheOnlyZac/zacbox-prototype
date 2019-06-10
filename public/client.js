$(function() {
    console.log("client initialized");

    var socket = io();

    socket.on("setPhase", function(data) {

    })

    /* When nameForm is submitted (new name to be sent to server) */
    $('#nameform').submit(function(e) {
        e.preventDefault(); // prevent page reloading
        socket.emit('set name', {
            "newName": $('#name').val()
        }); // send the new name to the server
        $('#name').val(''); // clear the nameForm textbox
        return false;
    });

    
});