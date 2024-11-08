import * as React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import style from "./HomePage.module.scss";
import First from "../B0_First/First";
import Timer from "../B1_Timer/Timer";
import Vote from "../B2_Vote/Vote";
import { AboutUs } from "../B3_AboutUs/AboutUs";
import Video from "../B5_Video/Video";
import { Tokenomics } from "../B6_Tokenomics/Tokenomics";
import { Plan } from "../B7_Plan/Plan";
import { Game } from "../B8_Game/Game";
import { Footer } from "../A1_Footer/Footer";
import { Holders } from "../B4_Holders/Holders";

const HomePage = () => {
  return (
    <div className={style.homePage}>
      <First />
      <Timer />
      <Video />
      <Vote />
      <AboutUs />
      <Holders />
      <Tokenomics />
      <Plan />
      <Game />
      <Footer />
    </div>
  );
};

HomePage.propTypes = {};

const mapStateToProps = (state: any) => ({
  votestatus: state.votestatus,
});

export default connect(mapStateToProps, {})(HomePage);
