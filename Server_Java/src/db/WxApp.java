package db;

import java.sql.Connection;
import java.sql.DriverManager;


public class WxApp  implements DbConnect{

	public static Connection dsWxApp;

//	@Override
	public void connection() throws Exception {
		// TODO Auto-generated method stub
		
//		String url = "jdbc:mysql://10.66.192.197:3306/WxApp";
		String url = "jdbc:mysql://591ba57a49ec3.gz.cdb.myqcloud.com:3806/WxApp";
		
		Class.forName("com.mysql.jdbc.Driver");		
		dsWxApp = DriverManager.getConnection(url, user, password);
     }
}
