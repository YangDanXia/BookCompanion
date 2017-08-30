package msg;

import java.io.IOException;

import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class MsgBoard
 */

public class MsgBoard extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public MsgBoard() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException,IOException {
		// TODO Auto-generated method stub
    	request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
		 // 连接数据库
    	Connection conn = SQLinit(response);	
       try {
		getInfo(conn,request,response);
	} catch (SQLException e) {
		// TODO Auto-generated catch block
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
	
	private void getInfo(Connection conn, HttpServletRequest request, HttpServletResponse response) throws IOException, SQLException {
        // 创建输出管道
		PrintWriter w = response.getWriter();
 
    	String status ="0";
    	String user =request.getParameter("user");
    	String receiver =request.getParameter("receiver");
    	PreparedStatement pstmt = conn.prepareStatement("select friend from message_record where status=? and user=? and receiver=? group by friend");
    	pstmt.setString(1, status);
		pstmt.setString(2,user);
		pstmt.setString(3, receiver);
		try {
			ResultSet rs = pstmt.executeQuery();
            // 创建JSON格式的字符串
			StringBuilder json = new StringBuilder();
			json.append("{\"result\":[");
			while(rs.next())
			{
				String friend = rs.getString("friend");
		    	PreparedStatement pstmt1 = conn.prepareStatement("select userPhone,avatarUrl,nickName from user_info  where userPhone=? ");
		    	pstmt1.setString(1, friend);
			    try 
			     {
				     ResultSet rs1 = pstmt1.executeQuery();
				     while(rs1.next())
				        {
				            String userPhone = rs1.getString("userPhone");
				            String avatarUrl = rs1.getString("avatarUrl");
					        String nickName = rs1.getString("nickName");
					
				       	   json.append("{");
				           json.append("\"phone\":").append("\""+userPhone+"\"").append(",\"photo\":").append("\""+avatarUrl+"\"");
					       json.append(",\"name\":").append("\""+nickName+"\"").append("},");
				        }
			        }catch (Exception e) {
				         e.printStackTrace();
			        }		
			}
			
            json.append("]}"); 
			String str = json.toString().replaceAll("},]}", "}]}");
			w.write(str);
			pstmt.close();
			rs.close();
		}catch (Exception e) {
			e.printStackTrace();
		}
    	
	}
	
    private Connection SQLinit(HttpServletResponse resp) throws IOException {
    	final String url = "jdbc:mysql://10.66.192.197:3306/WxApp";
		final String user_name = "root";
		final String passeword = "BBBBBBHJaiOV1z";
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
