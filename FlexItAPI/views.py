from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import BasicAuthentication
from rest_framework.decorators import permission_classes as permission_decorator
from knox.views import LoginView as KnoxLoginView
from FlexItAPI.serializers import UserSerializer, WorkoutSerializer
from FlexItAPI.models import Workout 


class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]

# ViewSets define the view behavior.
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
        serializer.is_valid()
        try:
            serializer.save()
            output = serializer.data
        except AssertionError as e:
            output = serializer.errors
        return Response(output)
        
class UserDetails(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer
    
    def get(self,request,id):
        print(request.data)
        queryset = User.objects.get(pk=id)
        serializer = self.serializer_class(queryset)
        return Response(serializer.data)   
    
class WorkoutListCreate(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = WorkoutSerializer
    
    def get(self, request):
        print(request.data)
        queryset = Workout.objects.all()
        serializer = self.serializer_class(queryset, many=True, context={'request':request})
        return Response(serializer.data)
