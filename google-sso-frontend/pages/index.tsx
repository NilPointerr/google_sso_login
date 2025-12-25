import { useState } from "react";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = () => {
    setIsLoading(true);
    window.location.href = "http://localhost:8000/login/google";
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .container {
          animation: fadeIn 0.8s ease-out;
        }
        
        .card {
          animation: slideIn 0.6s ease-out;
        }
        
        .gradient-bg {
          background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        
        .icon-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .button-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
      
      <div style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }} className="gradient-bg">
        {/* Animated background circles */}
        <div style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          top: "-150px",
          right: "-150px",
          animation: "float 6s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          bottom: "-100px",
          left: "-100px",
          animation: "float 8s ease-in-out infinite",
          animationDelay: "1s"
        }} />
        
        <div className="container card" style={{
          textAlign: "center",
          padding: "60px 50px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          maxWidth: "450px",
          width: "90%",
          position: "relative",
          zIndex: 1
        }}>
          {/* Google Icon */}
          <div className="icon-float" style={{
            marginBottom: "30px",
            display: "flex",
            justifyContent: "center"
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          
          <h1 style={{
            marginBottom: "10px",
            fontSize: "32px",
            fontWeight: "700",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginTop: "0"
          }}>
            Welcome Back
          </h1>
          
          <p style={{
            marginBottom: "40px",
            fontSize: "16px",
            color: "#666",
            lineHeight: "1.6"
          }}>
            Sign in with your Google account to continue
          </p>
          
          <button
            onClick={loginWithGoogle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isLoading}
            style={{
              padding: "14px 32px",
              fontSize: "16px",
              cursor: isLoading ? "wait" : "pointer",
              backgroundColor: isHovered ? "#357ae8" : "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              transform: isHovered ? "translateY(-2px)" : "translateY(0)",
              boxShadow: isHovered 
                ? "0 10px 25px rgba(66, 133, 244, 0.4)" 
                : "0 4px 15px rgba(66, 133, 244, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "0 auto",
              minWidth: "220px",
              justifyContent: "center"
            }}
          >
            {isLoading ? (
              <>
                <div style={{
                  width: "18px",
                  height: "18px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }} />
                Connecting...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
          
          <div style={{
            marginTop: "30px",
            fontSize: "12px",
            color: "#999"
          }}>
            Secure authentication powered by Google
          </div>
        </div>
      </div>
    </>
  );
}
