package ee.ut.client;

import java.util.List;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;

@RemoteServiceRelativePath("game")
public interface GameService extends RemoteService {
	public Integer createGame(String playerName);
	public boolean joinGame(int gameId, String playerName);
	public List<Game> getActiveGamesList();
	public List<Game> getFinishedGamesList();
	public String[] getGamePlayers(int gameId);
	public String getUniquePlayerName();
	public boolean isOpponentReady(int gameId, boolean isOpponent);
	public boolean playerMove(int gameId, boolean isOpponent, int x, int y);
	public int[] remoteMove(int gameId, boolean isOpponent);
	public boolean startGame(int gameId, String playerType, String fieldEnc);
	public void quitGame(int gameId, boolean isOpponent);
	public Integer getGamesListVersion();
}
