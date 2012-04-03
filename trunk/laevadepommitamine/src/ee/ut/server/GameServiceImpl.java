package ee.ut.server;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;

import ee.ut.client.Game;
import ee.ut.client.GameService;

public class GameServiceImpl extends RemoteServiceServlet implements GameService {
	private static final long serialVersionUID = 1L;

	@Override
	public Integer createGame(String playerName) {
		Database.ensure();
		Connection conn;
		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();
			sta.executeUpdate("INSERT INTO Players (name) VALUES ('" + playerName + "')");
			ResultSet st = sta.executeQuery("SELECT ID FROM Players WHERE Name='" + playerName + "'");
			st.next();
			int playerId = st.getInt(1);
			sta.executeUpdate("INSERT INTO Rankings (Player, Score) VALUES ('" + playerId + "', 0)");
			sta.executeUpdate("INSERT INTO Games (Name, Player) VALUES ('" + playerName + " ootab...', " + Integer.toString(playerId) + ")");
			st = sta.executeQuery("SELECT id FROM Games WHERE Player='" + Integer.toString(playerId) + "'");
			st.next();
			int gameId = st.getInt(1);
			sta.close();
			conn.close();
			return new Integer(gameId);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return 0;
	}

	@Override
	public List<Game> getGamesList() {
		Database.ensure();
		List<Game> list = new ArrayList<Game>();
		Connection conn;

		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();
			ResultSet resultSet = sta.executeQuery("SELECT ID, Name FROM Games");
			while (resultSet.next()) {
				int id = resultSet.getInt(1);
				String name = resultSet.getString(2);
				list.add(new Game(id, name));
			}
			sta.close();
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
		return list;
	}

	@Override
	public void joinGame(int gameId, String playerName) {
		Database.ensure();
		Connection conn;
		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();
			sta.executeUpdate("UPDATE Games SET Opponent='" + playerName + "' WHERE ID=" + Integer.toString(gameId));
			sta.close();
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	boolean isNameAvailable(String name) {
		Database.ensure();
		try {
			Connection conn = Database.getConnection();
			Statement sta = conn.createStatement();
			ResultSet resultSet = sta.executeQuery("SELECT * FROM Players WHERE Name='" + name + "'");
			boolean available = !resultSet.next();
			sta.close();
			conn.close();
			return available;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return false;
	}

	public static Integer uniqueId = 0;
	public String getUniquePlayerName() {
		uniqueId++;
		return "Player #" + uniqueId.toString();
	}

	/*
	@Override
	public String getUniquePlayerName() {
		Integer number = 1;
		String name = "Player #" + number.toString();
		while (!isNameAvailable(name)) {
			number++;
			name = "Player #" + number.toString();
		}
		return name;
	}
	*/

	@Override
	public int[] remoteMove(int gameId) {
		Database.ensure();
		Connection conn;

		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();
			ResultSet resultSet = sta.executeQuery("SELECT PlayerField FROM Games WHERE ID=" + Integer.toString(gameId));
			resultSet.next();
			String field = resultSet.getString(1);
			Map<Integer, Ship> ships = Ship.decodeShips(field);
			Map<Integer, Bomb> bombs = Bomb.decodeBombs(field);

			boolean valid = false;
			Random random = new Random();
			int x = 0, y = 0, id = 0;
			while (!valid) {
				x = random.nextInt(10);
				y = random.nextInt(10);
				id = x * 10 + y;
				valid = !bombs.containsKey(id);
			}

			bombs.put(id, new Bomb(x, y));
			String fieldEnc = Ship.encodeField(ships, bombs);
			sta.executeUpdate("UPDATE Games SET PlayerField='" + fieldEnc +  "' WHERE ID=" + Integer.toString(gameId));

			sta.close();
			conn.close();

			return new int[] {x, y};
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return new int[] {0,0};
	}

	@Override
	public void startGame(int gameId, String fieldEnc) {
		Database.ensure();
		try {
			Connection conn = Database.getConnection();
			Statement sta = conn.createStatement();
			sta.executeUpdate("UPDATE Games SET PlayerField='" + fieldEnc +  "' WHERE ID=" + Integer.toString(gameId));
			sta.close();
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
