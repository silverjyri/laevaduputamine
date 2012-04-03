package ee.ut.client;

import java.util.List;

import com.google.gwt.user.client.rpc.RemoteService;
import com.google.gwt.user.client.rpc.RemoteServiceRelativePath;

@RemoteServiceRelativePath("rankings")
public interface RankingsService extends RemoteService {
	public List<String> getRankingsList();
	public Integer getRankingsVersion();
}
