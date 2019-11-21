game = new WordSpudGame();

$(function() {
    //console.log("client initialized");
    var socket = io();
    screen.orientation.lock("portrait");
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
        var lobbyName = $('#lobby-list').append("<tr class='playername " + data.id + "'><td>" + data.name + "</td></tr>");
        /* Add name to the In-game players table */
        var igName = $('#ingame-list').append("<td class='playername " + data.id + "'>" + data.name + "</td>");
        var igName = $('#score-list').append("<td class='score " + data.id + "'>0</td>");
        $('.' + data.id).addClass(data.color);
 
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
        game.currPlayer =currPlayerId;
        if (currPlayerId == game.me) {
            $('#spudtb').val('');
            $('#spudform').css({'opacity':'1', 'visibility':'visible'});
        } else {
            $('#spudform').css('visibility', 'hidden');
        }

        $('.playername').toArray().forEach(element => {
            if ($(element).hasClass(currPlayerId)) {
                $(element).addClass('currentplayer');
            } else {
                $(element).removeClass('currentplayer');
                $(element).css('padding-bottom', '0px');
            }
        });
    })

    socket.on('set word1', function(newText) { setWordOne(newText); });

    socket.on('set word2', function(data) { setWordTwo(data.newText, data.color); });

    socket.on('spud add', function(data) {
        newSpud = $("<span class='" + data.color + "'></span>").appendTo('#spud'), data.spudText;
        typeTransition(newSpud, data.spudText);
        var spudWords = data.spudText.split(" ");

        setWordOne(spudWords[spudWords.length - 1]);

        $('#word2').text('');
    })

    socket.on('start vote', function() {
        console.log("starting vote");
        if (game.currPlayer == game.me) {
            return;
        }
        $('#voteform').css({'opacity':'1', 'visibility':'visible'});
    })

    socket.on('add score', function(data) {
        console.log("adding " + data.score + " to player " + data.playerId);
        game.players[data.playerId].score += data.score;
        $('.score.' + data.playerId).text(game.players[data.playerId].score);
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
        $(this).val($(this).val().replace(/[^a-z0-9 ]/gi,''));
        if ($(this).val().length >= 35) {
            $(this).val($(this).val().substring(0, 35));
            console.log('whoops');
        }

        socket.emit("live type", $('#spudtb').val());
    })

    $('#spudform').submit(function(e) {
        /* Prevent page reloading */
        e.preventDefault();

        var spudText =  $('#spudtb').val();

        // check for blank value 
        if (spudText.length === 0 || spudText.match(/^ *$/) !== null) {
            socket.emit('pass turn');
        } else {
            console.log("Spud form submitted");
            socket.emit('spud submit', spudText);
        }
        $('#spudform').css('opacity', '0', function() {
            $(this).css('visibilty', 'hidden');
        })
    });

    $('#voteform').submit(function(e) {
        /* Prevent page reloading */
        e.preventDefault();
    })

    $('.vote-btn').on('click', function() {

        /* Report vote to server */
        if ($(this).hasClass('voteyes-btn')) socket.emit('vote', 'yes');
        else if ($(this).hasClass('voteno-btn')) socket.emit('vote', 'no');
        else { return; }

        /* Hide voteform */
        $('#voteform').css('opacity', '0', function() {
            $(this).css('visibilty', 'hidden');
        })
    })

});

function setWordOne(text) {
    /*$(".wordsoneandtwo").fadeOut(200, function() {
        $('#word1').text(text);
    }).fadeIn(200);*/
    $('#word1').text(text);
}

function setWordTwo(text, color) {
    $('#word2').text(text);
    $('#word2').removeClass()
    $('#word2').addClass('word')
    $('#word2').addClass(color);
}

function typeTransition(element, text, time=text.length*100) {
    var len = text.length;
    
    for (let i = 0; i < len; i++) {
        setTimeout(function() {
            element.append(text.charAt(i));
        }, (time / len) * (i + 1));
    }
}

function setPhase(phaseNum) {
    for (var i = 0; i <= 2; i++)
        $('#phase' + i).hide();
    
    $('#phase' + phaseNum).show();

    /* Check if the Player is VIP, and toggle the UI appropriately */
    //console.log("me: " + game.me + " | vip: " + game.vip);
    checkVipUi();
}

function checkVipUi() {
    if (game.me == game.vip) $('.vip-only').show();
    else $('.vip-only').hide();
}