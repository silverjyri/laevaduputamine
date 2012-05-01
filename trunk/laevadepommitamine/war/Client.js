Client = {};
window.Client = Client;

if (!window.Server) {
	window.Server = {};
}
Server = window.Server;

Client.rand = function(n) {
	return Math.floor(Math.random() * (n + 1));
};

Client.isString = function(value) {
	return typeof value === 'string';
};

Client.sizeOf = function(obj) {
	var size = 0, key;
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			size++;
	}
	return size;
};

Client.playSound = function(sound) {
	var id = 'sound_' + sound;
	if (!Client[id]) {
		if (!Modernizr.audio.mp3 && !Modernizr.audio.ogg) {
			Client[id] = $('<embed src="sound/' + sound + '.mp3" hidden="true" autostart="true" loop="false" /');
		} else {
			Client[id] = $('<audio id="' + id + '">' +
				'<source src="sound/' + sound + '.ogg" type="audio/ogg" />' +
				'<source src="sound/' + sound + '.mp3" type="audio/mp3" /></audio>');
		}
		$('#sounds').append(Client[id]);
	}
	var soundEl = Client[id][0];
	soundEl.load();
	soundEl.play();
};

Client.setScreen = function(screen) {
	if (this.screen && this.screen.onHide) {
		this.screen.onHide();
	}
	this.screen = screen;
	$("#screen_container").html(this.screen.render());
	this.screen.onRender();
};

Client.startLobby = function() {
	this.lobby = this.lobby || new Lobby();
	this.setScreen(this.lobby);
};

Client.startPlacement = function() {
	if (!this.placement) {
		var username;
		if (this.lobby) {
			this.lobby.username.setEnabled(false);
			username = this.lobby.username.getText();
		}
		this.player = new LocalPlayer(username, Client.gameId != undefined);
		this.placement = new Placement();
	}
	this.setScreen(this.placement);
};

Client.startGame = function() {
	if (!this.game) {
		var ai = this.placement.opponentList.selected === this.placement.aiOpponentItem;
		this.opponent = new WebPlayer(ai ? "AI" : this.placement.webOpponentItem.value, !this.player.isOpponent);
		var playerType = this.player.isOpponent ? 'opponent' : (ai ? 'againstai' : 'player');
		this.game = new Game(playerType);
		delete this.placement;
	}
	this.setScreen(this.game);
};

Client.stopGame = function() {
	if (this.lobby) {
		this.lobby.username.setEnabled(true);
		if (this.lobby.joinBtn) {
			this.lobby.joinBtn.setEnabled(true);
		}
	}
	delete this.placement;
	delete this.game;
	delete this.gameId;
	delete this.player;
	delete this.opponent;
	Client.startLobby();
};

Client.startRankings = function() {
	this.rankings = this.rankings || new Rankings();
	this.setScreen(this.rankings);
};

Client.startHistory = function() {
	this.history = this.history || new History();
	this.setScreen(this.history);
};

Client.startReplay = function(gameId) {
	if (!this.replay || this.replay.gameId != gameId) {
		this.replay = new Replay(gameId);
	}
	this.setScreen(this.replay);
};

Client.getGameReplayData = function(gameId) {
	if (Modernizr.localstorage) {
		this.replayGameId = gameId;
		Server.getGameReplayData(gameId);
	}
};

Client.getGameReplayDataCallback = function(player, opponent, playerField, opponentField, moveHistory, playerStarts) {
	if (this.replayGameId == undefined) {
		return;
	}
	var data = {player: player, opponent: opponent, playerField: playerField, opponentField: opponentField,
		moveHistory: moveHistory, playerStarts: playerStarts}
	localStorage.setItem('history' + this.replayGameId, JSON.stringify(data));
	if (this.replay) {
		this.replay.setReplayData(data);
	}
	delete this.replayGameId;
};

Client.fbLogout = function() {
	FB.logout(function (response) {
    });
	Client.fbStatus(false);
};

Client.fbStatus = function(logged_in) {
	var lobby = Client.lobby;
	if (logged_in) {
		if (lobby) {
			lobby.fb_loginbtn.hide();
			lobby.fb_logoutbtn.show();
		}
		FB.api('/me', function(response) {
			Client.fb_username = response.name;
			if (lobby) {
				lobby.username.setText(response.name);
				lobby.username.setEnabled(false);
			}
		});
	} else {
		delete Client.fb_username;
		if (lobby) {
			lobby.fb_loginbtn.show();
			lobby.fb_logoutbtn.hide();
			lobby.username.setEnabled(true);
		}
	}
	FB.XFBML.parse(document.getElementById('.fb-button'));
};

$LAB
.script("ui/components/Button.js")
.script("ui/components/ListItem.js")
.script("ui/components/Menu.js")
.script("ui/components/TextField.js").wait()
.script("ui/components/ListBox.js").wait()
.script("Lobby.js").wait(function() {
	Client.startLobby();
})
.script('//connect.facebook.net/en_US/all.js').wait(function() {
	FB.init({
		appId: '355620854495125',
		status: true, 
		cookie: true,
		xfbml: true,
		oauth: true
	});
	FB.getLoginStatus(function(response) {
		var lobby = Client.lobby;
		if (!lobby)
			return;
		var fb_loginbtn = $('<div class="fb-login-button">Logi sisse</div>');
		var fb_logoutbtn = $('<span onclick="Client.fbLogout()"><a class="fb_button fb_button_medium"><span class="fb_button_text">Logi v&auml;lja</span></a></span>');
		var css = {'float': 'right', 'padding-right': '195px'};
		fb_loginbtn.css(css);
		fb_logoutbtn.css(css);
		fb_loginbtn.insertBefore(lobby.gamesList.el);
		fb_logoutbtn.insertBefore(lobby.gamesList.el);
		lobby.fb_loginbtn = fb_loginbtn;
		lobby.fb_logoutbtn = fb_logoutbtn;
		Client.fbStatus(response.status === 'connected');
	});
	FB.Event.subscribe('auth.login',
	    function(response) {
			Client.fbStatus(true);
	    }
	);
})
.script("model/Field.js")
.script("ui/ShipFloating.js")
.script("Placement.js")
.script("ui/FieldView.js")
.script("controller/LocalPlayer.js")
.script("controller/WebPlayer.js").wait(function() {
	//Client.startPlacement();
})
.script("Game.js")
.script("Rankings.js")
.script("History.js")
.script("Replay.js");
