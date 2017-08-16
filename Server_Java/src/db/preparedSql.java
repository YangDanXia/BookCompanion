package db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.Map;
import com.mchange.v2.c3p0.ComboPooledDataSource;

public class preparedSql {
	
	public static Connection connWx;
	public static Connection connLib;
	public final void runSQL() throws Exception {
//		�������ݿ�
		ConnectionPoolFactory dataBase =  ConnectionPoolFactory.getInstance();
		ComboPooledDataSource dsWx =dataBase.getDB("WxApp");
		ComboPooledDataSource dsLib=dataBase.getDB("Library");
//		�������ݿ�
		connWx = dsWx.getConnection();
		connLib = dsLib.getConnection();
	}
	
	//ģ��
	public final PreparedStatement prepared(String dbName,String type,String table,Map<String,String> field,Map<String,String> factor) throws Exception {
		
		int index=1;
//		дsql���
		DML dml =  DML.getInstance();
		String  sql =dml.getDML(type, table, field, factor);
		PreparedStatement pstmt = null ;
//		ִ��SQL���
		if(dbName.equalsIgnoreCase("Library")) {
			pstmt = connLib.prepareStatement(sql);
		}else if(dbName.equalsIgnoreCase("WxApp")) {
		   pstmt = connWx.prepareStatement(sql);
		}

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
