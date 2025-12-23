import React from "react";
import "./index.css";
import "./i18n/languageConfig";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="449386819320-v4lu3eiouevdev5l9b4mgavmujagsrjf.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
