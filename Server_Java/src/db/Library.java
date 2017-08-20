package db;

import com.mchange.v2.c3p0.ComboPooledDataSource;

public class Library  implements DbConnect{

	public static ComboPooledDataSource dsLibrary;
	
	@Override
	public void connection() throws Exception {
		// TODO Auto-generated method stub
		dsLibrary = new ComboPooledDataSource();
		dsLibrary.setDriverClass(driver);
//		dsLibrary.setJdbcUrl("jdbc:mysql://591ba57a49ec3.gz.cdb.myqcloud.com:3806/GDOULibrary");
		dsLibrary.setJdbcUrl("jdbc:mysql://10.66.192.197:3306/GDOULibrary");
		dsLibrary.setUser(user);
		dsLibrary.setPassword(password);
		dsLibrary.setMaxPoolSize(40);
		dsLibrary.setMinPoolSize(2);
		dsLibrary.setInitialPoolSize(5);
		dsLibrary.setMaxStatements(180);
	}

}
