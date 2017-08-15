package db;

import java.sql.PreparedStatement;
import java.util.Map;

public abstract class DbBean {
	
//  ��Ҫд�����ݿ�����ݣ��ü�ֵ�Ե���ʽ����
	public static Map<String,String> map;
	
//	ʹ�ù��췽����ȡ����
	public DbBean(Map<String,String> map) {
		DbBean.map = map;
	}
	
	abstract String sql();
	abstract void executer();

	//ģ��
	public final void executeSql() {
		int index=1;
//		��ȡSQL���
		String sql = sql();
//		ִ��SQL���
		PreparedStatement pstmt = conn.prepareStatement(sql);
//		ռλ���ж�Ӧ��ֵ
		for(String key:map.keySet()) {
			pstmt.setString(index, map.get(key));
			index++;
		}
	}
}
