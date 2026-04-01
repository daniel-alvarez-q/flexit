import datetime
from typing import Type
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Model
from collections import Counter
from rest_framework import permissions, serializers, status
from rest_framework.utils.serializer_helpers import ReturnList, ReturnDict
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from knox.views import LoginView as KnoxLoginView
from FlexItAPI.serializers import (
    LoginSerializer,
    UserSerializer,
    UserMetricsSerializer,
    WorkoutSerializer,
    ExerciseSerializer,
    WorkoutSessionSerializer,
    ExerciseLogSerializer,
)
from FlexItAPI.models import Workout, Exercise, WorkoutSession, ExerciseLog

##### Helpers ######


def query_search(
    model: Type[Model],
    serializer: Type[serializers.Serializer],
    instance_id: int,
    **kwargs,
):
    user = kwargs.get("user")
    try:
        if user:
            queryset = model.objects.get(pk=instance_id, user=user)
        else:
            queryset = model.objects.get(pk=instance_id)
        return Response(serializer(queryset).data)
    except Exception as e:
        return Response(
            {"Error fetching data": f"{e}"}, status=status.HTTP_404_NOT_FOUND
        )


def query_save(serializer, **kwargs):
    user = kwargs.get("user")
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    if user:
        serializer.save(user=user)
    else:
        serializer.save()
    return Response(serializer.data)


def query_delete(model: Type[Model], instance_id: int, request: Request):
    user = request.user
    try:
        instance = model.objects.get(pk=instance_id, user=user)
        return Response(instance.delete()[1])
    except Exception as e:
        return Response(
            {"Error fetching data": f"{e}"}, status=status.HTTP_400_BAD_REQUEST
        )


def query_validate_role(user: User, user_id: int):
    if not user.is_staff and user.pk != user_id:
        raise PermissionError(
            "This user does not have the necessary role to perform this operation."
        )


# Custom login view
class LoginView(KnoxLoginView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"error": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        request.user = user
        response: Response = super().post(request)
        if response.data is None:
            response.data = {}
        if isinstance(response.data, dict):
            response.data["user"] = {
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "is_staff": user.is_staff,
            }
        return response


###### User views, extending Django's default user model #######


class UserListCreate(APIView):
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.AllowAny()]
        if self.request.method == "GET":
            return [permissions.IsAdminUser()]
        return super().get_permissions()

    def get(self, request):
        serializer = self.serializer_class(User.objects.all(), many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        return query_save(serializer)


class UserDetails(APIView):
    serializer_class = UserSerializer

    def get(self, request, id):
        return query_search(User, self.serializer_class, id)

    def delete(self, request, id):
        try:
            query_validate_role(request.user, id)
            return Response(User.objects.get(pk=id).delete())
        except Exception as e:
            return Response(
                {"Error fetching data": f"{e}"}, status=status.HTTP_400_BAD_REQUEST
            )

    def patch(self, request, id):
        try:
            query_validate_role(request.user, id)
            instance = User.objects.get(pk=id)
            serializer = self.serializer_class(data=request.data, instance=instance)
            return query_save(serializer)
        except Exception as e:
            return Response(
                {"Error fetching data": f"{e}"}, status=status.HTTP_400_BAD_REQUEST
            )


class UserMetrics(APIView):

    serializer_class = UserMetricsSerializer

    def get(self, request):
        user = request.user
        serializer = self.serializer_class
        try:
            # workouts = Workout.objects.filter(user=user)
            # exercises = Exercise.objects.filter(user=user).annotate(
            #     Count("exerciselog")
            # )
            sessions = WorkoutSession.objects.filter(user=user)
            logs = ExerciseLog.objects.filter(session__user=user)
        except Exception as e:
            return Response(serializer({}).data)

        payload: dict = {}
        account_lifecycle: float = (
            datetime.datetime.now(datetime.timezone.utc) - user.date_joined
        ).total_seconds() / 86400
        now: datetime.datetime = datetime.datetime.now(datetime.timezone.utc)
        seven_days_delta: datetime.datetime = now - datetime.timedelta(days=7)
        fourteen_days_delta: datetime.datetime = seven_days_delta - datetime.timedelta(
            days=7
        )

        # Session metrics
        payload["total_sessions"] = len(sessions)
        payload["sessions_per_week_ratio"] = len(sessions) / (account_lifecycle / 7)

        sessions_current_week: list[WorkoutSession] = [
            s
            for s in sessions
            if s.start_time >= seven_days_delta and s.end_time is not None
        ]

        sessions_last_week: list[WorkoutSession] = [
            s
            for s in sessions
            if fourteen_days_delta <= s.start_time < seven_days_delta
            and s.end_time is not None
        ]

        payload["session_count_current_week"] = len([s for s in sessions_current_week])
        payload["session_count_last_week"] = len([s for s in sessions_last_week])
        payload["session_minutes_current_week"] = round(
            sum(
                [
                    (s.end_time - s.start_time).total_seconds() / 60
                    for s in sessions_current_week
                    if s.end_time is not None
                ]
            ),
            2,
        )

        payload["session_minutes_last_week"] = round(
            sum(
                [
                    (s.end_time - s.start_time).total_seconds() / 60
                    for s in sessions_last_week
                    if s.end_time is not None
                ]
            ),
            2,
        )

        # Exercise metrics
        payload["total_exercise_logs"] = len(logs)
        payload["logs_per_exercise"] = Counter(
            (l.exercise.pk, l.exercise.name) for l in logs
        )

        logs_current_week: list[ExerciseLog] = [
            l for l in logs if l.log_time >= seven_days_delta
        ]
        logs_last_week: list[ExerciseLog] = [
            l for l in logs if fourteen_days_delta <= l.log_time < seven_days_delta
        ]

        payload["logs_current_week"] = len(logs_current_week)
        payload["logs_last_week"] = len(logs_last_week)
        payload["total_volume_current_week"] = round(
            sum(
                [
                    l.series * l.repetitions * l.weight
                    for l in logs_current_week
                    if l.exercise.category == "str"
                ]
            ),
            2,
        )

        payload["total_volume_last_week"] = round(
            sum(
                [
                    l.series * l.repetitions * l.weight
                    for l in logs_last_week
                    if l.exercise.category == "str"
                ]
            ),
            2,
        )
        payload["logs_per_difficulty"] = Counter(l.exercise.category for l in logs)
        payload["logs_per_focus"] = Counter(l.exercise.focus_area for l in logs)
        payload["logs_per_week_ratio"] = len(logs) / (account_lifecycle / 7)

        return Response(serializer(payload).data)


###### Workout views #######


class WorkoutListCreate(APIView):
    serializer_class = WorkoutSerializer

    def get(self, request):
        queryset = Workout.objects.filter(user=request.user)
        serializer = self.serializer_class(
            queryset, many=True, context={"request": request}
        )
        return Response(serializer.data)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        return query_save(serializer, user=request.user)


class WorkoutDetails(APIView):
    serializer_class = WorkoutSerializer

    def get(self, request, id):
        return query_search(Workout, self.serializer_class, id, user=request.user)

    def patch(self, request, id):
        try:
            instance = Workout.objects.get(pk=id, user=request.user)
            serializer = self.serializer_class(
                instance=instance, data=request.data, partial=True
            )
            return query_save(serializer)
        except Exception as e:
            return Response({"Error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        return query_delete(Workout, id, request)


class WorkoutExercises(APIView):
    serializer_class = ExerciseSerializer

    def get(self, request, id):
        try:
            workout_instance = Workout.objects.get(pk=id, user=request.user)
            exercises = Exercise.objects.filter(workouts=workout_instance)
            return Response(self.serializer_class(exercises, many=True).data)
        except Exception as e:
            return Response(
                {f"Error fetching data: {e}"}, status=status.HTTP_400_BAD_REQUEST
            )


class WorkoutSessions(APIView):
    serializer_class = WorkoutSessionSerializer

    def get(self, request, id):
        try:
            workout_instance = Workout.objects.get(pk=id, user=request.user)
            workout_sessions = WorkoutSession.objects.filter(
                workout=workout_instance
            ).order_by(
                "-start_time"
            )  # Note it is set in descending order!
            return Response(self.serializer_class(workout_sessions, many=True).data)
        except Exception as e:
            return Response(
                {f"Error fetching data: {e}"}, status=status.HTTP_400_BAD_REQUEST
            )


###### Exercise views #######


class ExerciseListCreate(APIView):
    serializer_class = ExerciseSerializer

    def get(self, request):
        return Response(
            self.serializer_class(
                Exercise.objects.filter(user=request.user), many=True
            ).data
        )

    def post(self, request):
        return query_save(self.serializer_class(data=request.data), user=request.user)


class ExerciseDetails(APIView):
    serializer_class = ExerciseSerializer

    def get(self, request: Request, id):
        include: list | None = (
            request.query_params.get("include", "").lower().split(",")
        )
        user: User | None = request.user
        exercise: Exercise = Exercise()
        exercise_serialized: ReturnDict | ReturnList | None = None
        try:
            if user:
                if not user.is_superuser:
                    exercise = Exercise.objects.get(pk=id, user=user)
                else:
                    exercise = Exercise.objects.get(pk=id)
        except Exercise.DoesNotExist as e:
            return Response(f"{e}", status=status.HTTP_404_NOT_FOUND)

        if include:
            # Auxiliary date entities
            current_date: datetime.datetime = datetime.datetime.now(
                datetime.timezone.utc
            )
            cutout_month: datetime.datetime = (
                current_date - datetime.timedelta(days=(current_date.day - 1))
            ).replace(hour=0, minute=0, second=0, microsecond=1)
            print(cutout_month)

            # lifecycle_days:int = (current_date - exercise.created_at).days
            # weeks = int(lifecycle_days/7) if lifecycle_days >= 14 else 1

            # Initialization
            context: dict = {}
            logs: list[ExerciseLog] = list(
                ExerciseLog.objects.filter(exercise=exercise)
            )

            # Additional payloads
            if "logs" in include:
                logs_serialized: ReturnList | ReturnDict = ExerciseLogSerializer(
                    logs, many=True
                ).data
                context["logs"] = logs_serialized

            if "workouts_full" in include:
                context["workouts_full"] = True

            if "kpis" in include:
                kpis: dict[str, int] = {}
                kpis["associated_workouts"] = len(exercise.workouts.all())
                kpis["total_logs"] = len(logs)
                kpis["logs_current_month"] = len(
                    [l for l in logs if l.log_time >= cutout_month]
                )
                context["kpis"] = kpis

            if "timeseries" in include:
                timeseries: dict = {}
                if exercise.category == "str":
                    test = {
                        l.log_time.strftime("%Y-%m-%d, %H:%M"): {
                            "1RM": l.weight * (1 + (l.repetitions / 30)),
                            "volume": l.weight * l.repetitions * l.series,
                            "weight": l.weight,
                            "reps": l.repetitions,
                            "series": l.series,
                        }
                        for l in logs
                    }
                    timeseries = test

                context["timeseries"] = timeseries

            exercise_serialized = self.serializer_class(exercise, context=context).data

        else:
            exercise_serialized = self.serializer_class(exercise).data

        return Response(exercise_serialized)

    def patch(self, request, id):
        try:
            instance = Exercise.objects.get(pk=id, user=request.user)
            serializer = self.serializer_class(
                instance=instance, data=request.data, partial=True
            )
            return query_save(serializer)
        except Exception as e:
            return Response(
                {"Error performing patch operation": f"{e}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, id):
        return query_delete(Exercise, id, request)


class ExerciseExerciseLogs(APIView):
    serializer_class = ExerciseLogSerializer

    def get(self, request, id):
        try:
            exercise = Exercise.objects.get(user=request.user, pk=id)
            # logs = exercise.exerciselog_set.all()
            logs = ExerciseLog.objects.filter(exercise=exercise)
            return Response(self.serializer_class(logs, many=True).data)
        except Exception as e:
            return Response({"Error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)


###### WorkoutSession views #######


class WorkoutSessionListCreate(APIView):
    serializer_class = WorkoutSessionSerializer

    def get(self, request):
        return Response(
            self.serializer_class(
                WorkoutSession.objects.filter(user=request.user).order_by(
                    "-start_time"
                ),
                many=True,
            ).data
        )

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        return query_save(serializer, user=request.user)


class WorkoutSessionDetails(APIView):
    serializer_class = WorkoutSessionSerializer

    def get(self, request, id):
        return query_search(
            WorkoutSession, self.serializer_class, id, user=request.user
        )

    def patch(self, request, id):
        try:
            instance = WorkoutSession.objects.get(pk=id, user=request.user)
        except Exception as e:
            return Response(
                {"Error performing patch operation": f"{e}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            return query_save(
                self.serializer_class(
                    instance=instance, data=request.data, partial=True
                )
            )

    def delete(self, request, id):
        return query_delete(WorkoutSession, id, request)

    ###### ExerciseLog views ######


class ExerciseLogListCreate(APIView):
    serializer_class = ExerciseLogSerializer

    def post(self, request):
        try:
            serializer = self.serializer_class(data=request.data)
            return query_save(serializer)
        except Exception as e:
            return Response({"Error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
