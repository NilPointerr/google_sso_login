# Google SSO Login

A full-stack application implementing Google Single Sign-On (SSO) authentication with a FastAPI backend and Next.js frontend.

## Features

- 🔐 Google OAuth 2.0 authentication
- 🎨 Modern, responsive UI with animated components
- 🔒 JWT token-based session management
- ⚡ FastAPI backend with automatic API documentation
- ⚛️ Next.js frontend with TypeScript
- 🚀 Easy setup and deployment

## Project Structure

```
google_sso_login/
├── google-sso-backend/      # FastAPI backend
│   ├── auth.py              # OAuth authentication logic
│   ├── main.py              # FastAPI application entry point
│   ├── pyproject.toml       # Python dependencies
│   ├── sample.env           # Environment variables template
│   └── README.md
├── google-sso-frontend/     # Next.js frontend
│   ├── pages/
│   │   ├── index.tsx        # Login page
│   │   ├── auth/
│   │   │   └── callback.tsx # OAuth callback handler
│   │   └── dashboard.tsx    # Protected dashboard page
│   ├── package.json         # Node.js dependencies
│   └── README.md
├── run.sh                   # Script to run both services
├── backend.log              # Backend server logs
└── frontend.log             # Frontend server logs
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.12+** (for backend)
- **Node.js 18+** and **npm** (for frontend)
- **Google Cloud Console** account with OAuth credentials
- **uv** (recommended) or **pip** (for Python package management)

### Optional but Recommended

- **uv** - Fast Python package manager (install from [https://github.com/astral-sh/uv](https://github.com/astral-sh/uv))

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd google_sso_login
```

### 2. Configure Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen if prompted
6. Create an OAuth 2.0 Client ID:
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:8000/auth/google/callback`
7. Copy your **Client ID** and **Client Secret**

### 3. Backend Setup

```bash
cd google-sso-backend
```

#### Option A: Using uv (Recommended)

```bash
# Install uv if you haven't already
curl -LsSf https://astral.sh/uv/install.sh | sh

# Sync dependencies
uv sync
```

#### Option B: Using pip

```bash
# Install dependencies
pip install -e .
```

#### Configure Environment Variables

```bash
# Copy the sample environment file
cp sample.env .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

Update the `.env` file with your Google OAuth credentials:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SECRET_KEY=your-random-secret-key-for-jwt
FRONTEND_URL=http://localhost:3000
```

**Important:** 
- Replace `your-google-client-id` and `your-google-client-secret` with your actual Google OAuth credentials
- Generate a secure random string for `SECRET_KEY` (you can use: `openssl rand -hex 32`)

### 4. Frontend Setup

```bash
cd ../google-sso-frontend

# Install dependencies
npm install
```

No additional configuration needed for the frontend - it's ready to use!

## Running the Application

### Option 1: Run Both Services with Script (Recommended)

The easiest way to run both backend and frontend together:

```bash
# Make sure you're in the project root
cd /path/to/google_sso_login

# Make the script executable (first time only)
chmod +x run.sh

# Run both services
./run.sh
```

The script will:
- Check for required dependencies
- Install frontend dependencies if needed
- Start the backend on `http://localhost:8000`
- Start the frontend on `http://localhost:3000`
- Display logs and status information

**To stop both services:** Press `Ctrl+C` in the terminal

**View logs:**
```bash
# Backend logs
tail -f backend.log

# Frontend logs
tail -f frontend.log
```

### Option 2: Run Services Individually

#### Running the Backend

```bash
cd google-sso-backend
```

**Using uv:**
```bash
uv run uvicorn main:app --reload --port 8000
```

**Using python3:**
```bash
python3 -m uvicorn main:app --reload --port 8000
```

**Using python:**
```bash
python -m uvicorn main:app --reload --port 8000
```

The backend will be available at:
- API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

#### Running the Frontend

Open a new terminal:

```bash
cd google-sso-frontend

# Development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Start both services** (using the script or individually)
2. **Open your browser** and navigate to `http://localhost:3000`
3. **Click "Continue with Google"** button
4. **Sign in** with your Google account
5. **You'll be redirected** to the dashboard after successful authentication

## API Endpoints

### Backend Endpoints

- `GET /login/google` - Initiates Google OAuth login flow
- `GET /auth/google/callback` - Handles OAuth callback from Google
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation

## Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Yes |
| `SECRET_KEY` | Secret key for JWT token signing | Yes |
| `FRONTEND_URL` | Frontend application URL | Yes (default: http://localhost:3000) |

## Troubleshooting

### Backend Issues

**Problem:** Backend fails to start
- **Solution:** Check that `.env` file exists and contains all required variables
- **Solution:** Verify Python version is 3.12 or higher: `python3 --version`
- **Solution:** Ensure dependencies are installed: `uv sync` or `pip install -e .`

**Problem:** OAuth callback fails
- **Solution:** Verify redirect URI in Google Cloud Console matches: `http://localhost:8000/auth/google/callback`
- **Solution:** Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct

### Frontend Issues

**Problem:** Frontend fails to start
- **Solution:** Ensure Node.js 18+ is installed: `node --version`
- **Solution:** Reinstall dependencies: `rm -rf node_modules && npm install`

**Problem:** Cannot connect to backend
- **Solution:** Verify backend is running on port 8000
- **Solution:** Check CORS settings in `main.py` if using a different frontend URL

### Script Issues

**Problem:** Script fails with permission denied
- **Solution:** Make script executable: `chmod +x run.sh`

**Problem:** Script can't find Python
- **Solution:** Install Python 3.12+ or ensure it's in your PATH
- **Solution:** Install uv for better Python management: `curl -LsSf https://astral.sh/uv/install.sh | sh`

## Development

### Backend Development

- Backend uses **FastAPI** with automatic reload on code changes
- API documentation is auto-generated at `/docs`
- Logs are written to `backend.log` when using the script

### Frontend Development

- Frontend uses **Next.js** with hot module replacement
- Pages are in the `pages/` directory
- TypeScript is configured for type safety
- Logs are written to `frontend.log` when using the script

## Security Notes

⚠️ **Important for Production:**

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use strong `SECRET_KEY`** - Generate with: `openssl rand -hex 32`
3. **Update CORS origins** - Restrict to your production domain
4. **Use HTTPS** - OAuth requires HTTPS in production
5. **Update redirect URIs** - Add production callback URL in Google Cloud Console

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the logs: `backend.log` and `frontend.log`
3. Check Google Cloud Console for OAuth configuration issues

