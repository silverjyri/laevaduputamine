package ee.ut.client;

import java.util.List;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;

@RemoteServiceRelativePath("game")
public interface GameService extends RemoteService {
	public Integer createGame(String playerName);
	public void joinGame(int gameId, String playerName);
	public List<Game> getGamesList();
	public String[] getGamePlayers(int gameId);
	public String getUniquePlayerName();
	public int[] remoteMove(int gameId);
	public void startGame(int gameId, String fieldEnc);
	public Integer getGamesListVersion();
}
