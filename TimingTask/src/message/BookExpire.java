package message;

public class BookExpire {
	
	String fieldStr = "{\"uk_phone\":'',\"book_library\":'',\"book_name\":'',\"book_takeTime\":''}";
	String table = "book_borrow";
    DataBase db = new DataBase();
    String rs = db.doFind(fieldStr, table, time)
}
