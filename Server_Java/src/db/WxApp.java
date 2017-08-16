package db;

import java.sql.Connection;
import java.sql.DriverManager;

import com.mchange.v2.c3p0.ComboPooledDataSource;

 

public class WxApp  implements DbConnect{

	public static ComboPooledDataSource dsWxApp;

//	public static Connection dsWxApp;
//	@Override
	public void connection() throws Exception {
		// TODO Auto-generated method stub
		dsWxApp = new ComboPooledDataSource();
		dsWxApp.setDriverClass(driver);
		dsWxApp.setJdbcUrl("jdbc:mysql://591ba57a49ec3.gz.cdb.myqcloud.com:3806/WxApp");
		dsWxApp.setUser(user);
		dsWxApp.setPassword(password);
		dsWxApp.setMaxPoolSize(40);
		dsWxApp.setMinPoolSize(1);
		dsWxApp.setInitialPoolSize(10);
		dsWxApp.setMaxStatements(180);

//	
//	final String url = "jdbc:mysql://591ba57a49ec3.gz.cdb.myqcloud.com:3806/WxApp";
//	final String user_name = "cdb_outerroot";
//	final String passeword = "haiqian@2017";
//	try{
//		Class.forName("com.mysql.jdbc.Driver");		
//		dsWxApp = DriverManager.getConnection(url, user_name, passeword);
//	}
//	catch (Exception e) {
//		e.printStackTrace();
//	}

}
}
