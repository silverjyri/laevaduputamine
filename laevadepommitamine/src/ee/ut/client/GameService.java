package ee.ut.client;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;

@RemoteServiceRelativePath("game")
public interface GameService extends RemoteService {
	public String getString();
}
