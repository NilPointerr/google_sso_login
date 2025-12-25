import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Callback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const { token, error: errorParam } = router.query;

    if (errorParam) {
      setError(errorParam as string);
      return;
    }

    if (token) {
      try {
        localStorage.setItem("token", token as string);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } catch (err) {
        setError("Failed to save token");
      }
    }
  }, [router]);

  // Animate loading dots
  useEffect(() => {
    if (!error) {
      const interval = setInterval(() => {
        setDots(prev => {
          if (prev.length >= 3) return "";
          return prev + ".";
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [error]);

  if (error) {
    return (
      <>
        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .error-container {
            animation: fadeIn 0.5s ease-out, shake 0.5s ease-in-out 0.5s;
          }
        `}</style>
        <div style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "20px"
        }}>
          <div className="error-container" style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "20px" }}>❌</div>
            <h2 style={{ color: "#e74c3c", marginBottom: "10px", fontSize: "24px" }}>Login Failed</h2>
            <p style={{ color: "#666", marginBottom: "30px", lineHeight: "1.6" }}>{error}</p>
            <button
              onClick={() => router.push("/")}
              style={{
                padding: "12px 24px",
                cursor: "pointer",
                backgroundColor: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                fontSize: "16px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Go Back to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        .pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
      <div style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Animated background elements */}
        <div style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          top: "20%",
          left: "10%",
          animation: "pulse 3s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          bottom: "20%",
          right: "10%",
          animation: "pulse 4s ease-in-out infinite",
          animationDelay: "1s"
        }} />
        
        <div className="fade-in" style={{
          textAlign: "center",
          zIndex: 1,
          position: "relative"
        }}>
          <div className="spinner" style={{
            width: "60px",
            height: "60px",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            borderTop: "4px solid white",
            borderRadius: "50%",
            margin: "0 auto 30px"
          }} />
          <h2 style={{
            color: "white",
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "10px"
          }}>
            Logging you in{dots}
          </h2>
          <p style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "16px"
          }}>
            Please wait while we redirect you
          </p>
        </div>
      </div>
    </>
  );
}
