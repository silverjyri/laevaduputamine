package ee.ut.client;

import java.util.List;

import com.google.gwt.user.client.rpc.AsyncCallback;

public interface GameServiceAsync {
	public void createGame(AsyncCallback<Void> callback);
	public void getGamesList(AsyncCallback<List<String>> callback);
}
