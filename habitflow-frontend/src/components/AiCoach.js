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
            <Header>
                <Sparkle xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        className="path"
                        d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z"
                    />
                    <path
                        className="path"
                        d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z"
                    />
                    <path
                        className="path"
                        d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z"
                    />
                </Sparkle>
                AI Health Coach
            </Header>
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
    font-size: 33px;
    margin-bottom: 10px;
    margin-top: 10px;
    text-align: center;
`;

const Sparkle = styled.svg`
    width: 27px;
    height: 27px;
    fill: none;
    stroke: currentColor;

    .path {
        fill: currentColor;
        stroke: currentColor;
        transform-origin: center;
        color: hsla(0, 0%, 9%, 1);
        margin-right: 4px;
        margin-bottom: -2px;
    }

    &:hover .path {
        stroke: gold;
        transform: scale(1.1);
    }
`;

const SubHead = styled.h4`
    font-size: 18px;
    font-family: "Figtree", sans-serif;
    font-weight: 400;
    margin-bottom: 22px;
    margin-left: 18px;
    text-align: center;
`;
const Content = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
    padding: 22px 68px 1rem;
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
