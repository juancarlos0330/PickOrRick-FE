import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import style from "./Timer.module.scss";
import { ethers } from "ethers";
import WertWidget from "@wert-io/widget-initializer";
import { v4 as uuidv4 } from "uuid";
import buttonloading from "../../assets/png/button-loading.gif";
import SwapModal from "./SwapModal/SwapModal";
import { getStatusForAdmin } from "../../actions/adminActions";
import PresaleSwapModal from "./PresaleSwapModal/PresaleSwapModal";
import PickOrRickTokenAbi from "../../abi/PickOrRickToken.json";
import PresaleTokenAbi from "../../abi/PresaleToken.json";

const uniswapcontractaddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const wethtestgoerlitokenaddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
const pickorricktesttokenaddress = "0xd30a5F0EE78befd520DB3eb62941F0a8522AC897";
const presaletokenaddress = "0xD6fF052Bb01559A159ac44A1f54af21A4cc02AF6";

declare const window: Window;

export const getDays = (ms: number) => {
  return Math.trunc(ms / (60000 * 60 * 24));
};

export const getHours = (ms: number) => {
  const min = ms / 60000;
  const days = Math.trunc(min / (60 * 24));
  return Math.trunc((min - days * 24 * 60) / 60);
};

export const getMins = (ms: number) => {
  const min = ms / 60000;
  const days = Math.trunc(min / (60 * 24));
  const hours = Math.trunc((min - days * 24 * 60) / 60);
  return Math.trunc(min - days * 24 * 60 - hours * 60);
};

export const getSecs = (ms: number) => {
  const secs = ms / 1000;
  const days = Math.trunc(secs / (60 * 60 * 24));
  const hours = Math.trunc((secs - days * 24 * 60 * 60) / (60 * 60));
  const minutes = Math.trunc(
    (secs - days * 24 * 60 * 60 - hours * 60 * 60) / 60
  );
  return Math.trunc(
    secs - days * 24 * 60 * 60 - hours * 60 * 60 - 60 * minutes
  );
};

const dateEnd = new Date(2023, 4, 31, 18); // дата окончания
export const convertToTwoDigit = (num: number): string =>
  num > 9 ? String(num) : `0${num}`;

const Timer = (props: any) => {
  const [timeIsOver, setTimeIsOver] = useState(false);
  const [time, setTime] = useState(0);
  const [start, setStart] = useState(false);
  const [buycardload, setBuycardload] = useState(false);
  const [claimFlag, setClaimFlag] = useState(false);
  const [open, setOpen] = useState(false);
  const [presaleOpen, setPresaleOpen] = useState(false);
  const [status, setStatus] = useState(0);
  const [PRTokenContract, setPRTokenContract] = useState<any>(null);
  const [totalTokenSoldAmount, setTotalTokenSoldAmount] = useState(0);
  const [totalTokenAmount, setTotalTokenAmount] = useState(0);
  const [PresaleTokenContract, setPresaleTokenContract] = useState<any>(null);
  const [account, setAccount] = useState("");

  const options = {
    partner_id: "01GZKFEJWFMT5CZJ59RE7CX3RT",
    click_id: uuidv4(),
    origin: "https://sandbox.wert.io",
    theme: "white",
    lang: "en",
    // partner_id: "01GZKFEJWFMT5CZJ59RE7CX3RT",
    // click_id: uuidv4(), // unique id of purhase in your system
    // origin: "https://sandbox.wert.io", // this option needed only in sandbox
    // currency: "USD",
    // commodity: "ETH",
    network: "goerli",
    // commodities: JSON.stringify([
    //   {
    //     commodity: "ETH",
    //     network: "goerli",
    //   },
    // ]),
    // currency_amount: 100,
    listeners: {
      loaded: () => {
        setBuycardload(false);
        console.log("loaded");
      },
    },
  };

  const wertWidget = new WertWidget(options);

  useEffect(() => {
    props.getStatusForAdmin();
  }, []);

  useEffect(() => {
    const time = new Date(dateEnd.getTime() - new Date().getTime()).getTime();
    if (time > 0 && !timeIsOver) {
      setTime(time);
      setStart(true);
    }
  }, []);

  useEffect(() => {
    if (props.adminstatus.status) {
      setStatus(props.adminstatus.status.status);
    }
  }, [props.adminstatus]);

  useEffect(() => {
    const timeId = setTimeout(() => {
      if (start) {
        if (time <= 60000) {
          setTimeIsOver(true);
          clearTimeout(timeId);
        } else {
          setTime((time) => time - 1000);
        }
      }
    }, 1000);
    return () => {
      clearTimeout(timeId);
    };
  }, [time]);

  const buywithcard = () => {
    wertWidget.mount();
    setBuycardload(true);
  };

  useEffect(() => {
    if (props.walletstatus.status == "connected") {
      const ethereum = (window as any).ethereum;
      if ((window as any).ethereum) {
        (window as any).ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .then(async (accounts: string[]) => {
            setAccount(accounts[0]);

            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const PresaleTokenContracts = new ethers.Contract(
              presaletokenaddress,
              PresaleTokenAbi,
              signer
            );
            setPresaleTokenContract(PresaleTokenContracts);
            const PORTokenContracts = new ethers.Contract(
              pickorricktesttokenaddress,
              PickOrRickTokenAbi,
              signer
            );
            setPRTokenContract(PORTokenContracts);
            try {
              const totalTokensold = await PresaleTokenContracts.tokensSold();
              setTotalTokenSoldAmount(
                Number(Number(String(totalTokensold)) / 1000000000000000000)
              );
            } catch (err) {
              console.log(err);
              setTotalTokenSoldAmount(0);
            }
            try {
              const totalTokenAmounts = await PORTokenContracts.balanceOf(
                presaletokenaddress
              );
              setTotalTokenAmount(
                Number(Number(String(totalTokenAmounts)) / 1000000000000000000)
              );
            } catch (err) {
              console.log(err);
            }
          })
          .catch((error: any) => {
            alert(`Something went wrong: ${error}`);
          });
      } else {
        alert("Please install Metamask wallet!");
      }
    }
  }, [props.walletstatus]);

  const claimPresaleBtnFunc = async () => {
    if (account) {
      if (PresaleTokenContract) {
        try {
          setClaimFlag(true);
          const claimtoken = await PresaleTokenContract.claimTokens({
            from: account,
          });
          await claimtoken.wait();
          setClaimFlag(false);
        } catch (err) {
          console.log(err);
          setClaimFlag(false);
        }
      }
    } else {
      alert("Please connect wallet!");
    }
  };

  return (
    <div>
      {status === 0 ? (
        <div className={style.timer}>
          <div className={style.card}>
            <p className={style.title}>Time To Launch</p>
            <p className={style.subtitle}>ON CENTRAL EXCHANGES IN...</p>

            <div className={style.items}>
              <div className={style.item}>
                <p className={style.value}>{getDays(time)}</p>
                <p className={style.label}>days</p>
              </div>

              <p className={style.separate}>:</p>

              <div className={style.item}>
                <p className={style.value}>
                  {convertToTwoDigit(getHours(time))}
                </p>
                <p className={style.label}>hours</p>
              </div>

              <p className={style.separate}>:</p>

              <div className={style.item}>
                <p className={style.value}>
                  {convertToTwoDigit(getMins(time))}
                </p>
                <p className={style.label}>minutes</p>
              </div>

              <p className={style.separate}>:</p>

              <div className={style.item}>
                <p className={style.value}>
                  {convertToTwoDigit(getSecs(time))}
                </p>
                <p className={style.label}>seconds</p>
              </div>
            </div>
            <p className={style.text}>Or.. Buy Now on Presale!</p>

            <a
              className={style.etnBtn}
              href="https://www.pinksale.finance/launchpad/0x36A2D017881169129d451a8176Ed7B5817A134d6?chain=ETH"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              <p>Buy on Pinksale!</p>
            </a>

            {/*<button*/}
            {/*  className={style.etnBtn}*/}
            {/*  onClick={() => setPresaleOpen(true)}*/}
            {/*>*/}
            {/*  <p>BUY $Rick WITH ETH</p>*/}
            {/*</button>*/}

            {/* <button className={style.cardBtn} onClick={() => buywithcard()}>
              {buycardload ? (
                <img height="100%" src={buttonloading} alt="buycardload" />
              ) : (
                <p>BUY $Rick WITH Debit/credit card</p>
              )}
            </button> */}

            <p className={style.text}>Raised so Far!</p>
            <div className={style.presaleBar}>
              <div
                className={style.presaleProgress}
                // style={{
                //   width:
                //     Number(
                //       totalTokenSoldAmount / Number(totalTokenAmount / 100)
                //     ) + "%",
                // }}
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>
        </div>
      ) : status === 1 ? (
        <div className={style.timer}>
          <div className={style.card}>
            <p className={style.title}>Time To Launch</p>
            <p className={style.subtitle}>ON BITMART EXCHANGES...</p>
            <div className={style.items}>
              <div className={style.item}>
                <p className={style.value}>{getDays(time)}</p>
                <p className={style.label}>days</p>
              </div>

              <p className={style.separate}>:</p>

              <div className={style.item}>
                <p className={style.value}>
                  {convertToTwoDigit(getHours(time))}
                </p>
                <p className={style.label}>hours</p>
              </div>

              <p className={style.separate}>:</p>

              <div className={style.item}>
                <p className={style.value}>
                  {convertToTwoDigit(getMins(time))}
                </p>
                <p className={style.label}>minutes</p>
              </div>

              <p className={style.separate}>:</p>

              <div className={style.item}>
                <p className={style.value}>
                  {convertToTwoDigit(getSecs(time))}
                </p>
                <p className={style.label}>seconds</p>
              </div>
            </div>
            <p className={style.title}>Register To Buy Rick Coin</p>
            <a
              href="https://www.bitmart.com/"
              target="_blank"
              className={style.cardBtn}
            >
              <p>Bitmart</p>
            </a>
            {claimFlag ? (
              <button className={style.cardBtn}>
                <img height="100%" src={buttonloading} alt="buycardload" />
              </button>
            ) : (
              <button
                className={style.cardBtn}
                onClick={() => claimPresaleBtnFunc()}
              >
                <p>Claim Presale Rick coin</p>
              </button>
            )}
          </div>
        </div>
      ) : status === 2 ? (
        <div className={style.timer}>
          <div className={style.card}>
            <p className={style.title}>Time To Moon!</p>
            <p className={style.subtitle}>We Have Launched On</p>
            <p className={style.title}>BitMark!</p>
            <p className={style.text}>Time to Next exchange Launch</p>
            <div className={style.thirditems}>
              <div className={style.item}>
                <p className={style.value}>{getDays(time)}</p>
                <p className={style.label}>days</p>
              </div>

              <p className={style.separate}>:</p>

              <div className={style.item}>
                <p className={style.value}>
                  {convertToTwoDigit(getHours(time))}
                </p>
                <p className={style.label}>hours</p>
              </div>

              <p className={style.separate}>:</p>

              <div className={style.item}>
                <p className={style.value}>
                  {convertToTwoDigit(getMins(time))}
                </p>
                <p className={style.label}>minutes</p>
              </div>

              <p className={style.separate}>:</p>

              <div className={style.item}>
                <p className={style.value}>
                  {convertToTwoDigit(getSecs(time))}
                </p>
                <p className={style.label}>seconds</p>
              </div>
            </div>
            <a
              href="https://www.bitmart.com/"
              target="_blank"
              className={style.cardBtn}
            >
              <p>Buy now on Bitmart</p>
            </a>
          </div>
        </div>
      ) : (
        <div className={style.timer}>
          <div className={style.card}>
            <p className={style.title}>Time To Launch</p>
            <p className={style.subtitle}>ON CENTRAL EXCHANGES IN...</p>
            <p className={style.title}>Time To Launch</p>
            <div className={style.items}>
              <div className={style.item}>
                <p className={style.value}>{getDays(time)}</p>
                <p className={style.label}>days</p>
              </div>

              <p className={style.separate}>:</p>

              <div className={style.item}>
                <p className={style.value}>
                  {convertToTwoDigit(getHours(time))}
                </p>
                <p className={style.label}>hours</p>
              </div>

              <p className={style.separate}>:</p>

              <div className={style.item}>
                <p className={style.value}>
                  {convertToTwoDigit(getMins(time))}
                </p>
                <p className={style.label}>minutes</p>
              </div>

              <p className={style.separate}>:</p>

              <div className={style.item}>
                <p className={style.value}>
                  {convertToTwoDigit(getSecs(time))}
                </p>
                <p className={style.label}>seconds</p>
              </div>
            </div>

            <p className={style.text}>Or.. Buy Now on Dex!</p>

            <button className={style.etnBtn} onClick={() => setOpen(true)}>
              <p>BUY $Rick WITH ETH</p>
            </button>

            <button className={style.cardBtn} onClick={() => buywithcard()}>
              {buycardload ? (
                <img height="100%" src={buttonloading} alt="buycardload" />
              ) : (
                <p>BUY $Rick WITH card</p>
              )}
            </button>

            <a
              href="https://app.uniswap.org/#/swap"
              target="_blank"
              className={style.nowBtn}
            >
              <p>BUY now</p>
            </a>
          </div>
        </div>
      )}
      <SwapModal open={open} onClose={() => setOpen(false)} />
      <PresaleSwapModal
        open={presaleOpen}
        onClose={() => setPresaleOpen(false)}
      />
    </div>
  );
};

Timer.propTypes = {
  getStatusForAdmin: PropTypes.func.isRequired,
  adminstatus: PropTypes.object.isRequired,
};

const mapStateToProps = (state: any) => ({
  adminstatus: state.adminstatus,
  walletstatus: state.walletstatus,
});

export default connect(mapStateToProps, { getStatusForAdmin })(Timer);
