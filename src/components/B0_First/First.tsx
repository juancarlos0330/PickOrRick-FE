import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import style from "./First.module.scss";
import mainMobile from "../../assets/png/B0_First/main-mobile.png";
import mainDesktop from "../../assets/png/B0_First/main-desktop.png";
import cucumber0 from "../../assets/png/B0_First/cucumber_0.png";
import cucumber1 from "../../assets/png/B0_First/cucumber_1.png";
import group from "../../assets/png/B0_First/cucumbers.png";
import { useNavigate } from "react-router-dom";
import { saveWalletStatus } from "../../actions/walletActions";
import { links } from "../B2_Vote/links";
import icon1 from "../../assets/png/social links/icon_1.png";
import icon1_hover from "../../assets/png/social links/icon_1_hover.png";
import icon2 from "../../assets/png/social links/icon_2.png";
import icon2_hover from "../../assets/png/social links/icon_2_hover.png";
import icon3 from "../../assets/png/social links/icon_3.png";
import icon3_hover from "../../assets/png/social links/icon_3_hover.png";

const First = (props: any) => {
  const navigate = useNavigate();

  const [isMetamaskInstalled, setIsMetamaskInstalled] =
    useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = () => {
    //check if Metamask wallet is installed
    if ((window as any).ethereum) {
      setIsMetamaskInstalled(true);

      (window as any).ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts: string[]) => {
          setAccount(accounts[0]);
          props.saveWalletStatus("connected");
        })
        .catch((error: any) => {
          alert(`Something went wrong: ${error}`);
        });
    } else {
      alert("Please install Metamask wallet!");
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    props.saveWalletStatus("disconnected");
  };

  useEffect(() => {
    if (props.walletstatus.status === "connected") {
      if ((window as any).ethereum) {
        setIsMetamaskInstalled(true);
        (window as any).ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .then((accounts: string[]) => {
            setAccount(accounts[0]);
          })
          .catch((error: any) => {
            alert(`Something went wrong: ${error}`);
          });
      } else {
        alert("Please install Metamask wallet!");
      }
    }
  }, [props.walletstatus]);

  const stakingJarFunc = () => {
    if (account) {
      navigate("/staking");
    } else {
      connectWallet();
    }
  };

  const pickleJarFunc = () => {
    if (account) {
      navigate("/dashboard");
    } else {
      connectWallet();
    }
  };

  return (
    <div className={style.first}>
      <img src={mainMobile} alt="" className={style.mainMobile} />
      <img src={mainDesktop} alt="" className={style.mainDesktop} />

      <img src={cucumber0} alt="" className={style.cucumber0} />
      <img src={cucumber1} alt="" className={style.cucumber1} />
      <img src={group} alt="" className={style.group} />

      <div className={style.top}>
        <button className={style.stakingBtn} onClick={() => stakingJarFunc()}>
          <p>Staking Jar</p>
        </button>

        <button className={style.pickleBtn} onClick={() => pickleJarFunc()}>
          <p>Pickle Jar</p>
        </button>

        {account ? (
          <button
            className={style.connectBtn}
            onClick={() => disconnectWallet()}
          >
            <p>Disconnect</p>
          </button>
        ) : (
          <button className={style.connectBtn} onClick={() => connectWallet()}>
            <p>Connect</p>
          </button>
        )}

        <div className={style.links}>
          {[
            {
              icon: icon1,
              icon_hover: icon1_hover,
              href: "https://twitter.com/pickorrick",
            },
            {
              icon: icon3,
              icon_hover: icon3_hover,
              href: "https://t.me/pickorrick",
            },
          ].map(({ icon, icon_hover, href }, key) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className={style.link}
            >
              <img src={icon} alt="" className={style.icon} />
              <img src={icon_hover} alt="" className={style.icon_hover} />
            </a>
          ))}
        </div>
      </div>

      <p className={style.subtitle}>[ get it pickle rick...]</p>

      <p className={style.label}>$Rick Coin</p>

      <p className={style.text}>The No1 Vote to Earn Crypto</p>
    </div>
  );
};

First.propTypes = {
  saveWalletStatus: PropTypes.func.isRequired,
};

const mapStateToProps = (state: any) => ({
  walletstatus: state.walletstatus,
});

export default connect(mapStateToProps, { saveWalletStatus })(First);
