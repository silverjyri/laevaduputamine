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

	public Bomb(int x, int y, boolean hit) {
		this.x = x;
		this.y = y;
		this.hit = hit;
	}

	private int x;
	private int y;
	private boolean hit;

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
	public boolean isHit() {
		return hit;
	}
	public void setHit(boolean hit) {
		this.hit = hit;
	}

	@Override
	public String toString() {
		return Integer.toString(x) + Integer.toString(y);
	}

	// Checks for the victory condition of 20 bomb hits
	public static boolean checkAllHits(Map<Integer, Bomb> bombs) {
		int count = 0;
		for (Entry<Integer, Bomb> bomb : bombs.entrySet()) {
			if (bomb.getValue().isHit()) {
				count++;
			}
		}
		return count == 20;
	}

	// Checks if there is a ship at the given coordinates
	public static Ship checkHit(Map<Integer, Ship> ships, Bomb bomb) {
		for (Entry<Integer, Ship> shipEntry : ships.entrySet()) {
			Ship ship = shipEntry.getValue();
			int sw = ship.isVertical() ? 1 : ship.getLength();
			int sh = ship.isVertical() ? ship.getLength() : 1;
			if ((bomb.x >= ship.getX()) && (bomb.x < ship.getX() + sw) &&
				(bomb.y >= ship.getY()) && (bomb.y < ship.getY() + sh)) {
				return ship;
			}
		}
		return null;
	}

	// Checks if the given ship is sunk (fully bombed)
	public static boolean checkSunk(Map<Integer, Bomb> bombs, Ship ship) {
		int x = ship.getX();
		int y = ship.getY();
		int vp = ship.isVertical() ? 1 : 0;
		int hp = ship.isVertical() ? 0 : 1;

		int i;
		for (i = 0; i < ship.getLength(); i++) {
			int id = (x + i * hp) * 10 + (y + i * vp);
			if (!bombs.containsKey(id)) {
				return false;
			}
		}
		return true;
	}

	// Decodes a string that represents a playing field (see ui/Field.js)
	public static Map<Integer, Bomb> decodeBombs(String fieldEnc) {
		Map<Integer, Bomb> bombs = new HashMap<Integer, Bomb>(100, 1.0f);
		int x, y;
		for(y = 0; y < 10; y++) {
			for(x = 0; x < 10; x++) {
				char c = fieldEnc.charAt(y*10 + x);
				int cp = String.valueOf(c).codePointAt(0);
				if (cp < 48 || cp > 58) {
					boolean hit = (c != 'a');
					bombs.put(x*10 + y, new Bomb(x,y,hit));
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
		int id;
		while (!valid) {
			x = random.nextInt(10);
			y = random.nextInt(10);
			id = x * 10 + y;
			valid = !bombs.containsKey(id);
		}
		return new Bomb(x, y);
	}

	@Override
	public int hashCode() {
		return x * 10 + y;
	}
}
