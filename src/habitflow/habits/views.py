from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Habit
from .serializers import HabitSerializer

class HabitListCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        habits = Habit.objects.filter(user=request.user)
        serializer = HabitSerializer(habits, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = HabitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HabitDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Habit.objects.get(pk=pk, user=user)
        except Habit.DoesNotExist:
            return None

    def put(self, request, pk):
        habit = self.get_object(pk, request.user)
        if not habit:
            return Response({"error": "Habit not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = HabitSerializer(habit, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        habit = self.get_object(pk, request.user)
        if not habit:
            return Response({"error": "Habit not found"}, status=status.HTTP_404_NOT_FOUND)
        habit.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class HabitStatsView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        habits = Habit.objects.filter(user=request.user)
        total = habits.count()
        completed = habits.filter(completed=True).count()
        pending = habits.filter(completed=False).count()

        return Response({
            "total": total,
            "completed": completed,
            "pending": pending
        }, status=status.HTTP_200_OK)