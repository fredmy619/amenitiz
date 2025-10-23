import { useState, useEffect } from "react";

interface GrandmasterData {
  players: string[];
}

export default function HomePage() {
  const [grandmasters, setGrandmasters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrandmasters = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://api.chess.com/pub/titled/GM");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: GrandmasterData = await response.json();
        setGrandmasters(data.players);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch grandmasters"
        );
        console.error("Error fetching grandmasters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGrandmasters();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Chess Grandmasters</h1>
        <p>Loading grandmasters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Chess Grandmasters</h1>
        <p style={{ color: "red" }}>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chess Grandmasters ({grandmasters.length})</h1>
      <p>List of all Grandmasters from Chess.com</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {grandmasters.map((username, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
              textAlign: "center",
            }}
          >
            {username}
          </div>
        ))}
      </div>
    </div>
  );
}
