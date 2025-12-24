from django.db import models
from django.contrib.auth.models import User
from datetime import timedelta

#Choices

EXERCISE_CATEGORIES = [
    ('str','strength'),
    ('car','cardio'),
    ('flx','flexibility'),
    ('res','resistance'),
    ('oth','other')
]

DIFICULTY_CATEGORIES = [
    ('ext', 'extreme'),
    ('hig', 'high'),
    ('med', 'medium'),
    ('low', 'low')
]

#Workout
class Workout(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=2000)
    difficulty = models.CharField(max_length=3, choices=DIFICULTY_CATEGORIES, default='med')
    source_url = models.URLField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
#Exercise
class Exercise(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    #Note the parameter 'related_name', since it conditions the inverse relationship (otherwise would be exercise_set)
    workouts = models.ManyToManyField(Workout, through='WorkoutExercise', related_name='exercises', blank=True)
    name = models.CharField(max_length=100, blank=False)
    description = models.TextField(max_length=2000)
    difficulty = models.CharField(max_length=3, choices=DIFICULTY_CATEGORIES, default='med')
    series = models.IntegerField(default=0)
    repetitions = models.IntegerField(default=0)
    weight = models.FloatField(default=0)
    duration = models.FloatField(default=0)
    distance = models.FloatField(default=0)
    category = models.CharField(max_length=3, choices=EXERCISE_CATEGORIES, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
#WorkoutExercise (relational table)
class WorkoutExercise(models.Model):
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    order = models.IntegerField(null=True) 
    
#Sessions
class WorkoutSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE, editable=False)
    exercises = models.ManyToManyField(Exercise, through='ExerciseLog', related_name='logged_sessions', editable=True, blank=True)
    start_time = models.DateTimeField(editable=False, blank=False)
    end_time = models.DateTimeField(null=True)
    
    class Meta:
        get_latest_by = 'start_time'
        
#Exercise log (relational table)
class ExerciseLog(models.Model):
    session = models.ForeignKey(WorkoutSession, on_delete=models.CASCADE, related_name='exercise_logs')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    series = models.IntegerField(default=0)
    repetitions = models.IntegerField(default=0)
    weight = models.FloatField(default=0)
    duration = models.FloatField(default=0)
    distance = models.FloatField(default=0)
    notes = models.TextField(max_length=2000)
    log_time = models.DateTimeField()