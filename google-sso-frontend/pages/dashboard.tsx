import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface User {
  email: string;
  name: string;
  picture?: string;
  exp?: number;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/");
      return;
    }

    try {
      // Decode JWT token (base64 decode the payload)
      const payload = JSON.parse(atob(token.split(".")[1]));
      
      // Check if token is expired
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }
      
      setUser(payload);
      setTimeout(() => setIsLoaded(true), 100);
    } catch (err) {
      setError("Failed to decode token");
      localStorage.removeItem("token");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (error) {
    return (
      <>
        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          .error-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
        <div style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "20px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}>
          <div className="error-shake" style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
            <h2 style={{ color: "#e74c3c", marginBottom: "10px" }}>Error</h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>{error}</p>
            <button
              onClick={handleLogout}
              style={{
                padding: "12px 24px",
                cursor: "pointer",
                backgroundColor: "#667eea",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                transition: "all 0.3s ease"
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
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
        <div style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: "60px",
              height: "60px",
              border: "4px solid rgba(255,255,255,0.3)",
              borderTop: "4px solid white",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px"
            }} />
            <p style={{ color: "white", fontSize: "18px", fontWeight: "500" }}>Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .fade-in {
          animation: fadeInUp 0.6s ease-out;
        }
        .slide-in {
          animation: slideIn 0.5s ease-out;
        }
      `}</style>
      
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px"
      }}>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto"
        }}>
          {/* Header */}
          <div className={isLoaded ? "fade-in" : ""} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            padding: "20px 30px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)"
          }}>
            <h1 style={{
              fontSize: "28px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0
            }}>
              Dashboard
            </h1>
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(231, 76, 60, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
          
          {/* Profile Card */}
          <div className={isLoaded ? "fade-in" : ""} style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}>
              {user.picture && (
                <div className={isLoaded ? "slide-in" : ""} style={{
                  marginBottom: "30px",
                  position: "relative"
                }}>
                  <img
                    src={user.picture}
                    alt="Profile"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      border: "4px solid #667eea",
                      boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
                      objectFit: "cover"
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "5px",
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#4ade80",
                    borderRadius: "50%",
                    border: "3px solid white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                  }} />
                </div>
              )}
              
              <h2 style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#333",
                marginBottom: "10px",
                marginTop: "0"
              }}>
                {user.name || "User"}
              </h2>
              
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#666",
                marginBottom: "40px",
                fontSize: "16px"
              }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {user.email || "N/A"}
              </div>
              
              {/* Info Cards */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "20px",
                width: "100%",
                marginTop: "30px"
              }}>
                <div style={{
                  padding: "20px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "12px",
                  color: "white",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "5px" }}>
                    ✓
                  </div>
                  <div style={{ fontSize: "14px", opacity: 0.9 }}>Verified Account</div>
                </div>
                
                <div style={{
                  padding: "20px",
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  borderRadius: "12px",
                  color: "white",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "32px", fontWeight: "700", marginBottom: "5px" }}>
                    🔐
                  </div>
                  <div style={{ fontSize: "14px", opacity: 0.9 }}>Secure Login</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
