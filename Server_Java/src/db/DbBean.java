package db;

import java.sql.Connection;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
 
import java.util.Map;

import com.mchange.v2.c3p0.ComboPooledDataSource;

public class DbBean {
	
	//模板
	public final ResultSet executeSql(String type,String table,Map<String,String> map,String where) throws Exception {
		
		int index=1;
//		连接数据库
		ConnectionPoolFactory dataBase =  ConnectionPoolFactory.getInstance();
		ComboPooledDataSource  ds =dataBase.getDB("Library");
		System.out.println(ds);
		Connection conn = ds.getConnection();
		
//		写sql语句
		DML dml =  DML.getInstance();
		String  sql =dml.getDML(type, table, map, where);
		
		
//		执行SQL语句
		PreparedStatement pstmt = conn.prepareStatement(sql);
//		占位符中对应的值
		for(String key:map.keySet()) {
			pstmt.setString(index, map.get(key));
			index++;
		}
		ResultSet rs = pstmt.executeQuery();
		return rs;
	}
}
