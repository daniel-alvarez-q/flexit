from rest_framework import serializers
from django.contrib.auth.models import User
from FlexItAPI.models import Workout,Exercise,WorkoutSession



# Serializers define the API representation.
class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    
    class Meta:
        model = User
        fields = ['id','username', 'email','is_staff']
        
    def create(self, validated_data):
        return User.objects.create(**validated_data)
        
class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        fields = ['user','name','description','source_url','created_at','updated_at'] 
        
    def create(self, validated_data):
        return Workout.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.source_url = validated_data.get('source_url', instance.source_url)
        instance.save()
        return instance
        
class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['user','workout','name','description','category','created_at','updated_at']

class WorkourSessionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutSession
        fields = ['user','workout','start_time','end_time']