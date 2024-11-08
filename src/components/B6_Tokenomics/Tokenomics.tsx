import * as React from "react";
import style from "./Tokenomics.module.scss";
import pot0 from "../../assets/png/B6_Tokenomics/pot0.png";
import pot1 from "../../assets/png/B6_Tokenomics/pot1.png";
import pot2 from "../../assets/png/B6_Tokenomics/pot2.png";
import pot3 from "../../assets/png/B6_Tokenomics/pot3.png";
import pot4 from "../../assets/png/B6_Tokenomics/pot4.png";
import group from "../../assets/png/B3_About/group.png";

export const Tokenomics = () => {
  return (
    <div className={style.tokenomics}>
      <img src={group} alt="" className={style.mobile1} />
      {/* <img src={group} alt="" className={style.mobile2} />
      <img src={group} alt="" className={style.mobile3} /> */}

      <h2 className={style.title}>Tokenomics</h2>

      <div className={style.pottops}>
        {[
          { src: pot1, label: "5% Marketing" },
          { src: pot3, label: "1% Airdrop" },
        ].map(({ src, label }, key) => (
          <div className={style.pot} key={key}>
            <img src={src} alt="" />
            <p className={style.label}>{label}</p>
          </div>
        ))}
      </div>

      <div className={style.pots}>
        {[
          { src: pot2, label: "5% Staking Pool" },
          { src: pot0, label: "84% Liquidity Presale" },
          { src: pot4, label: "5% Future Cex Listings" },
        ].map(({ src, label }, key) => (
          <div className={style.pot} key={key}>
            <img src={src} alt="" />
            <p className={style.label}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
