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

	public native static void addGame(String game) /*-{
		$wnd.Client.lobby.addGame(game);
	}-*/;

	public native static void clearGames() /*-{
		$wnd.Client.lobby.gamesList.clear();
	}-*/;

	public native static void addRanking(String ranking) /*-{
		$wnd.Client.rankings.rankingsList.add(ranking);
	}-*/;

	public native static void clearRankings() /*-{
		$wnd.Client.rankings.rankingsList.clear();
	}-*/;

	public native static void setPlayerName(String name) /*-{
		$wnd.Client.lobby.initialize(name);
	}-*/;

	public native static void remoteMoveResult(int[] bomb) /*-{
		$wnd.Client.game.remoteMoveResult({x: bomb[0], y: bomb[1]});
	}-*/;

	public native static void setGameId(int id) /*-{
		$wnd.Client.placement.gameId = id;
	}-*/;

	public static void createGame(String playerName)
	{
		gameService.createGame(playerName, new AsyncCallback<Integer>() {
			public void onFailure(Throwable caught) {
				Window.alert("RPC failed.");
			}

			public void onSuccess(Integer gameId) {
				setGameId(gameId);
			}
		});
	}

	public static void getGamesList()
	{
		gameService.getGamesList(new AsyncCallback<List<String>>() {
			public void onFailure(Throwable caught) {
				Window.alert("RPC failed.");
			}

			public void onSuccess(List<String> result) {
				clearGames();
				for (String game : result) {
					addGame(game);
				}
			}
		});
	}

	public static void getUniquePlayerName()
	{
		gameService.getUniquePlayerName(new AsyncCallback<String>() {
			public void onFailure(Throwable caught) {
				Window.alert("RPC failed.");
			}

			public void onSuccess(String result) {
				setPlayerName(result);
			}
		});
	}
	
	public static void getRankingsList()
	{
		rankingsService.getRankingsList(new AsyncCallback<List<String>>() {
			public void onFailure(Throwable caught) {
				Window.alert("RPC failed.");
			}

			public void onSuccess(List<String> result) {
				clearRankings();
				for (String ranking : result) {
					addRanking(ranking);
				}
			}
		});
	}

	public static void remoteMove(int gameId)
	{
		gameService.remoteMove(gameId, new AsyncCallback<int[]>() {
			public void onFailure(Throwable caught) {
				Window.alert("RPC failed.");
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
				Window.alert("RPC failed.");
			}

			@Override
			public void onSuccess(Void result) {
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
		$wnd.Server.getRankingsList = $entry(@ee.ut.client.Laevadepommitamine::getRankingsList());
		$wnd.Server.remoteMove = $entry(@ee.ut.client.Laevadepommitamine::remoteMove(I));
		$wnd.Server.startGame = $entry(@ee.ut.client.Laevadepommitamine::startGame(ILjava/lang/String;));
	}-*/;

	public void onModuleLoad() {
		exportMethods();
	}
}
