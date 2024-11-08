import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import style from "./Card.module.scss";
import ufo from "../../../assets/png/B4_Market/ufo.png";
import rick from "../../../assets/png/A6_Staking/rick.png";
import jars from "../../../assets/png/A6_Staking/jars.png";
import stakers from "../../../assets/png/A6_Staking/stakers.png";
import clsx from "clsx";
import earning_mobile from "../../../assets/png/A6_Staking/earning_mobile.png";
import earning_desktop from "../../../assets/png/A6_Staking/earning_desktop.png";
import { saveWalletStatus } from "../../../actions/walletActions";
import isEmpty from "../../../validation/is-empty";
import Loadingsrc from "../../../assets/png/button-loading.gif";

// import abi
import PickOrRickToken from "../../../abi/PickOrRickToken.json";
import VotingSystem from "../../../abi/VotingSystem.json";
import TokenStaking from "../../../abi/TokenStaking.json";

const RPTokenContractAddress = "0x75430D0782A443bD4f1c92C69009599dEA53A206";
const VotingContractAddress = "0x30c4B449C1Faa73FC29b70f202Ae5c00871C1D0a";
const TokenStakingContractAddress =
  "0xcE142533e5C55E20Ae5eB3A76b92B3B8302e47A6";

const Card = (props: any) => {
  const [account, setAccount] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [totalRickStakedAmount, setTotalRickStakedAmount] = useState(0);
  const [totalRickEarnedAmount, setTotalRickEarnedAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [stakersnum, setStakersNum] = useState(0);
  const [stakerInfo, setStakerInfo] = useState([]);
  const [stakebalance, setStakeBalance] = useState(0);
  const [approveFlag, setApproveFlag] = useState(false);
  const [stakedFlag, setStakedFlag] = useState(false);
  const [stakerStartStakingTime, setStakerStartStakingTime] = useState("");
  const [stakerLastClaimTime, setStakerLastClaimTime] = useState("");
  const [stakerid, setStakerId] = useState(0);
  const [unstakingFlag, setUnstakingFlag] = useState(false);
  const [claimAmount, setClaimAmount] = useState(0);
  const [claimFlag, setClaimFlag] = useState(false);

  const [PickOrRickTokenContracts, setPickOrRickTokenContracts] =
    useState<any>(null);
  const [TokenStakingContracts, setTokenStakingContracts] = useState<any>(null);

  const numberformatfunc = (num: any) => {
    return Number(Number(num).toFixed(2));
  };

  const getAssets = async () => {
    const ethereum = (window as any).ethereum;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const PickOrRickxContract = new ethers.Contract(
      RPTokenContractAddress,
      PickOrRickToken,
      signer
    );
    const TokenStakingContract = new ethers.Contract(
      TokenStakingContractAddress,
      TokenStaking,
      signer
    );
    setPickOrRickTokenContracts(PickOrRickxContract);
    setTokenStakingContracts(TokenStakingContract);
    if (PickOrRickxContract && TokenStakingContract) {
      try {
        const bals = await PickOrRickxContract.balanceOf(account);
        setBalance(Number((bals / 1000000000000000000).toFixed(2).toString()));
        try {
          const totalstakedamount =
            await TokenStakingContract._currentStakedAmount();
          setTotalRickStakedAmount(
            Number(
              Number(
                Number(String(totalstakedamount)) / 1000000000000000000
              ).toFixed(2)
            )
          );

          try {
            const totalrewardamount = await TokenStakingContract._totalReward();
            setTotalRickEarnedAmount(
              ethers.BigNumber.from(totalrewardamount._hex).toNumber()
            );

            try {
              const stakerlen = await TokenStakingContract.getstakers();
              setStakersNum(ethers.BigNumber.from(stakerlen._hex).toNumber());

              try {
                const stakeinfo = await TokenStakingContract.getStakesByStaker(
                  account
                );
                setStakerInfo(stakeinfo);
                if (isEmpty(stakeinfo)) {
                  setStakedFlag(false);
                  setStakeBalance(0);
                  setStakerStartStakingTime("");
                  setStakerLastClaimTime("");
                  setStakerId(0);
                  setClaimAmount(0);
                } else {
                  setStakedFlag(true);
                  setStakeBalance(
                    Number(
                      Number(
                        Number(String(stakeinfo[0].amount)) /
                          1000000000000000000
                      ).toFixed(2)
                    )
                  );
                  const starttime = new Date(
                    Number(String(stakeinfo[0].stakeTimeStamp)) * 1000
                  );
                  const lastclaimtime = new Date(
                    Number(String(stakeinfo[0].lastClaimTimeStamp)) * 1000
                  );
                  setStakerStartStakingTime(
                    convertToTwoDigit(Number(starttime.getMonth() + 1)) +
                      "/" +
                      convertToTwoDigit(starttime.getDate()) +
                      "/" +
                      convertToTwoDigit(starttime.getFullYear())
                  );
                  setStakerLastClaimTime(
                    convertToTwoDigit(Number(lastclaimtime.getMonth() + 1)) +
                      "/" +
                      convertToTwoDigit(lastclaimtime.getDate()) +
                      "/" +
                      convertToTwoDigit(lastclaimtime.getFullYear())
                  );
                  setStakerId(Number(String(stakeinfo[0].id)));
                  try {
                    const claimable = await TokenStakingContract.getClaimable(
                      Number(String(stakeinfo[0].id))
                    );
                    setClaimAmount(Number(String(claimable)));
                  } catch (err) {
                    console.log(err);
                  }
                }
              } catch (err) {
                console.log(err, "-------");
              }
            } catch (err) {
              console.log(err, "Get Stakers Error");
            }
          } catch (err) {
            console.log(err, "Get Total Rewards Error");
          }
        } catch (err) {
          console.log(err, "Get Total Staked Error");
        }
      } catch (err) {}
    }
  };

  useEffect(() => {
    // wallet connection part
    if ((window as any).ethereum) {
      (window as any).ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts: string[]) => {
          props.saveWalletStatus("connected");
          setAccount(accounts[0]);
        })
        .catch((error: any) => {
          alert(`Something went wrong: ${error}`);
          window.location.href = "/";
        });
    } else {
      alert("Please install Metamask wallet!");
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (account) {
      getAssets();
    }
  }, [account]);

  const stakeapprovefunc = async () => {
    if (stakebalance <= balance && stakebalance > 0) {
      if (PickOrRickTokenContracts && TokenStakingContracts) {
        try {
          setApproveFlag(true);
          const approvestatus = await PickOrRickTokenContracts.approve(
            TokenStakingContractAddress,
            ethers.utils.parseUnits(String(stakebalance), 18),
            { from: account }
          );
          await approvestatus.wait();

          try {
            const stakeToken = await TokenStakingContracts.StakeToken(
              ethers.utils.parseUnits(String(stakebalance), 18),
              { from: account }
            );
            await stakeToken.wait();
            setApproveFlag(false);
            setStakedFlag(true);
            const bals = await PickOrRickTokenContracts.balanceOf(account);
            setBalance(
              Number((bals / 1000000000000000000).toFixed(2).toString())
            );
            try {
              await getAssets();
            } catch (err) {
              console.log(err);
            }
          } catch (err) {
            setApproveFlag(false);
            console.log(err, "-------staking error----------");
          }
        } catch (err) {
          setApproveFlag(false);
          console.log(err, "-----approve error------");
        }
      }
    } else {
      alert("Your staking amount is higher than your balance");
    }
  };

  const unstakerfunc = async () => {
    if (PickOrRickTokenContracts && TokenStakingContracts) {
      try {
        setUnstakingFlag(true);
        const approvestatus = await TokenStakingContracts.unStake(stakerid, {
          from: account,
        });
        await approvestatus.wait();
        try {
          await getAssets();
          setUnstakingFlag(false);
        } catch (err) {
          console.log(err);
          setUnstakingFlag(false);
        }
      } catch (err: any) {
        console.log(err, "-----");
        alert("You can unstake after 30 days at least.");
        setUnstakingFlag(false);
      }
    }
  };

  const claimfunc = async () => {
    if (PickOrRickTokenContracts && TokenStakingContracts) {
      try {
        setClaimFlag(true);
        const claimstatus = await TokenStakingContracts.claimReward(stakerid, {
          from: account,
        });
        await claimstatus.wait();
        try {
          await getAssets();
          setClaimFlag(false);
        } catch (err) {
          console.log(err);
          setClaimFlag(false);
        }
      } catch (err) {
        console.log(err);
        alert("You Can claim reward after 30 days at least");
        setClaimFlag(false);
      }
    }
  };

  const convertToTwoDigit = (num: number): string => {
    return num > 9 ? String(num) : `0${num}`;
  };

  return (
    <div className={style.card}>
      {/* topBlock */}
      <div className={style.topBlock}>
        <div className={style.topBlock_firstSection}>
          <img src={ufo} alt="" className={style.ufo} />
          <p className={style.label}>Total $RICK Staked</p>
          <p className={style.value}>
            {numberformatfunc(totalRickStakedAmount)}
          </p>
        </div>

        <div className={style.topBlock_secondSection}>
          <img src={rick} alt="" className={style.rick} />
          <p className={style.label}>$RICK Earned</p>
          <p className={style.value}>
            {numberformatfunc(totalRickEarnedAmount)}
          </p>
        </div>

        <div className={style.topBlock_thirdSection}>
          <img src={jars} alt="" className={style.jars} />
          <p className={style.label}>APY Rate%</p>
          <p className={style.value}>100%</p>
        </div>

        <div className={style.topBlock_fourSection}>
          <img src={stakers} alt="" className={style.stakers} />
          <p className={style.label}>Stakers</p>
          <p className={style.value}>{stakersnum}</p>
        </div>
      </div>

      {/* bottomBlock */}
      <div className={style.bottomBlock}>
        <div className={style.bottomBlock_firstSection}>
          <div className={style.tabs}>
            {["Staking", "Unstaking", "Claiming"].map((tab, key) => (
              <p
                key={key}
                className={clsx({
                  [style.tab]: true,
                  [style.tab_active]: key === tabIndex,
                })}
                onClick={() => setTabIndex(key)}
              >
                {tab}
              </p>
            ))}
          </div>

          {tabIndex === 0 ? (
            <div>
              <div className={style.balance}>
                <input
                  type="number"
                  disabled={isEmpty(stakerInfo) ? false : true}
                  value={stakebalance}
                  onChange={(e) => setStakeBalance(Number(e.target.value))}
                />
                {isEmpty(stakerInfo) && (
                  <p onClick={() => setStakeBalance(balance)}>Max</p>
                )}
              </div>

              <div className={style.rows}>
                {[
                  { label: "Deposit coins:", value: stakebalance + " $RICK" },
                  {
                    label: "Recive in 30 days:",
                    value:
                      Number(Number((stakebalance * 30) / 365).toFixed(2)) +
                      " $RICK",
                  },
                ].map(({ label, value }, key) => (
                  <div className={style.row} key={key}>
                    <p>{label}</p>
                    <p>{value}</p>
                  </div>
                ))}
              </div>

              {stakedFlag ? (
                <button disabled className={style.btn}>
                  <p>Staked</p>
                </button>
              ) : approveFlag ? (
                <button
                  disabled
                  className={style.btn}
                  onClick={() => stakeapprovefunc()}
                >
                  Approving...
                  <img
                    src={Loadingsrc}
                    style={{ width: "50px", height: "50px" }}
                  />
                </button>
              ) : (
                <button
                  disabled={isEmpty(stakerInfo) ? false : true}
                  className={style.btn}
                  onClick={() => stakeapprovefunc()}
                >
                  <p>Approve</p>
                </button>
              )}
            </div>
          ) : tabIndex === 1 ? (
            <div>
              <div className={style.unstaking}></div>
              <div className={style.rows}>
                {[
                  { label: "Deposit coins:", value: stakebalance + " $RICK" },
                  {
                    label: "Start Staking Time:",
                    value: stakerStartStakingTime,
                  },
                  {
                    label: "Last Claim Time:",
                    value: stakerLastClaimTime,
                  },
                ].map(({ label, value }, key) => (
                  <div className={style.row} key={key}>
                    <p>{label}</p>
                    <p>{value}</p>
                  </div>
                ))}
              </div>
              {unstakingFlag ? (
                <button disabled className={style.btn}>
                  <img
                    alt="loading"
                    src={Loadingsrc}
                    style={{ width: "50px", height: "50px" }}
                  />
                </button>
              ) : (
                <button
                  disabled={isEmpty(stakerInfo) ? true : false}
                  className={style.btn}
                  onClick={() => unstakerfunc()}
                >
                  <p>Unstaking</p>
                </button>
              )}
            </div>
          ) : (
            <div>
              {claimFlag ? (
                <button disabled className={style.btn}>
                  <img
                    alt="loading"
                    src={Loadingsrc}
                    style={{ width: "50px", height: "50px" }}
                  />
                </button>
              ) : (
                <button
                  disabled={isEmpty(stakerInfo) ? true : false}
                  className={style.btn}
                  onClick={() => claimfunc()}
                >
                  <p>Claim</p>
                </button>
              )}
            </div>
          )}
        </div>

        <div className={style.bottomBlock_secondSection}>
          <img src={earning_mobile} alt="" className={style.earning_mobile} />
          <img src={earning_desktop} alt="" className={style.earning_desktop} />
          <div className={style.bottomBlock_secondSection_card}>
            <p>Earnings</p>
            <p>{claimAmount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

Card.propTypes = {
  saveWalletStatus: PropTypes.func.isRequired,
};

const mapStateToProps = (state: any) => ({
  walletstatus: state.walletstatus,
});

export default connect(mapStateToProps, { saveWalletStatus })(Card);
