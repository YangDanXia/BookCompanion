package code;

import java.io.IOException; 

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

/**
 * Servlet implementation class EnQRcode
 */
public class EnQRcode extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public EnQRcode() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException { 
        //��ȡ����ͼ��������
        String code = request.getParameter("code");
        //��ȡ��Ҫ�����ά�������
		QRcode(code,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException { 
		doGet(request, response);
	}
 

	private void QRcode(String book,HttpServletResponse response) throws IOException{
		 ServletOutputStream stream = null; 
	     try{
	            StringBuilder sb = new StringBuilder(1024);
	            sb.append("1;");
                // ��ά������
	            sb.append(book);
	            sb.append("rjb;");
	            String str = sb.toString();
	            str = new String(str.getBytes("UTF-8"), "ISO-8859-1"); 
	            stream = response.getOutputStream();  
	            // ��Ҫ���ɵ�ͼƬ���ͺʹ�С
	            BitMatrix bitMatrix =  new QRCodeWriter().encode(str, BarcodeFormat.QR_CODE, 200, 200);
                // ��ҳ������ʾ��ά��
	            MatrixToImageWriter.writeToStream(bitMatrix,"png", stream);   
	        }catch(Exception ex){
	            System.out.println(ex.toString());
	        }finally {  
                if (stream != null) {  
                    stream.flush();  
                    stream.close();  
                }  
	        }
  }

}
