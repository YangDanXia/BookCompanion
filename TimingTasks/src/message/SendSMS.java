package message;

import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;

import com.aliyuncs.dysmsapi.model.v20170525.SendSmsRequest;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.exceptions.ClientException;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;

/**
 * Created on 17/6/7.
 * ����API��Ʒ��DEMO����,�����а�����һ��SmsDemo�ֱ࣬��ͨ��
 * ִ��main��������������Ų�ƷAPI����(ֻ��Ҫ��AK�滻�ɿ�ͨ����ͨ��-���Ų�Ʒ���ܵ�AK����)
 * ����������2��jar��(����ڹ��̵�libsĿ¼��)
 * 1:aliyun-java-sdk-core.jar
 * 2:aliyun-java-sdk-dysmsapi.jar
 *
 * ��ע:Demo���̱������UTF-8
 * ���ʶ��ŷ���������մ�DEMO
 */
public class SendSMS {

    //��Ʒ����:��ͨ�Ŷ���API��Ʒ,�����������滻
    static final String product = "Dysmsapi";
    //��Ʒ����,�����������滻
    static final String domain = "dysmsapi.aliyuncs.com";

    // TODO �˴���Ҫ�滻�ɿ������Լ���AK(�ڰ����Ʒ��ʿ���̨Ѱ��)
    static final String accessKeyId = "LTAIPn82P2LKTcEB";
    static final String accessKeySecret = "jnqIHeLWA752HcQQmHBlO5EFPquSMO";

    public SendSmsResponse sendSms(String phone,String template,String param) throws ClientException {

        //������������ʱʱ��
        System.setProperty("sun.net.client.defaultConnectTimeout", "10000");
        System.setProperty("sun.net.client.defaultReadTimeout", "10000");

        //��ʼ��acsClient,�ݲ�֧��region��
        IClientProfile profile = DefaultProfile.getProfile("cn-hangzhou", accessKeyId, accessKeySecret);
        DefaultProfile.addEndpoint("cn-hangzhou", "cn-hangzhou", product, domain);
        IAcsClient acsClient = new DefaultAcsClient(profile);

        //��װ�������-��������������̨-�ĵ���������
        SendSmsRequest request = new SendSmsRequest();
        //����:�������ֻ���
        request.setPhoneNumbers(phone);
        //����:����ǩ��-���ڶ��ſ���̨���ҵ�
        request.setSignName("��;Life");
        //����:����ģ��-���ڶ��ſ���̨���ҵ�
        request.setTemplateCode(template);
        //��ѡ:ģ���еı����滻JSON��,��ģ������Ϊ"�װ���${name},������֤��Ϊ${code}"ʱ,�˴���ֵΪ
        request.setTemplateParam(param);

        //hint �˴����ܻ��׳��쳣��ע��catch
        SendSmsResponse sendSmsResponse = acsClient.getAcsResponse(request);

        return sendSmsResponse;
    
    }
}
