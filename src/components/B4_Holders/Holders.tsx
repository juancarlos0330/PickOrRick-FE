import * as React from "react";
import style from "./Holders.module.scss";
import pyramid from "../../assets/png/B4_Market/pyramid.png";
import ufo from "../../assets/png/B4_Market/ufo.png";
import group from "../../assets/png/B3_About/group.png";

const text0 =
  "Its all about the marketcap Morty! The more holders we get the higher the marketcap, thats how we get rich!";
// const text1 =
//   "Were launching on $250k MCAP that means everytime $250k comes in were already up 100% meme coins are 10xing within 1 week of launch its all about finding a good one early, were gonna make pepe look like a shitcoin if we get this right!";

export const Holders = () => {
  return (
    <div className={style.holders}>
      <h2 className={style.title}>Holders</h2>

      <img src={pyramid} alt="" className={style.pyramid} />
      <img src={ufo} alt="" className={style.ufo} />

      {/*<img src={group} alt="" className={style.mobile1}/>*/}
      <img src={group} alt="" className={style.mobile2} />
      <img src={group} alt="" className={style.desktop} />

      <div className={style.items}>
        <div className={style.row}>
          <p>{"100,000"}</p>
        </div>
        <div className={style.row}>
          <p>{"10,000"}</p>
          <p>{"50,000"}</p>
        </div>
        <div className={style.row}>
          <p>{"1,000"}</p>
          <p>{"2,500"}</p>
          <p>{"5,000"}</p>
        </div>
      </div>

      <p className={style.text0}>{text0}</p>
      {/* <p className={style.text1}>{text1}</p> */}
    </div>
  );
};
