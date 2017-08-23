package message;

import java.io.IOException;
import java.sql.SQLException;

public class BookExpire {
	
	public static void main(String[] args) throws SQLException, IOException {
		String fieldStr = "{\"uk_phone\":'',\"book_library\":'',\"book_name\":'',\"book_takeTime\":''}";
		String table = "book_borrow";
		Date date = new Date();
	    DataBase db = new DataBase();
	    String rs = db.doFind(fieldStr, table, time);
	    System.out.print(rs);
	}

}
