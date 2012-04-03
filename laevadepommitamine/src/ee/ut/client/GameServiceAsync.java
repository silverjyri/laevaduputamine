package ee.ut.client;

import java.util.List;

import com.google.gwt.user.client.rpc.AsyncCallback;

public interface GameServiceAsync {
	public void createGame(String playerName, AsyncCallback<Integer> callback);
	public void getGamesList(AsyncCallback<List<String>> callback);
	public void getUniquePlayerName(AsyncCallback<String> callback);
	public void remoteMove(int gameId, AsyncCallback<int[]> callback);
	public void startGame(int gameId, String fieldEnc, AsyncCallback<Void> callback);
}
