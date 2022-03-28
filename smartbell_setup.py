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














# room_column_setup_text = " varchar(255), "

# room_types = "SELECT room_type, room_type_id from room;"
# cursor.execute(room_types)

# room_type_count = 0

# select_room_count = "SELECT count(id) FROM room AS rm LEFT OUTER JOIN place AS plc ON rm.room_type_id=plc.room_type_id WHERE rm.room_type="

# # print(select_room_count)

# # cursor.execute("SELECT id FROM place;")

# room_type_list = []
# room_type_original_name_list = []

# for (room_type, room_type_id) in cursor:
#   print(room_type)
#   room_type = str(room_type)
#   cleaned_room_type = room_type.replace("/", "_")
#   cleaned_room_type = cleaned_room_type.replace(" ", "_")
#   room_type_count = room_type_count + 1
#   create_table = create_table + cleaned_room_type + "_count " + room_column_setup_text

#   room_type_list.append(cleaned_room_type + "_count")
#   room_type_original_name_list.append(room_type)
# # print(select_room_count + room_type + ";"
# #   cursor.execute("SELECT id FROM place;")
# #   cursor.execute(select_room_count + '"' +  + '"' + ";")

# #   loop_count = 0

# #   for (count) in cursor:
# #     print(count)
# #     cursor.execute("INSERT INTO area_room_type (\'" + room_type + "\') VALUES (" + str(count) + ");")
# #     loop_count=loop_count+1

# print(room_type_list)

# final_query = create_table[:-2]
# final_query = final_query + ");"

# cursor.execute(final_query)

# count_list = []

# # cursor.execute("SELECT id FROM place;")
# for (name) in room_type_original_name_list:
#     cursor.execute(select_room_count + '"' + name + '"' + ";")
#     for (count) in cursor:
#         count_list.append(count)

# loop_count = 0

# for (count) in count_list:
#     print(count)
#     count = re.sub("[^0-9]", "", str(count))
#     print(count)
#     cursor.execute("INSERT INTO area_room_type (\'" + str(room_type_list[loop_count]) + "\') VALUES (" + str(count) + ");")
#     loop_count=loop_count+1

# print(final_query)

cnx.commit()

cursor.close()
cnx.close()                              