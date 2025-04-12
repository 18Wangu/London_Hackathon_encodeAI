import React from "react";
import { Routes, Route } from "react-router-dom";
import WheelOfFate from "./components/WheelOfFate";
import EventDetails from "./components/EventDetails";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<WheelOfFate />} />
      <Route path="/event/:eventId" element={<EventDetails />} />
    </Routes>
  );
};

export default App;
