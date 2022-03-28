from select import select
import sqlite3
import re

from datetime import datetime
from dateutil.parser import parse

cnx = sqlite3.connect('smartbell.db', isolation_level=None)

cur = cnx.cursor()
# cur.execute('SELECT * FROM class')
# print(cur.fetchall())


def is_date(string, fuzzy=False):
    """
    Return whether the string can be interpreted as a date.

    :param string: str, string to check for date
    :param fuzzy: bool, ignore unknown tokens in string if True
    """
    try:
        parse(string, fuzzy=fuzzy)
        return True

    except ValueError:
        return False


def print_rows():
    rows = cur.fetchall()
    for row in rows:
        print(row)
    print()


tables = {
    1: 'member',
    2: 'membership',
    3: 'equipment',
    4: 'service',
    5: 'employee',
    6: 'class',
    7: 'class_attendance',
}

memberships = {
    1: 'platinum',
    2: 'gold',
    3: 'silver',
    4: 'regular',
}

waiver_statuses = {
    1: 'approved',
    2: 'pending',
    3: 'denied',
}

payment_statuses = {
    1: 'paid',
    2: 'unpaid'
}

quality_statuses = {
    1: 'brand new',
    2: 'lightly used',
    3: 'heavily used'
}

keep_going = True

print('Hello! Welcome to Smartbell (the dumb version).\n')

while keep_going:
    print('Please select one of the following options:')
    print('1: Read a table\n2: Insert to a table\n3: Access reports')
    selections = []
    selections.append(input())

    options = [str(i) for i in range(1, 4)]
    while selections[-1] not in options:
        print('Please select a valid option.')
        print("1: Read a table\n2: Insert to a table\n3: Access reports")
        selections[-1] = input()
    selections[-1] = int(selections[-1])

    if selections[-1] == 1:
        print('\nWhich table would you like to read from?')
    if selections[-1] == 2:
        print('\nWhich table would you like to insert into?')

    if selections[-1] < 3:
        options = [str(i) for i in range(1, 8)]
        print('1: member\n2: membership\n3: equipment\n4: service_history\n5: employee\n6: class\n7: class_attendance')
        selections.append(input())
        while selections[-1] not in options:
            print('Please select a valid option.')
            print('1: member\n2: membership\n3: equipment\n4: service_history\n5: employee\n6: class\n7: class_attendance')
            selections[-1] = input()
        selections[-1] = int(selections[-1])

    ######
    # READ
    ######
    if selections[0] == 1:

        cur.execute('SELECT * FROM {} '.format(tables[selections[1]]))
        print_rows()

    ########
    # REPORT
    ########

    elif selections[0] == 3:
        options = [str(i) for i in range(1, 6)]
        print('\nWhich report would you like?')
        print('1: members with payment status ____\n2: members with membership ____\
            \n3: members with 1+ referrals\n4: members with waiver status ____\
            \n5: equipment with quality_status ____')
        selections.append(input())
        while selections[-1] not in options:
            print('Please select a valid option.')
            print('1: members with payment status ____\n2: members with membership ____\
                \n3: members with 1+ referrals\n4: members with waiver status ____\
                \n5: equipment with quality_status ____')
            selections[-1] = input()
        selections[-1] = int(selections[-1])

        if selections[-1] == 1:
            options = [str(i) for i in range(1, 3)]
            print('\nWhich payment_status would you like a report on?')
            print('1: paid\n2: unpaid')
            selections.append(input())
            while selections[-1] not in options:
                print('Please select a valid option.')
                print('1: paid\n2: unpaid')
                selections[-1] = input()
            selections[-1] = int(selections[-1])

            cur.execute('SELECT * FROM member WHERE payment_status=(?)', (payment_statuses[selections[-1]],))

        elif selections[-1] == 2:
            print('\nWhich membership type would you like a report on?')
            print('1: platinum\n2: gold\n3: silver\n4: regular')
            selections.append(input())
            while selections[-1] not in options:
                print('Please select a valid option.')
                print('1: platinum\n2: gold\n3: silver\n4: regular')
                selections[-1] = input()
            selections[-1] = int(selections[-1])

            cur.execute('SELECT * FROM member WHERE membership=(?)', (memberships[selections[-1]],))

        elif selections[-1] == 3:

            cur.execute('SELECT * FROM member WHERE referrals >= 1')

        elif selections[-1] == 4:
            print('\nWhich waiver_status you like a report on?')
            print('1: approved\n2: pending')
            selections.append(input())
            while selections[-1] not in options:
                print('Please select a valid option.')
                print('1: approved\n2: pending')
                selections[-1] = input()
            selections[-1] = int(selections[-1])

            cur.execute('SELECT * FROM member WHERE waiver_status=(?)', (waiver_statuses[selections[-1]],))

        elif selections[-1] == 5:
            print('\nWhich quality_status would you like a report on?')
            print('1: brand new\n2: lightly used\n3: heavily used')
            selections.append(input())
            while selections[-1] not in options:
                print('Please select a valid option.')
                print('1: brand new\n2: lightly used\n3: heavily used')
                selections[-1] = input()
            selections[-1] = int(selections[-1])

            cur.execute('SELECT * FROM equipment WHERE quality_status=(?)', (quality_statuses[selections[-1]],))

        
        print_rows()

    #######
    # WRITE
    #######

    elif selections[0] == 2:
        if selections[1] == 1:
            member = {}
            print("\nWhat is the member's name?")
            member['name'] = input()

            print("\nWhat is the member's birthday?")
            member['birthday'] = input()
            while not is_date(member['birthday']):
                print('Please enter a valid date')
                member['birthday'] = input()
            member['birthday'] = datetime.strftime(
                parse(member['birthday']), '%m-%d-%Y')

            options = [str(i) for i in range(1, 5)]
            print('\nWhat is their membership type?')
            print('1: platinum\n2: gold\n3: silver\n4: regular')
            member['membership'] = input()
            while member['membership'] not in options:
                print('Please select a valid option.')
                print('1: platinum\n2: gold\n3: silver\n4: regular')
                member['membership'] = input()

            options = [str(i) for i in range(1, 2)]
            print('\nWhat is their waiver status')
            print('1: appoved\n2: pending')
            member['waiver_status'] = input()
            while member['waiver_status'] not in options:
                print('Please select a valid option.')
                print('1: appoved\n2: pending')
                member['waiver_status'] = input()
            member['waiver_status'] = waiver_statuses[int(
                member['waiver_status'])]
            member['payment_status'] = 'paid'
            member['referrals'] = 0
            member['last_attended'] = datetime.strftime(
                datetime.today(), '%m-%d-%Y')
            print(member)

            cur.execute("INSERT INTO member (name, birthday, membership, payment_status, last_attended, referrals, waiver_status) \
                VALUES (:name, :birthday, :membership, :payment_status, :last_attended, :referrals, :waiver_status)", member)

        else:
            print('\nSorry, that functionality is not currently supported')

    print('\nWould you like to keep using Smartbell?')
    print('1: yes\n2: no')
    if input() != '1':
        keep_going = False
    else:
        print()

print('\nGoodbye!')
