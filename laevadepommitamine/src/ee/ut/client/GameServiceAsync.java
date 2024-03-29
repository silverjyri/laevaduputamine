package ee.ut.client;

import java.util.List;

import com.google.gwt.user.client.rpc.AsyncCallback;

public interface GameServiceAsync {
	public void createGame(String playerName, AsyncCallback<Integer> callback);
	public void getActiveGamesList(AsyncCallback<List<Game>> callback);
	public void getFinishedGamesList(AsyncCallback<List<Game>> callback);
	public void getGamePlayers(int gameId, AsyncCallback<String[]> callback);
	public void getGameReplayData(int gameId, AsyncCallback<String[]> callback);
	public void getUniquePlayerName(AsyncCallback<String> callback);
	public void joinGame(int gameId, String playerName, AsyncCallback<Boolean> callback);
	public void isOpponentReady(int gameId, boolean isOpponent, AsyncCallback<Boolean> callback);
	public void playerMove(int gameId, boolean isOpponent, int x, int y, AsyncCallback<boolean[]> callback);
	public void remoteMove(int gameId, boolean isOpponent, AsyncCallback<int[]> callback);
	public void startGame(int gameId, String playerType, String fieldEnc, AsyncCallback<Boolean> callback);
	public void quitGame(int gameId, boolean isOpponent, AsyncCallback<Void> callback);
	public void getGamesListVersion(AsyncCallback<Integer> callback);
}
