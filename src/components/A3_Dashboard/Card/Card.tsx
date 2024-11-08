import React, { useEffect, useState, FC } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import style from "./Card.module.scss";
import { svgIcons } from "../../../assets/svgIcons";
import src0 from "../../../assets/png/A3_Dashboard/deposit/0.png";
import src1 from "../../../assets/png/A3_Dashboard/deposit/1.png";
import clsx from "clsx";
import { ethers } from "ethers";
import { TimeBlock } from "../TimeBlock/TimeBlock";
import logo_pick from "../../../assets/png/A3_Dashboard/logo_pick.png";
import logo_rick from "../../../assets/png/A3_Dashboard/logo_rick.png";
import bottomImg from "../../../assets/png/A3_Dashboard/card.png";
import Loadingsrc from "../../../assets/png/button-loading.gif";

const uniswapcontractaddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const RPTokenContractAddress = "0xd30a5F0EE78befd520DB3eb62941F0a8522AC897";
const VotingContractAddress = "0x30c4B449C1Faa73FC29b70f202Ae5c00871C1D0a";
const TokenStakingContractAddress =
  "0xcE142533e5C55E20Ae5eB3A76b92B3B8302e47A6";

interface ICard {
  waitHour: any;
  waitMin: any;
  waitSec: any;
  gameMin: any;
  gameSec: any;
  curStatus: any;
  account: any;
  PickOrRickContract: any;
  VotingSystemContract: any;
  pakstatus: any;
}

const Card: FC<ICard> = (props: any) => {
  let intervalId: any = null;
  const [voted, setVoted] = useState(false);
  const [fightEnd, setFightEnd] = useState(false);
  const [results, setResults] = useState([0, 0]);
  const [votes, setVotes] = useState([0, 0]);
  const [won, setWon] = useState(false);
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(0);
  const [inTheJar, setInTheJar] = useState(0);
  const [voteBtnStatus, setVoteBtnStatus] = useState(0);
  const [gameIndex, setGameIndex] = useState(0);
  const [approveLFlag, setApproveLFlag] = useState(false);
  const [votingFlag, setVotingFlag] = useState(false);
  const [waitvotingFlag, setWaitVotingFlag] = useState(false);
  const [gameStartedStatus, setGameStartedStatus] = useState(false);
  const [rewards, setRewards] = useState(0);

  const title = () => {
    if (!voted) return "Join the Pickle Fight!";
    if (voted && !fightEnd) return "In The Jar You Go!";
    if (voted && fightEnd && won) return "Clever Pickle You Won!";
    if (voted && fightEnd && !won) return "Silly Pickle You Lost!";
  };

  const startcallfunc = async (propsdata: any) => {
    if (propsdata.PickOrRickContract) {
      const accountBalances = await propsdata.PickOrRickContract.balanceOf(
        propsdata.account
      );
      setBalance(
        Number((accountBalances / 1000000000000000000).toFixed(2).toString())
      );
    }
    if (propsdata.VotingSystemContract) {
      const userRewards = await propsdata.VotingSystemContract.userRewards(
        propsdata.account
      );
      setRewards(
        Number((userRewards / 1000000000000000000).toFixed(2).toString())
      );
    }
  };

  useEffect(() => {
    startcallfunc(props);
  }, [props.PickOrRickContract, props.VotingSystemContract]);

  useEffect(() => {
    setVoteBtnStatus(props.curStatus);
    if (
      Number(props.waitHour) <= 0 &&
      Number(props.waitMin) <= 0 &&
      Number(props.waitSec) <= 0
    ) {
      setVoteBtnStatus(1);
      setGameStartedStatus(true);
    }

    if (
      Number(props.gameMin) <= 0 &&
      Number(props.gameSec) <= 0 &&
      voteBtnStatus === 1 &&
      gameIndex != 0
    ) {
      voteEndFunc();
    }
  }, [props]);

  const voteEndFunc = async () => {
    intervalId = setInterval(async () => {
      if (props.VotingSystemContract) {
        const gamestarted = await props.VotingSystemContract.gameStarted();
        setGameStartedStatus(gamestarted);
        gamestartedCheckfunc(gamestarted);
      }
    }, 2000);
  };

  const gamestartedCheckfunc = async (gstatus: boolean) => {
    if (gstatus === false) {
      clearInterval(intervalId);
      if (props.VotingSystemContract && props.PickOrRickContract) {
        // get rewards every users
        const userRewards = await props.VotingSystemContract.userRewards(
          props.account
        );
        setRewards(
          Number((userRewards / 1000000000000000000).toFixed(2).toString())
        );

        // set every jar game winner/loser
        const winningjar = await props.VotingSystemContract.winningJar(
          gameIndex
        );
        const winningjarcon = winningjar ? "pick" : "rick";
        if (winningjarcon === props.pakstatus.status) {
          setWon(true);
        } else {
          setWon(false);
        }

        // get votes every jar
        const pickvotes = await props.VotingSystemContract.PickTotal(gameIndex);
        const rickvotes = await props.VotingSystemContract.RickTotal(gameIndex);
        setVotes([
          Number((pickvotes / 1000000000000000000).toFixed(2).toString()),
          Number((rickvotes / 1000000000000000000).toFixed(2).toString()),
        ]);

        // get percent every jar
        const pickpercent = await props.VotingSystemContract.winnigPercent(
          gameIndex,
          true
        );

        setResults([
          ethers.BigNumber.from(pickpercent._hex).toNumber(),
          Number(100 - ethers.BigNumber.from(pickpercent._hex).toNumber()),
        ]);

        setWaitVotingFlag(false);
        setFightEnd(true);
        setVoteBtnStatus(0);
      }
    }
  };

  const startVote = () => {
    if (Number(amount) > Number(balance)) {
      alert("Amount is too high than your available balance");
    } else if (Number(amount) <= 0) {
      alert("Amount is higher more than 0");
    } else {
      setVoted(true);
    }
  };

  const startFight = async () => {
    if (props.PickOrRickContract && props.VotingSystemContract) {
      try {
        setApproveLFlag(true);
        const aprroveStatus = await props.PickOrRickContract.approve(
          VotingContractAddress,
          ethers.utils.parseUnits(String(amount), 18),
          { from: props.account }
        );
        await aprroveStatus.wait();

        const gameid = await props.VotingSystemContract.gameIndex();

        setGameIndex(ethers.BigNumber.from(gameid._hex).toNumber());

        setApproveLFlag(false);

        try {
          setVotingFlag(true);
          const voteStatustx = await props.VotingSystemContract.vote(
            ethers.utils.parseUnits(String(amount), 18),
            props.pakstatus.status === "pick" ? true : false
          );
          await voteStatustx.wait();
          setInTheJar(amount);
          setVotingFlag(false);
          // setFightEnd(true);
        } catch (err) {
          setVotingFlag(false);
          console.log(err);
        }
      } catch (err) {
        setApproveLFlag(false);
        console.log(err);
      }
    }
  };

  return (
    <div className={style.card}>
      <div className={style.topPart}>
        <div className={style.balance}>
          <p className={style.label}>Total balance</p>
          <p className={style.value}>{Number(balance)}</p>
          <p className={style.name}>$Rick</p>
          {svgIcons.balance}
        </div>

        <div className={style.deposit}>
          <div className={style.rows}>
            <div className={style.row}>
              <p>Available</p>
              <p>{`${Number(balance) - Number(inTheJar)} Rick`}</p>
            </div>
            <div className={style.row}>
              <p>In The Jar</p>
              <p>{`${Number(inTheJar)} Rick`}</p>
            </div>
          </div>
          <img src={src0} alt="" className={clsx(style.img, style.img_1)} />
          <img src={src1} alt="" className={clsx(style.img, style.img_2)} />
        </div>

        <div className={style.rewards}>
          <p className={style.title}>rewards</p>
          <p className={clsx(style.text, style.text_1)}>Total Rick Won!</p>
          <p className={style.value}>{Number(rewards)}</p>
          <p className={clsx(style.text, style.text_2)}>
            Earn points and redeem points
          </p>

          <div className={style.btns}>
            <button>{svgIcons.save}</button>
            <button>{svgIcons.gift}</button>
          </div>
        </div>
      </div>

      <div className={style.bottomPart}>
        <div className={style.top}>
          <p
            className={clsx({
              [style.title]: true,
              [style.title_end]: voted && fightEnd,
            })}
          >
            {title()}
          </p>

          {!voted && (
            <>
              <div className={style.timeRow}>
                <p className={style.label}>Next Pickle Fight starts in</p>
                <div className={style.times}>
                  <TimeBlock value={props.waitHour} unit="hours" />
                  <p className={style.divider}>:</p>
                  <TimeBlock value={props.waitMin} unit="minutes" />
                  <p className={style.divider}>:</p>
                  <TimeBlock value={props.waitSec} unit="seconds" />
                </div>
              </div>

              <div className={style.deposit}>
                <p className={style.label}>Deposit Amount</p>
                <div className={style.amountWrapper}>
                  <input
                    type="number"
                    defaultValue={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                  <p>Rick</p>
                </div>
              </div>
              <button
                disabled={voteBtnStatus ? false : true}
                className={style.voteBtn}
                onClick={() => startVote()}
              >
                <p>VOTE</p>
              </button>
            </>
          )}

          {voted && !fightEnd && (
            <>
              <div className={style.timeRow}>
                <p className={style.label}>Pickle Fight Ends in</p>
                <div className={style.times}>
                  <TimeBlock value={props.gameMin} unit="minutes" />
                  <p className={style.divider}>:</p>
                  <TimeBlock value={props.gameSec} unit="seconds" />
                </div>
              </div>

              <div className={style.jar}>
                <p className={style.label}>
                  How Many Pickles You put in the Jar!
                </p>
                {approveLFlag || votingFlag || waitvotingFlag ? (
                  <button disabled className={style.rickBtn}>
                    {approveLFlag && "Approving..."}
                    {votingFlag && "Voting..."}
                    {waitvotingFlag && "Waiting..."}
                    <img src={Loadingsrc} alt="loading" />
                  </button>
                ) : (
                  <button
                    className={style.rickBtn}
                    onClick={() => startFight()}
                  >
                    <p>{`${amount} Rick`}</p>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className={style.bottom}>
          <div className={style.left}>
            <img src={logo_pick} alt="" className={style.logoMobile} />

            <div className={style.info}>
              <div className={style.status}>
                <div
                  className={style.inner}
                  style={{
                    height: `${fightEnd ? 100 : results[0]}%`,
                  }}
                />
              </div>

              <div className={style.rest}>
                <img src={logo_pick} alt="" className={style.logoDesktop} />
                {fightEnd && (
                  <>
                    <p className={style.result}>{`${results[0]}%`}</p>
                    <p className={style.votes}>{`${votes[0]} votes`}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className={style.right}>
            <img src={logo_rick} alt="" className={style.logoMobile} />

            <div className={style.info}>
              <div className={style.rest}>
                <img src={logo_rick} alt="" className={style.logoDesktop} />
                {fightEnd && (
                  <>
                    <p className={style.result}>{`${results[1]}%`}</p>
                    <p className={style.votes}>{`${votes[1]} votes`}</p>
                  </>
                )}
              </div>

              <div className={style.status}>
                <div
                  className={style.inner}
                  style={{
                    height: `${fightEnd ? 100 : results[1]}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <img src={bottomImg} alt="" className={style.bottomImg} />
      </div>
    </div>
  );
};

Card.propTypes = {};

const mapStateToProps = (state: any) => ({
  pakstatus: state.pakstatus,
});

export default connect(mapStateToProps, {})(Card);
