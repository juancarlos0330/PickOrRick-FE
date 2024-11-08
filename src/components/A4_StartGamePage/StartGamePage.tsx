import * as React from "react";
import style from "./StartGamePage.module.scss";
import First from "../B0_First/First";

export const StartGamePage = () => {
  return (
    <div className={style.startGamePage}>
      <First />
      <button className={style.startBtn}>
        <p>Start Game</p>
      </button>
    </div>
  );
};
