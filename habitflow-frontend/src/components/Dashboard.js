import React, { useState, useEffect } from "react";
import AiCoach from "./AiCoach";
import TrackHabits from "./TrackHabits";
import Profile from "./Profile";
import styled from "styled-components";
import AiRoutine from "./AiRoutine";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState(
        localStorage.getItem("activeTab") || "ai"
    );

    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
    }, [activeTab]);

    return (
        <Container>
            <Header>
                <Tab
                    active={activeTab === "ai"}
                    onClick={() => setActiveTab("ai")}
                >
                    AI Coach
                </Tab>
                <Tab
                    active={activeTab === "track"}
                    onClick={() => setActiveTab("track")}
                >
                    Track Habits
                </Tab>
                <Tab
                    active={activeTab === "routine"}
                    onClick={() => setActiveTab("routine")}
                >
                    Smart Routine
                </Tab>
                <Tab
                    active={activeTab === "profile"}
                    onClick={() => setActiveTab("profile")}
                >
                    Profile
                </Tab>
            </Header>

            <Content>
                {activeTab === "ai" && <AiCoach />}
                {activeTab === "track" && <TrackHabits />}
                {activeTab === "routine" && <AiRoutine />}
                {activeTab === "profile" && <Profile />}
            </Content>
        </Container>
    );
};

export default Dashboard;

const Container = styled.div`
    width: 100%;
    padding-top: 80px;
    overflow-y: hidden;
`;

const Header = styled.div`
    position: fixed;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 18px;
    background-color: #ffffff91;
    padding: 6px 6px;
    z-index: 999;
    border: 1px solid #00000012;
    border-radius: 40px;
    backdrop-filter: blur(9px);
`;

const Tab = styled.div`
    cursor: default;
    font-weight: bold;
    color: ${(props) => (props.active ? "#000" : "#3c3c3cff")};
    background-color: ${(props) => (props.active ? "#c1ff75" : "transparent")};
    border-radius: 40px;
    padding: 14px 16px;
`;

const Content = styled.div`
    width: 100%;
    margin: 1.5rem auto 2rem;
`;
