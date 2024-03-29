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
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

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

			ResultSet rs = sta.executeQuery("SELECT ID FROM Players WHERE Name='" + playerName + "'");
			if (!rs.next()) {
				sta.executeUpdate("INSERT INTO Players (name) VALUES ('" + playerName + "')");
				rs = sta.executeQuery("SELECT ID FROM Players WHERE Name='" + playerName + "'");
				rs.next();
				incrementPlayersListVersion(sta);
			}
			Integer playerId = rs.getInt(1);

			Boolean playerStartsFirst = new Random().nextBoolean();
			sta.executeUpdate("INSERT INTO Games (Name, Player, PlayerStarts) VALUES ('" + playerName + " ootab...', " + playerId + ", " + playerStartsFirst + ")");
			incrementGamesListVersion(sta);
			rs = sta.executeQuery("SELECT id FROM Games WHERE Player='" + playerId + "'");
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
	public List<Game> getActiveGamesList() {
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
	public List<Game> getFinishedGamesList() {
		Database.ensure();
		List<Game> list = new ArrayList<Game>();
		Connection conn;

		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();
			ResultSet rs = sta.executeQuery("SELECT ID, Name FROM Games WHERE Finished=true AND Winner!=0");
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

	public static Integer getPlayersListVersion(Statement sta) throws SQLException {
		ResultSet rs = sta.executeQuery("SELECT PlayersListVersion FROM Global");
		rs.next();
		return rs.getInt(1);
	}

	public static void incrementPlayersListVersion(Statement sta) throws SQLException {
		Integer version = getPlayersListVersion(sta) + 1;
		sta.executeUpdate("UPDATE Global SET PlayersListVersion=" + version.toString());
	}

	public static Integer getGamesListVersion(Statement sta) throws SQLException {
		ResultSet rs = sta.executeQuery("SELECT GamesListVersion FROM Global");
		rs.next();
		return rs.getInt(1);
	}

	public static void incrementGamesListVersion(Statement sta) throws SQLException {
		Integer version = getGamesListVersion(sta) + 1;
		sta.executeUpdate("UPDATE Global SET GamesListVersion=" + version.toString());
	}

	@Override
	public Integer getGamesListVersion() {
		Database.ensure();
		try {
			Connection conn = Database.getConnection();
			Statement sta = conn.createStatement();
			int version = getGamesListVersion(sta);
			sta.close();
			conn.close();
			return version;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return 0;
	}

	public String[] getGamePlayers(int gameId, Statement sta) throws SQLException {
		String[] players = new String[2];
		ResultSet rs = sta.executeQuery("SELECT Players.Name FROM Games INNER JOIN Players ON Players.ID = Games.Player WHERE ID=" + Integer.toString(gameId));
		if (!rs.next()) {
			// Game not found, server restarted?
			return players;
		}
		players[0] = rs.getString(1);

		rs = sta.executeQuery("SELECT Opponent FROM Games WHERE ID=" + Integer.toString(gameId));
		rs.next();
		Integer opponentId = rs.getInt(1);

		if (opponentId == -1) {
			players[1] = "AI";
		} else if (opponentId == -2) {
			players[1] = null;
		} else {
			rs = sta.executeQuery("SELECT Name FROM Players WHERE ID=" + opponentId);
			rs.next();
			players[1] = rs.getString(1);
		}
		return players;
	}

	@Override
	public String[] getGamePlayers(int gameId) {
		String[] players = new String[2];
		Database.ensure();
		try {
			Connection conn = Database.getConnection();
			Statement sta = conn.createStatement();
			players = getGamePlayers(gameId, sta);
			sta.close();
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return players;
	}

	// Returns player field, opponent field and move history.
	@Override
	public String[] getGameReplayData(int gameId) {
		String[] replayData = new String[6];
		Database.ensure();
		try {
			Connection conn = Database.getConnection();
			Statement sta = conn.createStatement();

			String[] players = getGamePlayers(gameId, sta);
			replayData[0] = players[0];
			replayData[1] = players[1];

			ResultSet rs = sta.executeQuery("SELECT Finished, PlayerField, OpponentField, MoveHistory, PlayerStarts FROM Games WHERE ID=" + Integer.toString(gameId));
			if (rs.next()) {
				// Can't see fields until finished
				boolean finished = rs.getBoolean(1);
				if (finished) {
					replayData[2] = rs.getString(2);
					replayData[3] = rs.getString(3);
				}
				replayData[4] = rs.getString(4);
				replayData[5] = Boolean.toString(rs.getBoolean(5));
			}

			sta.close();
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return replayData;
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
			if (!rs.next()) {
				return false;
			}
			if (rs.getInt(1) != -2) {
				return false;
			}

			// If opponent has a field set, then the game has started, can't join.
			rs = sta.executeQuery("SELECT OpponentField FROM Games WHERE ID=" + Integer.toString(gameId));
			rs.next();
			if (rs.getString(1) != null) {
				return false;
			}

			// Retrieve player ID
			rs = sta.executeQuery("SELECT ID FROM Players WHERE Name='" + playerName + "'");
			if (!rs.next()) {
				sta.executeUpdate("INSERT INTO Players (name) VALUES ('" + playerName + "')");
				rs = sta.executeQuery("SELECT ID FROM Players WHERE Name='" + playerName + "'");
				rs.next();
				incrementPlayersListVersion(sta);
			}
			Integer playerId = rs.getInt(1);

			// Update game opponent and game name
			rs = sta.executeQuery("SELECT Players.name FROM Games INNER JOIN Players ON Players.ID = Games.Player WHERE ID=" + Integer.toString(gameId));
			rs.next();
			String opponentName = rs.getString(1);
			sta.executeUpdate("UPDATE Games SET Opponent=" + playerId + ", Name='" + opponentName + " vs. " + playerName + "' WHERE ID=" + Integer.toString(gameId));
			incrementGamesListVersion(sta);

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

	 private final Lock lock = new ReentrantLock();
	
	@Override
	public synchronized boolean[] playerMove(int gameId, boolean isOpponent, int x, int y) {
		Database.ensure();
		Connection conn;

		lock.lock();
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
			Ship hitShip = Bomb.checkHit(ships, bomb);
			boolean hit = hitShip != null;
			bomb.setHit(hit);
			int id = x * 10 + y;
			bombs.put(id, bomb);
			boolean sunk = hit ? Bomb.checkSunk(bombs, hitShip) : false;

			// Update playing field with the new bomb
			String fieldEnc = Ship.encodeField(ships, bombs);
			if (isOpponent) {
				sta.executeUpdate("UPDATE Games SET PlayerField='" + fieldEnc +  "' WHERE ID=" + Integer.toString(gameId));
			} else {
				sta.executeUpdate("UPDATE Games SET OpponentField='" + fieldEnc +  "' WHERE ID=" + Integer.toString(gameId));
			}

			updateMoveHistory(gameId, x, y, sta);
			updateMoveHistoryVersion(gameId, isOpponent, sta);

			// Check for victory
			if (sunk && Bomb.checkAllHits(bombs)) {
				rs = sta.executeQuery("SELECT Player, Opponent FROM Games WHERE ID=" + Integer.toString(gameId));
				rs.next();
				int playerId = rs.getInt(1);
				int opponentId = rs.getInt(2);

				rs = sta.executeQuery("SELECT Victories, Defeats, Name FROM Players WHERE ID=" + Integer.toString(playerId));
				rs.next();
				int playerVictories = rs.getInt(1);
				int playerDefeats = rs.getInt(2);
				String playerName = rs.getString(3);

				String opponentName;
				
				if (isOpponent) {
					sta.executeUpdate("UPDATE Games SET Winner=2, Finished=true WHERE ID=" + Integer.toString(gameId));
					sta.executeUpdate("UPDATE Players SET Defeats=" + Integer.toString(playerDefeats + 1)+ " WHERE ID=" + Integer.toString(playerId));
					rs = sta.executeQuery("SELECT Defeats, Name FROM Players WHERE ID=" + Integer.toString(opponentId));
					rs.next();
					int opponentVictories = rs.getInt(1);
					opponentName = rs.getString(2) + " (v&otilde;itja)";
					sta.executeUpdate("UPDATE Players SET Victories=" + Integer.toString(opponentVictories + 1)+ " WHERE ID=" + Integer.toString(opponentId));
				} else {
					playerName += " (v&otilde;itja)";
					sta.executeUpdate("UPDATE Games SET Winner=1, Finished=true WHERE ID=" + Integer.toString(gameId));
					sta.executeUpdate("UPDATE Players SET Victories=" + Integer.toString(playerVictories + 1)+ " WHERE ID=" + Integer.toString(playerId));
					if (opponentId != -1) {
						rs = sta.executeQuery("SELECT Defeats, Name FROM Players WHERE ID=" + Integer.toString(opponentId));
						rs.next();
						int opponentDefeats = rs.getInt(1);
						opponentName = rs.getString(2);
						sta.executeUpdate("UPDATE Players SET Defeats=" + Integer.toString(opponentDefeats + 1)+ " WHERE ID=" + Integer.toString(opponentId));
					} else {
						opponentName = "AI";
					}
				}
				sta.executeUpdate("UPDATE Games SET Name='" + playerName + " vs. " + opponentName + "' WHERE ID=" + Integer.toString(gameId));

				incrementGamesListVersion(sta);
			}

			sta.close();
			conn.close();

			lock.unlock();
			return new boolean[]{hit, sunk};
		} catch (SQLException e) {
			e.printStackTrace();
		}

		lock.unlock();
		return new boolean[]{false, false};
	}

	// Returns info about opponent's move
	@Override
	public synchronized int[] remoteMove(int gameId, boolean isOpponent) {
		Database.ensure();
		Connection conn;

		lock.lock();
		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();
			ResultSet rs;

			// Check if opponent is AI
			rs = sta.executeQuery("SELECT Opponent FROM Games WHERE ID=" + Integer.toString(gameId));
			if (!rs.next()) {
				// Client from previous session?
				lock.unlock();
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
				Ship hitShip = Bomb.checkHit(ships, bomb);
				boolean hit = hitShip != null;
				bomb.setHit(hit);
				bombs.put(id, bomb);
				boolean sunk = hit ? Bomb.checkSunk(bombs, hitShip) : false;
				String fieldEnc = Ship.encodeField(ships, bombs);
				sta.executeUpdate("UPDATE Games SET PlayerField='" + fieldEnc +  "' WHERE ID=" + Integer.toString(gameId));

				updateMoveHistory(gameId, x, y, sta);
				updateMoveHistoryVersion(gameId, true, sta);
				updateMoveHistoryVersion(gameId, false, sta);

				// Check for victory
				if (sunk && Bomb.checkAllHits(bombs)) {
					sta.executeUpdate("UPDATE Games SET Winner=2, Finished=true WHERE ID=" + Integer.toString(gameId));

					rs = sta.executeQuery("SELECT Player FROM Games WHERE ID=" + Integer.toString(gameId));
					rs.next();
					int playerId = rs.getInt(1);

					rs = sta.executeQuery("SELECT Defeats, Name FROM Players WHERE ID=" + Integer.toString(playerId));
					rs.next();
					int playerDefeats = rs.getInt(1);
					String playerName = rs.getString(2);
					sta.executeUpdate("UPDATE Players SET Defeats=" + Integer.toString(playerDefeats + 1)+ " WHERE ID=" + Integer.toString(playerId));

					sta.executeUpdate("UPDATE Games SET Name='" + playerName + " vs. AI (v&otilde;itja)" + "' WHERE ID=" + Integer.toString(gameId));
				}
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

			lock.unlock();
			return new int[] {x, y};
		} catch (SQLException e) {
			e.printStackTrace();
		}

		lock.unlock();
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
			boolean playerStarts = rs.getBoolean(1);
			boolean startFirst;

			if (playerType.equalsIgnoreCase("opponent")) {
				sta.executeUpdate("UPDATE Games SET OpponentField='" + fieldEnc +  "' WHERE ID=" + Integer.toString(gameId));
				startFirst = !playerStarts;
			} else {
				if (playerType.equalsIgnoreCase("againstai")) {
					Map<Integer, Ship> ships = Ship.generateRandomShips();
					Map<Integer, Bomb> bombs = new HashMap<Integer, Bomb>();
					fieldEnc = Ship.encodeField(ships, bombs);
					rs = sta.executeQuery("SELECT Players.Name FROM Games INNER JOIN Players ON Players.ID = Games.Player WHERE ID=" + Integer.toString(gameId));
					rs.next();
					String playerName = rs.getString(1);
					sta.executeUpdate("UPDATE Games SET Opponent=-1, Name='" + playerName + " vs. AI', OpponentField='" + fieldEnc +  "' WHERE ID=" + Integer.toString(gameId));
					incrementGamesListVersion(sta);
				}
				sta.executeUpdate("UPDATE Games SET PlayerField='" + fieldEnc +  "' WHERE ID=" + Integer.toString(gameId));
				startFirst = playerStarts;
			}

			sta.close();
			conn.close();
			return startFirst;
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return false;
	}


	@Override
	public void quitGame(int gameId, boolean isOpponent) {
		Database.ensure();
		Connection conn;

		try {
			conn = Database.getConnection();
			Statement sta = conn.createStatement();

			if (isOpponent) {
				ResultSet rs = sta.executeQuery("SELECT OpponentField FROM Games WHERE ID=" + Integer.toString(gameId));
				rs.next();
				if (rs.getString(1) == null) {
					// If the opponent quits placement, clear opponent
					rs = sta.executeQuery("SELECT Players.Name FROM Games INNER JOIN Players ON Players.ID = Games.Player WHERE ID=" + Integer.toString(gameId));
					rs.next();
					String playerName = rs.getString(1);
					sta.executeUpdate("UPDATE Games SET Opponent=-2, Name='" + playerName + " ootab...' WHERE ID=" + Integer.toString(gameId));
				} else {
					// Game was active, no result
					sta.executeUpdate("UPDATE Games SET Finished=true WHERE ID=" + Integer.toString(gameId));
				}
			} else {
				ResultSet rs = sta.executeQuery("SELECT PlayerField FROM Games WHERE ID=" + Integer.toString(gameId));
				rs.next();
				if (rs.getString(1) == null) {
					// If the original player quits placement, delete the game
					sta.executeUpdate("DELETE FROM Games WHERE ID=" + Integer.toString(gameId));
				} else {
					// Game was active, no result
					sta.executeUpdate("UPDATE Games SET Finished=true WHERE ID=" + Integer.toString(gameId));
				}
			}
			incrementGamesListVersion(sta);

			sta.close();
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
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
