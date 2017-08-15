package db;
 
import java.util.Map;

public class DML {
	
//	����ģʽ
	private static DML instance = new DML();
	
	private DML() {};
	
	public static DML getInstance() {
		return instance;
	}
	
	
	public String getDML(String type,String table,Map<String,String> map,String where) {
		if(type.equalsIgnoreCase("inquire")) {
			String sql =deleteDML(table,where);
			return sql;
		}else if(type.equalsIgnoreCase("insert")) {
			String sql = insertDML(table, map);
			return sql;
		}else if(type.equalsIgnoreCase("update")) {
			String sql = updateDML(table, map,where);
			return sql;
		}else if(type.equalsIgnoreCase("delete")) {
			String sql = deleteDML(table,where);
			return sql;
		}
		return null;
		
	}
	
	
//��ѯ����
	public static String inquire(String table,Map<String,String> map,String where) {
//		sql���
		String sql;
//		����
		StringBuilder keys = new StringBuilder();
		for(String key:map.keySet()) {
			keys.append(key);
			keys.append(",");
		}
		keys.delete((keys.length())-1, keys.length());
		sql = "select "+keys.toString() +" from "+table+" where  "+where;
		return sql;
	}

	
//	�������
	public static String insertDML(String table,Map<String,String> map) {
//		sql���
		String sql;
//		����
		StringBuilder keys = new StringBuilder();
//		���ʺű�ʾ��ֵ
		StringBuilder keySize = new StringBuilder();
		for(String key:map.keySet()) {
			keys.append(key);
			keys.append(",");
			keySize.append("?,");
		}
		keys.delete((keys.length())-1, keys.length());
		keySize.delete((keySize.length())-1, keySize.length());
		sql = "insert into "+table+"("+keys.toString()+")" +" values "+"("+keySize.toString()+")";
		return sql;
	}

//	�޸�����
	public static String updateDML(String table,Map<String,String> map,String where) {
//		sql���
		String sql;
//		����
		StringBuilder keys = new StringBuilder();
		for(String key:map.keySet()) {
			keys.append(key);
			keys.append("=?");
		}
		sql = "update "+table+" set "+keys.toString()+" where " + where;
		return sql;
	}
	
//	ɾ������
	public static String deleteDML(String table,String where) {
//		sql���
		String sql;
		sql = "delete from "+table+" where " + where;
		return sql;
	}
	
}
