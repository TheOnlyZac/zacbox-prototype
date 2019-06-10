$(function() {
    console.log("client initialized");
    var socket = io();

    setPhase(0);

    /* When nameForm is submitted (new name to be sent to server) */
    $('#nameform').submit(function(e) {
        /* Prevent page reloading */
        e.preventDefault();

        /* Send the new name to the server */
        var newName = $('#name').val();
        socket.emit('set name', newName);

        /* Clear the textbox and set header text */
        $('.header-title').text(newName);
        $('#name').val('');
        return false;
    });

    /* Server trigger for new Phase to start */
    socket.on("setPhase", function(phaseNum) {
        setPhase(phaseNum);
    });

});

function setPhase(phaseNum) {
    for (var i = 0; i <= 1; i++)
        $('#phase' + i).hide();
    
    $('#phase' + phaseNum).show();
    $('#phase ' + phaseNum + ' .vip-only').hide();
}