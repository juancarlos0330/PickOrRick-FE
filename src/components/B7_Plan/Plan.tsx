import * as React from "react";
import style from "./Plan.module.scss";
import logo from "../../assets/png/B7_Plan/logo.png";
import pot0 from "../../assets/png/B6_Tokenomics/pot0.png";
import pot2 from "../../assets/png/B6_Tokenomics/pot1.png";
import pot1 from "../../assets/png/B7_Plan/spot2.png";
import group from "../../assets/png/B3_About/group.png";

const pretext = "oh and troll crypto influencers on twitter till they tweet us";
const text =
  "We know it gets boring living in your wife's boyfriend's basement. so here's a game about pickles to keep you busy until launch :)";

export const Plan = () => {
  return (
    <div className={style.plan}>
      <img src={group} alt="" className={style.mobile1} />
      <img src={group} alt="" className={style.mobile2} />
      <img src={group} alt="" className={style.mobile3} />
      <img src={group} alt="" className={style.mobile4} />

      <img src={logo} alt="" className={style.logo} />

      <h2 className={style.title}>Here's the plan morty</h2>

      <div className={style.pots}>
        {[
          {
            src: pot0,
            label: "q1: degen",
            text: "Find people who like pickles, specifically pickle ricks.",
          },
          {
            src: pot1,
            label: "q2: half degen",
            text: "Empty a pickle jar and put everyone's money in it...",
          },
          {
            src: pot2,
            label: "q3: pickgen",
            text: "Make everyone fight for the pickle jar of money...",
          },
        ].map(({ src, label, text }, key) => (
          <div className={style.pot} key={key}>
            <img src={src} alt="" />
            <p className={style.label}>{label}</p>
            <p className={style.text}>{text}</p>
          </div>
        ))}
      </div>

      <p className={style.pretext}>{pretext}</p>

      <p className={style.text}>{text}</p>
    </div>
  );
};
