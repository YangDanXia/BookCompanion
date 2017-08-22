package db;

 
import java.sql.PreparedStatement;
import java.util.Map;
 

public class preparedSql {
	

	//模板
	public final PreparedStatement prepared(String dbName,String type,String table,Map<String,String> field,Map<String,String> factor,String limit) throws Exception {
		ConnectionPoolFactory dataBase =  ConnectionPoolFactory.getInstance();
		int index=1;
//		写sql语句
		DML dml =  DML.getInstance();
		String  sql =dml.getDML(type, table, field, factor,limit);
		PreparedStatement pstmt = null ;
//		执行SQL语句
		if(dbName.equalsIgnoreCase("Library")) {
			pstmt =dataBase.getDB(dbName).prepareStatement(sql);
		}else if(dbName.equalsIgnoreCase("WxApp")) {
		   pstmt =dataBase.getDB(dbName).prepareStatement(sql);
		}else if(dbName.equalsIgnoreCase("gdou_book")) {
			pstmt = dataBase.getDB(dbName).prepareStatement(sql);
		}

//		占位符中对应的值
		if(!type.equalsIgnoreCase("inquire")) {
			for(String key:field.keySet()) {
				String value = new String(field.get(key).getBytes("ISO-8859-1"),"utf-8");
				pstmt.setString(index, value);
				index++;
			}
		}

		for(String key:factor.keySet()) {
			String value = new String(factor.get(key).getBytes("ISO-8859-1"),"utf-8");
			System.out.println("条件值："+value);
			pstmt.setString(index, value);
			index++;
		}
		return pstmt;
	}
	 
}
