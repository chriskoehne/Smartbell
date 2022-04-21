from datetime import date
from django.db import models
from localflavor.us.models import USSocialSecurityNumberField
from djmoney.models.fields import MoneyField
from django.utils.translation import gettext_lazy as _


# Create your models here.

# primary keys are added by default unless explicitly done

class Membership(models.Model):

    class Periods(models.TextChoices):
        WEEKLY = 'W', _('Weekly')
        MONTHLY = 'M', _('Monthly')
        YEARLY = 'Y', _('Yearly')


    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    cost = MoneyField(max_digits=6, decimal_places=2, default_currency='USD')
    payment_periods = models.CharField(
        max_length=1,
        choices=Periods.choices,
        default=Periods.MONTHLY
    )
    benefits = models.TextField()

    def _str_(self):
        return self.name


class Member(models.Model):

    name = models.CharField(max_length=255)
    birthday = models.DateField()
    membership_type = models.ForeignKey(Membership, on_delete=models.CASCADE)
    good_payment_standing = models.BooleanField(default=True)
    last_attended = models.DateField(default=date.today)
    referrals = models.IntegerField(default=0)

    def _str_(self):
        return self.name


class Employee(models.Model):

    name = models.CharField(max_length=255)
    hire_date = models.DateField()
    wage = MoneyField(max_digits=6, decimal_places=2, default_currency='USD')
    ssn = USSocialSecurityNumberField()
    hire_date = models.DateField(default=date.today)

    def _str_(self):
        return self.name


class Equipment(models.Model):

    class Statuses(models.IntegerChoices):
        NEW = 0, _('New')
        LIGHTLY_USED = 1, _('Lightly Used')
        HEAVILY_USED = 2, _('Heavily Used')
        NEEDS_SERVICE = 3, _('Needs Repair')
        SERVICING = 4, _('Servicing')


    name = models.CharField(max_length=255)
    status = models.IntegerField(
        choices=Statuses.choices,
        default=Statuses.NEW
    )
    notes = models.TextField()

    def _str_(self):
        return self.name


class ServiceHistory(models.Model):

    equipment_id = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    employee_id = models.ForeignKey(Employee, on_delete=models.PROTECT)
    date = models.DateField(default=date.today)

    def _str_(self):
        return self.equipment_id + ' | ' + self.employee_id


class GymClass(models.Model):

    instructor = models.ForeignKey(Employee, on_delete=models.CASCADE)
    datetime = models.DateTimeField()
    cost = MoneyField(max_digits=6, decimal_places=2, default_currency='USD')

    def _str_(self):
        return self.instructor + ' | ' + self.datetime + ' | ' + self.cost


class GymClassAttendance(models.Model):

    gym_class = models.ForeignKey(GymClass, on_delete=models.PROTECT)
    member = models.ForeignKey(Employee, on_delete=models.PROTECT)

    def _str_(self):
        return self.session + ' | ' + self.member