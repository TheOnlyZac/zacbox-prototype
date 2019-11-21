game = new WordSpudGame();

$(function() {
    //console.log("client initialized");
    var socket = io();
    setPhase(0);
    $("#name").focus();

    /* * * * SERVER/CLIENT SETUP * * * */

    socket.on('disconnect', function() {
        console.log('socket disconnected');
        $('#dc-banner').css('visibility', 'visible');
    });

    socket.on('add player', function(data) {
        //console.log("Received: add player | " + data.id);
        game.addPlayer(data.id, data.name, data.color);

        /* Add name to the Lobby players table */
        var lobbyName = $('#lobby-list').append("<tr class=" + data.id + "><td>" + data.name + "</td></tr>");
        /* Add name to the In-game players table */
        var igName = $('#ingame-list').append("<td class='" + data.id + "'>" + data.name + "</td>");
        $('.' + data.id).addClass(data.color);
        $('.' + data.id).addClass("playername");
 
    });
    
    socket.on('remove player', function(id) {
        //console.log("Received: remove player | " + id);
        game.removePlayer(id);

        /* Remove name from the Phase 1 players table */
        $('.' + id).remove();

    });

    /* On first connect the server will tell the client their ID */
    socket.on('you are', function(id) {
        console.log("Received: you are | " + id);
        game.me = id;
    });

    /* Server trigger for new Phase to start */
    socket.on('set phase', function(phaseNum) {
        //console.log("Received: setPhase | " + phaseNum);
        setPhase(phaseNum);
    });

    /* Server will periodically send the VIP's ID in case it changes */
    socket.on('set vip', function(id) {
        //console.log("Received: set vip | " + id);
        game.vip = id;

        /* Correct UI in case player just became VIP */
        checkVipUi();
    });

    socket.on('your turn', function(currPlayerId) {
        //console.log("received: curr player is " + currPlayerId);
        if (currPlayerId == game.me) {
            $('#spudtb').val('');
            $('#spudform').css('visibility', 'visible');
        } else {
            $('#spudform').css('visibility', 'hidden');
        }

        $('.playername').toArray().forEach(element => {
            console.log($(element));
            if ($(element).hasClass(currPlayerId)) {
                $(element).addClass('currentplayer');
            } else {
                $(element).removeClass('currentplayer');
                $(element).css('padding-bottom', '0px');
            }
        });
    })

    socket.on('set word1', function(newText) {
        $('#word1').text(newText);
    })

    socket.on('set word2', function(data) {
        $('#word2').text(data.newText);
        $('#word2').removeClass()
        $('#word2').addClass('word')
        $('#word2').addClass(data.color);

    })

    socket.on('spud add', function(data) {
        $('#spud').append("<span class='" + data.color + "'>" + data.spudText + "</span>");
        var spudWords = data.spudText.split(" ");
        $('#word1').text(spudWords[spudWords.length - 1]);
        $('#word2').text('');
    })

    /* * * * GAME TRIGGERS * * * */

    /* Player set name and log in */
    $('#nameform').submit(function(e) {
        /* Prevent page reloading */
        e.preventDefault();

        /* Send the new name to the server */
        var newName = $('#name').val();

        newName.replace(/[^\w]/g,'');
        if (newName.length === 0 || newName.match(/^ *$/) !== null)
            return;

        socket.emit('log in', newName);

        /* Clear the textbox and set header text */
        $('.header-title').text(newName);
        $('#name').val('');
        return false;
    });

    $('#startgameform').submit(function(e) {
        /* Prevent page reloading */
        e.preventDefault();

        /* Client check for VIP status */
        if (game.vip != game.me) {
            console.log("Error starting game: Not VIP");
            return;
        }

        console.log("Sending start game message!");
        socket.emit('start game');
    });

    $('#spudtb').on('input', function() {
        socket.emit("live type", $('#spudtb').val());
    })

    $('#spudform').submit(function(e) {
        /* Prevent page reloading */
        e.preventDefault();

        if ($('#spudtb').val().length == 0) {
            socket.emit('pass turn');
        } else {
            console.log("Spud form submitted");
            socket.emit('spud submit', $('#spudtb').val());
        }
    });

});

function setPhase(phaseNum) {
    for (var i = 0; i <= 2; i++)
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