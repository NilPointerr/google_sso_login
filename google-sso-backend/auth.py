"""Authentication module for Google OAuth SSO integration.

This module handles Google OAuth 2.0 authentication flow, including
initiating the login process, handling callbacks, and generating JWT tokens.
"""

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from jose import jwt
import httpx
import os
import time
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
oauth = OAuth()

SECRET_KEY = os.getenv("SECRET_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

# Register Google OAuth provider
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


def create_jwt(user: dict) -> str:
    """Create a JWT token with user information.

    Generates a JSON Web Token containing user email, name, and picture
    from the Google OAuth response. The token expires in 1 hour.

    Args:
        user: Dictionary containing user information from Google OAuth.
            Expected keys: 'email', 'name', 'picture'.

    Returns:
        str: Encoded JWT token as a string.

    Example:
        >>> user = {"email": "user@example.com", "name": "John Doe", "picture": "https://..."}
        >>> token = create_jwt(user)
        >>> isinstance(token, str)
        True
    """
    payload = {
        "email": user.get("email", ""),
        "name": user.get("name", ""),
        "picture": user.get("picture", ""),
        "exp": int(time.time()) + 3600,  # Token expires in 1 hour
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


@router.get("/login/google")
async def login_google(request: Request) -> RedirectResponse:
    """Initiate Google OAuth login flow.

    Redirects the user to Google's OAuth consent screen where they can
    authorize the application to access their Google account information.

    Args:
        request: FastAPI Request object containing request details.

    Returns:
        RedirectResponse: HTTP redirect to Google OAuth authorization page.

    Raises:
        HTTPException: If the OAuth flow initialization fails.

    Example:
        User visits `/login/google` and is redirected to Google's login page.
    """
    try:
        # Construct absolute callback URL
        redirect_uri = str(request.url_for("google_callback"))
        return await oauth.google.authorize_redirect(request, redirect_uri)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to initiate login: {str(e)}"
        )


@router.get("/auth/google/callback", name="google_callback")
async def google_callback(request: Request) -> RedirectResponse:
    """Handle Google OAuth callback and generate JWT token.

    This endpoint is called by Google after the user authorizes the application.
    It exchanges the authorization code for an access token, fetches user
    information from Google, creates a JWT token, and redirects to the frontend.

    Args:
        request: FastAPI Request object containing OAuth callback parameters.

    Returns:
        RedirectResponse: HTTP redirect to frontend callback URL with either:
            - JWT token as query parameter on success
            - Error message as query parameter on failure

    The redirect URL format:
        - Success: `{FRONTEND_URL}/auth/callback?token={jwt_token}`
        - Error: `{FRONTEND_URL}/auth/callback?error={error_message}`

    Example:
        After Google redirects to this endpoint, user is sent to frontend
        with a JWT token that can be stored and used for authenticated requests.
    """
    try:
        # Get access token from Google
        token = await oauth.google.authorize_access_token(request)

        # Fetch user info from Google using the access token
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {token['access_token']}"},
            )
            response.raise_for_status()
            user = response.json()

        # Create JWT token with user information
        jwt_token = create_jwt(user)

        # Redirect to frontend with JWT token
        return RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?token={jwt_token}")
    except Exception as e:
        # On error, redirect to frontend with error message
        error_msg = str(e).replace(" ", "%20")  # URL encode spaces
        return RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?error={error_msg}")
