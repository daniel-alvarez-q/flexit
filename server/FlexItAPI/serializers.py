import re,datetime
from rest_framework import serializers
from django.contrib.auth.models import User
from FlexItAPI.models import Workout,Exercise,WorkoutSession,ExerciseLog

##### Helpers #####

# def username_validator(input:str):
#     if not re.fullmatch(r"^[\w.@+-]+\Z", input):
#         raise serializers.ValidationError('Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters.')
#     return 

# Serializers define the API representation.
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True)
    password = serializers.CharField(
        required=True, 
        write_only=True)
    is_staff = serializers.BooleanField(
        default=False,
        read_only=True)
    
    class Meta:
        model = User
        fields = ['id','first_name','last_name','username', 'email','password','is_staff']
        
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = User.objects.create(**validated_data)
        if password:
            instance.set_password(password)
            instance.save()
        return instance
    
    def update(self,instance,validated_data):
        password = validated_data.pop('password', None)
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
        
class WorkoutSerializer(serializers.ModelSerializer):
    source_url=serializers.URLField(
        allow_null=True,
        required=False)
    user = serializers.PrimaryKeyRelatedField(
        many=False,
        read_only=True)
    
    class Meta:
        model = Workout
        fields = ['id','name','description','difficulty','source_url','user','created_at','updated_at'] 
        
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
    user = serializers.PrimaryKeyRelatedField(
        many=False,
        read_only=True,
    )
    
    class Meta:
        model = Exercise
        fields = ['id','workouts','name','description','difficulty','series','repetitions','weight','duration','distance','category','user','created_at','updated_at']
        
    def create(self, validated_data):
        workout_instances = validated_data.pop('workouts', None)
        instance = Exercise.objects.create(**validated_data)
        if workout_instances:
            instance.workouts.set(workout_instances)
        return instance
    
    def update(self, instance, validated_data):
        workout_instances = validated_data.pop('workouts',[])
        workouts_updated = Workout.objects.filter(pk__in=[x.id for x in instance.workouts.all()]+[x.id for x in workout_instances])
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.category = validated_data.get('category', instance.category)
        instance.save()
        instance.workouts.set(workouts_updated)
        return instance
    
class ExerciseLogSerializer(serializers.ModelSerializer):
    session=serializers.PrimaryKeyRelatedField(
        queryset=WorkoutSession.objects.all()
    )
    exercise=serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.all()
    )
    notes=serializers.CharField(required=False, max_length=2000, allow_blank=True)
    
    class Meta:
        model = ExerciseLog
        fields = ['session','exercise','series','repetitions','weight','duration','distance','notes','log_time']
        
class WorkoutSessionSerializer(serializers.ModelSerializer):
    workout=serializers.PrimaryKeyRelatedField(
        queryset=Workout.objects.all(),
        required=True
    )
    exercise_logs=ExerciseLogSerializer(
        many=True, 
        required=False
    )
    
    class Meta:
        model = WorkoutSession
        fields = ['id','workout','exercise_logs','user','start_time','end_time']
        
    def create(self,validated_data):
        exercise_logs = validated_data.pop('exercise_logs',[])
        workoutsession = WorkoutSession(**validated_data)
        workoutsession.start_time = datetime.datetime.now(datetime.timezone.utc)
        workoutsession.save()
        for log_data in exercise_logs:
            log = ExerciseLog(**log_data)
            log.session = workoutsession
            log.save()
        return workoutsession
    
    def update(self,instance,validated_data):
        exercise_logs = validated_data.pop('exercise_logs',[])
        instance.workout = validated_data.get('workout', instance.workout)
        instance.end_time = validated_data.get('end_time', instance.end_time)
        instance.save()
        for log_data in exercise_logs:
            log = ExerciseLog(**log_data)
            log.session = instance
            log.save()
        return instance