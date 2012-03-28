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

	public static void createGame()
	{
		gameService.createGame(new AsyncCallback<Void>() {
			public void onFailure(Throwable caught) {
				Window.alert("RPC failed.");
			}

			public void onSuccess(Void result) {
			}
		});
	}

	public native static void addGame(String game) /*-{
		$wnd.Client.lobby.gamesList.add(game);
	}-*/;

	public native static void addRanking(String ranking) /*-{
		$wnd.Client.rankings.rankingsList.add(ranking);
	}-*/;

	public static void getGamesList()
	{
		gameService.getGamesList(new AsyncCallback<List<String>>() {
			public void onFailure(Throwable caught) {
				Window.alert("RPC failed.");
			}

			public void onSuccess(List<String> result) {
				for (String game : result) {
					addGame(game);
				}
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
				for (String ranking : result) {
					addRanking(ranking);
				}
			}
		});
	}

	public native void exportMethods() /*-{
		$wnd.createGame = $entry(@ee.ut.client.Laevadepommitamine::createGame());
		$wnd.getGamesList = $entry(@ee.ut.client.Laevadepommitamine::getGamesList());
		$wnd.getRankingsList = $entry(@ee.ut.client.Laevadepommitamine::getRankingsList());
	}-*/;

	public void onModuleLoad() {
		exportMethods();
	}
}
