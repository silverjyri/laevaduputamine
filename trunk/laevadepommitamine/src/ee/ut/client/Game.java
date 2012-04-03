package ee.ut.client;

import com.google.gwt.user.client.rpc.IsSerializable;

public class Game implements IsSerializable {
	public Game() {
		this(0, "");
	}
	
	public Game(int id, String name) {
		super();
		this.id = id;
		this.name = name;
	}

	private int id;
	private String name;

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
