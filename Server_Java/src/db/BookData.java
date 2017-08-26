package db;

import java.sql.Connection;
import java.sql.DriverManager;

public class BookData  implements DbConnect{

	public static Connection dsBook;

//	@Override
	public void connection() throws Exception {
		// TODO Auto-generated method stub

		String url = "jdbc:mysql://10.66.192.197:3306/gdou_book";
		Class.forName("com.mysql.jdbc.Driver");		
		dsBook = DriverManager.getConnection(url, user, password);
		
     }
}
