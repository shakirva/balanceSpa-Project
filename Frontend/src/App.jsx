
import React, { useEffect, useRef, useState } from "react";
import { ConfigProvider } from "antd";
import "./App.css";
import Router from "./routes";
import { antdTheme } from "./theme";
import { ToastProvider } from "@components/common/toast";
import { useNavigate } from "react-router-dom";

const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutes

function App() {
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        navigate("/");
      }, INACTIVITY_TIMEOUT);
    };
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("touchstart", resetTimer);
    window.addEventListener("mousedown", resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("touchstart", resetTimer);
      window.removeEventListener("mousedown", resetTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [navigate]);

  return (
    <ConfigProvider theme={antdTheme}>
      <ToastProvider />
      <Router />
    </ConfigProvider>
  );
}

export default App;
