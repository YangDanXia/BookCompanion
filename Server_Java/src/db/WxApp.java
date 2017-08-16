package db;

import com.mchange.v2.c3p0.ComboPooledDataSource;


public class WxApp  implements DbConnect{

	public static ComboPooledDataSource dsWxApp;

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
     }
}
