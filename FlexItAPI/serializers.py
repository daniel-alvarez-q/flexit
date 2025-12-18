from rest_framework import serializers
from django.contrib.auth.models import User
from FlexItAPI.models import Workout,Exercise,WorkoutSession,WorkoutExercise



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
        fields = ['id','user','name','description','source_url','created_at','updated_at'] 
        
    def create(self, validated_data):
        return Workout.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.source_url = validated_data.get('source_url', instance.source_url)
        instance.save()
        return instance
        
class ExerciseSerializer(serializers.ModelSerializer):
    workouts = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Workout.objects.all(),
        write_only=True,
        required=False
    )
    class Meta:
        model = Exercise
        fields = ['id','user','workouts','name','description','category','created_at','updated_at']
        
    def create(self, validated_data):
        workout_instances = validated_data.pop('workouts', None)
        exercise = Exercise.objects.create(**validated_data)
        if workout_instances:          
            exercise.workouts.set(workout_instances)
        return exercise

class WorkourSessionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutSession
        fields = ['id','user','workout','start_time','end_time']
            
            
        