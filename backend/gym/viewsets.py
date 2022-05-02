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
        queryString = "SELECT * from gym_equipment"
        
        paramsAdded = 0
        # firstParamAdded = 0

        if self.request.query_params.get('name'):
            
            queryString = queryString + " WHERE name=\'" + self.request.query_params.get('name') + "\'"
            paramsAdded = paramsAdded + 1

        if self.request.query_params.get('status'):
            if paramsAdded > 0:
                queryString = queryString + " AND status=\'" + self.request.query_params.get('status') + "\'"
            else:
                queryString = queryString + " WHERE status=\'" + self.request.query_params.get('status') + "\'"
            paramsAdded = paramsAdded + 1
        
        if self.request.query_params.get('notes'):
            if paramsAdded > 0:
                queryString = queryString + " AND notes=\'" + self.request.query_params.get('notes') + "\'"
            else:
                queryString = queryString + " WHERE notes=\'" + self.request.query_params.get('notes') + "\'"
            paramsAdded = paramsAdded + 1

        queryset = Equipment.objects.raw(queryString)
        return queryset

    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer


class ServiceHistoryViewset(viewsets.ModelViewSet):
    queryset = ServiceHistory.objects.all()
    serializer_class = ServiceHistSerializer


class GymClassViewset(viewsets.ModelViewSet):
    queryset = GymClass.objects.all()
    serializer_class = GymClassSerializer


class GymClassAttendanceViewset(viewsets.ModelViewSet):
    queryset = GymClassAttendance.objects.all()
    serializer_class = GymClassAttendanceSerializer
