package db;

import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

public class DbDemo {
	
	public static void main(String[] args) throws Exception {
		String sql;
		Map<String,String> map = new HashMap<String, String>();
		map.put("AdminId","rjb1");
		DbBean object = new DbBean(map);
		sql = "select AdminPassword  from INFORMATION_ADMIN where AdminId=?";
		ResultSet rs = object.executeSql(sql);
		while(rs.next())
		{
		    System.out.println(rs.getString("AdminPassword"));
		}
	}

}
