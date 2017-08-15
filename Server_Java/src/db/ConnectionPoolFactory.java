package db;

import com.mchange.v2.c3p0.ComboPooledDataSource;

public class ConnectionPoolFactory {
//	单例模式
	private static ConnectionPoolFactory instance = new ConnectionPoolFactory();
	
	private ConnectionPoolFactory() {};
	
	public static ConnectionPoolFactory getInstance() {
		return instance;
	}
//	工厂模式
	public ComboPooledDataSource getDB(String dbName) throws Exception {
		 if(dbName.equalsIgnoreCase("Library")){
			 new Library().connection();
		     return Library.dsLibrary;
	      } else if (dbName.equalsIgnoreCase("WxApp")){
	    	  new WxApp().connection();
			 return WxApp.dsWxApp;
	      }
		return null;
	}
	
}
