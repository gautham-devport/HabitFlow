# aicoach/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import requests
import json
import re

class AICoachView(APIView):
    """
    POST {'query': '...'}
    Returns a clean JSON array of 8-10 habit suggestions.
    """

    def post(self, request):
        user_input = request.data.get("query", "")
        if not user_input:
            return Response({"error": "Query is required"}, status=status.HTTP_400_BAD_REQUEST)

        API_URL = "https://router.huggingface.co/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.HUGGINGFACE_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "deepseek-ai/DeepSeek-V3.2-Exp:novita",
            "messages": [
                {"role": "system", "content": "You are an AI coach for healthy habits. Only give habits related to health, fitness, or personal productivity. Return at least 8 habits as a JSON array with 'title' and 'description'."},
                {"role": "user", "content": user_input}
            ],
            "max_new_tokens": 600
        }

        try:
            response = requests.post(API_URL, headers=headers, json=payload)
            response.raise_for_status()
            result = response.json()

            # Get AI text
            try:
                chat_text = result["choices"][0]["message"]["content"]
            except (KeyError, IndexError):
                return Response({"error": "Invalid response from Hugging Face API"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            suggestions = []

            # Try parsing JSON properly
            try:
                suggestions = json.loads(chat_text)
            except json.JSONDecodeError:
                # Fallback: extract "title" and "description" using regex
                title_matches = re.findall(r'"title"\s*:\s*"([^"]+)"', chat_text)
                desc_matches = re.findall(r'"description"\s*:\s*"([^"]+)"', chat_text)
                for i in range(max(len(title_matches), len(desc_matches))):
                    suggestions.append({
                        "title": title_matches[i] if i < len(title_matches) else f"Habit {i+1}",
                        "description": desc_matches[i] if i < len(desc_matches) else "Description from AI"
                    })

                # If still empty, fallback to line splitting
                if not suggestions:
                    lines = [line.strip() for line in chat_text.split("\n") if line.strip()]
                    for i, line in enumerate(lines[:10]):
                        suggestions.append({"title": f"Habit {i+1}", "description": line})

            # Ensure suggestions is always a list
            if isinstance(suggestions, dict):
                # If dict has 'habits' key, use that
                if "habits" in suggestions and isinstance(suggestions["habits"], list):
                    suggestions = suggestions["habits"]
                else:
                    # Ignore empty dicts or convert to empty list
                    suggestions = []

            # Remove any completely empty items (like {})
            suggestions = [
                s for s in suggestions
                if isinstance(s, dict) and s.get("title") and s.get("description")
            ]

            # If still empty, fill with placeholders
            if not suggestions:
                for i in range(8):
                    suggestions.append({
                        "title": f"Habit {i+1}",
                        "description": "Description from AI"
                    })

            # Ensure minimum 8 items
            while len(suggestions) < 8:
                suggestions.append({
                    "title": f"Habit {len(suggestions)+1}",
                    "description": "Description from AI"
                })

            # Limit to 10
            suggestions = suggestions[:10]


            return Response({"suggestions": suggestions})

        except requests.exceptions.RequestException as e:
            return Response({"error": f"Hugging Face API error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
