package message;

import java.io.IOException;



import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.exceptions.ClientException;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;


public class BookExpire {
	
	public static void main(String[] args) throws SQLException, IOException, ClientException, InterruptedException {
		String fieldStr = "{\"idx_phone\":'',\"book_library\":'',\"book_name\":'',\"book_takeTime\":''}";
		String table = "book_borrow";
      // 从倒数一周发短信提醒
		Date d=new Date();   
		SimpleDateFormat df=new SimpleDateFormat("yyyy-M-d");   
//		一周后的日期
		String time = df.format(new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000)).toString();
	    System.out.println(time);
	    DataBase db = new DataBase();
	    String rs = db.doFind(fieldStr, table, time);
        JsonParser parser=new JsonParser();  //创建JSON解析器
        JsonObject object=(JsonObject) parser.parse(rs);  //创建JsonObject对象
        JsonArray arrays=object.get("result").getAsJsonArray(); //获取数组内容
        for(int i=0; i<arrays.size(); i++){
        	JsonObject array=arrays.get(i).getAsJsonObject();//获取每组内容
        	String phone= array.get("idx_phone").getAsString();
        	String takeTime = array.get("book_takeTime").getAsString();
        	String library = array.get("book_library").getAsString();
        	String book = array.get("book_name").getAsString();
        	String template = "SMS_84340009";
        	String param = "{\"time\":\""+takeTime+"\",\"library\":\""+library+"\",\"book\":\""+book+"\"}";
        	System.out.println(param);
    	    SendSMS sms = new SendSMS();
    		SendSmsResponse resp = sms.sendSms(phone,template,param);
    		System.out.print(resp.getCode());
    		Thread.sleep(3000L);
        }
	}

}
