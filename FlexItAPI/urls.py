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
    path(f'exercises', views.ExerciseListCreate.as_view(), name='exercises')
]