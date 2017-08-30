package db;

public interface DbConnect {
	
	public static final String driver = "com.mysql.jdbc.Driver";
	public static final String user = "cdb_outerroot";
	public static final String password = "haiqian@2017";
//	public static final String user = "root";
//	public static final String password = "BBBBBBHJaiOV1z";
	
     void connection() throws Exception;
}
