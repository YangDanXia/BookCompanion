package db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Map;
import com.mchange.v2.c3p0.ComboPooledDataSource;

public class preparedSql {
	
	public static Connection conn;
	public final void runSQL(String dbName) throws Exception {
//		�������ݿ�
		ConnectionPoolFactory dataBase =  ConnectionPoolFactory.getInstance();
		ComboPooledDataSource ds =dataBase.getDB(dbName);
//		�������ݿ�
		conn = ds.getConnection();
	}
	
	//ģ��
	public final PreparedStatement prepared(String type,String table,Map<String,String> field,Map<String,String> factor) throws Exception {
		
		int index=1;
//		дsql���
		DML dml =  DML.getInstance();
		String  sql =dml.getDML(type, table, field, factor);
		
//		ִ��SQL���
		PreparedStatement pstmt = conn.prepareStatement(sql);
//		ռλ���ж�Ӧ��ֵ
		if(!type.equalsIgnoreCase("inquire")) {
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
