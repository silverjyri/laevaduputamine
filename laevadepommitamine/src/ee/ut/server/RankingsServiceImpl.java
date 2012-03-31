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

	@Override
	public List<String> getRankingsList() {
		Database.ensure();
		List<String> list = new ArrayList<String>();
		Connection conn;

		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();
			ResultSet resultSet = sta.executeQuery("SELECT Name, Score FROM Rankings");
			while (resultSet.next()) {
				String name = resultSet.getString(1);
				Integer score = resultSet.getInt(2);
				list.add(name + score.toString());
				sta.executeUpdate("UPDATE Rankings SET Score=" + Integer.toString(score + 10) + " WHERE Name='" + name + "'");
			}
			sta.close();
			conn.close();
			
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return list;
	}
}
