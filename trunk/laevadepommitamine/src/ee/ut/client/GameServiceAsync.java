package ee.ut.client;

import java.util.List;

import com.google.gwt.user.client.rpc.AsyncCallback;

public interface GameServiceAsync {
	public void getString(AsyncCallback<String> callback);
	public void getGamesList(AsyncCallback<List<String>> callback);
}
