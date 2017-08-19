package books;

import java.io.IOException;

import java.io.InputStream;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

//import com.github.kevinsawicki.http.HttpRequest;

/**
 * Servlet implementation class GetBooksInfo
 */
public class GetBooksInfo extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetBooksInfo() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter w = response.getWriter();
		String appRequest = request.getParameter("request");
		/*
		 * 传入为isbn则是查找一本书
		 */
		if(appRequest.equals("isbn")){
			try{
                // 获取ISBN编号
				String ISBN = request.getParameter("ISBN");
                // 通过ISBN找到此书的相关信息
				String url_getBookInfo = "https://api.douban.com/v2/book/isbn/"+ISBN;
		        // 获取页面内容即图书信息
			    CloseableHttpClient client = HttpClients.createDefault();
			    HttpGet get = new HttpGet(url_getBookInfo);
				HttpResponse resp = client.execute(get);
				HttpEntity entity = resp.getEntity();
				InputStream is = entity.getContent();
				String data =IOUtils.toString(is,"UTF-8");
                // 写入到反馈给小程序的数据上
				w.print(data); 
			}catch(Exception e){
				e.printStackTrace();
			}
		}
		
		/*
		 * 传入为tag是查找系列图书
		 */
		if(appRequest.equals("tag")){
			try{
                // 获取关键字，有可能是中文，所以要注意编码问题
				String tag = new String(request.getParameter("tag").getBytes("ISO-8859-1"),"utf-8");
//				String tag = request.getParameter("tag");
                // 获取起始指针
				String start = request.getParameter("start");
                // 每次获取的图书量
				String count =request.getParameter("count");
                // 根据关键字、起始指针和图书量返回一定量的图书
				String url_getBookInfo = "https://api.douban.com/v2/book/search?q="+tag+"&start="+start+"&count="+count;
				// 获取页面内容即图书信息
			    CloseableHttpClient client = HttpClients.createDefault();
			    HttpGet get = new HttpGet(url_getBookInfo);
				HttpResponse resp = client.execute(get);
				HttpEntity entity = resp.getEntity();
				InputStream is = entity.getContent();
				String data =IOUtils.toString(is,"UTF-8");
				w.print(data);
			}catch(Exception e){
				e.printStackTrace();
			}
		}
		
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
