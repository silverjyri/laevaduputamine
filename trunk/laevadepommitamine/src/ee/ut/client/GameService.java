package ee.ut.client;

import java.util.List;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;

@RemoteServiceRelativePath("game")
public interface GameService extends RemoteService {
	public Integer createGame(String playerName);
	public List<String> getGamesList();
	public String getUniquePlayerName();
	public int[] remoteMove(int gameId);
	public void startGame(int gameId, String fieldEnc);
}
