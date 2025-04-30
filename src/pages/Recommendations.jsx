import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/recommendations.css";

const Recommendations = () => {
  const navigate = useNavigate();
  const [nights, setNights] = useState(3);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [nightOptions] = useState([2, 3, 4, 5, 6, 7, 8]);

  // Fetch recommendations when the component mounts or nights changes
  useEffect(() => {
    fetchRecommendations(nights);
  }, [nights]);

  const fetchRecommendations = async (nightsCount) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8001/recommendations/${nightsCount}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`No itineraries found for ${nightsCount} nights`);
        }
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setRecommendations(data);
      setSelectedItinerary(null); // Reset selected itinerary when getting new recommendations
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError(error.message);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNightChange = (e) => {
    setNights(parseInt(e.target.value, 10));
  };

  const handleViewDetails = (itineraryId) => {
    navigate(`/itineraries/${itineraryId}`);
  };

  const handleItinerarySelect = (itinerary) => {
    setSelectedItinerary(itinerary);
  };

  const getRegionImage = (region) => {
    // Map region names to image URLs
    const regionImages = {
      Phuket:
        "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1000",
      Krabi:
        "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000",
      "Phuket & Krabi":
        "https://media.istockphoto.com/id/2149112736/photo/wat-arun-temple-at-sunset-bangkok-in-thailand.webp?a=1&b=1&s=612x612&w=0&k=20&c=kK9uAh4kN8-HmAo49oYtZujbvZCXrkilB95gaLzruuA=",
      // Add more regions as needed
    };

    // Return image URL or a default image if region not found
    return (
      regionImages[region] ||
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000"
    );
  };

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h1>Recommended Itineraries</h1>
        <p className="header-subtitle">
          Find the perfect travel plan for your needs
        </p>
      </div>

      <div className="filter-section">
        <div className="night-filter">
          <label htmlFor="nights-select">
            How many nights are you planning to stay?
          </label>
          <div className="night-selector">
            <select
              id="nights-select"
              value={nights}
              onChange={handleNightChange}
              className="nights-dropdown"
            >
              {nightOptions.map((option) => (
                <option key={option} value={option}>
                  {option} {option === 1 ? "Night" : "Nights"}
                </option>
              ))}
            </select>

            <div className="night-buttons">
              {nightOptions.map((option) => (
                <button
                  key={option}
                  className={`night-btn ${option === nights ? "active" : ""}`}
                  onClick={() => setNights(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="recommendations-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Finding the best itineraries for you...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <div className="error-icon">!</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button
              className="try-again-btn"
              onClick={() => fetchRecommendations(nights)}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="recommendations-layout">
            <div className="itinerary-cards">
              {recommendations.map((itinerary) => (
                <div
                  key={itinerary.id}
                  className={`itinerary-card ${
                    selectedItinerary?.id === itinerary.id ? "selected" : ""
                  }`}
                  onClick={() => handleItinerarySelect(itinerary)}
                >
                  <div
                    className="card-image"
                    style={{
                      backgroundImage: `url(${getRegionImage(
                        itinerary.region
                      )})`,
                    }}
                  >
                    <div className="price-tag">
                      {itinerary.price
                        ? `$${itinerary.price}`
                        : "Price on request"}
                    </div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{itinerary.title}</h3>
                    <div className="card-details">
                      <div className="card-detail">
                        <span className="detail-icon">🌙</span>
                        <span>
                          {itinerary.nights}{" "}
                          {itinerary.nights === 1 ? "Night" : "Nights"}
                        </span>
                      </div>
                      <div className="card-detail">
                        <span className="detail-icon">📍</span>
                        <span>{itinerary.region}</span>
                      </div>
                    </div>
                    <p className="card-description">
                      {itinerary.description
                        ? itinerary.description.length > 100
                          ? `${itinerary.description.substring(0, 100)}...`
                          : itinerary.description
                        : `Experience the best of ${itinerary.region} with this specially crafted ${itinerary.nights}-night itinerary.`}
                    </p>
                    <button
                      className="view-details-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(itinerary.id);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}

              {recommendations.length === 0 && !loading && !error && (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No Itineraries Found</h3>
                  <p>We don't have any itineraries for {nights} nights yet.</p>
                  <p>Try a different duration or check back later!</p>
                </div>
              )}
            </div>

            {selectedItinerary && (
              <div className="itinerary-preview">
                <h2 className="preview-title">{selectedItinerary.title}</h2>
                <div
                  className="preview-image"
                  style={{
                    backgroundImage: `url(${getRegionImage(
                      selectedItinerary.region
                    )})`,
                  }}
                ></div>
                <div className="preview-details">
                  <div className="preview-detail">
                    <span className="detail-label">Region:</span>
                    <span className="detail-value">
                      {selectedItinerary.region}
                    </span>
                  </div>
                  <div className="preview-detail">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">
                      {selectedItinerary.nights} nights
                    </span>
                  </div>
                  <div className="preview-detail">
                    <span className="detail-label">Price:</span>
                    <span className="detail-value">
                      {selectedItinerary.price
                        ? `$${selectedItinerary.price} per person`
                        : "Price on request"}
                    </span>
                  </div>
                </div>
                <div className="preview-description">
                  <h3>Description</h3>
                  <p>
                    {selectedItinerary.description ||
                      `A wonderful ${selectedItinerary.nights}-night adventure in the beautiful ${selectedItinerary.region} region.`}
                  </p>
                </div>
                <div className="preview-actions">
                  <button
                    className="preview-action-btn view"
                    onClick={() => handleViewDetails(selectedItinerary.id)}
                  >
                    View Full Details
                  </button>
                  <button className="preview-action-btn book">Book Now</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="create-own-itinerary">
        <div className="create-own-content">
          <h2>Can't find what you're looking for?</h2>
          <p>
            Create your own custom itinerary with our easy-to-use itinerary
            builder!
          </p>
          <button className="create-btn" onClick={() => navigate("/create")}>
            Create Custom Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
