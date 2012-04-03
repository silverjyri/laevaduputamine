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

	public native static void clearGames() /*-{
		$wnd.Client.lobby.gamesList.clear();
	}-*/;

	public native static void setPlayerName(String name) /*-{
		$wnd.Client.lobby.initialize(name);
	}-*/;

	public native static void remoteMoveResult(int[] bomb) /*-{
		$wnd.Client.game.remoteMoveResult({x: bomb[0], y: bomb[1]});
	}-*/;

	public native static void addRanking(String ranking) /*-{
		$wnd.Client.rankings.rankingsList.add(ranking);
	}-*/;

	public native static void clearRankings() /*-{
		$wnd.Client.rankings.rankingsList.clear();
	}-*/;

	public native static int getRankingsVersion() /*-{
		return $wnd.Client.rankings.version;
	}-*/;

	public native static void gameCreated(int gameId) /*-{
		$wnd.Client.placement.gameCreated(gameId);
	}-*/;

	public native static void gameStarted() /*-{
		$wnd.Client.game.gameStarted();
	}-*/;

	public native static void gameJoined() /*-{
		$wnd.Client.placement.gameJoined();
	}-*/;

	public static void createGame(String playerName)
	{
		gameService.createGame(playerName, new AsyncCallback<Integer>() {
			public void onFailure(Throwable caught) {
				Window.alert("createGame RPC failed. " + caught.getMessage());
				caught.printStackTrace();
			}

			public void onSuccess(Integer gameId) {
				gameCreated(gameId);
			}
		});
	}

	public static void doPeriodicUpdate(String screenName) {
		
	}

	public static void getGamesList()
	{
		gameService.getGamesList(new AsyncCallback<List<Game>>() {
			public void onFailure(Throwable caught) {
				Window.alert("getGamesList RPC failed. " + caught.getMessage());
				caught.printStackTrace();
			}

			public void onSuccess(List<Game> result) {
				clearGames();
				for (Game game : result) {
					addGame(game.getId(), game.getName());
				}
			}
		});
	}

	public static void getUniquePlayerName()
	{
		gameService.getUniquePlayerName(new AsyncCallback<String>() {
			public void onFailure(Throwable caught) {
				Window.alert("getUniquePlayerName RPC failed. " + caught.getMessage());
				caught.printStackTrace();
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

	public static void joinGame(int gameId, String playerName)
	{
		gameService.joinGame(gameId, playerName, new AsyncCallback<Void>() {
			public void onFailure(Throwable caught) {
				Window.alert("joinGame RPC failed. " + caught.getMessage());
				caught.printStackTrace();
			}

			public void onSuccess(Void result) {
				gameJoined();
			}
		});
	}

	public static void remoteMove(int gameId)
	{
		gameService.remoteMove(gameId, new AsyncCallback<int[]>() {
			public void onFailure(Throwable caught) {
				Window.alert("remoteMove RPC failed. " + caught.getMessage());
				caught.printStackTrace();
			}

			public void onSuccess(int[] result) {
				remoteMoveResult(result);
			}
		});
	}

	public static void startGame(int gameId, String fieldEnd)
	{
		gameService.startGame(gameId, fieldEnd, new AsyncCallback<Void>() {
			public void onFailure(Throwable caught) {
				Window.alert("startGame RPC failed. " + caught.getMessage());
				caught.printStackTrace();
			}

			@Override
			public void onSuccess(Void result) {
				gameStarted();
			}
		});
	}

	public native void exportMethods() /*-{
		if (!$wnd.Server) {
			$wnd.Server = {};
		}
		$wnd.Server.createGame = $entry(@ee.ut.client.Laevadepommitamine::createGame(Ljava/lang/String;));
		$wnd.Server.getGamesList = $entry(@ee.ut.client.Laevadepommitamine::getGamesList());
		$wnd.Server.getUniquePlayerName = $entry(@ee.ut.client.Laevadepommitamine::getUniquePlayerName());
		$wnd.Server.joinGame = $entry(@ee.ut.client.Laevadepommitamine::joinGame(ILjava/lang/String;));
		$wnd.Server.remoteMove = $entry(@ee.ut.client.Laevadepommitamine::remoteMove(I));
		$wnd.Server.startGame = $entry(@ee.ut.client.Laevadepommitamine::startGame(ILjava/lang/String;));
		$wnd.Server.doPeriodicUpdate = $entry(@ee.ut.client.Laevadepommitamine::doPeriodicUpdate(Ljava/lang/String;));

		$wnd.Server.getRankingsList = $entry(@ee.ut.client.Laevadepommitamine::getRankingsList());
	}-*/;

	public void onModuleLoad() {
		exportMethods();
	}
}
