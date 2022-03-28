import sqlite3
import re

from datetime import datetime

# pwd.py contains MyPassword = "1234"
# Username and password are stored in the python file for simplicity
# Do not store user credentials in your code, look for best security practices in your OS, database, and development environment
# cnx = mysql.connector.connect(user='root', password=pwd.MyPassword,
#                               host='localhost',
#                               database='pricelist')

cnx = sqlite3.connect('smartbell.db', isolation_level=None);

cursor = cnx.cursor()

cursor.execute("DROP TABLE member;")
cursor.execute("DROP TABLE equipment;")




# Member table
cursor.execute("CREATE TABLE member (member_name varchar(255), birthday varchar(255), membership_type varchar(255), payment_status varchar(255));")
cursor.execute("INSERT INTO member (member_name, birthday, membership_type, payment_status) VALUES (\'john brown\', \'07-11-2001\', \'platinum\', \'paid\');")

# Equipment table
cursor.execute("CREATE TABLE equipment (machine_name varchar(255), notes varchar(255), quality_status varchar(255), popularity varchar(255));")
cursor.execute("INSERT INTO equipment (machine_name, notes, quality_status, popularity) VALUES (\'bench press\', \'no notes\', \'brand new\', \'high\');")

# Classes table
cursor.execute("CREATE TABLE class (instructor_name varchar(255), time varchar(255), reservations integer, capacity integer, cost integer);")
cursor.execute("INSERT INTO class (instructor_name, time, reservations, capacity, cost) VALUES (\'Dwayne Johnson\', \'8:00 EDT 03-31-2022\', \'8\', \'10\', \'$100\');")




cnx.commit()

cursor.close()
cnx.close()                              
