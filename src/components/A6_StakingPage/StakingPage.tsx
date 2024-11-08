import * as React from "react";
import style from "./StakingPage.module.scss";
import cucumber_left from "../../assets/png/A3_Dashboard/cucumber_left.png";
import cucumber_right from "../../assets/png/A3_Dashboard/cucumber_right.png";
import Card from "./Card/Card";
import Header from "./Header/Header";

const StakingPage = () => {
  return (
    <div className={style.stakingPage}>
      <div className={style.inner}>
        <Header />
        <Card />
      </div>
      <img src={cucumber_left} alt="left" className={style.cucumber_left} />
      <img src={cucumber_right} alt="right" className={style.cucumber_right} />
    </div>
  );
};

export default StakingPage;
