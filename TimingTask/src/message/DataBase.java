package message;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

import com.alibaba.fastjson.JSON;

public class DataBase {
   
	  public String doFind(String fieldStr,String table,String time) throws SQLException, IOException  { 
	    	Connection conn = SQLinit();	
			 @SuppressWarnings("unchecked")
			Map<String,String> field =(Map<String,String>)JSON.parse(fieldStr);    
		    String sql =  inquireAll(table, field);
		    System.out.println(sql);
		    PreparedStatement pstmt = conn.prepareStatement(sql);
		    pstmt.setString(1, time);
		    String str = null;
		    try 
		     {
			      ResultSet rs = pstmt.executeQuery();
			      str = getResult(rs, field);
		  	      pstmt.close();
			      rs.close();
	      	}catch (Exception e) {
			e.printStackTrace();
		 }
		      return str;
	 }
	    
	    public static String inquireAll(String table, Map<String, String> field) {
	        //	  sqlÓï¾ä
	    	    String sql;
	       //   ¼üÃû
	    	    StringBuilder keys = new StringBuilder();
	    	    for(String key:field.keySet()) {
	    		    keys.append(key);
	    	    	keys.append(",");
	    	    }
	    	   keys.delete((keys.length())-1, keys.length());
	    	   sql = "select "+keys.toString() +" from "+table+" where book_ takeTime=?";
	    	   return sql;
	    	}
	    
		public static String getResult(ResultSet rs,Map<String,String> field) throws SQLException {
			StringBuilder json = new StringBuilder();
			json.append("{\"result\":[");
			while(rs.next())
			  {
				 
				  json.append("{");	
				  for(String key:field.keySet()) {
					 String value = rs.getString(key).replaceAll(" ", "");
					 String str = value.replaceAll("\"", "");
				     json.append("\""+key+"\":").append("\""+str+"\",");
				  }
				  json.append("},");	
				
		  	  }
	        json.append("]}"); 
	        String str = json.toString().replaceAll(",}","}");
			String str1 = str.toString().replaceAll(",]}","]}");
			return str1;
		}
	    
		
	    private Connection SQLinit() throws IOException {
	    	final String url = "jdbc:mysql://591ba57a49ec3.gz.cdb.myqcloud.com:3806/WxApp";
			final String user_name = "cdb_outerroot";
			final String passeword = "haiqian@2017";
			Connection conn = null;
			try{
				Class.forName("com.mysql.jdbc.Driver");		
				conn = DriverManager.getConnection(url, user_name, passeword);
			}
			catch (Exception e) {
				e.printStackTrace();
			}
			return conn;
		}
	    
	    
}
