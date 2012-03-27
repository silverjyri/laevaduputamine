package ee.ut.client;

import java.util.List;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.rpc.AsyncCallback;

public class Laevadepommitamine implements EntryPoint {

	private static final GameServiceAsync gameService = (GameServiceAsync) GWT
			.create(GameService.class);

	public static void createGame()
	{
		gameService.getString(new AsyncCallback<String>() {
			public void onFailure(Throwable caught) {
				Window.alert("RPC failed.");
			}

			public void onSuccess(String result) {
				Window.alert("RPC OK." + result);
			}
		});
	}

	public native static void addGame(String game) /*-{
		$wnd.Client.lobby.gamesList.add(game);
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

	public native void exportMethods() /*-{
		$wnd.createGame = $entry(@ee.ut.client.Laevadepommitamine::createGame());
		$wnd.getGamesList = $entry(@ee.ut.client.Laevadepommitamine::getGamesList());
	}-*/;

	public void onModuleLoad() {
		exportMethods();
	}
}
