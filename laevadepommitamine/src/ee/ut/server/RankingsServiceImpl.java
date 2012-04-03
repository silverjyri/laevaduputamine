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
			ResultSet resultSet = sta.executeQuery("SELECT Players.name, Score, Player FROM Rankings INNER JOIN Players ON Rankings.Player = Players.ID");
			while (resultSet.next()) {
				String name = resultSet.getString(1);
				Integer score = resultSet.getInt(2);
				Integer playerId = resultSet.getInt(3);
				list.add(name + ' ' + score.toString());
				sta.executeUpdate("UPDATE Rankings SET Score=" + Integer.toString(score + 10) + " WHERE Player='" + playerId + "'");
				rankingsVersion++;
			}
			sta.close();
			conn.close();
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return list;
	}

	public void setRanking() {
		
	}

	@Override
	public Integer getRankingsVersion() {
		return rankingsVersion;
	}
}
