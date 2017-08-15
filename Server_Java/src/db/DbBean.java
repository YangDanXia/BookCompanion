package db;

import java.sql.Connection;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
 
import java.util.Map;

import com.mchange.v2.c3p0.ComboPooledDataSource;

public class DbBean {
	
//  ��Ҫд�����ݿ�����ݣ��ü�ֵ�Ե���ʽ����
	public static Map<String,String> map;
	
//	ʹ�ù��췽����ȡ����
	public DbBean(Map<String,String> map) {
		DbBean.map = map;
	}
	
// ����SQL���
//	abstract String sql();
//	abstract void executer();

	//ģ��
	public final ResultSet executeSql(String sql) throws Exception {
		
		int index=1;
		ConnectionPoolFactory object =  ConnectionPoolFactory.getInstance();
		ComboPooledDataSource  ds =object.getDB("Library");
		System.out.println(ds);
		Connection conn = ds.getConnection();
		
//		��ȡSQL���
//		String sql = sql();
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
