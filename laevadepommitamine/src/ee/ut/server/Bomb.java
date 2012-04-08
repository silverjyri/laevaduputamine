package ee.ut.server;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Map.Entry;

public class Bomb {
	public Bomb(int x, int y) {
		this.x = x;
		this.y = y;
	}

	private int x;
	private int y;

	public int getX() {
		return x;
	}
	public void setX(int x) {
		this.x = x;
	}
	public int getY() {
		return y;
	}
	public void setY(int y) {
		this.y = y;
	}

	@Override
	public String toString() {
		return Integer.toString(x) + Integer.toString(y);
	}

	// Checks if there is a ship at the given coordinates
	public static boolean checkHit(Map<Integer, Ship> ships, Bomb bomb) {
		for (Entry<Integer, Ship> shipEntry : ships.entrySet()) {
			Ship ship = shipEntry.getValue();
			int sw = ship.isVertical() ? 1 : ship.getLength();
			int sh = ship.isVertical() ? ship.getLength() : 1;
			if ((bomb.x >= ship.getX()) && (bomb.x < ship.getX() + sw) &&
				(bomb.y >= ship.getY()) && (bomb.y < ship.getY() + sh)) {
				return true;
			}
		}
		return false;
	}

	// Decodes a string that represents a playing field (see ui/Field.js)
	public static Map<Integer, Bomb> decodeBombs(String fieldEnc) {
		Map<Integer, Bomb> bombs = new HashMap<Integer, Bomb>();
		int x, y;
		for(y = 0; y < 10; y++) {
			for(x = 0; x < 10; x++) {
				char c = fieldEnc.charAt(y*10 + x);
				int cp = String.valueOf(c).codePointAt(0);
				if (cp < 48 || cp > 58) {
					bombs.put(x*10 + y, new Bomb(x,y));
				}
			}
		}
		return bombs;
	}
	
	public static Bomb getAiBomb(Map<Integer, Bomb> bombs) {
		if (bombs.size() >= 100) {
			return new Bomb(-1, -1);
		}

		boolean valid = false;
		int x = 0, y = 0;
		Random random = new Random();
		int id = 0;
		while (!valid) {
			x = random.nextInt(10);
			y = random.nextInt(10);
			id = x * 10 + y;
			valid = !bombs.containsKey(id);
		}
		return new Bomb(x, y);
	}
}
