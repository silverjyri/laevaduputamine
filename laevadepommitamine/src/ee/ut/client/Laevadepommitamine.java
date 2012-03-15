package ee.ut.client;

import java.util.Arrays;
import java.util.List;

import com.google.gwt.cell.client.TextCell;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.dom.client.Document;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.MouseDownEvent;
import com.google.gwt.event.dom.client.MouseDownHandler;
import com.google.gwt.user.cellview.client.CellList;
import com.google.gwt.user.cellview.client.HasKeyboardSelectionPolicy.KeyboardSelectionPolicy;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.view.client.SelectionChangeEvent;
import com.google.gwt.view.client.SingleSelectionModel;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class Laevadepommitamine implements EntryPoint {

	private String getFieldId(int player, int row, int column) {
		return "p" + player + "b" + row + column;
	}

	private Element getField(int player, int row, int column) {
		return Document.get().getElementById(getFieldId(player, row, column));
		//return RootPanel.get(getFieldId(player, row, column));
	}
	
	private void placeShip(int player, int row, int column, int length, boolean vertical) {
		if (length == 1) {
			Element field = getField(player, row, column);
			field.addClassName("ship_single");
			return;
		}

		int i;
		for (i=0; i<length; i++)
		{
			Element field;
			if (vertical) {
				field = getField(player, row + i, column);
				if (field == null) {
					return;
				}
				if (i == 0) {
					field.addClassName("ship_vertical_1");
				} else if (i == length - 1) {
					field.addClassName("ship_vertical_3");
				} else {
					field.addClassName("ship_vertical_2");
				}
			} else {
				field = getField(player, row, column + i);
				if (field == null) {
					return;
				}
				if (i == 0) {
					field.addClassName("ship_horizontal_1");
				} else if (i == length - 1) {
					field.addClassName("ship_horizontal_3");
				} else {
					field.addClassName("ship_horizontal_2");
				}
			}
		}
	}
	
	private void placeHit(int player, int row, int column) {
		Element field = getField(player, row, column);
		if (field != null) {
			field.addClassName("bomb");
		}
	}
	
	public void onModuleLoad() {
		final Button newButton = new Button("Alusta m&auml;ngu");
		newButton.setStylePrimaryName("button");
		final Button loginButton = new Button("Logi sisse");
		loginButton.setStylePrimaryName("button");
		final Button scoreButton = new Button("Edetabel");
		scoreButton.setStylePrimaryName("button");
		final Button historyButton = new Button("Ajalugu");
		historyButton.setStylePrimaryName("button");
		
		RootPanel menu = RootPanel.get("menu");
		menu.add(newButton);
		menu.add(loginButton);
		menu.add(scoreButton);
		menu.add(historyButton);
		
		int f = 1;
		for (f = 1; f<=2; f++) {
			RootPanel field = RootPanel.get("field" + f);
		
			field.addDomHandler(new MouseDownHandler() {
				@Override
				public void onMouseDown(MouseDownEvent event) {
					if (event.getNativeButton() != com.google.gwt.dom.client.NativeEvent.BUTTON_LEFT) {
						return;
					}
					
					RootPanel field = (RootPanel) event.getSource();
					int p = Integer.parseInt(field.getElement().getId().substring(5, 6));
					int col = (event.getX() - 6) / 33;
					int row = (event.getY() - 6) / 33;
					if (p == 1) {
						placeShip(p, row, col, 1, false);
					} else {
						placeHit(p, row, col);
					}
				}
			}, MouseDownEvent.getType());
			
			int i;
			for (i=0; i<10; i++) {
				int j;
				HTML row = new HTML();
				for (j=0; j<10; j++) {
					HTML box = new HTML();
					box.setStyleName("box");
					box.getElement().setId(getFieldId(f, i, j));
					row.getElement().appendChild(box.getElement());
				}
				field.add(row);
			}
		}

		placeShip(1, 0, 0, 1, false);
		placeShip(1, 2, 4, 2, true);
		placeShip(1, 5, 3, 3, false);
		placeShip(1, 3, 8, 4, true);
		placeShip(1, 8, 2, 5, false);
		placeHit(1, 4, 8);
		placeHit(2, 1, 6);
		placeHit(2, 6, 7);
		
		newButton.addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {

			}
		});


		final List<String> games = Arrays.asList("Game 1", "Game 2",
			      "Game 3", "Game 4");
		
		// Create a cell to render each value.
	    TextCell textCell = new TextCell();

	    // Create a CellList that uses the cell.
	    CellList<String> cellList = new CellList<String>(textCell);
	    cellList.setKeyboardSelectionPolicy(KeyboardSelectionPolicy.ENABLED);

	    // Add a selection model to handle user selection.
	    final SingleSelectionModel<String> selectionModel = new SingleSelectionModel<String>();
	    cellList.setSelectionModel(selectionModel);
	    selectionModel.addSelectionChangeHandler(new SelectionChangeEvent.Handler() {
	      public void onSelectionChange(SelectionChangeEvent event) {
	        String selected = selectionModel.getSelectedObject();
	        if (selected != null) {
	          Window.alert("You selected: " + selected);
	        }
	      }
	    });

	    // Set the total row count. This isn't strictly necessary, but it affects
	    // paging calculations, so its good habit to keep the row count up to date.
	    cellList.setRowCount(games.size(), true);

	    // Push the data into the widget.
	    cellList.setRowData(0, games);

	    // Add it to the root panel.
	    RootPanel.get("gamelist").add(cellList);
	    
	    
		final List<String> players = Arrays.asList("Player 1", "Player 2",
			      "Player 3", "Player 4");
		
	    // Create a CellList that uses the cell.
	    cellList = new CellList<String>(textCell);
	    cellList.setKeyboardSelectionPolicy(KeyboardSelectionPolicy.ENABLED);

	    // Add a selection model to handle user selection.
	    final SingleSelectionModel<String> selectionModel2 = new SingleSelectionModel<String>();
	    cellList.setSelectionModel(selectionModel2);
	    selectionModel2.addSelectionChangeHandler(new SelectionChangeEvent.Handler() {
	      public void onSelectionChange(SelectionChangeEvent event) {
	        String selected = selectionModel2.getSelectedObject();
	        if (selected != null) {
	          Window.alert("You selected: " + selected);
	        }
	      }
	    });

	    // Set the total row count. This isn't strictly necessary, but it affects
	    // paging calculations, so its good habit to keep the row count up to date.
	    cellList.setRowCount(players.size(), true);

	    // Push the data into the widget.
	    cellList.setRowData(0, players);

	    // Add it to the root panel.
	    RootPanel.get("playerlist").add(cellList);
	}
}
