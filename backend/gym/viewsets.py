from django.contrib.auth.models import User
from .models import *
from rest_framework import viewsets, generics
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from django.db.models import F
from django.db.models.expressions import RawSQL

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
    
    def get_queryset(self):
        print(self.request.query_params)
        paramExists = False
        for param in self.request.query_params:
            if self.request.query_params[param]:
                if param != "startDate" and param != "endDate":
                    paramExists = True
        if self.request.query_params.get("startDate") and self.request.query_params.get("endDate"):
            paramExists = True

        if paramExists:
            statement = "SELECT * FROM gym_member WHERE "
            name = self.request.query_params.get("name")
            membership_type = self.request.query_params.get("membership_type")
            referrals = self.request.query_params.get("referrals")
            payment = self.request.query_params.get("good_payment_standing")
            startDate = self.request.query_params.get("startDate")
            endDate = self.request.query_params.get("endDate")
            alreadyAdded = False
            if name:
                statement += "name LIKE \"%%" + name + "%%\""
                alreadyAdded = True
            if referrals:
                if alreadyAdded: statement += " AND "   
                statement += "referrals = \"" + referrals + "\""
                alreadyAdded = True
            if membership_type:
                if alreadyAdded: statement += " AND "
                statement += "membership_type_id = \"" + membership_type + "\""
                alreadyAdded = True
            if payment:
                if alreadyAdded: statement += " AND "
                statement += "good_payment_standing = \"" + payment + "\""
            if startDate:
                if endDate:
                    if alreadyAdded: statement += " AND "
                    statement += "last_attended BETWEEN \"" + startDate + "\" AND \"" + endDate + "\""
            print(statement)
            queryset = Member.objects.raw(statement)
        else:
            queryset = Member.objects.raw('SELECT * FROM gym_member')
        return queryset


class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer

    def get_queryset(self):
        print(self.request.query_params)
        paramExists = False
        for param in self.request.query_params:
            if self.request.query_params[param] and self.request.query_params[param] != "NaN":
                paramExists = True

        if paramExists:
            statement = "SELECT * FROM gym_membership WHERE "
            name = self.request.query_params.get("name")
            cost = self.request.query_params.get("cost")
            payment_periods = self.request.query_params.get("payment_periods")
            benefits = self.request.query_params.get("benefits")
            alreadyAdded = False
            if name:
                statement += "name LIKE \"%%" + name + "%%\""
                alreadyAdded = True
            if cost and cost != "NaN":
                if alreadyAdded: statement += " AND "   
                statement += "cost = \"" + cost + "\""
                alreadyAdded = True
            if payment_periods:
                if alreadyAdded: statement += " AND "
                statement += "payment_periods = \"" + payment_periods + "\""
                alreadyAdded = True
            if benefits:
                if alreadyAdded: statement += " AND "
                statement += "benefits LIKE \"%%" + benefits + "%%\""
            print(statement)
            queryset = Membership.objects.raw(statement)
        else:
            queryset = Membership.objects.all()
        return queryset

        


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

    def get_queryset(self):
        print(self.request.query_params)
        paramExists = False
        for param in self.request.query_params:
            if self.request.query_params[param] and self.request.query_params[param] != "NaN":
                paramExists = True

        if paramExists:
            statement = "SELECT * FROM gym_gymclass WHERE "
            instructor = self.request.query_params.get("instructor")
            cost = self.request.query_params.get("cost")
            capacity = self.request.query_params.get("capacity")
            alreadyAdded = False
            if instructor:
                statement += "instructor_id = \"" + instructor + "\""
                alreadyAdded = True
            if cost and cost != "NaN":
                if alreadyAdded: statement += " AND "   
                statement += "cost = \"" + cost + "\""
                alreadyAdded = True
            if capacity and capacity != "NaN":
                if alreadyAdded: statement += " AND "
                statement += "capacity >= \"" + capacity + "\""
                alreadyAdded = True
            print(statement)
            queryset = GymClass.objects.raw(statement)
        else:
            queryset = GymClass.objects.all()
        return queryset
        




class GymClassAttendanceViewset(viewsets.ModelViewSet):
    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `gym_class` query parameter in the URL.
        """
        queryset = GymClassAttendance.objects.all()
        gym_class = self.request.query_params.get('gym_class')
        if gym_class is not None:
            queryset = queryset.filter(gym_class=gym_class)
        return queryset

    queryset = GymClassAttendance.objects.all()
    serializer_class = GymClassAttendanceSerializer
