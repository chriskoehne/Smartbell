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
cursor.execute("DROP TABLE class;")
cursor.execute("DROP TABLE membership;")
cursor.execute("DROP TABLE employee;")
cursor.execute("DROP TABLE service;")
cursor.execute("DROP TABLE class_attendance;")


# Member table
cursor.execute("CREATE TABLE member (member_name varchar(255), birthday varchar(255), membership_type varchar(255), payment_status varchar(255), last_attended varchar(255), referrals integer, waiver_status varchar(255));")
cursor.execute("INSERT INTO member (member_name, birthday, membership_type, payment_status) VALUES (\'john brown\', \'07-11-2001\', \'platinum\', \'paid\');")

# Membership Option Table
cursor.execute("CREATE TABLE membership (membership_id integer, membership_plan_name varchar(255), cost integer, payment_period varchar(255), benefits varchar(255));")
cursor.execute("INSERT INTO membership (membership_id, membership_plan_name, cost, payment_period, benefits) VALUES (\'1\', \'platinum\', \'100\', \'monthly\', \'all amenities, 2 weekly guest passes, and 24\7 access\');")
cursor.execute("INSERT INTO membership (membership_id, membership_plan_name, cost, payment_period, benefits) VALUES (\'2\', \'gold\', \'50\', \'monthly\', \'partial amenities, 1 weekly guest pass and access until 3 am\');")
cursor.execute("INSERT INTO membership (membership_id, membership_plan_name, cost, payment_period, benefits) VALUES (\'3\', \'silver\', \'40\', \'monthly\', \'partial amenities, access until 12am\');")
cursor.execute("INSERT INTO membership (membership_id, membership_plan_name, cost, payment_period, benefits) VALUES (\'4\', \'regular\', \'25\', \'monthly\', \'normal access\');")

# # Employee Table
cursor.execute("CREATE TABLE employee (employee_id integer, employee_name varchar(255), wage integer, SSN varchar(255), hire_date varchar(255));")

# # Equipment table
cursor.execute("CREATE TABLE equipment (equipment_id varchar(255), machine_name varchar(255), notes varchar(255), quality_status varchar(255));")
cursor.execute("INSERT INTO equipment (machine_name, notes, quality_status) VALUES (\'bench press\', \'no notes\', \'brand new\');")

# # Service History Table
cursor.execute("CREATE TABLE service (equipment_id integer, employee_id integer, notes varchar(255), date varchar(255));")

# # Classes table
cursor.execute("CREATE TABLE class (instructor_name varchar(255), time varchar(255), reservations integer, capacity integer, cost integer);")
cursor.execute("INSERT INTO class (instructor_name, time, reservations, capacity, cost) VALUES (\'Dwayne Johnson\', \'8:00 EDT 03-31-2022\', \'8\', \'10\', \'$100\');")

# Class Attendance
cursor.execute("CREATE TABLE class_attendance (instructor_name varchar(255), time varchar(255), member_id integer);")


cnx.commit()

cursor.close()
cnx.close()                              
