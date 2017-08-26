package db;

import java.sql.Connection;
import java.sql.DriverManager;


public class Library  implements DbConnect{

	public static Connection dsLibrary;
	
	@Override
	public void connection() throws Exception {
		// TODO Auto-generated method stub

		String url = "jdbc:mysql://10.66.192.197:3306/GDOULibrary";
		Class.forName("com.mysql.jdbc.Driver");		
		dsLibrary = DriverManager.getConnection(url, user, password);
	}

}
