from django.contrib.auth.models import User
from .models import *
from rest_framework import viewsets, generics
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from django.db.models import F
from django_prepared_query import PreparedManager


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        print("here here here here here")
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print('here')
        serializer.save()

        if 'referred_by' in request.data:
            Member.objects.filter(id=request.data['referred_by']).update(
                referrals=F('referrals') + 1)
            print('referred is')

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer


class EquipmentViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        if self.request.query_params.get('prepared') == "no":
            queryset = Equipment.objects.raw('SELECT * FROM gym_equipment')
        else:
            queryset = Equipment.objects.raw('SELECT * FROM gym_equipment WHERE name="bench press"')
        return queryset
    
    queryset = GymClassAttendance.objects.all()
    serializer_class = EquipmentSerializer


class ServiceHistoryViewset(viewsets.ModelViewSet):
    queryset = ServiceHistory.objects.all()
    serializer_class = ServiceHistSerializer


class GymClassViewset(viewsets.ModelViewSet):
    queryset = GymClass.objects.all()
    serializer_class = GymClassSerializer


class GymClassAttendanceViewset(viewsets.ModelViewSet):

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = GymClassAttendance.objects.all()
        gym_class = self.request.query_params.get('gym_class')
        if gym_class is not None:
            queryset = queryset.filter(gym_class=gym_class)
        return queryset

    queryset = GymClassAttendance.objects.all()
    serializer_class = GymClassAttendanceSerializer
