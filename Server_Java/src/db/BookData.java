package db;

import com.mchange.v2.c3p0.ComboPooledDataSource;


public class BookData  implements DbConnect{

	public static ComboPooledDataSource dsBook;

//	@Override
	public void connection() throws Exception {
		// TODO Auto-generated method stub
		dsBook = new ComboPooledDataSource();
		dsBook.setDriverClass(driver);
//		dsBook.setJdbcUrl("jdbc:mysql://591ba57a49ec3.gz.cdb.myqcloud.com:3806/gdou_book");
		dsBook.setJdbcUrl("jdbc:mysql://10.66.192.197:3306/gdou_book");
		dsBook.setUser(user);
		dsBook.setPassword(password);
		dsBook.setMaxPoolSize(40);
		dsBook.setMinPoolSize(1);
		dsBook.setInitialPoolSize(10);
		dsBook.setMaxStatements(180);
     }
}
