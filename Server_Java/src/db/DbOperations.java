package db;


import java.io.IOException;


import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class DbOperations extends HttpServlet{
	private static final long serialVersionUID = 1L;
	
	/**
     * @see HttpServlet#HttpServlet()
     */
    public DbOperations() {
        super();
    }
    
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
    		throws ServletException, IOException {
        // 处理接收和返回数据的编码问题
    	req.setCharacterEncoding("UTF-8");
		resp.setContentType("text/html;charset=UTF-8");
        // 创建输出管道
		PrintWriter w = resp.getWriter();
        // 连接数据库
    	Connection conn = SQLinit(resp);	
        // 获取用户的请求类型
		String request = req.getParameter("request"); 

		/*
		 * 实现用户登录的功能，UserId(用户名）和UserPassword（密码），
		 * 检索INFORMATION_USER 用户信息表
		 */
		if (request.equals("doLogin"))
		{
			boolean result;
			try {
				  result = doLogin(conn, req);
		    	  w.print(result);
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}

		/*
		 * 增加用户 即增加表的数据（用户注册账号），用INFORMATION_USER表 
		 */
		if (request.equals("newID"))
		{   
			try {
			  int result = newId(conn, req);
			   w.write(result);
			}catch (SQLException se){
				w.write("1062");
			    se.printStackTrace();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}

		/* 
		 * 用户修改密码
		 */
		if (request.equals("alterPassword"))
		{
			try {
				boolean result = alterPassword(conn, req);
				w.print(result);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}


		/* 
		 * 对INFORMATION_BOOK表进行修改操作，
		 * 将BookId与传入的数据都相等的一行的BookStatus（状态）改为预约
		 */
		if (request.equals("alterStatus"))
		{   
			boolean result = false;
			try {
				result = alterStatus(conn, req);
				w.print(result);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		w.close();
    }
    
    
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
    		throws ServletException, IOException {
    	req.setCharacterEncoding("UTF-8");
	    resp.setContentType("text/html; charset=UTF-8");
    	Connection conn = SQLinit(resp); 

		/*
		 * 查询INFORMATION_BOOK表，通过BooklistISBN获取相应的BookId(索书号)、
		 * BookAddress(图书所在位置)、BookStatus（状态），计算共有多少本藏书，
		 * 返回JSON格式的数据，数据包括 索书号 位置 状态 藏书量 
		 */
    	if (req.getParameter("request").equals("get_bookmsg_1"))
    	{
    		try {
				doGet_bookmsg_1(conn, req, resp);
			} catch (SQLException e) {
				e.printStackTrace();
			}
    	}

		/*
	     * 通过bookId查找V_INFORMATION_BOOKDETAIL中的图书信息，
         * 返回JSON格式数据，数据内容包括图书的BookId、BooklistISBN、BooklistTitle、BooklistAuthor
		 */
    	if (req.getParameter("request").equals("get_bookmsg_2"))
    	{
    		try {
				doGet_bookmsg_2(conn, req, resp);
			} catch (SQLException e) {
				e.printStackTrace();
			}
    	}
    }
    

    /*
	 * 实现用户登录的功能，UserId(用户名）和UserPassword（密码），
	 * 检索INFORMATION_USER 用户信息表
	 */
    private boolean doLogin(Connection conn, HttpServletRequest req) throws SQLException 
    {

    	String UserId = req.getParameter("UserId");
    	String UserPassword = req.getParameter("UserPassword");
    	PreparedStatement pstmt = conn.prepareStatement("select * from INFORMATION_USER where UserId=? and UserPassword=?");
    	pstmt.setString(1, UserId);
    	pstmt.setString(2, UserPassword);
    	ResultSet rs = pstmt.executeQuery();
    	if (rs.next())
    	{
    		return true;
    	}
    	return false;
	}

    /*
	 * 增加用户 即增加表的数据（用户注册账号），用INFORMATION_USER表 
	 */
    private int newId(Connection conn, HttpServletRequest req) throws SQLException, UnsupportedEncodingException 
    {
 
    	String UserId =req.getParameter("UserId");
    	String UserPassword = req.getParameter("UserPassword");
    	PreparedStatement pstmt = conn.prepareStatement("insert into user_info values(?,?)");
    	pstmt.setString(1, UserId);
    	pstmt.setString(2, UserPassword);
    	return pstmt.executeUpdate();
	}
    /*
     * 用户修改密码
     */
    private boolean alterPassword(Connection conn, HttpServletRequest req) throws SQLException 
    {
    	String UserId = req.getParameter("UserId");
    	String newPassword = req.getParameter("newPassword");
    	PreparedStatement pstmt = conn.prepareStatement("update INFORMATION_USER set UserPassword=? where UserId=?");
    	pstmt.setString(1, newPassword);
    	pstmt.setString(2, UserId);
		return pstmt.execute();
	}
    
    
    /*
	 * 查询INFORMATION_BOOK表，通过BooklistISBN获取相应的BookId(索书号)、
	 * BookAddress(图书所在位置)、BookStatus（状态），计算共有多少本藏书，
	 * 返回JSON格式的数据，数据包括 索书号 位置 状态 藏书量 
	 */
    private void doGet_bookmsg_1(Connection conn, HttpServletRequest req, HttpServletResponse resp) throws SQLException, IOException 
    {      	
	    PrintWriter w = resp.getWriter();
    	String ISBN = req.getParameter("BooklistISBN");
    	PreparedStatement pstmt = conn.prepareStatement("select * from INFORMATION_BOOK where BooklistISBN=?");
		pstmt.setString(1, ISBN);
		try 
		{
			ResultSet rs = pstmt.executeQuery();
            // 创建JSON格式的字符串
			StringBuilder json = new StringBuilder();
			json.append("{\"books\":[");
			while(rs.next())
			{
				String BookId = rs.getString("BookId");
				String BookAddress = rs.getString("BookAddress");
				String BookStatus = rs.getString("BookStatus");
				
				json.append("{");
				json.append("\"BookId\":").append("\""+BookId+"\"").append(",\"BookAddress\":").append("\""+BookAddress+"\"");
				json.append(",\"BookStatus\":").append("\""+BookStatus+"\"").append("},");
				
			}
            json.append("]}"); 
			String str = json.toString().replaceAll("},]}", "}]}");
			w.write(str);
			pstmt.close();
			rs.close();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	
    }
    
    
    
    
    /*
     * 通过bookId查找V_INFORMATION_BOOKDETAIL中的图书信息，
     * 返回JSON格式数据，数据内容包括图书的BookId、BooklistISBN、BooklistTitle、BooklistAuthor
     */
    private void doGet_bookmsg_2(Connection conn, HttpServletRequest req, HttpServletResponse resp) throws SQLException, IOException 
    { 
    	PrintWriter w = resp.getWriter();
	    String Id = req.getParameter("bookId");
	    System.out.println(Id);
	    PreparedStatement pstmt = conn.prepareStatement("select * from V_INFORMATION_BOOKDETAIL where BookId=?");
	    pstmt.setString(1, Id);
	    try 
	     {
		   ResultSet rs = pstmt.executeQuery();
		   StringBuilder json = new StringBuilder();
		   json.append("{\"book\":[");
		   while(rs.next())
		    {
		      String BookId = rs.getString("BookId");
		      String BooklistISBN = rs.getString("BooklistISBN");
			  String BooklistTitle = rs.getString("BooklistTitle");
			  String BooklistAuthor = rs.getString("BooklistAuthor");
			  String BooklistImage = rs.getString("BooklistImage");
			
			  json.append("{");
		      json.append("\"BookId\":").append("\""+BookId+"\"").append(",\"ISBN\":").append("\""+BooklistISBN+"\"");
			  json.append(",\"title\":").append("\""+BooklistTitle+"\"").append(",\"author\":").append("\""+BooklistAuthor+"\"");
			  json.append(",\"image\":").append("\""+BooklistImage+"\"").append("}");
		    }
        json.append("]}");
		String str = json.toString();
		w.write(str);
		pstmt.close();
		rs.close();
	}catch (Exception e) {
		e.printStackTrace();
	 }		
	}
    
    
    
    /*
     * 对INFORMATION_BOOK表进行修改操作，
     * 将BookId与传入的数据都相等的一行的BookStatus（状态）改为预约
     */
    private boolean alterStatus(Connection conn, HttpServletRequest req) throws SQLException, UnsupportedEncodingException 
    {
		String BookId = req.getParameter("BookId");
		String str = "预约";
		String Status = new String(str.getBytes("UTF-8"));
		PreparedStatement pstmt = conn.prepareStatement("update INFORMATION_BOOK set BookStatus=? where BookId=?");
    	pstmt.setString(1, Status);
    	pstmt.setString(2, BookId);
		return pstmt.execute();
	}
    
    private Connection SQLinit(HttpServletResponse resp) throws IOException {
    	final String url = "jdbc:mysql://591ba57a49ec3.gz.cdb.myqcloud.com:3806/WxApp";
		final String user_name = "cdb_outerroot";
		final String passeword = "haiqian@2017";
		PrintWriter w = resp.getWriter();
		Connection conn = null;
		try{
			Class.forName("com.mysql.jdbc.Driver");		
			conn = DriverManager.getConnection(url, user_name, passeword);
		}
		catch (Exception e) {
			e.printStackTrace();
			w.print("Load fault");
		}
		return conn;
	}

}