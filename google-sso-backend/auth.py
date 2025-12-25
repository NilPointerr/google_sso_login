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

def create_jwt(user: dict):
    """Create JWT token with user information"""
    payload = {
        "email": user.get("email", ""),
        "name": user.get("name", ""),
        "picture": user.get("picture", ""),
        "exp": int(time.time()) + 3600,  # Token expires in 1 hour
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

@router.get("/login/google")
async def login_google(request: Request):
    """Initiate Google OAuth login flow"""
    try:
        # Construct absolute callback URL
        redirect_uri = str(request.url_for("google_callback"))
        return await oauth.google.authorize_redirect(request, redirect_uri)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initiate login: {str(e)}")

@router.get("/auth/google/callback", name="google_callback")
async def google_callback(request: Request):
    """Handle Google OAuth callback"""
    try:
        # Get access token from Google
        token = await oauth.google.authorize_access_token(request)
        
        # Fetch user info from Google using the access token
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={"Authorization": f"Bearer {token['access_token']}"}
            )
            response.raise_for_status()
            user = response.json()
        
        # Create JWT token with user information
        jwt_token = create_jwt(user)
        
        # Redirect to frontend with JWT token
        return RedirectResponse(
            url=f"{FRONTEND_URL}/auth/callback?token={jwt_token}"
        )
    except Exception as e:
        # On error, redirect to frontend with error message
        error_msg = str(e).replace(" ", "%20")  # URL encode spaces
        return RedirectResponse(
            url=f"{FRONTEND_URL}/auth/callback?error={error_msg}"
        )
