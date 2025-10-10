import React from "react";
import styled from "styled-components";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;
        const userInfo = jwtDecode(token);

        console.log("User Info:", userInfo);
        // console.log(JSON.parse(localStorage.getItem("user")));

        try {
            // Send Google info to Django to create/get user & return JWT
            const res = await axios.post(
                "http://127.0.0.1:8000/api/users/google-login/",
                {
                    email: userInfo.email,
                    name: userInfo.name,
                    google_id: userInfo.sub,
                    picture: userInfo.picture,
                }
            );

            // Store JWT and user info in localStorage
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            navigate("/dashboard"); // or /aicoach
        } catch (err) {
            console.error("Django login failed:", err);
            alert("Login failed. Try again.");
        }
    };

    const handleError = () => {
        console.log("Login Failed");
    };

    return (
        <Container>
            <Card>
                <Title>Welcome to HabitFlow</Title>
                <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
            </Card>
        </Container>
    );
};

export default GoogleAuth;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: #fff;
`;

const Title = styled.h1`
    font-size: 3.2rem;
    margin-bottom: 4.5rem;
`;

const Card = styled.div`
    width: 28%;
    height: 65%;
    background: white;
    color: black;
    border-radius: 52px;
    padding: 40px 37px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    border: 1.2px solid #b1b1b1ff;
`;
