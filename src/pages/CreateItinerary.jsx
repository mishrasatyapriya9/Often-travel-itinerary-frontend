import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateItinerary.css";

const CreateItinerary = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    region: "",
    nights: 1,
    price: "",
    accommodations: [
      {
        hotel_name: "",
        room_type: "",
        location: "",
        check_in_day: 1,
        num_nights: 1,
      },
    ],
    transfers: [
      {
        day: 1,
        from_location: "",
        to_location: "",
        transfer_type: "",
      },
    ],
    activities: [
      {
        name: "",
        description: "",
        location: "",
        day: 1,
        duration_hours: 1,
      },
    ],
  });

  // Handle basic form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "nights" || name === "price" ? Number(value) : value,
    });
  };

  // Handle changes in nested objects (accommodations, transfers, activities)
  const handleNestedChange = (e, index, fieldType) => {
    const { name, value } = e.target;
    const updatedItems = [...formData[fieldType]];

    // Convert numeric fields to numbers
    const convertedValue = [
      "check_in_day",
      "num_nights",
      "day",
      "duration_hours",
    ].includes(name)
      ? Number(value)
      : value;

    updatedItems[index] = {
      ...updatedItems[index],
      [name]: convertedValue,
    };

    setFormData({
      ...formData,
      [fieldType]: updatedItems,
    });
  };

  // Add a new item to a nested array (accommodation, transfer, or activity)
  const addItem = (fieldType) => {
    let newItem;

    switch (fieldType) {
      case "accommodations":
        newItem = {
          hotel_name: "",
          room_type: "",
          location: "",
          check_in_day: 1,
          num_nights: 1,
        };
        break;
      case "transfers":
        newItem = {
          day: 1,
          from_location: "",
          to_location: "",
          transfer_type: "",
        };
        break;
      case "activities":
        newItem = {
          name: "",
          description: "",
          location: "",
          day: 1,
          duration_hours: 1,
        };
        break;
      default:
        return;
    }

    setFormData({
      ...formData,
      [fieldType]: [...formData[fieldType], newItem],
    });
  };

  // Remove an item from a nested array
  const removeItem = (index, fieldType) => {
    const updatedItems = [...formData[fieldType]];
    updatedItems.splice(index, 1);

    setFormData({
      ...formData,
      [fieldType]: updatedItems,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/itineraries/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      alert("Itinerary created successfully!");
      navigate(`/`); // Redirect to the new itinerary page
    } catch (error) {
      console.error("Error creating itinerary:", error);
      alert("Failed to create itinerary. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-itinerary-container">
      <h1>Create New Itinerary</h1>

      <form onSubmit={handleSubmit} className="itinerary-form">
        <section className="form-section basic-info">
          <h2>Basic Information</h2>

          <div className="form-group">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Phuket Beach Relaxation"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe this itinerary..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="region">Region*</label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                placeholder="e.g. Phuket"
              />
            </div>

            <div className="form-group">
              <label htmlFor="nights">Number of Nights*</label>
              <input
                type="number"
                id="nights"
                name="nights"
                value={formData.nights}
                onChange={handleChange}
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price per person"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </section>

        {/* Accommodations Section */}
        <section className="form-section accommodations">
          <div className="section-header">
            <h2>Accommodations</h2>
            <button
              type="button"
              className="add-btn"
              onClick={() => addItem("accommodations")}
            >
              + Add Accommodation
            </button>
          </div>

          {formData.accommodations.map((accommodation, index) => (
            <div key={`accommodation-${index}`} className="nested-item">
              <div className="nested-item-header">
                <h3>Accommodation {index + 1}</h3>
                {index > 0 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(index, "accommodations")}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`hotel-name-${index}`}>Hotel Name*</label>
                  <input
                    type="text"
                    id={`hotel-name-${index}`}
                    name="hotel_name"
                    value={accommodation.hotel_name}
                    onChange={(e) =>
                      handleNestedChange(e, index, "accommodations")
                    }
                    required
                    placeholder="Hotel name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`room-type-${index}`}>Room Type</label>
                  <input
                    type="text"
                    id={`room-type-${index}`}
                    name="room_type"
                    value={accommodation.room_type}
                    onChange={(e) =>
                      handleNestedChange(e, index, "accommodations")
                    }
                    placeholder="e.g. Deluxe Sea View"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={`location-${index}`}>Location*</label>
                <input
                  type="text"
                  id={`location-${index}`}
                  name="location"
                  value={accommodation.location}
                  onChange={(e) =>
                    handleNestedChange(e, index, "accommodations")
                  }
                  required
                  placeholder="e.g. Patong Beach, Phuket"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`check-in-day-${index}`}>Check-in Day*</label>
                  <input
                    type="number"
                    id={`check-in-day-${index}`}
                    name="check_in_day"
                    value={accommodation.check_in_day}
                    onChange={(e) =>
                      handleNestedChange(e, index, "accommodations")
                    }
                    required
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`num-nights-${index}`}>
                    Number of Nights*
                  </label>
                  <input
                    type="number"
                    id={`num-nights-${index}`}
                    name="num_nights"
                    value={accommodation.num_nights}
                    onChange={(e) =>
                      handleNestedChange(e, index, "accommodations")
                    }
                    required
                    min="1"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Transfers Section */}
        <section className="form-section transfers">
          <div className="section-header">
            <h2>Transfers</h2>
            <button
              type="button"
              className="add-btn"
              onClick={() => addItem("transfers")}
            >
              + Add Transfer
            </button>
          </div>

          {formData.transfers.map((transfer, index) => (
            <div key={`transfer-${index}`} className="nested-item">
              <div className="nested-item-header">
                <h3>Transfer {index + 1}</h3>
                {index > 0 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(index, "transfers")}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <label htmlFor={`transfer-day-${index}`}>Day*</label>
                <input
                  type="number"
                  id={`transfer-day-${index}`}
                  name="day"
                  value={transfer.day}
                  onChange={(e) => handleNestedChange(e, index, "transfers")}
                  required
                  min="1"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`from-location-${index}`}>From*</label>
                  <input
                    type="text"
                    id={`from-location-${index}`}
                    name="from_location"
                    value={transfer.from_location}
                    onChange={(e) => handleNestedChange(e, index, "transfers")}
                    required
                    placeholder="e.g. Airport"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`to-location-${index}`}>To*</label>
                  <input
                    type="text"
                    id={`to-location-${index}`}
                    name="to_location"
                    value={transfer.to_location}
                    onChange={(e) => handleNestedChange(e, index, "transfers")}
                    required
                    placeholder="e.g. Hotel"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={`transfer-type-${index}`}>Transfer Type*</label>
                <select
                  id={`transfer-type-${index}`}
                  name="transfer_type"
                  value={transfer.transfer_type}
                  onChange={(e) => handleNestedChange(e, index, "transfers")}
                  required
                >
                  <option value="">Select a transfer type</option>
                  <option value="Private Car">Private Car</option>
                  <option value="Shared Minivan">Shared Minivan</option>
                  <option value="Ferry">Ferry</option>
                  <option value="Longtail Boat">Longtail Boat</option>
                  <option value="Speedboat">Speedboat</option>
                  <option value="Ferry + Longtail Boat">
                    Ferry + Longtail Boat
                  </option>
                  <option value="Longtail Boat + Private Car">
                    Longtail Boat + Private Car
                  </option>
                </select>
              </div>
            </div>
          ))}
        </section>

        {/* Activities Section */}
        <section className="form-section activities">
          <div className="section-header">
            <h2>Activities</h2>
            <button
              type="button"
              className="add-btn"
              onClick={() => addItem("activities")}
            >
              + Add Activity
            </button>
          </div>

          {formData.activities.map((activity, index) => (
            <div key={`activity-${index}`} className="nested-item">
              <div className="nested-item-header">
                <h3>Activity {index + 1}</h3>
                {index > 0 && (
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(index, "activities")}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <label htmlFor={`activity-name-${index}`}>Name*</label>
                <input
                  type="text"
                  id={`activity-name-${index}`}
                  name="name"
                  value={activity.name}
                  onChange={(e) => handleNestedChange(e, index, "activities")}
                  required
                  placeholder="e.g. Phi Phi Islands Tour"
                />
              </div>

              <div className="form-group">
                <label htmlFor={`activity-description-${index}`}>
                  Description
                </label>
                <textarea
                  id={`activity-description-${index}`}
                  name="description"
                  value={activity.description}
                  onChange={(e) => handleNestedChange(e, index, "activities")}
                  placeholder="Describe this activity..."
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label htmlFor={`activity-location-${index}`}>Location*</label>
                <input
                  type="text"
                  id={`activity-location-${index}`}
                  name="location"
                  value={activity.location}
                  onChange={(e) => handleNestedChange(e, index, "activities")}
                  required
                  placeholder="e.g. Phi Phi Islands"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`activity-day-${index}`}>Day*</label>
                  <input
                    type="number"
                    id={`activity-day-${index}`}
                    name="day"
                    value={activity.day}
                    onChange={(e) => handleNestedChange(e, index, "activities")}
                    required
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor={`duration-hours-${index}`}>
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    id={`duration-hours-${index}`}
                    name="duration_hours"
                    value={activity.duration_hours}
                    onChange={(e) => handleNestedChange(e, index, "activities")}
                    step="0.5"
                    min="0.5"
                  />
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Itinerary"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItinerary;
