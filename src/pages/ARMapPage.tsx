import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { MapPin, X, ArrowLeft } from "lucide-react";
import Navigation3D from "../components/Navigation3D";

export const ARMapPage = () => {
  const navigate = useNavigate();
  const { currentLocation, selectedDestination } = useApp();
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    if (!currentLocation || !selectedDestination) {
      navigate("/qr-scan");
    }
  }, [currentLocation, selectedDestination, navigate]);

  if (!currentLocation || !selectedDestination) {
    return null;
  }

  // Normalize names (IMPORTANT)
  const currentRoom = currentLocation.name.toLowerCase();
  const destination = selectedDestination.name.toLowerCase();

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        position: "relative",
        background: "#f9fafb",
      }}
    >
      {/* 3D Scene */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <Navigation3D
          destination={destination}
          currentRoom={currentRoom}
        />

        {/* INFO PANEL */}
        {showInfo && (
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              padding: "18px",
              borderRadius: "12px",
              boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
              maxWidth: "320px",
              zIndex: 10,
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <h3 style={{ margin: 0 }}>Navigation</h3>
              <button
                onClick={() => setShowInfo(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* FROM */}
            <div
              style={{
                background: "#f3f4f6",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <MapPin size={14} style={{ marginRight: "6px" }} />
                <span style={{ fontSize: "11px" }}>FROM</span>
              </div>
              <p style={{ margin: "4px 0", fontWeight: "600" }}>
                {currentLocation.name}
              </p>
            </div>

            {/* TO */}
            <div
              style={{
                background: "#dcfce7",
                padding: "10px",
                borderRadius: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <MapPin size={14} style={{ marginRight: "6px" }} />
                <span style={{ fontSize: "11px" }}>TO</span>
              </div>
              <p style={{ margin: "4px 0", fontWeight: "600" }}>
                {selectedDestination.name}
              </p>
            </div>

            <small style={{ color: "#6b7280", fontSize: "11px" }}>
              3D indoor navigation demo (based on floor plan)
            </small>
          </div>
        )}

        {/* SHOW BUTTON */}
        {!showInfo && (
          <button
            onClick={() => setShowInfo(true)}
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              background: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            Show Info
          </button>
        )}

        {/* BACK BUTTON */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            zIndex: 10,
          }}
        >
          <button
            onClick={() => navigate("/qr-scan")}
            style={{
              background: "#fff",
              border: "none",
              padding: "12px 16px",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>
    </div>
  );
};