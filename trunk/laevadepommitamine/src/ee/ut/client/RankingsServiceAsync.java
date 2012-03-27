package ee.ut.client;

import java.util.List;

import com.google.gwt.user.client.rpc.AsyncCallback;

public interface RankingsServiceAsync {
	public void getRankingsList(AsyncCallback<List<String>> callback);
}
