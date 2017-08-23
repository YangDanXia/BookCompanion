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

public class Reservation {
	public static void main(String[] args) throws SQLException, IOException, ClientException, InterruptedException {
		String fieldStr = "{\"idx_phone\":'',\"book_library\":'',\"book_takeTime\":''}";
		String table = "booking_record";
	    Date dNow = new Date( );
	    SimpleDateFormat ft=  new SimpleDateFormat ("yyyy-MM-dd");
	    String time  = ft.format(dNow).toString();
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
        	String template = "SMS_88115022";
        	String param = "{\"library\":\""+library+"\",\"time\":\""+takeTime+"\"}";
        	System.out.println(param);
    	    SendSMS sms = new SendSMS();
    		SendSmsResponse resp = sms.sendSms(phone,template,param);
    		System.out.print(resp.getCode());
    		Thread.sleep(3000L);
        }

	    System.out.print(rs);
	}
	


}
