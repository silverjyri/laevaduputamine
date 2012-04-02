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

	public static void createGame(String playerName)
	{
		gameService.createGame(playerName, new AsyncCallback<Void>() {
			public void onFailure(Throwable caught) {
				Window.alert("RPC failed.");
			}

			public void onSuccess(Void result) {
			}
		});
	}

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
		$wnd.Client.lobby.username.setText(name);
	}-*/;
	
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

	public native void exportMethods() /*-{
		if (!$wnd.Server) {
			$wnd.Server = {};
		}
		$wnd.Server.createGame = $entry(@ee.ut.client.Laevadepommitamine::createGame(Ljava/lang/String;));
		$wnd.Server.getGamesList = $entry(@ee.ut.client.Laevadepommitamine::getGamesList());
		$wnd.Server.getUniquePlayerName = $entry(@ee.ut.client.Laevadepommitamine::getUniquePlayerName());
		$wnd.Server.getRankingsList = $entry(@ee.ut.client.Laevadepommitamine::getRankingsList());
	}-*/;

	public void onModuleLoad() {
		exportMethods();
	}
}
