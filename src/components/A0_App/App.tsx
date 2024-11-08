import React from "react";
import style from "./App.module.scss";
import { Route, Routes } from "react-router-dom";
import HomePage from "../A2_HomePage/HomePage";
import VerifyPage from "../A2_HomePage/VerifyPage";
import Dashboard from "../A3_Dashboard/Dashboard";
import { StartGamePage } from "../A4_StartGamePage/StartGamePage";
import { GameOverPage } from "../A5_GameOverPage/GameOverPage";
import StakingPage from "../A6_StakingPage/StakingPage";
import AdminPage from "../Admin/AdminPage";
import AdminDashboardPage from "../AdminDashboard/AdminDashboardPage";

export const App = () => {
  return (
    <div className={style.app}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify-email/*" element={<VerifyPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/game-start" element={<StartGamePage />} />
        <Route path="/game-over" element={<GameOverPage />} />
        <Route path="/staking" element={<StakingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
    </div>
  );
};
