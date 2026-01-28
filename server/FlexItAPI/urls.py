from django.urls import path,include
from rest_framework import routers
from . import views

app_name = 'FlexItAPI'

# Routers provide an easy way of automatically determining the URL conf.


urlpatterns = [
    path(r'users', views.UserListCreate.as_view(), name='users'),
    path(r'user/<int:id>', views.UserDetails.as_view(), name='user-detail'),
    path(r'workouts', views.WorkoutListCreate.as_view(), name='workouts'),
    path(r'workout/<int:id>', views.WorkoutDetails.as_view(), name='workout-detail'),
    path(r'workout/<int:id>/exercises', views.WorkoutExercises.as_view(),name='workoutexercises'),
    path(r'workout/<int:id>/sessions', views.WorkoutSessions.as_view(), name='workoutsessions'),
    path(r'exercises', views.ExerciseListCreate.as_view(), name='exercises'),
    path(r'exercise/<int:id>', views.ExerciseDetails.as_view(), name='exercise-detail'),
    path(r'workoutsessions', views.WorkoutSessionListCreate.as_view(), name='sessions'),
    path(r'workoutsession/<int:id>', views.WorkoutSessionDetails.as_view(), name='session-detail')
]