import React from "react";
import "./index.css";
import "./i18n/languageConfig";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "449386819320-v4lu3eiouevdev5l9b4mgavmujagsrjf.apps.googleusercontent.com";

root.render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <App />
  </GoogleOAuthProvider>
);
