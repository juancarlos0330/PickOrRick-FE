import * as React from "react";
import style from "./GameOverPage.module.scss";
import cucumber_left from "../../assets/png/B0_First/cucumber_0.png";
import cucumber_right from "../../assets/png/B0_First/cucumber_1.png";
import src from "../../assets/png/B2_Vote/mainDesktop.png";
import clsx from "clsx";
import group_mobile from "../../assets/png/A5_GameOver/group_mobile.png";
import group_desktop from "../../assets/png/A5_GameOver/group_desktop.png";

export const GameOverPage = () => {
    return (
        <div className={style.gameOverPage}>
            <img src={cucumber_left} alt="" className={style.cucumber_left}/>
            <img src={cucumber_right} alt="" className={style.cucumber_right}/>
            <img src={group_mobile} alt="" className={style.group_mobile}/>
            <img src={group_desktop} alt="" className={style.group_desktop}/>

            <p className={style.title}>Dont Forget To Vote!</p>

            <img src={src} alt="" className={style.img}/>

            <p className={clsx(style.title, style.title_1)}>$Rick coin</p>

            <button className={style.btn}>
                <p>play again</p>
            </button>

            <p className={style.label}>Game Over!</p>

        </div>
    )
}
