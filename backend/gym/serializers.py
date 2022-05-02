from unicodedata import name
from django.contrib.auth.models import User
from django.db import transaction
from .models import *
from rest_framework import serializers


class EmployeeSerializer(serializers.ModelSerializer):
    wage = serializers.CharField()

    class Meta:
        model = Employee
        fields = ['id', 'name', 'hire_date', 'wage']


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
    membership_type = serializers.SlugRelatedField(
        slug_field='name', queryset=Membership.objects.all())

    class Meta:
        model = Member
        fields = ['id', 'name', 'birthday', 'membership_type', 'good_payment_standing',
                  'last_attended', 'referrals']


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'status', 'notes']


class ServiceHistSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceHistory
        fields = ['equipment_id', 'employee_id', 'date']


class GymClassSerializer(serializers.ModelSerializer):
    cost = serializers.CharField()

    class Meta:
        model = GymClass
        fields = ['id', 'instructor', 'datetime', 'cost', 'capacity']


class GymClassAttendanceSerializer(serializers.ModelSerializer):
    # gym_class = GymClassSerializer(read_only=True)
    # member = MemberSerializer(read_only=True)

    # gym_class_id = serializers.SlugRelatedField(queryset=GymClassAttendance.objects.all(), many=True, slug_field='gym_class', write_only=True)
    # member_id = serializers.SlugRelatedField(queryset=GymClassAttendance.objects.all(),  many=True, slug_field='member', write_only=True)
    class Meta:
        model = GymClassAttendance
        fields = ['id', 'gym_class', 'member']
