import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoogleAuth from "./components/GoogleAuth";
import Dashboard from "./components/Dashboard";
import AiCoach from "./components/AiCoach";
import TrackHabits from "./components/TrackHabits";
import AiRoutine from "./components/AiRoutine";
import Profile from "./components/Profile";

import Training from "./components/Training";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/training" element={<Training />} />
                <Route path="/" element={<GoogleAuth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="ai-suggestions" element={<AiCoach />} />
                <Route path="track-habits" element={<TrackHabits />} />
                <Route path="ai-routine" element={<AiRoutine />} />
                <Route path="profile" element={<Profile />} />
            </Routes>
        </Router>
    );
};

export default App;
