from typing import Type
import json
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Model
from rest_framework import permissions, serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import permission_classes as permission_decorator
from knox.views import LoginView as KnoxLoginView
from FlexItAPI.serializers import LoginSerializer,UserSerializer, WorkoutSerializer, ExerciseSerializer, WorkoutSessionSerializer, ExerciseLogSerializer
from FlexItAPI.models import Workout, Exercise, WorkoutSession, ExerciseLog

##### Helpers ######

def query_search(model:Type[Model], serializer:Type[serializers.Serializer], instance_id:int, **kwargs):
    user = kwargs.get('user')
    try:
        if user:
            queryset = model.objects.get(pk=instance_id, user=user)
        else:
            queryset = model.objects.get(pk=instance_id)
        return Response(serializer(queryset).data)
    except Exception as e:
        return Response({'Error fetching data': f'{e}'}, status=status.HTTP_404_NOT_FOUND)

def query_save(serializer, **kwargs):
    user = kwargs.get('user')
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if user:   
        serializer.save(user=user)
    else:
        serializer.save()
    return Response(serializer.data)

def query_delete(model:Type[Model],instance_id:int,request:Request):
    user = request.user
    try:
        instance = model.objects.get(pk=instance_id, user=user)
        return Response(instance.delete()[1])
    except Exception as e:
        return Response({'Error fetching data': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)

def query_validate_role(user:User,user_id:int):
    if not user.is_staff and user.pk != user_id:
        raise PermissionError('This user does not have the necessary role to perform this operation.')
            
# Custom login view
class LoginView(KnoxLoginView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer
    
    def post(self, request, format=None):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user is None:
            return Response(
                {'error': 'Invalid username or password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        request.user = user
        response = super().post(request)
        response.data['user'] = {'username': user.username, 
                                 'first_name':user.first_name, 
                                 'last_name': user.last_name, 
                                 'email':user.email, 
                                 'is_staff': user.is_staff}
        return response

###### User views, using Django's default user model #######

class UserListCreate(APIView):
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.AllowAny()]
        if self.request.method == "GET":
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    def get(self,request):
        serializer = self.serializer_class(User.objects.all(), many=True)
        return Response(serializer.data)
    
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        return query_save(serializer)
        
class UserDetails(APIView):
    serializer_class = UserSerializer
    
    def get(self,request,id):
        return query_search(User, self.serializer_class, id)
    
    def delete(self,request,id):
        try:
            query_validate_role(request.user, id)
            return Response(User.objects.get(pk=id).delete())
        except Exception as e:
            return Response({'Error fetching data': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self,request,id):
        try:
            query_validate_role(request.user,id)
            instance = User.objects.get(pk=id)
            serializer = self.serializer_class(data=request.data, instance=instance)
            return query_save(serializer)
        except Exception as e:
             return Response({'Error fetching data': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)
    
###### Workout views #######

class WorkoutListCreate(APIView):
    serializer_class = WorkoutSerializer
    
    def get(self, request):
        queryset = Workout.objects.filter(user=request.user)
        serializer = self.serializer_class(queryset, many=True, context={'request':request})
        return Response(serializer.data)
    
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        return query_save(serializer, user=request.user)
    
class WorkoutDetails(APIView):
    serializer_class = WorkoutSerializer
    
    def get(self,request,id):
        return query_search(Workout, self.serializer_class,id, user=request.user)
    
    def patch(self,request,id):
        try:
            instance = Workout.objects.get(pk=id, user=request.user)
            serializer = self.serializer_class(instance=instance, data=request.data, partial=True)
            return query_save(serializer)
        except Exception as e:
            return Response({'Error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request,id):
        return query_delete(Workout, id, request)
    
class WorkoutExercises(APIView):
    serializer_class = ExerciseSerializer

    def get(self,request,id):
        try:
            workout_instance = Workout.objects.get(pk=id, user=request.user)
            exercises = workout_instance.exercises.all()
            return Response(self.serializer_class(exercises, many=True).data)
        except Exception as e:
            return Response({f"Error fetching data: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        
class WorkoutSessions(APIView):
    serializer_class = WorkoutSessionSerializer
    
    def get(self,request,id):
        try:
            workout_instance = Workout.objects.get(pk=id, user=request.user)
            workout_sessions = workout_instance.workoutsession_set.all().order_by('-start_time') #Note it is set in descending order! 
            return Response(self.serializer_class(workout_sessions, many=True).data)
        except Exception as e:
            return Response({f"Error fetching data: {e}"}, status=status.HTTP_400_BAD_REQUEST)    

###### Exercise views #######

class ExerciseListCreate(APIView):
    serializer_class = ExerciseSerializer
    
    def get(self,request):
        return Response(self.serializer_class(Exercise.objects.filter(user=request.user),many=True).data)
    
    def post(self,request):
        return query_save(self.serializer_class(data=request.data), user=request.user)
    
class ExerciseDetails(APIView):
    serializer_class = ExerciseSerializer
    
    def get(self,request,id):
        return query_search(Exercise, self.serializer_class,id,user=request.user)
    
    def patch(self, request, id):
        try:
            instance = Exercise.objects.get(pk=id, user=request.user)
            serializer = self.serializer_class(instance=instance, data=request.data, partial=True)
            return query_save(serializer)
        except Exception as e:
            return Response({'Error performing patch operation': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request, id):
        return query_delete(Exercise, id, request)
    
###### WorkoutSession views #######

class WorkoutSessionListCreate(APIView):
    serializer_class = WorkoutSessionSerializer
    
    def get(self,request):
        return Response(self.serializer_class(WorkoutSession.objects.filter(user=request.user).order_by('-start_time'), many=True).data)
     
    def post(self,request):
        serializer = self.serializer_class(data=request.data)
        return query_save(serializer,user=request.user)
    
class WorkoutSessionDetails(APIView):
    serializer_class = WorkoutSessionSerializer
    
    def get(self,request,id):
        return query_search(WorkoutSession, self.serializer_class, id, user=request.user)
    
    def patch(self,request,id):
        try:
            instance = WorkoutSession.objects.get(pk=id, user=request.user)
        except Exception as e:
            return Response({'Error performing patch operation': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return query_save(self.serializer_class(instance=instance, data=request.data, partial=True))
        
    def delete(self,request, id):
        return query_delete(WorkoutSession, id, request)
    
    ###### ExerciseLog views ######
    
class ExerciseLogListCreate(APIView):
    serializer_class = ExerciseLogSerializer
    
    def post(self,request):
        try:
            serializer = self.serializer_class(data=request.data)
            return query_save(serializer)
        except Exception as e:
            return Response({'Error': f'{e}'}, status=status.HTTP_400_BAD_REQUEST)