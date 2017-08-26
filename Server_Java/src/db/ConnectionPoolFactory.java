package db;

import java.sql.Connection;
import java.sql.SQLException;



public class ConnectionPoolFactory {
//	单例模式
	private static ConnectionPoolFactory instance = new ConnectionPoolFactory();
	
	private ConnectionPoolFactory() {};
	
	public static ConnectionPoolFactory getInstance() {
		return instance;
	}
	
  	public static Connection connWx;
  	public static Connection connLib;
  	public static Connection connBook;
//	工厂模式
	public Connection getDB(String dbName) throws Exception {
		try {
			 if(dbName.equalsIgnoreCase("Library")){
				 new Library().connection();
				 connLib = Library.dsLibrary;
			     return connLib;
		      } else if (dbName.equalsIgnoreCase("WxApp")){
		    	  new WxApp().connection();
		    	  connWx= WxApp.dsWxApp;
				 return connWx;
				
		      }else if (dbName.equalsIgnoreCase("gdou_book")){
		    	  new BookData().connection();
		    	  connBook = BookData.dsBook;
				 return connBook;
		      }
		}catch(Exception e) {
			 e.printStackTrace();
		}
		return null;

	}
	
	public void closeConn() throws SQLException {
        try{
            if(connWx!=null) connWx.close();
        }catch(SQLException se){
        	 se.printStackTrace();
        }
        try{
            if(connLib!=null) connLib.close();
        }catch(SQLException se1){
            se1.printStackTrace();
        }
        try{
            if(connBook !=null) connBook.close();
        }catch(SQLException se2){
            se2.printStackTrace();
        }
	}
	
}
