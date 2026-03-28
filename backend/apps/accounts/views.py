from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import Address
from .serializers import (
    AddressSerializer,
    LoginSerializer,
    ProfileCompleteSerializer,
    RegisterSerializer,
    UserSerializer,
    UserUpdateSerializer,
)


def _set_refresh_cookie(response, refresh_token):
    jwt_conf = settings.SIMPLE_JWT
    response.set_cookie(
        key=jwt_conf.get('AUTH_COOKIE', 'refresh_token'),
        value=str(refresh_token),
        httponly=jwt_conf.get('AUTH_COOKIE_HTTPONLY', True),
        samesite=jwt_conf.get('AUTH_COOKIE_SAMESITE', 'Lax'),
        secure=jwt_conf.get('AUTH_COOKIE_SECURE', False),
        path=jwt_conf.get('AUTH_COOKIE_PATH', '/'),
        max_age=int(jwt_conf['REFRESH_TOKEN_LIFETIME'].total_seconds()),
    )


def _clear_refresh_cookie(response):
    jwt_conf = settings.SIMPLE_JWT
    response.delete_cookie(
        key=jwt_conf.get('AUTH_COOKIE', 'refresh_token'),
        path=jwt_conf.get('AUTH_COOKIE_PATH', '/'),
        samesite=jwt_conf.get('AUTH_COOKIE_SAMESITE', 'Lax'),
    )


def _token_response(user):
    """Generate JWT pair and build response with httpOnly refresh cookie."""
    refresh = RefreshToken.for_user(user)
    data = {
        'access': str(refresh.access_token),
        'user': UserSerializer(user).data,
    }
    response = Response(data, status=status.HTTP_200_OK)
    _set_refresh_cookie(response, refresh)
    return response


class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        data = {
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data,
        }
        response = Response(data, status=status.HTTP_201_CREATED)
        _set_refresh_cookie(response, refresh)
        return response


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return _token_response(serializer.validated_data['user'])


class RefreshView(APIView):
    """Read refresh token from httpOnly cookie, return new access + rotate cookie."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        raw_token = request.COOKIES.get(
            settings.SIMPLE_JWT.get('AUTH_COOKIE', 'refresh_token')
        )
        if not raw_token:
            return Response(
                {'detail': 'No refresh token.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        try:
            old_refresh = RefreshToken(raw_token)
            old_refresh.blacklist()
            user_id = old_refresh['user_id']

            from django.contrib.auth import get_user_model
            User = get_user_model()
            user = User.objects.get(pk=user_id)

            new_refresh = RefreshToken.for_user(user)
            data = {'access': str(new_refresh.access_token)}
            response = Response(data, status=status.HTTP_200_OK)
            _set_refresh_cookie(response, new_refresh)
            return response
        except TokenError:
            response = Response(
                {'detail': 'Token inválido o expirado.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
            _clear_refresh_cookie(response)
            return response


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        raw_token = request.COOKIES.get(
            settings.SIMPLE_JWT.get('AUTH_COOKIE', 'refresh_token')
        )
        if raw_token:
            try:
                RefreshToken(raw_token).blacklist()
            except TokenError:
                pass
        response = Response(status=status.HTTP_204_NO_CONTENT)
        _clear_refresh_cookie(response)
        return response


class MeView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ('PATCH', 'PUT'):
            return UserUpdateSerializer
        return UserSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        serializer = UserUpdateSerializer(
            self.get_object(), data=request.data, partial=partial,
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(self.get_object()).data)


class AddressListCreateView(generics.ListCreateAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)


class ProfileCompleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = ProfileCompleteSerializer(
            {'is_complete': request.user.is_profile_complete}
        )
        return Response(serializer.data)
