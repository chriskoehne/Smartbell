from django.contrib.auth.models import User
from .models import *
from rest_framework import serializers


class EmployeeSerializer(serializers.ModelSerializer):
    wage = serializers.CharField()

    class Meta:
        model = Employee
        fields = ['name', 'hire_date', 'wage', 'ssn']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']


class MembershipSerializer(serializers.ModelSerializer):
    cost = serializers.CharField()

    class Meta:
        model = Membership
        fields = ['id', 'name', 'cost', 'payment_periods', 'benefits']


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'name', 'birthday', 'membership_type', 'good_payment_standing',
                  'last_attended', 'referrals']


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['name', 'status', 'notes']


class ServiceHistSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceHistory
        fields = ['equipment_id', 'employee_id', 'date']


class GymClassSerializer(serializers.ModelSerializer):
    cost = serializers.CharField()

    class Meta:
        model = GymClass
        fields = ['instructor', 'datetime', 'cost']


class GymClassAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GymClassAttendance
        fields = ['gym_class', 'member']
