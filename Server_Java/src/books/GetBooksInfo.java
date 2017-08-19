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
		 * ����Ϊisbn���ǲ���һ����
		 */
		if(appRequest.equals("isbn")){
			try{
                // ��ȡISBN���
				String ISBN = request.getParameter("ISBN");
                // ͨ��ISBN�ҵ�����������Ϣ
				String url_getBookInfo = "https://api.douban.com/v2/book/isbn/"+ISBN;
		        // ��ȡҳ�����ݼ�ͼ����Ϣ
			    CloseableHttpClient client = HttpClients.createDefault();
			    HttpGet get = new HttpGet(url_getBookInfo);
				HttpResponse resp = client.execute(get);
				HttpEntity entity = resp.getEntity();
				InputStream is = entity.getContent();
				String data =IOUtils.toString(is,"UTF-8");
                // д�뵽������С�����������
				w.print(data); 
			}catch(Exception e){
				e.printStackTrace();
			}
		}
		
		/*
		 * ����Ϊtag�ǲ���ϵ��ͼ��
		 */
		if(appRequest.equals("tag")){
			try{
                // ��ȡ�ؼ��֣��п��������ģ�����Ҫע���������
				String tag = new String(request.getParameter("tag").getBytes("ISO-8859-1"),"utf-8");
//				String tag = request.getParameter("tag");
                // ��ȡ��ʼָ��
				String start = request.getParameter("start");
                // ÿ�λ�ȡ��ͼ����
				String count =request.getParameter("count");
                // ���ݹؼ��֡���ʼָ���ͼ��������һ������ͼ��
				String url_getBookInfo = "https://api.douban.com/v2/book/search?q="+tag+"&start="+start+"&count="+count;
				// ��ȡҳ�����ݼ�ͼ����Ϣ
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
