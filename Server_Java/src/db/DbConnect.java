package db;

public interface DbConnect {
	
	public static final String driver = "com.mysql.jdbc.Driver";
	public static final String user = "cdb_outerroot";
	public static final String password = "haiqian@2017";
	
     void connection() throws Exception;
}
