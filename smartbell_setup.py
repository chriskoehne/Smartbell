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

cursor.execute("DROP TABLE IF EXISTS member;")
cursor.execute("DROP TABLE IF EXISTS equipment;")
cursor.execute("DROP TABLE IF EXISTS class;")
cursor.execute("DROP TABLE IF EXISTS membership;")
cursor.execute("DROP TABLE IF EXISTS employee;")
cursor.execute("DROP TABLE IF EXISTS service;")
cursor.execute("DROP TABLE IF EXISTS class_attendance;")


# Member table
cursor.execute("CREATE TABLE IF NOT EXISTS member (member_id integer primary key, name varchar(255), birthday varchar(255), membership integer, payment_status varchar(255), last_attended varchar(255), referrals integer, waiver_status varchar(255));")
cursor.execute("INSERT INTO member (member_id, name, birthday, membership, payment_status, last_attended, referrals, waiver_status) VALUES (\'1\', \'John Brown\', \'07-11-2001\', \'1\', \'paid\', \'03-11-2022\', 1, \'approved\');")
cursor.execute("INSERT INTO member (member_id, name, birthday, membership, payment_status, last_attended, referrals, waiver_status) VALUES (\'2\', \'Alex Jones\', \'12-25-1980\', \'2\', \'unpaid\', \'02-04-2019\', 2, \'approved\');")
cursor.execute("INSERT INTO member (member_id, name, birthday, membership, payment_status, last_attended, referrals, waiver_status) VALUES (\'3\', \'Will Smith\', \'11-12-1968\', \'4\', \'paid\', \'03-27-2022\', 0, \'pending\');")
cursor.execute("INSERT INTO member (member_id, name, birthday, membership, payment_status, last_attended, referrals, waiver_status) VALUES (\'4\', \'Saul Goodman\', \'11-12-1960\', \'4\', \'paid\', \'12-12-2021\', 0, \'pending\');")
cursor.execute("INSERT INTO member (member_id, name, birthday, membership, payment_status, last_attended, referrals, waiver_status) VALUES (\'5\', \'James McGill\', \'05-22-1990\', \'3\', \'paid\', \'07-14-2021\', 1, \'approved\');")
cursor.execute("INSERT INTO member (member_id, name, birthday, membership, payment_status, last_attended, referrals, waiver_status) VALUES (\'6\', \'Skylar White\', \'08-30-1975\', \'2\', \'paid\', \'03-20-2022\', 0, \'pending\');")

# Membership Option Table
cursor.execute("CREATE TABLE IF NOT EXISTS membership (membership_id integer primary key, membership_plan_name varchar(255), cost integer, payment_period varchar(255), benefits varchar(255));")
cursor.execute("INSERT INTO membership (membership_id, membership_plan_name, cost, payment_period, benefits) VALUES (\'1\', \'platinum\', \'100\', \'monthly\', \'all amenities, 2 weekly guest passes, and 24\\7 access\');")
cursor.execute("INSERT INTO membership (membership_id, membership_plan_name, cost, payment_period, benefits) VALUES (\'2\', \'gold\', \'50\', \'monthly\', \'partial amenities, 1 weekly guest pass and access until 3 am\');")
cursor.execute("INSERT INTO membership (membership_id, membership_plan_name, cost, payment_period, benefits) VALUES (\'3\', \'silver\', \'40\', \'monthly\', \'partial amenities, access until 12am\');")
cursor.execute("INSERT INTO membership (membership_id, membership_plan_name, cost, payment_period, benefits) VALUES (\'4\', \'regular\', \'25\', \'monthly\', \'normal access\');")

# # Employee Table
cursor.execute("CREATE TABLE IF NOT EXISTS employee (employee_id integer primary key, name varchar(255), hourly_wage real, SSN varchar(255), hire_date varchar(255));")
cursor.execute("INSERT INTO employee (employee_id, name, hourly_wage, SSN, hire_date) VALUES (\'3123\', \'Dwayne Johnson\', \'35\', \'223458291\', \'02-21-2015\');")
cursor.execute("INSERT INTO employee (employee_id, name, hourly_wage, SSN, hire_date) VALUES (\'2123\', \'Arnold Schwarzenegger\', \'30\', \'2934732283\', \'03-04-2017\');")


# # Equipment table
cursor.execute("CREATE TABLE IF NOT EXISTS equipment (equipment_id integer primary key, machine_name varchar(255), notes varchar(255), quality_status varchar(255));")
cursor.execute("INSERT INTO equipment (equipment_id, machine_name, notes, quality_status) VALUES (\'1\', \'bench press\', \'no notes\', \'brand new\');")
cursor.execute("INSERT INTO equipment (equipment_id, machine_name, notes, quality_status) VALUES (\'2\', \'bench press\', \'no notes\', \'brand new\');")
cursor.execute("INSERT INTO equipment (equipment_id, machine_name, notes, quality_status) VALUES (\'3\', \'shoulder press\', \'no notes\', \'lightly used\');")
cursor.execute("INSERT INTO equipment (equipment_id, machine_name, notes, quality_status) VALUES (\'4\', \'45 degree leg press\', \'no notes\', \'heavily used\');")




# INSERT INTO gym_equipment (id, name, status, notes) VALUES (1, 'bench press', 1, 'no notes');
# INSERT INTO gym_equipment (id, name, status, notes) VALUES (2, 'bench press', 1, 'no notes');
# INSERT INTO gym_equipment (id, name, status, notes) VALUES (3, 'shoulder press', 4, 'no notes');
# INSERT INTO gym_equipment (id, name, status, notes) VALUES (4, '45 degree leg press', 6, 'no notes');

# # Service History Table
cursor.execute("CREATE TABLE IF NOT EXISTS service (equipment_id integer, employee_id integer, notes varchar(255), date varchar(255));")
cursor.execute("INSERT INTO service (equipment_id, employee_id, notes, date) VALUES (\'4\', \'3123\', \'Soiled seat replaced\', \'02-05-2019\');")

# # Classes table
cursor.execute("CREATE TABLE IF NOT EXISTS class (instructor_name varchar(255), class_name varchar(255), time varchar(255), reservations integer, capacity integer, cost integer);")
cursor.execute("INSERT INTO class (instructor_name, class_name, time, reservations, capacity, cost) VALUES (\'Dwayne Johnson\', \'axe throwing\', \'8:00 EDT 03-31-2022\', \'1\', \'10\', \'$100\');")

# Class Attendance
cursor.execute("CREATE TABLE IF NOT EXISTS class_attendance (instructor_name varchar(255), time varchar(255), member_id integer);")
cursor.execute("INSERT INTO class_attendance (instructor_name, time, member_id) VALUES (\'Dwayne Johnson\', \'8:00 EDT 03-31-2022\', \'4\');")


cnx.commit()

cursor.close()
cnx.close()                              
