package ee.ut.server;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;

import ee.ut.client.RankingsService;

public class RankingsServiceImpl extends RemoteServiceServlet implements RankingsService {
	private static final long serialVersionUID = 1L;
	private static int rankingsVersion = 1;
	
	@Override
	public List<String> getRankingsList() {
		Database.ensure();
		List<String> list = new ArrayList<String>();
		Connection conn;

		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();
			ResultSet resultSet = sta.executeQuery("SELECT Name, Victories, Defeats, ID FROM Players");
			while (resultSet.next()) {
				String name = resultSet.getString(1);
				Integer victories = resultSet.getInt(2);
				Integer defeats = resultSet.getInt(3);
				Integer playerId = resultSet.getInt(4);
				float total = victories + defeats;
				int ratio = (int)((victories / total) * 100.0f);
				list.add(name + " (" + victories.toString() + "/" + defeats.toString() + " " + Integer.toString(ratio) + "%)");
				sta.executeUpdate("UPDATE Players SET Victories=" + Integer.toString(victories + 1) + " WHERE ID='" + playerId + "'");
				rankingsVersion++;
			}
			sta.close();
			conn.close();
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return list;
	}

	@Override
	public Integer getRankingsVersion() {
		return rankingsVersion;
	}
}
