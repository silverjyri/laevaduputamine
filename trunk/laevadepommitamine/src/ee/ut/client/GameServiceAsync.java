package ee.ut.client;

import java.util.List;

import com.google.gwt.user.client.rpc.AsyncCallback;

public interface GameServiceAsync {
	public void createGame(String playerName, AsyncCallback<Integer> callback);
	public void getGamesList(AsyncCallback<List<Game>> callback);
	public void getGamePlayers(int gameId, AsyncCallback<String[]> callback);
	public void getUniquePlayerName(AsyncCallback<String> callback);
	public void joinGame(int gameId, String playerName, AsyncCallback<Void> callback);
	public void remoteMove(int gameId, AsyncCallback<int[]> callback);
	public void startGame(int gameId, String fieldEnc, AsyncCallback<Void> callback);
	public void getGamesListVersion(AsyncCallback<Integer> callback);
}
