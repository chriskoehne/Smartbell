from django.shortcuts import HttpResponse, render

from django.views.generic import ListView

from .models import *

# Create your views here.
def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

def hello(request):
    text = """<h1>Welcome to the app! </h1>"""
    return HttpResponse(text)


