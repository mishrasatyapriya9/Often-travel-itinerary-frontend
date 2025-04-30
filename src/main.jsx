import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateItinerary from "./pages/CreateItinerary";
import Recommendations from "./pages/Recommendations";
import ItineraryDetails from "./pages/ItineraryDetails";
import Navbar from "./components/Navbar";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <div className="app">
      <Navbar />
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateItinerary />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/itineraries/:id" element={<ItineraryDetails />} />
        </Routes>
      </div>
    </div>
  </BrowserRouter>
);
