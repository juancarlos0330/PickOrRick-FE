import * as React from "react";
import style from "./AboutUs.module.scss";
import left from "../../assets/png/B3_About/cucumber_left.png";
import right from "../../assets/png/B3_About/cucumber_right.png";
import left_mobile from "../../assets/png/B3_About/cucumber_left_mobile.png";
import right_mobile from "../../assets/png/B3_About/cucumber_right_mobile.png";
import group from "../../assets/png/B3_About/group.png";

const text =
  "Listen, Morty. They turned pickles into crypto currency. It's like discovering the fountain of wealth in a jar of pickles. People vote for Pick or Rick, and the winning side takes all the money. It's like the Olympics of pickles, Morty. Lets get in on the action and make ourselves $Pepe Rich. What do you say, are you ready to take over the pickle world with me?";

export const AboutUs = () => {
  return (
    <div className={style.aboutUs}>
      <img src={left} alt="" className={style.left} />
      <img src={right} alt="" className={style.right} />

      <img src={left_mobile} alt="" className={style.left_mobile} />
      <img src={right_mobile} alt="" className={style.right_mobile} />

      <img src={group} alt="" className={style.mobile1} />
      <img src={group} alt="" className={style.desktop} />

      <button className={style.aboutBtn}>
        <p>about us</p>
      </button>

      <p className={style.text}>{text}</p>
    </div>
  );
};
