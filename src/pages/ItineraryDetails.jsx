import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/ItineraryDetails.css";

const ItineraryDetails = () => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/itineraries/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch itinerary");
        }

        const data = await response.json();
        setItinerary(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItinerary();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading itinerary details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" className="btn-back">
          Return to home
        </Link>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="not-found">
        <h2>Itinerary not found</h2>
        <Link to="/" className="btn-back">
          Return to home
        </Link>
      </div>
    );
  }

  // Group activities by day
  const activitiesByDay = {};
  itinerary.activities.forEach((activity) => {
    if (!activitiesByDay[activity.day]) {
      activitiesByDay[activity.day] = [];
    }
    activitiesByDay[activity.day].push(activity);
  });

  return (
    <div className="itinerary-details">
      <header className="itinerary-header">
        <Link to="/" className="back-link">
          <span className="back-arrow">←</span> Back
        </Link>
        <div className="itinerary-meta">
          <span className="region-tag">{itinerary.region}</span>
          <span className="nights-tag">{itinerary.nights} Nights</span>
        </div>
      </header>

      <div className="itinerary-title-container">
        <h1 className="itinerary-title">{itinerary.title}</h1>
        {itinerary.price && (
          <div className="price-tag">${itinerary.price.toFixed(2)}</div>
        )}
      </div>

      {itinerary.description && (
        <p className="itinerary-description">{itinerary.description}</p>
      )}

      <div className="itinerary-content">
        <section className="section accommodations">
          <h2>Accommodations</h2>
          <div className="cards-container">
            {itinerary.accommodations.map((accommodation) => (
              <div className="card" key={accommodation.id}>
                <div className="card-header">
                  <h3>{accommodation.hotel_name}</h3>
                  <span className="location">{accommodation.location}</span>
                </div>
                <div className="card-content">
                  {accommodation.room_type && (
                    <div className="info-row">
                      <span className="label">Room:</span>
                      <span>{accommodation.room_type}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <span className="label">Check-in:</span>
                    <span>Day {accommodation.check_in_day}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Duration:</span>
                    <span>{accommodation.num_nights} nights</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section transfers">
          <h2>Transfers</h2>
          <div className="timeline">
            {itinerary.transfers.map((transfer) => (
              <div className="timeline-item" key={transfer.id}>
                <div className="timeline-marker">
                  <span className="day">Day {transfer.day}</span>
                </div>
                <div className="timeline-content">
                  <div className="transfer-type">{transfer.transfer_type}</div>
                  <div className="transfer-route">
                    <span className="from">{transfer.from_location}</span>
                    <span className="arrow">→</span>
                    <span className="to">{transfer.to_location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section activities">
          <h2>Daily Activities</h2>
          {Object.keys(activitiesByDay)
            .sort((a, b) => a - b)
            .map((day) => (
              <div className="day-activities" key={day}>
                <h3 className="day-heading">Day {day}</h3>
                <div className="activity-cards">
                  {activitiesByDay[day].map((activity) => (
                    <div className="activity-card" key={activity.id}>
                      <h4 className="activity-name">{activity.name}</h4>
                      <div className="activity-location">
                        {activity.location}
                      </div>
                      {activity.duration_hours && (
                        <div className="activity-duration">
                          {activity.duration_hours} hours
                        </div>
                      )}
                      {activity.description && (
                        <p className="activity-description">
                          {activity.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </section>
      </div>

      <div className="cta-container">
        <button className="cta-button">Book This Itinerary</button>
      </div>
    </div>
  );
};

export default ItineraryDetails;
