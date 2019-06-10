game = new WordSpudGame();

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
    socket.on('setPhase', function(phaseNum) {
        console.log("Received: setPhase | " + phaseNum);
        setPhase(phaseNum);
    });

    socket.on('you are', function(id) {
        console.log("Received: you are | " + id);
        game.me = id;
    });

    socket.on('set vip', function(id) {
        console.log("Received: set vip | " + id);
        game.vip = id;

        /* Correct UI in case player just became VIP */
        checkVipUi();
    });

    socket.on('add player', function(data) {
        console.log("Received: add player | " + data.id);
        game.addPlayer(data.id, data.name);
    });

});

function setPhase(phaseNum) {
    for (var i = 0; i <= 1; i++)
        $('#phase' + i).hide();
    
    $('#phase' + phaseNum).show();

    /* Check if the Player is VIP, and toggle the UI appropriately */
    console.log("me: " + game.me + " | vip: " + game.vip);
    checkVipUi();
}

function checkVipUi() {
    if (game.me == game.vip) $('.vip-only').show();
    else $('.vip-only').hide();
}