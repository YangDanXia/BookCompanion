package db;
 
import java.util.Map;

public class DML {
	
//	单例模式
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
	
	
//查询数据
	public static String inquire(String table,Map<String,String> map,String where) {
//		sql语句
		String sql;
//		键名
		StringBuilder keys = new StringBuilder();
		for(String key:map.keySet()) {
			keys.append(key);
			keys.append(",");
		}
		keys.delete((keys.length())-1, keys.length());
		sql = "select "+keys.toString() +" from "+table+" where  "+where;
		return sql;
	}

	
//	添加数据
	public static String insertDML(String table,Map<String,String> map) {
//		sql语句
		String sql;
//		键名
		StringBuilder keys = new StringBuilder();
//		用问号表示键值
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

//	修改数据
	public static String updateDML(String table,Map<String,String> map,String where) {
//		sql语句
		String sql;
//		键名
		StringBuilder keys = new StringBuilder();
		for(String key:map.keySet()) {
			keys.append(key);
			keys.append("=?");
		}
		sql = "update "+table+" set "+keys.toString()+" where " + where;
		return sql;
	}
	
//	删除数据
	public static String deleteDML(String table,String where) {
//		sql语句
		String sql;
		sql = "delete from "+table+" where " + where;
		return sql;
	}
	
}
