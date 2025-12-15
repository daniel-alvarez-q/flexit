from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.authentication import BasicAuthentication
from knox.views import LoginView as KnoxLoginView
from knox.auth import TokenAuthentication
from FlexItAPI.serializers import UserSerializer, WorkoutSerializer
from FlexItAPI.models import Workout 


class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
class WorkoutViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
