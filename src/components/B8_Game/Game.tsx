import * as React from "react";
import style from "./Game.module.scss";
import card from "../../assets/png/B8_Game/card.png";
import {svgIcons} from "../../assets/svgIcons";
import group from "../../assets/png/B3_About/group.png";

export const Game = () => {
    return (
        <div className={style.game}>

            {/*<img src={group} alt="" className={style.mobile1}/>*/}
            {/*<img src={group} alt="" className={style.mobile2}/>*/}
            <img src={group} alt="" className={style.desktop}/>

            <h2 className={style.title}>The game</h2>

            <div className={style.wrapper}>
                <iframe src="https://v6p9d9t4.ssl.hwcdn.net/html/6311121/index.html">

                </iframe>
            </div>

            {/*<a className={style.card}*/}
            {/*   href="https://www.newgrounds.com/portal/view/853593"*/}
            {/*   target="_blank"*/}
            {/*   rel="nofollow noopener noreferrer"*/}
            {/*>*/}
            {/*    <img src={card} alt=""/>*/}
            {/*    {svgIcons.game}*/}
            {/*</a>*/}
        </div>
    )
}
