package ee.ut.server;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
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
	

	public static java.io.OutputStream disableDerbyLogFile(){
	     return new java.io.OutputStream() {
	         public void write(int b) throws IOException {
	             // Ignore all log messages
	         }
	     };
	}
	
	@Override
	public String getString() {
		if (instance == null) {
			try {
				instance = (JDBCDriver) Class.forName(DRIVER).newInstance();
			} catch (InstantiationException e) {
				e.printStackTrace();
				return e.getMessage();
			} catch (IllegalAccessException e) {
				e.printStackTrace();
				return e.getMessage();
			} catch (ClassNotFoundException e) {
				e.printStackTrace();
				return e.getMessage();
			}
		}
		
		Connection conn;
		try {
			conn = DriverManager.getConnection(PROTOCOL);
			//conn = instance.connect(PROTOCOL, null);
			Statement sta = conn.createStatement();
			ResultSet tables = conn.getMetaData().getTables(conn.getCatalog(), null, "%", null);
			boolean exists = false;
			while(tables.next()) {
				if (tables.getString(3).equalsIgnoreCase("Edetabel")) {
					exists = true;
					break;
				}
			}
			if (!exists) {
				sta.executeUpdate("CREATE TABLE Edetabel ("
						+ " ID INTEGER PRIMARY KEY,"
						+ "Name char(50),"
						+ "Score INTEGER)");
				sta.executeUpdate("INSERT INTO Edetabel VALUES (1, 'Silver', 100)");
				sta.executeUpdate("INSERT INTO Edetabel VALUES (2, 'Andres', 50)");
			}
			ResultSet resultSet = sta.executeQuery("SELECT Name, Score FROM Edetabel");
			String list = "\nEdetabel:\n";
			while (resultSet.next()) {
				String name = resultSet.getString(1);
				Integer score = resultSet.getInt(2);
				list += name + score.toString() + "\n";
				sta.executeUpdate("UPDATE Edetabel SET Score=" + Integer.toString(score + 10) + " WHERE Name='" + name + "'");
			}
			sta.close();

			conn.close();
			
			return "Database OK" + list;
		} catch (SQLException e) {
			e.printStackTrace();
			return e.getMessage();
		}
	}

	@Override
	public List<String> getGamesList() {
		List<String> games = new ArrayList<String>();
		games.add("Andres vs. P&auml;tris");
		games.add("Silver vs. AI");
		return games;
	}
}
