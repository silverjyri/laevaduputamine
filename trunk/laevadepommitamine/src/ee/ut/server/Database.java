package ee.ut.server;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.hsqldb.jdbc.JDBCDriver;

public class Database {
	
	public static final String DRIVER = "org.hsqldb.jdbc.JDBCDriver";
	public static JDBCDriver instance = null;
	public static final String PROTOCOL = "jdbc:hsqldb:mem:myDb";
	
	public static void storeTestData(Connection conn) throws SQLException {
		Statement sta = conn.createStatement();
		sta.executeUpdate("INSERT INTO Games (name) VALUES ('Andres vs. P&auml;tris')");
		sta.executeUpdate("INSERT INTO Games (name) VALUES ('Silver vs. AI')");
		sta.executeUpdate("INSERT INTO Rankings (name, score) VALUES ('Silver', 100)");
		sta.executeUpdate("INSERT INTO Rankings (name, score) VALUES ('Andres', 50)");
		sta.executeUpdate("INSERT INTO Players (name) VALUES ('Silver')");
		sta.executeUpdate("INSERT INTO Players (name) VALUES ('Andres')");
		sta.close();
	}
	
	public synchronized static void ensure() {
		if (instance == null) {
			try {
				instance = (JDBCDriver) Class.forName(DRIVER).newInstance();

				Connection conn = getConnection();
				if (!tableExists(conn, "Games")) {
					Statement sta = conn.createStatement();
					sta.executeUpdate("CREATE TABLE Games ("
							+ "ID INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,"
							+ "Name char(50))");
					sta.executeUpdate("CREATE TABLE Rankings ("
							+ "ID INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,"
							+ "Name char(50),"
							+ "Score INTEGER)");
					sta.executeUpdate("CREATE TABLE Players ("
							+ "ID INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,"
							+ "Name char(50))");
					sta.close();
					storeTestData(conn);
				}
				conn.close();
			} catch (InstantiationException e) {
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (ClassNotFoundException e) {
				e.printStackTrace();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}
	}
	
	public static boolean tableExists(Connection conn, String name) {
		ResultSet tables;
		try {
			tables = conn.getMetaData().getTables(conn.getCatalog(), null, "%", null);
			while(tables.next()) {
				if (tables.getString(3).equalsIgnoreCase(name)) {
					return true;
				}
			}
		} catch (SQLException e) {
			return false;
		}
		
		return false;
	}
	
	public static Connection getConnection() throws SQLException {
		return instance.connect(PROTOCOL, null);
	}
}
