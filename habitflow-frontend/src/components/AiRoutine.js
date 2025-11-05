import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { keyframes, css } from "styled-components";

const AiRoutine = () => {
    const [routine, setRoutine] = useState([]);
    const [advice, setAdvice] = useState("");
    const [loading, setLoading] = useState(false);

    // ✅ Load saved data on mount (for persistence)
    useEffect(() => {
        const savedRoutine = localStorage.getItem("aiRoutine");
        const savedAdvice = localStorage.getItem("aiAdvice");

        if (savedRoutine) setRoutine(JSON.parse(savedRoutine));
        if (savedAdvice) setAdvice(savedAdvice);
    }, []);

    const generateRoutine = async () => {
        // ✅ Clear old routine/advice when user clicks generate
        setRoutine([]);
        setAdvice("");
        localStorage.removeItem("aiRoutine");
        localStorage.removeItem("aiAdvice");

        setLoading(true);
        try {
            const habitRes = await axios.get(
                "http://127.0.0.1:8000/api/habits/",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "access"
                        )}`,
                    },
                }
            );

            const habits = habitRes.data.map((h) => h.title);

            const aiRes = await axios.post(
                "http://127.0.0.1:8000/api/aicoach/routine/",
                {
                    habits,
                }
            );

            // ✅ Set new routine and advice
            setRoutine(aiRes.data.routine);
            setAdvice(aiRes.data.advice);

            // ✅ Save new routine and advice in localStorage
            localStorage.setItem(
                "aiRoutine",
                JSON.stringify(aiRes.data.routine)
            );
            localStorage.setItem("aiAdvice", aiRes.data.advice);
        } catch (err) {
            console.error("Error generating routine:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Banner>
                <MainTitle>
                    <h2>Your Perfect Routine</h2>
                    <h3>Designed by AI</h3>
                </MainTitle>

                <Button
                    onClick={generateRoutine}
                    $loading={loading}
                    disabled={loading}
                >
                    <Sparkle
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        $loading={loading}
                    >
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
                    <TextButton>
                        {loading
                            ? "Generating Routine..."
                            : "Generate Smart AI Routine"}
                    </TextButton>
                </Button>
            </Banner>

            {routine.length > 0 && (
                <RoutineList>
                    {routine.map((r, i) => (
                        <RoutineCard key={i}>
                            <Time>{r.time}</Time>
                            <Activity>{r.activity}</Activity>
                        </RoutineCard>
                    ))}
                </RoutineList>
            )}

            {advice && (
                <AdviceBox>
                    <h3>AI Insight for You</h3>
                    <p>{advice}</p>
                </AdviceBox>
            )}
        </Container>
    );
};

export default AiRoutine;

const Container = styled.div`
    width: 60%;
    margin: 4rem auto 1rem;
`;
const Banner = styled.div`
    background: #000000ff;
    padding: 3rem;
    border-radius: 50px;
`;
const MainTitle = styled.div`
    h2 {
        color: #848484;
        text-align: center;
        font-size: 60px;
        font-weight: 700;
        margin-top: 12px;
        font-family: "Figtree", sans-serif;
    }
    h3 {
        text-align: center;
        font-size: 62px;
        font-weight: 700;
        margin-bottom: 2.4rem;
        color: #5bc54a;
        color: #52cf3e;
        font-family: "Figtree", sans-serif;
    }
`;

const pathAnim = keyframes`
  0%, 34%, 71%, 100% { transform: scale(1); }
  17% { transform: scale(var(--scale_path_1, 1)); }
  49% { transform: scale(var(--scale_path_2, 1)); }
  83% { transform: scale(var(--scale_path_3, 1)); }
`;

const Button = styled.button`
    margin: 0 auto;
    --border_radius: 9999px;
    --transition: 0.3s ease-in-out;
    width: 15.8rem;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 15px 16px;
    background-color: transparent;
    border: none;
    border-radius: var(--border_radius);
    transition: all var(--transition);

    &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        background-color: hsla(0, 0%, 12%, 1);
        border-radius: var(--border_radius);
        transition: all var(--transition);
        z-index: 0;
    }

    &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        background-color: hsla(260, 97%, 61%, 0.75);
        background-image: radial-gradient(
                at 51% 89%,
                hsla(266, 45%, 74%, 1) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 100% 100%,
                hsla(266, 36%, 60%, 1) 0px,
                transparent 50%
            ),
            radial-gradient(
                at 22% 91%,
                hsla(266, 36%, 60%, 1) 0px,
                transparent 50%
            );
        background-position: top;
        opacity: ${({ $loading }) => ($loading ? 1 : 0)};
        border-radius: var(--border_radius);
        transition: opacity var(--transition);
        z-index: 2;
    }

    &:active {
        transform: scale(1);
    }
`;

const Sparkle = styled.svg`
    position: relative;
    z-index: 10;
    width: 1.4rem;

    .path {
        fill: currentColor;
        stroke: currentColor;
        transform-origin: center;
        color: hsl(0, 0%, 100%);
    }

    ${({ $loading }) =>
        $loading &&
        css`
            .path {
                animation: ${pathAnim} 1.5s linear 0.5s infinite;
            }
        `}

    .path:nth-child(1) {
        --scale_path_1: 1.2;
    }
    .path:nth-child(2) {
        --scale_path_2: 1.2;
    }
    .path:nth-child(3) {
        --scale_path_3: 1.2;
    }
`;

const TextButton = styled.span`
    position: relative;
    z-index: 10;
    margin: 0 auto;
    background-clip: text;
    font-size: 1rem;
    color: #efefefff;
`;

const RoutineList = styled.div`
    margin-top: 3rem;
`;

const RoutineCard = styled.div`
    background: #ffffffff;
    border-radius: 30px;
    padding: 1.4rem 2rem;
    margin-bottom: 1rem;
    display: flex;
    gap: 5px;
    flex-direction: column;
`;

const Time = styled.span`
    font-size: 21px;
    font-weight: 500;
    color: #60cd1a;
    font-family: "Oxygen", sans-serif;
`;

const Activity = styled.span`
    color: #374151;
    font-size: 21px;
    font-family: "Oxygen", sans-serif;
`;

const AdviceBox = styled.div`
    background: #e3e2f0;
    border-radius: 42px;
    padding: 1.6rem 2rem;
    margin-top: 2rem;

    h3 {
        font-size: 23px;
        font-weight: 700;
        margin-bottom: 0.6rem;
        color: #000;
        font-family: "Figtree", sans-serif;
        display: inline-block;
        background: #cdc8ff;
        padding: 7px 20px;
        border-radius: 22px;
    }

    p {
        color: #000000;
        font-size: 19px;
        line-height: 1.6;
        font-family: "Oxygen", sans-serif;
    }
`;
