from typing import Type
from django.contrib.auth.models import User
from django.db.models import Model
from rest_framework import permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.authentication import BasicAuthentication
from rest_framework.decorators import permission_classes as permission_decorator
from knox.views import LoginView as KnoxLoginView
from FlexItAPI.serializers import UserSerializer, WorkoutSerializer, ExerciseSerializer, WorkourSessionsSerializer
from FlexItAPI.models import Workout, Exercise 

##### Helpers ######

def query_search(model:Type[Model], serializer:Type[serializers.Serializer], id:int, **kwargs):
    user = kwargs.get('user')
    try:
        if user:
            queryset = model.objects.get(pk=id, user=user)
        else:
            queryset = model.objects.get(pk=id)
        output = serializer(queryset).data
    except Exception as e:
        output = {'Error performing query': e}
    return output

def query_save(serializer, **kwargs):
    try:
        serializer.is_valid(raise_exception=True)
    except AssertionError as e:
        output = serializer.errors
    else:
        serializer.save()
        output = serializer.data
    return output

def query_delete(model:Type[Model],id:int,request:Request):
    user = request.user
    try:
        isinstance = model.objects.get(pk=id, user=user)
        output = isinstance.delete()[1]
    except Exception as e:
        output = {'Error performing query': f'{e}'}
    return output

# Custom login view
class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]

# User views, using Django's default user model.
class UserListCreate(APIView):
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.AllowAny()]
        if self.request.method == "GET":
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    def get(self,request):
        queryset = User.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        output = query_save(serializer)
        return Response(output)
        
class UserDetails(APIView):
    serializer_class = UserSerializer
    
    def get(self,request,id):
        return Response(query_search(User, self.serializer_class, id))
    
    def delete(self,request,id):
        user = request.user
        try:
            if not user.is_staff:
                assert user.id == id, 'User does not have the necessary role to delete users other than itself.'
            output = User.objects.get(pk=id).delete()
        except Exception as e:
            output = {'Error performing query': f'{e}'}
        return Response(output)   
    
# Workout views
class WorkoutListCreate(APIView):
    serializer_class = WorkoutSerializer
    
    def get(self, request):
        queryset = Workout.objects.filter(user=request.user)
        serializer = self.serializer_class(queryset, many=True, context={'request':request})
        return Response(serializer.data)
    
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        return Response(query_save(serializer))
    
class WorkoutDetails(APIView):
    serializer_class = WorkoutSerializer
    
    def get(self,request,id):
        return Response(query_search(Workout, self.serializer_class,id, user=request.user))
    
    def patch(self,request,id):
        try:
            instance = Workout.objects.get(pk=id, user=request.user)
            serializer = self.serializer_class(instance=instance, data=request.data, partial=True)
            output = query_save(serializer)
        except Exception as e:
            output = {'Error': f'{e}'}
        return Response(output)
    
    def delete(self,request,id):
        return Response(query_delete(Workout, id, request))
    
class WorkoutExercises(APIView):
    serializer_class = ExerciseSerializer

    def get(self,request,workout_id):
        try:
            workout_instance = Workout.objects.get(pk=workout_id, user=request.user)
            exercises = workout_instance.exercises.values()
            output = self.serializer_class(exercises, many=True).data
        except Exception as e:
            output = {f"Error: {e}"}
        return Response(output)
    
class ExerciseListCreate(APIView):
    serializer_class = ExerciseSerializer
    
    def get(self,request):
        return Response(self.serializer_class(Exercise.objects.filter(user=request.user),many=True).data)
    
    def post(self,request):
        return Response(query_save(self.serializer_class(data=request.data)))
    
class ExerciseDetails(APIView):
    serializer_class = ExerciseSerializer
    
    def get(self,request,id):
        return Response(query_search(Exercise, self.serializer_class,id,user=request.user))
    
    def patch(self, request, id):
        try:
            instance = Exercise.objects.get(pk=id, user=request.user)
            serializer = self.serializer_class(instance=instance, data=request.data, partial=True)
            output = query_save(serializer)
        except Exception as e:
            output = {'Error': f'{e}'}
        return Response(output)
    
    def delete(self,request, id):
        return Response(query_delete(Exercise, id, request))