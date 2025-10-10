import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { googleLogout } from "@react-oauth/google";
import UserIcon from "../assets/images/user.jpeg";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("access");
            const storedUser = JSON.parse(localStorage.getItem("user"));

            if (!token) {
                console.error("No access token found!");
                setLoading(false);
                return;
            }

            try {
                // ✅ Fetch latest profile details from backend
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/users/profile/",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // ✅ Keep Google picture (if Django doesn't return one)
                const updatedUser = {
                    ...response.data,
                    picture: storedUser?.picture || response.data.picture || "",
                };

                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleLogout = () => {
        googleLogout();
        localStorage.removeItem("user");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("activeTab");
        window.location.href = "/";
    };

    if (loading) return <LoadingMsg>Loading profile...</LoadingMsg>;
    if (!user)
        return (
            <LoadingMsg>Failed to load profile. Please login again.</LoadingMsg>
        );

    const imageUrl = user.picture?.replace(/=s\d+-c$/, "") || UserIcon;

    return (
        <Container>
            <Card>
                <ProfileImage
                    src={imageUrl}
                    alt={user.name}
                    onError={(e) => (e.target.src = UserIcon)}
                />
                <div>
                    <Name>{user.name}</Name>
                    <Email>{user.email}</Email>
                    <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                </div>
            </Card>
        </Container>
    );
};

export default Profile;

const Container = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 4.4rem;
`;

const Card = styled.div`
    width: 27rem;
    background: #e5e5e5;
    padding: 24px 31px;
    border-radius: 43px;
    display: flex;
    flex-direction: column;
`;

const ProfileImage = styled.img`
    display: block;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    padding: 6px;
    margin: 0 auto 20px auto;
    object-fit: cover;
    background: #fff;
`;

const Name = styled.h2`
    margin-bottom: 5px;
    margin-top: 12px;
`;

const Email = styled.p`
    color: gray;
    margin-bottom: 35px;
`;

const LogoutButton = styled.button`
    width: 100%;
    padding: 8px 20px;
    border: none;
    background-color: #f23444ff;
    color: white;
    font-weight: 600;
    border-radius: 25px;
    cursor: pointer;
`;

const LoadingMsg = styled.p`
    text-align: center;
    margin-top: 50px;
    color: red;
    font-weight: 500;
`;
