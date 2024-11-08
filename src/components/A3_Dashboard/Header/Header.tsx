import * as React from "react";
import style from "./Header.module.scss";
import logo from "../../../assets/png/A3_Dashboard/header_logo.png";
import { Link } from "react-router-dom";
import { svgIcons } from "../../../assets/svgIcons";
import { TimeBlock } from "../TimeBlock/TimeBlock";

const userName = "Stanislav";

export const Header = () => {
  return (
    <header className={style.header}>
      <div className={style.innerMobile}>
        <img src={logo} alt="" className={style.logo} />
        <p className={style.title}>Welcome, Pickle Sam!</p>
        <p className={style.label}>Next Pickle Fight starts in</p>

        <div className={style.times}>
          <TimeBlock value={17} unit="hours" />
          <p className={style.divider}>:</p>
          <TimeBlock value={46} unit="minutes" />
          <p className={style.divider}>:</p>
          <TimeBlock value={53} unit="seconds" />
        </div>
      </div>

      <div className={style.innerDesktop}>
        <div className={style.left}>
          <Link to="/" className={style.logo}>
            <img src={logo} alt="" />
          </Link>

          <div className={style.texts}>
            <p className={style.userName}>Welcome, ${userName}!</p>
            <p className={style.label}>Personal Dashboard</p>
          </div>
        </div>

        <div className={style.right}>
          <button className={style.downloadData}>
            <p>Staking Jar</p>
          </button>

          <button className={style.link}>{svgIcons.link}</button>

          <button className={style.more}>{svgIcons.more}</button>
        </div>
      </div>
    </header>
  );
};
