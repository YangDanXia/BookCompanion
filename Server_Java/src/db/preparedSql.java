package db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Map;
import com.mchange.v2.c3p0.ComboPooledDataSource;

public class preparedSql {
	
	//模板
	public final PreparedStatement prepared(String dbName,String type,String table,Map<String,String> field,Map<String,String> factor) throws Exception {
		
		int index=1;
//		连接数据库
		ConnectionPoolFactory dataBase =  ConnectionPoolFactory.getInstance();
		ComboPooledDataSource  ds =dataBase.getDB(dbName);
		System.out.println(ds);
		Connection conn = ds.getConnection();
		
//		写sql语句
		DML dml =  DML.getInstance();
		String  sql =dml.getDML(type, table, field, factor);
		
		
//		执行SQL语句
		PreparedStatement pstmt = conn.prepareStatement(sql);
//		占位符中对应的值
		if(type.equalsIgnoreCase("inquire")) {
			
		}else {
			for(String key:field.keySet()) {
				pstmt.setString(index, field.get(key));
				index++;
			}
		}

		for(String key:factor.keySet()) {
			pstmt.setString(index, factor.get(key));
			index++;
		}
		return pstmt;
	}
	 
}
