package ee.ut.client;

import java.util.List;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.rpc.AsyncCallback;

public class Laevadepommitamine implements EntryPoint {

	private static final GameServiceAsync gameService = (GameServiceAsync) GWT
			.create(GameService.class);
	private static final RankingsServiceAsync rankingsService = (RankingsServiceAsync) GWT
			.create(RankingsService.class);

	public native static void addGame(int id, String name) /*-{
		$wnd.Client.lobby.addGame(id, name);
	}-*/;

	public native static void addGameAndSelect(int id, String name) /*-{
		$wnd.Client.lobby.addGame(id, name, true);
	}-*/;
	
	public native static int clearGames() /*-{
		var list = $wnd.Client.lobby.gamesList;
		var selectedId = list.selected ? list.selected.value : -1;
		list.clear();
		return selectedId;
	}-*/;

	public native static void isOpponentReadyCallback(boolean result) /*-{
		$wnd.Client.game.isOpponentReadyCallback(result);
	}-*/;

	public native static void isOpponentMoveReadyCallback(boolean result) /*-{
		$wnd.Client.game.isOpponentMoveReadyCallback(result);
	}-*/;

	public native static void setPlayerName(String name) /*-{
		$wnd.Client.lobby.initialize(name);
	}-*/;

	public native static void playerMoveResult(boolean hit) /*-{
		$wnd.Client.player.moveResult(hit);
	}-*/;

	public native static void remoteMoveResult(int[] bomb) /*-{
		$wnd.Client.opponent.moveResult({x: bomb[0], y: bomb[1]});
	}-*/;

	public native static void addRanking(String ranking) /*-{
		$wnd.Client.rankings.rankingsList.add(ranking);
	}-*/;

	public native static void clearRankings() /*-{
		$wnd.Client.rankings.rankingsList.clear();
	}-*/;

	public native static int getGamesListVersion() /*-{
		return $wnd.Client.lobby.gamesListVersion;
	}-*/;

	public native static void getGamePlayersCallback(String player, String opponent) /*-{
		if ($wnd.Client.placement) {
			$wnd.Client.placement.getPlayersCallback(player, opponent);
		}
	}-*/;
	
	public native static int getRankingsVersion() /*-{
		return $wnd.Client.rankings.version;
	}-*/;

	public native static void setGamesListVersion(int version) /*-{
		$wnd.Client.lobby.gamesListVersion = version;
	}-*/;

	public native static void setRankingsVersion(int version) /*-{
		$wnd.Client.rankings.version = version;
	}-*/;

	public native static void gameCreated(int gameId) /*-{
		$wnd.Client.placement.gameCreated(gameId);
	}-*/;

	public native static void gameStarted(boolean firstMove) /*-{
		$wnd.Client.game.gameStarted(firstMove);
	}-*/;

	public native static void gameJoined(boolean successful) /*-{
		$wnd.Client.placement.gameJoined(successful);
	}-*/;

	public native static void consoleError(String msg) /*-{
		console.error(msg);
		$wnd.Client.screen.updateInterval = 10000;
		if ($wnd.Client.screen === $wnd.Client.lobby) {
			$wnd.Client.lobby.username.setError("Viga: " + msg);
		}
	}-*/;

	public static void createGame(String playerName)
	{
		gameService.createGame(playerName, new AsyncCallback<Integer>() {
			public void onFailure(Throwable caught) {
				Window.alert("createGame RPC failed.");
				caught.printStackTrace();
			}

			public void onSuccess(Integer gameId) {
				gameCreated(gameId);
			}
		});
	}

	public static void getGamesList()
	{
		gameService.getGamesListVersion(new AsyncCallback<Integer>() {
			public void onFailure(Throwable caught) {
				consoleError("getGamesListVersion RPC failed.");
			}

			public void onSuccess(Integer version) {
				if (version == getGamesListVersion()) {
					return;
				}
				setGamesListVersion(version);

				gameService.getGamesList(new AsyncCallback<List<Game>>() {
					public void onFailure(Throwable caught) {
						consoleError("getGamesList RPC failed.");
					}
		
					public void onSuccess(List<Game> result) {
						int selected = clearGames();
						for (Game game : result) {
							int id = game.getId();
							if (id == selected) {
								addGameAndSelect(id, game.getName());
							} else {
								addGame(id, game.getName());
							}
						}
					}
				});
			}
		});
	}

	public static void getGamePlayers(int gameId)
	{
		gameService.getGamePlayers(gameId, new AsyncCallback<String[]>() {
			public void onFailure(Throwable caught) {
				Window.alert("getGamePlayers RPC failed.");
			}

			public void onSuccess(String[] players) {
				getGamePlayersCallback(players[0], players[1]);
			}
		});
	}

	public static void getUniquePlayerName()
	{
		gameService.getUniquePlayerName(new AsyncCallback<String>() {
			public void onFailure(Throwable caught) {
				consoleError("getUniquePlayerName RPC failed.");
			}

			public void onSuccess(String result) {
				setPlayerName(result);
			}
		});
	}
	
	public static void getRankingsList()
	{
		rankingsService.getRankingsVersion(new AsyncCallback<Integer>() {
			public void onFailure(Throwable caught) {
				Window.alert("RPC failed.");
				caught.printStackTrace();
			}

			public void onSuccess(Integer version) {
				if (version == getRankingsVersion()) {
					return;
				}
				setRankingsVersion(version);

				rankingsService.getRankingsList(new AsyncCallback<List<String>>() {
					public void onFailure(Throwable caught) {
						Window.alert("RPC failed.");
						caught.printStackTrace();
					}

					public void onSuccess(List<String> result) {
						clearRankings();
						for (String ranking : result) {
							addRanking(ranking);
						}
					}
				});
			}
		});
	}

	public static void isOpponentReady(int gameId, boolean isOpponent)
	{
		gameService.isOpponentReady(gameId, isOpponent, new AsyncCallback<Boolean>() {
			public void onFailure(Throwable caught) {
				Window.alert("isOpponentReady RPC failed.");
			}

			public void onSuccess(Boolean result) {
				isOpponentReadyCallback(result);
			}
		});
	}

	public static void joinGame(int gameId, String playerName)
	{
		gameService.joinGame(gameId, playerName, new AsyncCallback<Boolean>() {
			public void onFailure(Throwable caught) {
				Window.alert("joinGame RPC failed. " + caught.getMessage());
			}

			public void onSuccess(Boolean successful) {
				gameJoined(successful);
			}
		});
	}

	public static void playerMove(int gameId, boolean isOpponent, int x, int y)
	{
		gameService.playerMove(gameId, isOpponent, x, y, new AsyncCallback<Boolean>() {
			public void onFailure(Throwable caught) {
				Window.alert("playerMove RPC failed. " + caught.getMessage());
			}

			public void onSuccess(Boolean result) {
				playerMoveResult(result);
			}
		});
	}

	public static void remoteMove(int gameId, boolean isOpponent)
	{
		gameService.remoteMove(gameId, isOpponent, new AsyncCallback<int[]>() {
			public void onFailure(Throwable caught) {
				Window.alert("remoteMove RPC failed. " + caught.getMessage());
				caught.printStackTrace();
			}

			public void onSuccess(int[] result) {
				remoteMoveResult(result);
			}
		});
	}

	public static void startGame(int gameId, String playerType, String fieldEnc)
	{
		gameService.startGame(gameId, playerType, fieldEnc, new AsyncCallback<Boolean>() {
			public void onFailure(Throwable caught) {
				Window.alert("startGame RPC failed. " + caught.getMessage());
				caught.printStackTrace();
			}

			@Override
			public void onSuccess(Boolean result) {
				gameStarted(result);
			}
		});
	}

	public native void exportMethods() /*-{
		if (!$wnd.Server) {
			$wnd.Server = {};
		}
		$wnd.Server.createGame = $entry(@ee.ut.client.Laevadepommitamine::createGame(Ljava/lang/String;));
		$wnd.Server.getGamesList = $entry(@ee.ut.client.Laevadepommitamine::getGamesList());
		$wnd.Server.getGamePlayers = $entry(@ee.ut.client.Laevadepommitamine::getGamePlayers(I));
		$wnd.Server.getUniquePlayerName = $entry(@ee.ut.client.Laevadepommitamine::getUniquePlayerName());
		$wnd.Server.isOpponentReady = $entry(@ee.ut.client.Laevadepommitamine::isOpponentReady(IZ));
		$wnd.Server.joinGame = $entry(@ee.ut.client.Laevadepommitamine::joinGame(ILjava/lang/String;));
		$wnd.Server.playerMove = $entry(@ee.ut.client.Laevadepommitamine::playerMove(IZII));
		$wnd.Server.remoteMove = $entry(@ee.ut.client.Laevadepommitamine::remoteMove(IZ));
		$wnd.Server.startGame = $entry(@ee.ut.client.Laevadepommitamine::startGame(ILjava/lang/String;Ljava/lang/String;));

		$wnd.Server.getRankingsList = $entry(@ee.ut.client.Laevadepommitamine::getRankingsList());
	}-*/;

	public void onModuleLoad() {
		exportMethods();
	}
}
