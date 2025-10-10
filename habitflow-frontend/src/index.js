import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <GoogleOAuthProvider clientId="538770925207-tnft334q7e7fho9e0iojb9v7kr5rqm46.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
);
