import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ItineraryList.css";
import { Calendar, Clock, Map, Compass, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/itineraries")
      .then((res) => {
        setItineraries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching itineraries:", err);
        setError("Failed to load itineraries. Please try again later.");
        setLoading(false);
      });
  }, []);

  const filteredItineraries = itineraries.filter((itinerary) => {
    // Filter by region
    if (filter !== "all" && itinerary.region.toLowerCase() !== filter) {
      return false;
    }

    // Filter by duration
    if (durationFilter === "short" && itinerary.nights > 3) return false;
    if (
      durationFilter === "medium" &&
      (itinerary.nights < 4 || itinerary.nights > 6)
    )
      return false;
    if (durationFilter === "long" && itinerary.nights < 7) return false;

    return true;
  });

  // Generate background gradient based on region
  const getBackgroundStyle = (region) => {
    if (region.toLowerCase() === "phuket") {
      return {
        background: "linear-gradient(135deg, #20bf55 0%, #01baef 100%)",
      };
    } else if (region.toLowerCase() === "krabi") {
      return {
        background: "linear-gradient(135deg, #4568dc 0%, #b06ab3 100%)",
      };
    } else {
      return {
        background: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
      };
    }
  };

  if (loading) {
    return <div className="loading">Loading itineraries...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }
  const HandleClick = (ItineraryId) => {
    navigate(`/itineraries/${ItineraryId}`);
  };

  return (
    <div className="itinerary-container">
      <header className="itinerary-header">
        <h1>Explore Thailand Itineraries</h1>
        <p>Discover handcrafted travel experiences in Phuket and Krabi</p>

        <div className="filters">
          <div className="filter-group">
            <label>Destination</label>
            <div className="filter-buttons">
              <button
                className={filter === "all" ? "active" : ""}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={filter === "phuket" ? "active" : ""}
                onClick={() => setFilter("phuket")}
              >
                Phuket
              </button>
              <button
                className={filter === "krabi" ? "active" : ""}
                onClick={() => setFilter("krabi")}
              >
                Krabi
              </button>
            </div>
          </div>

          <div className="filter-group">
            <label>Duration</label>
            <div className="filter-buttons">
              <button
                className={durationFilter === "all" ? "active" : ""}
                onClick={() => setDurationFilter("all")}
              >
                All
              </button>
              <button
                className={durationFilter === "short" ? "active" : ""}
                onClick={() => setDurationFilter("short")}
              >
                2-3 Nights
              </button>
              <button
                className={durationFilter === "medium" ? "active" : ""}
                onClick={() => setDurationFilter("medium")}
              >
                4-6 Nights
              </button>
              <button
                className={durationFilter === "long" ? "active" : ""}
                onClick={() => setDurationFilter("long")}
              >
                7+ Nights
              </button>
            </div>
          </div>
        </div>
      </header>

      {filteredItineraries.length === 0 ? (
        <div className="no-results">
          No itineraries match your filters. Try adjusting your criteria.
        </div>
      ) : (
        <div className="itinerary-grid">
          {filteredItineraries.map((itinerary) => (
            <div
              className="itinerary-card"
              key={itinerary.id || itinerary.title}
            >
              <div
                className="itinerary-image"
                style={getBackgroundStyle(itinerary.region)}
              >
                <div className="itinerary-image-content">
                  <div className="nights-badge">
                    <Calendar size={14} />
                    <span>{itinerary.nights} Nights</span>
                  </div>
                  <h3 className="image-title">{itinerary.title}</h3>
                </div>
                <div className="region-badge">{itinerary.region}</div>
              </div>
              <div className="itinerary-content">
                <h2>{itinerary.title}</h2>
                <div className="itinerary-details">
                  <div className="detail">
                    <Map size={16} />
                    <span>{itinerary.region}</span>
                  </div>
                  <div className="detail">
                    <Clock size={16} />
                    <span>{itinerary.nights} nights</span>
                  </div>
                </div>
                {itinerary.description && (
                  <p className="itinerary-description">
                    {itinerary.description}
                  </p>
                )}
                <div className="itinerary-footer">
                  <button
                    className="view-button"
                    onClick={() => HandleClick(itinerary.id)}
                  >
                    View Details <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
