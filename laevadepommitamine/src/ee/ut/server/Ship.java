package ee.ut.server;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Random;

public class Ship {
	public Ship(int x, int y, int length, boolean vertical) {
		this.x = x;
		this.y = y;
		this.length = length;
		this.vertical = vertical;
	}

	public Ship(int x, int y, int length) {
		this.x = x;
		this.y = y;
		this.length = length;
		this.vertical = false;
	}

	private int x;
	private int y;
	private int length;
	private boolean vertical;

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
	public int getLength() {
		return length;
	}
	public void setLength(int length) {
		this.length = length;
	}
	public boolean isVertical() {
		return vertical;
	}
	public void setVertical(boolean vertical) {
		this.vertical = vertical;
	}

	// Encodes a string that represents a playing field (see ui/Field.js)
	public static String encodeField(Map<Integer, Ship> ships, Map<Integer, Bomb> bombs) {
		int x, y, id;
		String field = "";
		int digit;
		for (y = 0; y < 10; y++) {
			for (x = 0; x < 10; x++) {
				id = x*10 + y;
				Ship ship = ships.get(id);
				Bomb bomb = bombs.get(id);
				if (ship != null) {
					digit = ship.getLength();
					if (ship.length != 1 && ship.vertical) {
						digit += 3;
					}
				} else {
					digit = 0;
				}
				if (bomb != null) {
					digit += String.valueOf('a').codePointAt(0);
				} else {
					digit += String.valueOf('0').codePointAt(0);
				}
				field += (char)digit;
			}
		}
		return field;
	}

	// Decodes a string that represents a playing field (see ui/Field.js)
	public static Map<Integer, Ship> decodeShips(String fieldEnc) {
		Map<Integer, Ship> ships = new HashMap<Integer, Ship>();
		int x, y;
		for(y = 0; y < 10; y++) {
			for(x = 0; x < 10; x++) {
				char c = fieldEnc.charAt(y*10 + x);
				if (c != '0') {
					int cp = String.valueOf(c).codePointAt(0);
					if (cp >= 48 && cp <= 58) {
						cp -= "0".codePointAt(0);
					} else {
						cp -= "a".codePointAt(0);
						if (cp == 0) {
							continue;
						}
					}
					boolean vertical = cp >= 5;
					if (vertical) {
						cp -= 3;
					}
					ships.put(x*10 + y, new Ship(x,y,cp,vertical));
				}
			}
		}
		return ships;
	}

	// Checks if a ship can be placed on the field
	public static boolean checkLocation(Map<Integer, Ship> ships, Ship ship) {
		int x = ship.getX();
		int y = ship.getY();
		int length = ship.getLength();
		boolean vertical = ship.isVertical();

		if (x < 0 || y < 0) {
			return false;
		}
		if ((vertical ? y : x) + length > 10) {
			return false;
		}

		for ( Entry<Integer, Ship> s : ships.entrySet()) {
			Ship iship = s.getValue();
			int w = vertical ? 1 : length;
			int h = vertical ? length : 1;
			int sw = iship.isVertical() ? 1 : iship.getLength();
			int sh = iship.isVertical() ? iship.getLength() : 1;
			if ((x + w >= iship.getX()) && (x <= iship.getX() + sw) &&
				(y + h >= iship.getY()) && (y <= iship.getY() + sh)) {
				return false;
			}
		}

		return true;
	}

	public static Map<Integer, Ship> generateRandomShips() {
		Map<Integer, Ship> ships = new HashMap<Integer, Ship>();
		int[] lengths = new int[]{ 4, 3, 3, 2, 2, 2, 1, 1, 1, 1 };
		Random random = new Random();
		for (int l : lengths) {
			boolean valid = false;
			Ship ship = new Ship(0, 0, 0);
			while (!valid) {
				ship.setX(random.nextInt(10));
				ship.setY(random.nextInt(10));
				ship.setLength(l);
				ship.setVertical(random.nextBoolean());
				if (ship.getLength() == 1 && ship.isVertical()) {
					ship.setVertical(false);
				}
				valid = Ship.checkLocation(ships, ship);
			}
			ships.put(ship.getX()*10 + ship.getY(), ship);
		}
		return ships;
	}
}
