import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const AiCoach = () => {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [loadingMessage, setLoadingMessage] = useState("");
    const [addedHabits, setAddedHabits] = useState({});

    // ✅ Load saved query & suggestions per user
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const savedQuery = localStorage.getItem(`aicoach_query_${user.email}`);
        const savedSuggestions = localStorage.getItem(
            `aicoach_suggestions_${user.email}`
        );

        if (savedQuery) setQuery(savedQuery);
        if (savedSuggestions) setSuggestions(JSON.parse(savedSuggestions));
    }, []);

    // ✅ Save query & suggestions per user
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        localStorage.setItem(`aicoach_query_${user.email}`, query);
        localStorage.setItem(
            `aicoach_suggestions_${user.email}`,
            JSON.stringify(suggestions)
        );
    }, [query, suggestions]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError("");
        setSuggestions([]);

        const messages = [
            "AI Generating your personalized habits",
            "Analyzing your health goals",
            "Finding the best suggestions ",
        ];
        let index = 0;
        setLoadingMessage(messages[index]); // show first message

        const interval = setInterval(() => {
            index = (index + 1) % messages.length;
            setLoadingMessage(messages[index]); // rotate messages without dots
        }, 2000); // change message every 2s

        try {
            const token = localStorage.getItem("access"); // JWT from Django login
            if (!token) throw new Error("User not authenticated");

            const res = await axios.post(
                "http://127.0.0.1:8000/api/aicoach/suggest/",
                { query },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.suggestions) {
                setSuggestions(res.data.suggestions);
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                setError("No suggestions received");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to get AI suggestions. Please login again.");
        } finally {
            setLoading(false);
            clearInterval(interval);
            setLoadingMessage("");
        }
    };

    const handleAddHabit = async (habit) => {
        try {
            const token = localStorage.getItem("access");
            if (!token) throw new Error("User not authenticated");

            const habitData = {
                title: habit.title,
                description: habit.description || "",
            };

            await axios.post("http://127.0.0.1:8000/api/habits/", habitData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Instead of alert, update the state for this habit
            setAddedHabits((prev) => ({ ...prev, [habit.title]: true }));
        } catch (err) {
            console.error(err.response?.data || err);
            // Optional: you can show some error text below the card instead of alert
        }
    };

    return (
        <Container>
            <Header>✨ AI Health Coach</Header>
            <SubHead>Get personalized habit suggestions powered by AI</SubHead>

            <Content>
                {loading && <LoadingMsg>{loadingMessage}</LoadingMsg>}
                {error && <ErrorMsg>{error}</ErrorMsg>}

                {suggestions.map((s, idx) => (
                    <SuggestionCard key={idx}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "100%",
                            }}
                        >
                            <div>
                                <Title>{s.title}</Title>
                                <Description>{s.description}</Description>
                            </div>
                            <AddButton
                                onClick={() => handleAddHabit(s)}
                                disabled={addedHabits[s.title]} // optional: disable button after added
                            >
                                {addedHabits[s.title]
                                    ? "Added Successfully"
                                    : "Track Habit"}
                            </AddButton>
                        </div>
                    </SuggestionCard>
                ))}
            </Content>

            <InputBar onSubmit={handleSubmit}>
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask about healthy habits..."
                />
                <SubmitButton type="submit" disabled={loading}>
                    Ask AI
                </SubmitButton>
            </InputBar>
        </Container>
    );
};

export default AiCoach;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    position: relative;
    padding-bottom: 100px;
    overflow-x: hidden;
`;
const Header = styled.h2`
    font-size: 25px;
    margin-bottom: 10px;
    text-align: center;
`;
const SubHead = styled.h4`
    font-size: 18px;
    font-family: "Figtree", sans-serif;
    font-weight: 400;
    margin-bottom: 30px;
    margin-left: 18px;
    text-align: center;
`;
const Content = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
    padding: 0 68px 1rem;
    overflow-x: auto;

    &::-webkit-scrollbar {
        width: 0;
    }

    overscroll-behavior-x: contain;
`;
const LoadingMsg = styled.p`
    margin: 10rem auto 0rem;
    margin-bottom: 14px;
    font-family: "Oxygen", sans-serif;
    font-weight: 500;
    font-size: 18px;
    color: black;
    position: relative;
    display: inline-block;

    background: linear-gradient(to right, black 0%, silver 50%, black 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;

    animation: wave 2.4s linear infinite;

    @keyframes wave {
        0% {
            background-position: 200% 0; /* start off right */
        }
        100% {
            background-position: -200% 0; /* move to left */
        }
    }
`;

const SuggestionCard = styled.div`
    width: 345px;
    height: 375px;
    flex: 0 0 auto;
    justify-content: space-between;
    box-shadow: 2px 4px 12px #00000014;
    border-radius: 34px;
    margin: 10px 0;
    padding: 0px 26px;
    text-align: left;
    background-color: #f9f9f9;
    overflow-y: auto;
`;
const Title = styled.h3`
    font-family: "Figtree", sans-serif;
    font-weight: 700;
    font-size: 28px;
    margin: 17px 0px 25px 0px;
`;
const Description = styled.p`
    font-weight: 500;
    font-size: 21px;
    color: #424242ff;
    margin-bottom: 15px;
    line-height: 1.4;
    font-family: "Oxygen", sans-serif;
`;
const ErrorMsg = styled.p`
    color: red;
    margin: 8rem auto 0rem;
    margin-bottom: 14px;
    font-weight: 400;
    font-size: 16px;
`;
const AddButton = styled.button`
    font-size: 17px;
    padding: 7px 15px;
    border-radius: 18px;
    font-weight: 600;
    background-color: #4ebf52;
    color: white;
    border: none;
    cursor: default;
    margin-bottom: 11px;
    font-family: "Figtree", sans-serif;
`;
const InputBar = styled.form`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 1.4rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 42%;
    border-radius: 28px;
    background-color: white;
    padding: 5px 5px;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
`;
const Input = styled.input`
    width: 88%;
    font-size: 15px;
    padding: 12px 18px;
    padding-right: 30px;
    box-sizing: border-box;
    border: none;
    background: #f3f3f3;
    border-radius: 35px;
    &:focus {
        outline: none;
    }
`;
const SubmitButton = styled.button`
    width: 4.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background-color: #af7bff;
    padding: 10px;
    border-radius: 35px;
    font-weight: 600;
    font-family: "Figtree", sans-serif;
    cursor: pointer;
`;
