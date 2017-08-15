package db;

import java.sql.Connection;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
 
import java.util.Map;

import com.mchange.v2.c3p0.ComboPooledDataSource;

public class DbBean {
	
	//ģ��
	public final ResultSet executeSql(String type,String table,Map<String,String> map,String where) throws Exception {
		
		int index=1;
//		�������ݿ�
		ConnectionPoolFactory dataBase =  ConnectionPoolFactory.getInstance();
		ComboPooledDataSource  ds =dataBase.getDB("Library");
		System.out.println(ds);
		Connection conn = ds.getConnection();
		
//		дsql���
		DML dml =  DML.getInstance();
		String  sql =dml.getDML(type, table, map, where);
		
		
//		ִ��SQL���
		PreparedStatement pstmt = conn.prepareStatement(sql);
//		ռλ���ж�Ӧ��ֵ
		for(String key:map.keySet()) {
			pstmt.setString(index, map.get(key));
			index++;
		}
		ResultSet rs = pstmt.executeQuery();
		return rs;
	}
}
