import pandas as pd
import mysql.connector as msql
from mysql.connector import Error

uniqlo_data = pd.read_csv("crawl_result.csv")

try:
    conn = msql.connect(host='localhost', user='test',
                        password='password',database = 'STproject')
    if conn.is_connected():
        cursor = conn.cursor()
        cursor.execute("select DATABASE();")
        record = cursor.fetchone()
        print("You're connected to database: ", record)

        cursor.execute('DROP TABLE IF EXISTS uniqlo_product;')
        print('Creating table....')
        cursor.execute("CREATE TABLE uniqlo_product (id INT NOT NULL, tw_name CHAR(128) NOT NULL, tw_price CHAR(16) NOT NULL, tw_url VARCHAR(4096) NOT NULL, jp_name CHAR(128) NOT NULL, jp_price CHAR(16) NOT NULL, jp_url VARCHAR(4096) NOT NULL)")
        print("uniqlo_data table is created....")
        for i, row in uniqlo_data.iterrows():
            sql = "INSERT INTO STproject.uniqlo_product VALUES (%s,%s,%s,%s,%s,%s,%s)"
            cursor.execute(sql, tuple(row))
            print("Record inserted")
            conn.commit()
except Error as e:
    print("Error while connecting to MySQL", e)


