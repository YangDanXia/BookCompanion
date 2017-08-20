package db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Map;
import com.mchange.v2.c3p0.ComboPooledDataSource;

public class preparedSql {
	
	public static Connection connWx;
	public static Connection connLib;
	public static Connection connBook;
	public final void runSQL() throws Exception {
//		启动数据库
		ConnectionPoolFactory dataBase =  ConnectionPoolFactory.getInstance();
		ComboPooledDataSource dsWx =dataBase.getDB("WxApp");
		ComboPooledDataSource dsLib=dataBase.getDB("Library");
		ComboPooledDataSource dsBook=dataBase.getDB("gdou_book");
//		连接数据库
		connWx = dsWx.getConnection();
		connLib = dsLib.getConnection();
		connBook = dsBook.getConnection();
	}
	
	//模板
	public final PreparedStatement prepared(String dbName,String type,String table,Map<String,String> field,Map<String,String> factor) throws Exception {
		
		int index=1;
//		写sql语句
		DML dml =  DML.getInstance();
		String  sql =dml.getDML(type, table, field, factor);
		PreparedStatement pstmt = null ;
//		执行SQL语句
		if(dbName.equalsIgnoreCase("Library")) {
			pstmt = connLib.prepareStatement(sql);
		}else if(dbName.equalsIgnoreCase("WxApp")) {
		   pstmt = connWx.prepareStatement(sql);
		}else if(dbName.equalsIgnoreCase("gdou_book")) {
			pstmt = connBook.prepareStatement(sql);
		}

//		占位符中对应的值
		if(!type.equalsIgnoreCase("inquire")) {
			for(String key:field.keySet()) {
				pstmt.setString(index, field.get(key));
				index++;
			}
		}

		for(String key:factor.keySet()) {
			String value = new String(factor.get(key).getBytes("ISO-8859-1"),"utf-8");
			pstmt.setString(index, value);
			index++;
		}
		return pstmt;
	}
	 
}
