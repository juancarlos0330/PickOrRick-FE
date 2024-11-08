import * as React from "react";
import style from "./Header.module.scss";
import { Link } from "react-router-dom";
import { svgIcons } from "../../../assets/svgIcons";
import logo from "../../../assets/png/A3_Dashboard/header_logo.png";

const userName = "Peter";

const Header = () => {
  return (
    <div className={style.header}>
      <div className={style.innerMobile}>
        <img src={logo} alt="" />
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
            <p>Staking</p>
          </button>

          <button className={style.link}>{svgIcons.link}</button>

          <button className={style.more}>{svgIcons.more}</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
