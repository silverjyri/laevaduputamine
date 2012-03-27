package ee.ut.server;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.hsqldb.jdbc.JDBCDriver;

public class Database {
	
	public static final String DRIVER = "org.hsqldb.jdbc.JDBCDriver";
	public static JDBCDriver instance = null;
	public static final String PROTOCOL = "jdbc:hsqldb:mem:myDb";
	
	public static void ensure() {
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
		return DriverManager.getConnection(PROTOCOL);
		//return instance.connect(PROTOCOL, null);
	}
}
