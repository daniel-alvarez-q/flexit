from rest_framework import serializers
from django.contrib.auth.models import User
from FlexItAPI.models import Workout 



# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']
        
class WorkoutSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Workout
        fields = ['user', 'name', 'description', 'source_url']