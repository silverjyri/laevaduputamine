package ee.ut.client;

import com.google.gwt.user.client.rpc.AsyncCallback;

public interface GameServiceAsync {
	public void getString(AsyncCallback<String> callback);
}
