package db;
 
import java.util.Map;

public class DML {
	
//	单例模式
	private static DML instance = new DML();
	
	private DML() {};
	
	public static DML getInstance() {
		return instance;
	}
	
	
	public String getDML(String type,String table,Map<String,String> field,Map<String,String> factor) {
		if(type.equalsIgnoreCase("inquire")) {
			String sql = inquire(table,field,factor);
			System.out.println(sql);
			return sql;
		}else if(type.equalsIgnoreCase("insert")) {
			String sql = insertDML(table, field);
			System.out.println(sql);
			return sql;
		}else if(type.equalsIgnoreCase("update")) {
			String sql = updateDML(table, field, factor);
			System.out.println(sql);
			return sql;
		}else if(type.equalsIgnoreCase("delete")) {
			String sql = deleteDML(table,factor);
			System.out.println(sql);
			return sql;
		}
		return null;
		
	}
	
	
//查询数据
	public static String inquire(String table,Map<String,String> field,Map<String,String> factor) {
//		sql语句
		String sql;
//		键名
		StringBuilder keys = new StringBuilder();
//		查询条件
		StringBuilder keyFactor = new StringBuilder();
		for(String key:field.keySet()) {
			keys.append(key);
			keys.append(",");
		}
		for(String key:factor.keySet()) {
			keyFactor.append(key);
			keyFactor.append("=? and");
		}
		System.out.println(keys.toString());
		System.out.println(keyFactor.toString());
		keys.delete((keys.length())-1, keys.length());
		keyFactor.delete((keyFactor.length())-3, keyFactor.length());
		sql = "select "+keys.toString() +" from "+table+" where  "+keyFactor.toString();
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
	public static String updateDML(String table,Map<String,String> field,Map<String,String> factor) {
//		sql语句
		String sql;
//		键名
		StringBuilder keys = new StringBuilder();
//		修改位置条件
		StringBuilder keyFactor = new StringBuilder();
		for(String key:field.keySet()) {
			keys.append(key);
			keys.append("=?,");
		}
		for(String key:factor.keySet()) {
			keyFactor.append(key);
			keyFactor.append("=? and");
		}
		keys.delete((keys.length())-1, keys.length());
		keyFactor.delete((keyFactor.length())-3, keyFactor.length());
		sql = "update "+table+" set "+keys.toString()+" where " + keyFactor.toString();
		return sql;
	}
	
//	删除数据
	public static String deleteDML(String table,Map<String,String> factor) {
//		sql语句
		String sql;
		StringBuilder keyFactor = new StringBuilder();
		for(String key:factor.keySet()) {
			keyFactor.append(key);
			keyFactor.append("=? and");
		}
		keyFactor.delete((keyFactor.length())-3, keyFactor.length());
		sql = "delete from "+table+" where " + keyFactor.toString();
		return sql;
	}
	
}
