import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoogleAuth from "./components/GoogleAuth";
import Dashboard from "./components/Dashboard";
import AiCoach from "./components/AiCoach";
import TrackHabits from "./components/TrackHabits";
import Profile from "./components/Profile";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<GoogleAuth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="ai-suggestions" element={<AiCoach />} />
                <Route path="track-habits" element={<TrackHabits />} />
                <Route path="profile" element={<Profile />} />
            </Routes>
        </Router>
    );
};

export default App;
