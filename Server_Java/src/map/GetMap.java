package map;

import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.net.URLEncoder;

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
 * Servlet implementation class GetMap
 */

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
		String url_getBookInfo = "http://api.map.baidu.com/place/search?query="+URLEncoder.encode("ͼ���", "UTF-8")+"&location="+latitude+","+longitude+"&radius=5000&output=json";
        // ��ȡҳ�����ݼ�ͼ����Ϣ
//	    1. ����HttpClient����
	    CloseableHttpClient client = HttpClients.createDefault();
//	    2. �������󷽷���ʵ������ָ������URL��
	    HttpGet get = new HttpGet(url_getBookInfo);
//		3. ����HttpClient�����execute(HttpUriRequest request)��������
		HttpResponse resp = client.execute(get);
//		4. ����HttpResponse��getEntity()�����ɻ�ȡHttpEntity����ͨ���ö����ȡ����������Ӧ����
		HttpEntity entity = resp.getEntity();
//		5.ͨ��HttpEntity�����ȡ����������Ӧ����
		InputStream is = entity.getContent();
		String data =IOUtils.toString(is,"UTF-8");
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
