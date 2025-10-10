import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import UndoIcon from "../assets/images/undo.png";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const TrackHabits = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchHabits = async () => {
        try {
            const token = localStorage.getItem("access");
            if (!token) throw new Error("User not authenticated");

            const res = await axios.get("http://127.0.0.1:8000/api/habits/", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setHabits(res.data);
        } catch (err) {
            console.error(err.response?.data || err);
            setError("Failed to fetch habits. Try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("access");
            await axios.delete(`http://127.0.0.1:8000/api/habits/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHabits(habits.filter((h) => h.id !== id));
        } catch (err) {
            console.error(err.response?.data || err);
            alert("Failed to delete habit.");
        }
    };

    const handleToggleDone = async (habit) => {
        try {
            const token = localStorage.getItem("access");
            const updatedHabit = { ...habit, completed: !habit.completed };

            await axios.put(
                `http://127.0.0.1:8000/api/habits/${habit.id}/`,
                updatedHabit,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setHabits(
                habits.map((h) => (h.id === habit.id ? updatedHabit : h))
            );
        } catch (err) {
            console.error(err.response?.data || err);
            alert("Failed to update habit.");
        }
    };

    if (loading) return <Loading>Loading habits...</Loading>;
    if (error) return <ErrorMsg>{error}</ErrorMsg>;

    return (
        <Container>
            <HabitContainer>
                {habits.length === 0 && (
                    <NoHabits>No habits tracked yet!</NoHabits>
                )}
                {habits.map((habit) => (
                    <HabitCard key={habit.id}>
                        <CardWrapper
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "100%",
                            }}
                        >
                            <div>
                                <Title completed={habit.completed}>
                                    {habit.title}
                                </Title>
                                <Description>{habit.description}</Description>
                            </div>
                            <Buttons>
                                <DoneButton
                                    completed={habit.completed}
                                    onClick={() => handleToggleDone(habit)}
                                >
                                    {habit.completed ? "Completed" : "Done"}
                                    <CheckIcon show={habit.completed}>
                                        <img src={UndoIcon} alt="undo" />
                                    </CheckIcon>
                                </DoneButton>
                                <DeleteButton
                                    hide={habit.completed}
                                    onClick={() => handleDelete(habit.id)}
                                >
                                    Remove
                                </DeleteButton>
                            </Buttons>
                        </CardWrapper>
                    </HabitCard>
                ))}
            </HabitContainer>

            {/* ✅ Progress Section */}
            <ProgressCard>
                <h3>Progress</h3>
                <div style={{ width: 180, margin: "0 auto" }}>
                    <CircularProgressbar
                        value={
                            (habits.filter((h) => h.completed).length /
                                habits.length) *
                                100 || 0
                        }
                        text={`${
                            Math.round(
                                (habits.filter((h) => h.completed).length /
                                    habits.length) *
                                    100
                            ) || 0
                        }%`}
                        strokeWidth={13}
                        styles={buildStyles({
                            textColor: "#333",
                            pathColor: "#4caf50",
                            trailColor: "#c8e6c9",
                            textSize: "20px",
                            pathTransitionDuration: 0.5,
                        })}
                    />
                </div>
                <TotalHabits>
                    Total Habits <span>{habits.length}</span>
                </TotalHabits>

                <CompletedHabits>
                    Completed{" "}
                    <span>{habits.filter((h) => h.completed).length}</span>
                </CompletedHabits>

                <RemainingHabits>
                    Remaining{" "}
                    <span>{habits.filter((h) => !h.completed).length}</span>
                </RemainingHabits>
            </ProgressCard>
        </Container>
    );
};

export default TrackHabits;

const Container = styled.div`
    width: 88%;
    margin: 0rem auto;
    display: flex;
    justify-content: space-between;
`;
const HabitContainer = styled.div`
    width: 95%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    height: 82.5vh;
    overflow-x: auto;
    padding: 5px 14px;
    background: #dae4dc;
    border-radius: 46px;
    clip-path: inset(0 round 40px);
`;

const HabitCard = styled.div`
    width: 49%;
    height: 269px;
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

const CardWrapper = styled.div``;

const Title = styled.h3`
    font-family: "Figtree", sans-serif;
    font-weight: 700;
    font-size: 26px;
    margin: 17px 0px 22px 0px;
`;

const Description = styled.p`
    font-weight: 500;
    font-size: 18.6px;
    color: #424242ff;
    margin-bottom: 15px;
    line-height: 1.4;
    font-family: "Oxygen", sans-serif;
`;

const Buttons = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 1rem;
    position: relative;
    overflow: hidden;
`;

const DoneButton = styled.button`
    flex: ${(props) => (props.completed ? "1" : "0.48")};
    transition: all 0.5s ease-in-out;
    font-size: 17px;
    font-weight: 600;
    padding: 7px 6px;
    background-color: ${(props) => (props.completed ? "#388e3c" : "#4caf50")};
    color: white;
    border: none;
    border-radius: 24px;
    cursor: pointer;
    font-family: ${(props) => (props.completed ? "Oxygen" : "Figtree")};
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
`;

const CheckIcon = styled.span`
    font-size: 18px;
    opacity: ${(props) => (props.show ? 1 : 0)};
    transform: translateX(${(props) => (props.show ? "6px" : "20px")});
    transition: all 0.4s ease-in-out;
    margin-right: -7rem;
    margin-left: 6rem;

    img {
        width: 16px;
        height: 16px;
        filter: brightness(0) invert(95%);
    }
`;

const DeleteButton = styled.button`
    flex: ${(props) => (props.hide ? "0" : "0.48")};
    opacity: ${(props) => (props.hide ? "0" : "1")};
    transition: all 0.4s ease-in-out;
    font-size: 17px;
    font-weight: 600;
    padding: 7px 6px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 24px;
    cursor: pointer;
    font-family: "Figtree", sans-serif;
    overflow: hidden;
`;

const ProgressCard = styled.div`
    width: 37%;
    border-radius: 50px;
    padding: 14px 26px;
    background-color: #f7ffff;
    border: 1px solid #f0f0f0ed;
    margin-left: 1.5rem;

    h3 {
        font-size: 42px;
        font-family: "Figtree", sans-serif;
        text-align: center;
        font-weight: 700;
        margin-bottom: 2.6rem;
        margin-top: 10px;
    }
`;

const TotalHabits = styled.p`
    font-size: 20px;
    margin: 54px 0px 25px 0px;
    padding: 6px 0px;
    text-align: center;
    border-radius: 26px;
    color: #3798ff;
    background: #d1eaff;
    font-weight: 500;
    font-family: "Figtree", sans-serif;
`;
const CompletedHabits = styled.p`
    font-size: 20px;
    margin-bottom: 25px;
    padding: 6px 0px;
    text-align: center;
    border-radius: 26px;
    color: rgb(46, 125, 50);
    background: #cbf9de;
    font-weight: 500;
    font-family: "Figtree", sans-serif;
`;
const RemainingHabits = styled.p`
    font-size: 20px;
    margin: 20px 0px;
    padding: 6px 0px;
    text-align: center;
    border-radius: 26px;
    background: #fff1d6;
    color: rgb(255 178 13);
    font-weight: 500;
    font-family: "Figtree", sans-serif;
`;
const Loading = styled.p`
    text-align: center;
`;

const ErrorMsg = styled.p`
    text-align: center;
    color: red;
`;

const NoHabits = styled.p`
    font-size: 22px;
    text-align: center;
    color: #777;
    position: absolute;
    top: 22rem;
    left: 40%;
    transform: translateX(-70%);
`;
