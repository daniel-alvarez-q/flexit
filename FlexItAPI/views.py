from typing import Type
from django.contrib.auth.models import User
from django.db.models import Model
from rest_framework import permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import BasicAuthentication
from rest_framework.decorators import permission_classes as permission_decorator
from knox.views import LoginView as KnoxLoginView
from FlexItAPI.serializers import UserSerializer, WorkoutSerializer, ExerciseSerializer, WorkourSessionsSerializer
from FlexItAPI.models import Workout 

##### Helpers ######

def query_search(model:Type[Model], serializer:Type[serializers.Serializer], id:int, **kwargs):
    user = kwargs.get('user')
    try:
        if user:
            queryset = model.objects.get(pk=id, user=user)
        else:
            queryset = model.objects.get(pk=id)
        output = serializer(queryset).data
    except:
        output = {'DoesNotExists': f'No objects of type {model} match the provided search pattern'}
    return output

def query_save(serializer):
    serializer.is_valid(raise_exception=False)
    try:
        serializer.save()
        output = serializer.data
    except AssertionError as e:
        output = serializer.errors
    return output

# Custom login view
class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]

# User views, using Django's default user model.
class UserListCreate(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    @permission_decorator([permissions.IsAdminUser])
    def get(self,request):
        queryset = User.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        output = query_save(serializer)
        return Response(output)
        
class UserDetails(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer
    
    def get(self,request,id):
        output = query_search(User, self.serializer_class, id)
        return Response(output)   
    
# Workout views
class WorkoutListCreate(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = WorkoutSerializer
    
    def get(self, request):
        print(request.data)
        queryset = Workout.objects.filter(user=request.user)
        serializer = self.serializer_class(queryset, many=True, context={'request':request})
        return Response(serializer.data)
    
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        output = query_save(serializer)
        return Response(output)
    
class WorkoutDetails(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = WorkoutSerializer
    
    def get(self,request,id):
        output = query_search(Workout, self.serializer_class,id, user=request.user)
        return Response(output)
    
    def patch(self,request,id):
        instance = Workout.objects.get(pk=id, user=request.user)
        serializer = self.serializer_class(instance=instance, data=request.data, partial=True)
        output = query_save(serializer)
        return Response(output)