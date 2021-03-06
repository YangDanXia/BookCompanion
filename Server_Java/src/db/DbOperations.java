package db;

import java.io.IOException;


import java.io.PrintWriter;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
 
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

/**
 * Servlet implementation class DbOperations
 */
public class DbOperations extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public DbOperations() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
    	request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
        // 创建输出管道
		PrintWriter w = response.getWriter();   
		Map<String, String>  field = new HashMap<String, String>();
		Map<String,String> factor = new HashMap<String, String>();
		// 获取数据库名
		String dbName = request.getParameter("dbName"); 
		// 获取数据表名
		String table = request.getParameter("table"); 
		// 获取操作类型
		String type = request.getParameter("typeName");
		// 获取字段数据
		String fieldStr = request.getParameter("field"); 
		// 获取条件值
		String factorStr = request.getParameter("factor"); 
		// 查找的行数
		String limit = request.getParameter("limit");
		

		field =(Map<String, String>)JSON.parse(fieldStr);    
	    factor =(Map<String,String>)JSON.parse(factorStr);    
		 
		 
		preparedSql object = new preparedSql();
		try {
			PreparedStatement pstmt;
			pstmt = object.prepared(dbName,type, table, field, factor,limit);
			if(type.equalsIgnoreCase("inquire")||type.equalsIgnoreCase("inquireAll")||type.equalsIgnoreCase("inquireLike")||type.equalsIgnoreCase("inquireOrder")) {
				ResultSet rs = pstmt.executeQuery();
				System.out.println("pstmt"+pstmt);
			    String str = getResult(rs, field);
			    System.out.print("返回的结果："+str);
			    w.print(str);
			    rs.close();
			    pstmt.close();
			}else {
				int rs = pstmt.executeUpdate();
				w.print("OK");
				System.out.println(new Date());
				if(rs == 0) {
					w.print("没有该内容");
				}
				pstmt.close();
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			w.print("error");
			e.printStackTrace();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	public static String getResult(ResultSet rs,Map<String,String> field) throws SQLException {
		StringBuilder json = new StringBuilder();
		json.append("{\"result\":[");
		while(rs.next())
		  {
			 
			  json.append("{");	
			  for(String key:field.keySet()) {
				 String value = rs.getString(key).replaceAll("\\s*", "");
				 String str = value.replaceAll("\\\\", "");
				 String str1 = str.replaceAll("\"", "");
			     json.append("\""+key+"\":").append("\""+str1+"\",");
			  }
			  json.append("},");	
			
	  	  }
        json.append("]}"); 
        String str = json.toString().replaceAll(",}","}");
		String str1 = str.toString().replaceAll(",]}","]}");
		return str1;
	}

}
