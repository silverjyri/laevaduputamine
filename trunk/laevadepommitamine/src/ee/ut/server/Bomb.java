package ee.ut.server;

import java.util.HashMap;
import java.util.Map;

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
}
