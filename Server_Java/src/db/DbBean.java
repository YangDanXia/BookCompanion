package db;

import java.sql.PreparedStatement;
import java.util.Map;

public abstract class DbBean {
	
//  需要写入数据库的内容，用键值对的形式传递
	public static Map<String,String> map;
	
//	使用构造方法获取数据
	public DbBean(Map<String,String> map) {
		DbBean.map = map;
	}
	
	abstract String sql();
	abstract void executer();

	//模板
	public final void executeSql() {
		int index=1;
//		获取SQL语句
		String sql = sql();
//		执行SQL语句
		PreparedStatement pstmt = conn.prepareStatement(sql);
//		占位符中对应的值
		for(String key:map.keySet()) {
			pstmt.setString(index, map.get(key));
			index++;
		}
	}
}
