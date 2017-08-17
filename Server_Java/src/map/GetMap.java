package map;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.github.kevinsawicki.http.HttpRequest;

/**
 * Servlet implementation class GetMap
 */
@WebServlet("/GetMap")
public class GetMap extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetMap() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter w = response.getWriter();
		String latitude = request.getParameter("latitude");
		String longitude = request.getParameter("longitude");
		String url_getBookInfo = "http://api.map.baidu.com/place/search?query=图书馆&location="+latitude+","+longitude+"&radius=5000&output=json&src=yourCompanyName|yourAppName ";
        // 获取页面内容即图书信息
		String data = HttpRequest.get(url_getBookInfo).body();
		w.print(data);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
