import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface PlayerData {
  username: string;
  name?: string;
  title?: string;
  country?: string;
  location?: string;
  joined: number;
  last_online: number;
  followers: number;
  is_streamer: boolean;
  twitch_url?: string;
  avatar?: string;
  player_id: number;
  status: string;
  verified: boolean;
  league: string;
  url: string;
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeSinceLastOnline, setTimeSinceLastOnline] = useState<string>("");

  useEffect(() => {
    if (!username) return;

    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.chess.com/pub/player/${username}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PlayerData = await response.json();
        setPlayerData(data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch player data",
        );
        console.error("Error fetching player data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [username]);

  useEffect(() => {
    if (!playerData) return;

    const updateTimeSinceLastOnline = () => {
      const now = Date.now();
      const lastOnline = playerData.last_online * 1000; // Convert to milliseconds

      console.log("lastOnline", lastOnline);
      const diffMs = now - lastOnline;

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeSinceLastOnline(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };

    // Update immediately
    updateTimeSinceLastOnline();

    // Update every second
    const interval = setInterval(updateTimeSinceLastOnline, 1000);

    return () => clearInterval(interval);
  }, [playerData]);

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <button
          onClick={handleBackClick}
          style={{ marginBottom: "20px", padding: "10px 20px" }}
        >
          Back to Grandmasters
        </button>
        <h1>Loading {username}...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <button
          onClick={handleBackClick}
          style={{ marginBottom: "20px", padding: "10px 20px" }}
        >
          Back to Grandmasters
        </button>
        <h1>Error</h1>
        <p style={{ color: "red" }}>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!playerData) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <button
          onClick={handleBackClick}
          style={{ marginBottom: "20px", padding: "10px 20px" }}
        >
          Back to Grandmasters
        </button>
        <h1>Player not found</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={handleBackClick}
        style={{ marginBottom: "20px", padding: "10px 20px" }}
      >
        Back to Grandmasters
      </button>

      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        {playerData.avatar && (
          <img
            src={playerData.avatar}
            alt={`${playerData.username} avatar`}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              marginRight: "20px",
            }}
          />
        )}
        <div>
          <h1>{playerData.name || playerData.username}</h1>
          {playerData.title && (
            <p style={{ fontSize: "18px", color: "#666" }}>
              {playerData.title}
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>Player Information</h3>
          <p>
            <strong>Username:</strong> {playerData.username}
          </p>
          <p>
            <strong>Player ID:</strong> {playerData.player_id}
          </p>
          <p>
            <strong>Country:</strong> {playerData.country || "N/A"}
          </p>
          <p>
            <strong>Location:</strong> {playerData.location || "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {playerData.status}
          </p>
          <p>
            <strong>Verified:</strong> {playerData.verified ? "Yes" : "No"}
          </p>
          <p>
            <strong>League:</strong> {playerData.league}
          </p>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>Activity</h3>
          <p>
            <strong>Followers:</strong> {playerData.followers.toLocaleString()}
          </p>
          <p>
            <strong>Joined:</strong>{" "}
            {new Date(playerData.joined * 1000).toLocaleDateString()}
          </p>
          <p>
            <strong>Last Online:</strong>{" "}
            {new Date(playerData.last_online * 1000).toLocaleString()}
          </p>
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              backgroundColor: "#e8f4fd",
              borderRadius: "5px",
              border: "2px solid #2196F3",
            }}
          >
            <h4 style={{ margin: "0 0 10px 0", color: "#1976D2" }}>
              Time Since Last Online
            </h4>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#1976D2",
                fontFamily: "monospace",
              }}
            >
              {timeSinceLastOnline}
            </div>
          </div>
        </div>

        {playerData.is_streamer && (
          <div
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>Streaming</h3>
            <p>
              <strong>Streamer:</strong> Yes
            </p>
            {playerData.twitch_url && (
              <p>
                <strong>Twitch:</strong>{" "}
                <a
                  href={playerData.twitch_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#9146FF" }}
                >
                  {playerData.twitch_url}
                </a>
              </p>
            )}
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Profile URL:</strong>{" "}
          <a
            href={playerData.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1976D2" }}
          >
            {playerData.url}
          </a>
        </p>
      </div>
    </div>
  );
}
