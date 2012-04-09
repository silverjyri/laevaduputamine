package ee.ut.server;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import com.google.gwt.user.server.rpc.RemoteServiceServlet;

import ee.ut.client.Game;
import ee.ut.client.GameService;

public class GameServiceImpl extends RemoteServiceServlet implements GameService {
	private static final long serialVersionUID = 1L;
	private static int gamesListVersion = 1;

	@Override
	public Integer createGame(String playerName) {
		Database.ensure();
		Connection conn;
		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();
			sta.executeUpdate("INSERT INTO Players (name) VALUES ('" + playerName + "')");

			ResultSet rs = sta.executeQuery("SELECT ID FROM Players WHERE Name='" + playerName + "'");
			rs.next();
			int playerId = rs.getInt(1);
			boolean playerStartsFirst = new Random().nextBoolean();
			sta.executeUpdate("INSERT INTO Games (Name, Player, PlayerStarts, Finished) VALUES ('" + playerName + " ootab...', " + Integer.toString(playerId) + ", " + Boolean.toString(playerStartsFirst) + ", false)");
			gamesListVersion++;
			rs = sta.executeQuery("SELECT id FROM Games WHERE Player='" + Integer.toString(playerId) + "'");
			rs.next();
			int gameId = rs.getInt(1);

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
			ResultSet rs = sta.executeQuery("SELECT ID, Name FROM Games WHERE Finished=false");
			while (rs.next()) {
				int id = rs.getInt(1);
				String name = rs.getString(2);
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
	public Integer getGamesListVersion() {
		return gamesListVersion;
	}

	@Override
	public String[] getGamePlayers(int gameId) {
		String[] players = new String[2];
		Database.ensure();
		try {
			Connection conn = Database.getConnection();
			Statement sta = conn.createStatement();

			ResultSet playerName = sta.executeQuery("SELECT Players.Name FROM Games INNER JOIN Players ON Players.ID = Games.Player WHERE ID=" + Integer.toString(gameId));
			if (playerName.next()) {
				players[0] = playerName.getString(1);
			}
			ResultSet opponentName = sta.executeQuery("SELECT Players.Name FROM Games INNER JOIN Players ON Players.ID = Games.Opponent WHERE ID=" + Integer.toString(gameId));
			if (opponentName.next()) {
				players[1] = opponentName.getString(1);
			}

			sta.close();
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return players;
	}

	// Returns true if joining was possible (there was one player in the game).
	@Override
	public boolean joinGame(int gameId, String playerName) {
		Database.ensure();
		Connection conn;
		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();

			ResultSet rs = sta.executeQuery("SELECT Opponent FROM Games WHERE ID=" + Integer.toString(gameId));
			rs.next();
			if (rs.getInt(1) != -2) {
				return false;
			}

			sta.executeUpdate("INSERT INTO Players (name) VALUES ('" + playerName + "')");

			rs = sta.executeQuery("SELECT ID FROM Players WHERE Name='" + playerName + "'");
			rs.next();
			int playerId = rs.getInt(1);
			rs = sta.executeQuery("SELECT Players.name FROM Games INNER JOIN Players ON Players.ID = Games.Player WHERE ID=" + Integer.toString(gameId));
			rs.next();
			String opponentName = rs.getString(1);

			sta.executeUpdate("UPDATE Games SET Opponent=" + Integer.toString(playerId) + ", Name='" + opponentName + " vs. " + playerName + "' WHERE ID=" + Integer.toString(gameId));
			gamesListVersion++;

			sta.close();
			conn.close();
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
	}

	boolean isNameAvailable(String name) {
		Database.ensure();
		try {
			Connection conn = Database.getConnection();
			Statement sta = conn.createStatement();

			ResultSet rs = sta.executeQuery("SELECT * FROM Players WHERE Name='" + name + "'");
			boolean available = !rs.next();

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
	public boolean isOpponentReady(int gameId, boolean isOpponent) {
		Database.ensure();
		Connection conn;

		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();

			boolean ready;
			ResultSet rs;
			if (isOpponent) {
				rs = sta.executeQuery("SELECT PlayerField FROM Games WHERE ID=" + Integer.toString(gameId));
			} else {
				rs = sta.executeQuery("SELECT OpponentField FROM Games WHERE ID=" + Integer.toString(gameId));
			}
			if (!rs.next()) {
				// Client from previous session?
				return false;
			}
			ready = rs.getString(1) != null;

			sta.close();
			conn.close();

			return ready;
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return false;
	}

	@Override
	public boolean playerMove(int gameId, boolean isOpponent, int x, int y) {
		Database.ensure();
		Connection conn;

		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();
			ResultSet rs;

			// Get opponent's playing field
			if (isOpponent) {
				rs = sta.executeQuery("SELECT PlayerField FROM Games WHERE ID=" + Integer.toString(gameId));
			} else {
				rs = sta.executeQuery("SELECT OpponentField FROM Games WHERE ID=" + Integer.toString(gameId));
			}
			rs.next();
			String field = rs.getString(1);
			Map<Integer, Ship> ships = Ship.decodeShips(field);
			Map<Integer, Bomb> bombs = Bomb.decodeBombs(field);

			// Make player bomb
			Bomb bomb = new Bomb(x, y);
			boolean hit = Bomb.checkHit(ships, bomb);
			int id = x * 10 + y;
			bombs.put(id, bomb);

			// Update playing field with the new bomb
			String fieldEnc = Ship.encodeField(ships, bombs);
			if (isOpponent) {
				sta.executeUpdate("UPDATE Games SET PlayerField='" + fieldEnc +  "' WHERE ID=" + Integer.toString(gameId));
			} else {
				sta.executeUpdate("UPDATE Games SET OpponentField='" + fieldEnc +  "' WHERE ID=" + Integer.toString(gameId));
			}

			updateMoveHistory(gameId, x, y, sta);
			updateMoveHistoryVersion(gameId, isOpponent, sta);

			sta.close();
			conn.close();

			return hit;
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return false;
	}

	// Returns info about opponent's move
	@Override
	public int[] remoteMove(int gameId, boolean isOpponent) {
		Database.ensure();
		Connection conn;

		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();
			ResultSet rs;

			// Check if opponent is AI
			rs = sta.executeQuery("SELECT Opponent FROM Games WHERE ID=" + Integer.toString(gameId));
			if (!rs.next()) {
				// Client from previous session?
				return new int[] {-1, -1};
			}
			boolean ai = rs.getInt(1) == -1;

			int x = 0, y = 0;
			if (ai) {
				// Get playing field
				rs = sta.executeQuery("SELECT PlayerField FROM Games WHERE ID=" + Integer.toString(gameId));
				rs.next();
				String field = rs.getString(1);
				Map<Integer, Ship> ships = Ship.decodeShips(field);
				Map<Integer, Bomb> bombs = Bomb.decodeBombs(field);

				// Make a move with AI
				Bomb bomb = Bomb.getAiBomb(bombs);
				x = bomb.getX();
				y = bomb.getY();
				int id = x * 10 + y;
				bombs.put(id, bomb);
				String fieldEnc = Ship.encodeField(ships, bombs);
				sta.executeUpdate("UPDATE Games SET PlayerField='" + fieldEnc +  "' WHERE ID=" + Integer.toString(gameId));

				updateMoveHistory(gameId, x, y, sta);
				updateMoveHistoryVersion(gameId, true, sta);
				updateMoveHistoryVersion(gameId, false, sta);
			} else {
				if (isOpponent) {
					rs = sta.executeQuery("SELECT MoveHistoryVersion, OpponentMoveHistoryVersion FROM Games WHERE ID=" + Integer.toString(gameId));
				} else {
					rs = sta.executeQuery("SELECT MoveHistoryVersion, PlayerMoveHistoryVersion FROM Games WHERE ID=" + Integer.toString(gameId));
				}
				rs.next();
				int version = rs.getInt(1);
				int playerVersion = rs.getInt(2);
				
				if (playerVersion == version) {
					// Opponent move not ready
					x = -1;
					y = -1;
				} else {
					// Not up to date, send back move information from history
					rs = sta.executeQuery("SELECT MoveHistory FROM Games WHERE ID=" + Integer.toString(gameId));
					rs.next();
					String history = rs.getString(1);
					int position = (playerVersion + 1) * 2; 
					String move = history.substring(position, position + 2);
					x = move.codePointAt(0) - 48;
					y = move.codePointAt(1) - 48;
					updateMoveHistoryVersion(gameId, isOpponent, sta);
				}
			}

			sta.close();
			conn.close();

			return new int[] {x, y};
		} catch (SQLException e) {
			e.printStackTrace();
		}

		return new int[] {-1,-1};
	}

	@Override
	public boolean startGame(int gameId, String playerType, String fieldEnc) {
		Database.ensure();
		try {
			Connection conn = Database.getConnection();
			Statement sta = conn.createStatement();

			ResultSet rs = sta.executeQuery("SELECT PlayerStarts FROM Games WHERE ID=" + Integer.toString(gameId));
			rs.next();
			boolean startFirst = !rs.getBoolean(1);

			if (playerType.equalsIgnoreCase("opponent")) {
				sta.executeUpdate("UPDATE Games SET OpponentField='" + fieldEnc +  "' WHERE ID=" + Integer.toString(gameId));
				startFirst = !startFirst;
			} else {
				sta.executeUpdate("UPDATE Games SET PlayerField='" + fieldEnc +  "' WHERE ID=" + Integer.toString(gameId));
				if (playerType.equalsIgnoreCase("againstai")) {
					Map<Integer, Ship> ships = Ship.generateRandomShips();
					Map<Integer, Bomb> bombs = new HashMap<Integer, Bomb>();
					fieldEnc = Ship.encodeField(ships, bombs);
					sta.executeUpdate("UPDATE Games SET Opponent=-1, OpponentField='" + fieldEnc +  "' WHERE ID=" + Integer.toString(gameId));
				}
			}

			sta.close();
			conn.close();
			return startFirst;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return false;
	}

	private void updateMoveHistory(int gameId, int x, int y, Statement sta) throws SQLException {
		String stringId = Integer.toString(x) + Integer.toString(y);
		ResultSet rs = sta.executeQuery("SELECT MoveHistoryVersion, MoveHistory FROM Games WHERE ID=" + Integer.toString(gameId));
		rs.next();
		int version = rs.getInt(1) + 1;
		String history = rs.getString(2);
		history = (history != null) ? history : "";
		history += stringId;
		sta.executeUpdate("UPDATE Games SET MoveHistoryVersion=" + Integer.toString(version) + ", MoveHistory='" + history +  "' WHERE ID=" + Integer.toString(gameId));
	}
	
	private void updateMoveHistoryVersion(int gameId, boolean isOpponent, Statement sta) throws SQLException {
		ResultSet rs;
		if (isOpponent) {
			rs = sta.executeQuery("SELECT OpponentMoveHistoryVersion FROM Games WHERE ID=" + Integer.toString(gameId));
		} else {
			rs = sta.executeQuery("SELECT PlayerMoveHistoryVersion FROM Games WHERE ID=" + Integer.toString(gameId));
		}
		rs.next();
		String version = Integer.toString(rs.getInt(1) + 1);
		if (isOpponent) {
			sta.executeUpdate("UPDATE Games SET OpponentMoveHistoryVersion=" + version + " WHERE ID=" + Integer.toString(gameId));			
		} else {
			sta.executeUpdate("UPDATE Games SET PlayerMoveHistoryVersion=" + version + " WHERE ID=" + Integer.toString(gameId));
		}
	}
}
