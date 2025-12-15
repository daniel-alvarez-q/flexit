from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.views import APIView
from FlexItAPI.serializers import UserSerializer, WorkoutSerializer
from FlexItAPI.models import Workout 

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
