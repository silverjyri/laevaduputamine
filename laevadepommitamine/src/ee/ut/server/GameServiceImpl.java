package ee.ut.server;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.hsqldb.jdbc.JDBCDriver;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;

import ee.ut.client.GameService;

public class GameServiceImpl extends RemoteServiceServlet implements GameService {
	private static final long serialVersionUID = 1L;

	public static final String DRIVER = "org.hsqldb.jdbc.JDBCDriver";
	public static JDBCDriver instance = null;
	public static final String PROTOCOL = "jdbc:hsqldb:mem:myDb";
	
	public static void ensureDatabase() {
		if (instance == null) {
			try {
				instance = (JDBCDriver) Class.forName(DRIVER).newInstance();
			} catch (InstantiationException e) {
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (ClassNotFoundException e) {
				e.printStackTrace();
			}
		}
	}
	
	@Override
	public void createGame() {
		Database.ensure();
		Connection conn;
		try {
			conn = Database.getConnection();

			Statement sta = conn.createStatement();
			sta.executeUpdate("INSERT INTO Games VALUES (3, 'Mari vs. Helen')");
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
			if (!Database.tableExists(conn, "Games")) {
				sta.executeUpdate("CREATE TABLE Games ("
						+ " ID INTEGER PRIMARY KEY,"
						+ "Name char(50))");
				sta.executeUpdate("INSERT INTO Games VALUES (1, 'Andres vs. P&auml;tris')");
				sta.executeUpdate("INSERT INTO Games VALUES (2, 'Silver vs. AI')");
			}
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
