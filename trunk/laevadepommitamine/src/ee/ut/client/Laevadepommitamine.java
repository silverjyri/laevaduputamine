package ee.ut.client;

import java.util.Arrays;
import java.util.List;

import com.google.gwt.cell.client.TextCell;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
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

	public void onModuleLoad() {
		final Button newButton = new Button("Alusta m&auml;ngu");
		final Button loginButton = new Button("Logi sisse");

		RootPanel menu = RootPanel.get("menu");
		menu.add(newButton);
		menu.add(loginButton);
		
		int f = 1;
		for (f = 1; f<=2; f++) {
			RootPanel field = RootPanel.get("field" + f);
			int i;
			for (i=0; i<10; i++) {
				int j;
				HTML row = new HTML();
				for (j=0; j<10; j++) {
					HTML box = new HTML();
					box.setStyleName("box");
					box.getElement().setId("p" + f + "b" + i + j);
					row.getElement().appendChild(box.getElement());
				}
				field.add(row);
			}
		}

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
