package ee.ut.server;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;

import ee.ut.client.GameService;

public class GameServiceImpl extends RemoteServiceServlet implements GameService {
	private static final long serialVersionUID = 1L;
	
	@Override
	public void createGame() {
		Database.ensure();
		Connection conn;
		try {
			conn = Database.getConnection();

			Statement sta = conn.createStatement();
			sta.executeUpdate("INSERT INTO Games (name) VALUES ('Mari ootab...')");
			sta.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public List<String> getGamesList() {
		Database.ensure();
		List<String> list = new ArrayList<String>();
		Connection conn;

		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();
			ResultSet resultSet = sta.executeQuery("SELECT Name FROM Games");
			while (resultSet.next()) {
				String name = resultSet.getString(1);
				list.add(name);
			}
			sta.close();

			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return list;
	}
}
