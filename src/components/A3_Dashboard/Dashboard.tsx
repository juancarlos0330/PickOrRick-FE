import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { ethers } from "ethers";
import style from "./Dashboard.module.scss";
import { Header } from "./Header/Header";
import Card from "./Card/Card";
import cucumber_left from "../../assets/png/A3_Dashboard/cucumber_left.png";
import cucumber_right from "../../assets/png/A3_Dashboard/cucumber_right.png";
import PickOrRickToken from "../../abi/PickOrRickToken.json";
import VotingSystem from "../../abi/VotingSystem.json";
import { getCurrentStatus } from "../../actions/votestatusActions"; // get current vote status
import { saveWalletStatus } from "../../actions/walletActions"; //Save wallet connection status

declare const window: Window;

const RPTokenContractAddress = "0x75430D0782A443bD4f1c92C69009599dEA53A206";
const VotingContractAddress = "0x30c4B449C1lFaa73FC29b70f202Ae5c00871C1D0a";

const Dashboard = (props: any) => {
  const [times, setTimes] = useState(0);
  const [gametimes, setGametimes] = useState(0);
  const [curStatus, setCurStatus] = useState(0);

  // wallect account info
  const [account, setAccount] = useState<string>("");
  const [accountBalance, setAccountBalance] = useState<string>("");
  const [PickOrRickContract, setPickOrRickContract] = useState<any>(null);
  const [VotingSystemContract, setVotingSystemContract] = useState<any>(null);

  // Getting all balance Data from wallet
  const getAllAssests = () => {
    // wallet connection part
    const ethereum = (window as any).ethereum;
    if ((window as any).ethereum) {
      (window as any).ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts: string[]) => {
          props.saveWalletStatus("connected");
          setAccount(accounts[0]);
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const PickOrRickxContract = new ethers.Contract(
            RPTokenContractAddress,
            PickOrRickToken,
            signer
          );
          const VotingSystemxContract = new ethers.Contract(
            VotingContractAddress,
            VotingSystem,
            signer
          );
          setPickOrRickContract(PickOrRickxContract);
          setVotingSystemContract(VotingSystemxContract);
        })
        .catch((error: any) => {
          alert(`Something went wrong: ${error}`);
        });
    } else {
      alert("Please install Metamask wallet!");
    }
  };

  useEffect(() => {
    props.getCurrentStatus();
    getAllAssests();
  }, []);

  useEffect(() => {
    var curHour = props.votestatus.curHour;
    var curMinute = props.votestatus.curMinute;
    var curSecond = props.votestatus.curSecond;
    setCurStatus(props.votestatus.status);

    if (!props.votestatus.status) {
      if (curHour > 9) {
        var ctimes = 24 * 3600;
        var cstimes =
          ctimes - ((curHour - 9) * 3600 + curMinute * 60 + curSecond);
        setTimes(cstimes);
      } else if (curHour < 9) {
        var ctimes = 9 * 3600;
        var cctimes = ctimes - (curHour * 3600 + curMinute * 60 + curSecond);
        setTimes(cctimes);
      }
    } else {
      var ctimes = 3600;
      var cstimes = ctimes - (curMinute * 60 + curSecond);
      setGametimes(cstimes);
    }
  }, [props.votestatus]);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setTimes(times - 1);
    }, 1000);
    if (times <= 0) {
      clearTimeout(timeId);
      props.getCurrentStatus();
    }
    return () => {
      clearTimeout(timeId);
    };
  }, [times]);

  useEffect(() => {
    const gametimeId = setTimeout(() => {
      setGametimes(gametimes - 1);
    }, 1000);
    if (gametimes <= 0) {
      clearTimeout(gametimeId);
      props.getCurrentStatus();
    }
    return () => {
      clearTimeout(gametimeId);
    };
  }, [gametimes]);

  const getHours = (ms: number) => {
    const min = ms / 60;
    const days = Math.trunc(min / (60 * 24));
    return Math.trunc((min - days * 24 * 60) / 60);
  };

  const getMins = (ms: number) => {
    const min = ms / 60;
    const days = Math.trunc(min / (60 * 24));
    const hours = Math.trunc((min - days * 24 * 60) / 60);
    return Math.trunc(min - days * 24 * 60 - hours * 60);
  };

  const getSecs = (ms: number) => {
    const secs = ms;
    const days = Math.trunc(secs / (60 * 60 * 24));
    const hours = Math.trunc((secs - days * 24 * 60 * 60) / (60 * 60));
    const minutes = Math.trunc(
      (secs - days * 24 * 60 * 60 - hours * 60 * 60) / 60
    );
    return Math.trunc(
      secs - days * 24 * 60 * 60 - hours * 60 * 60 - 60 * minutes
    );
  };

  const convertToTwoDigit = (num: number): string =>
    num > 9 ? String(num) : `0${num}`;

  return (
    <div className={style.dashboard}>
      <div className={style.inner}>
        <Header />
        <Card
          waitHour={convertToTwoDigit(getHours(times))}
          waitMin={convertToTwoDigit(getMins(times))}
          waitSec={convertToTwoDigit(getSecs(times))}
          gameMin={convertToTwoDigit(getMins(gametimes))}
          gameSec={convertToTwoDigit(getSecs(gametimes))}
          curStatus={curStatus}
          account={account}
          PickOrRickContract={PickOrRickContract}
          VotingSystemContract={VotingSystemContract}
        />
      </div>
      <img src={cucumber_left} alt="" className={style.cucumber_left} />
      <img src={cucumber_right} alt="" className={style.cucumber_right} />
    </div>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  getCurrentStatus: PropTypes.func.isRequired,
  saveWalletStatus: PropTypes.func.isRequired,
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
  votestatus: state.votestatus,
});

export default connect(mapStateToProps, { getCurrentStatus, saveWalletStatus })(
  Dashboard
);
