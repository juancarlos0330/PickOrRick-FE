import * as React from "react";
import style from "./Vote.module.scss";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import mainMobile from "../../assets/png/B2_Vote/mainMobile.png";
import mainDesktop from "../../assets/png/B2_Vote/mainDesktop.png";
import groupMobile from "../../assets/png/B2_Vote/group_mobile.png";
import groupDesktop from "../../assets/png/B2_Vote/group_desktop.png";
import { SocialLinks } from "../common/SocialLinks/SocialLinks";
import { useState } from "react";
import { Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import ChooseModal from "./ChooseModal/ChooseModal";
import { saveWalletStatus } from "../../actions/walletActions";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Vote = (props: any) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [alertopen, setAlertOpen] = useState(false);

  const handleAlertClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const checkWalletConnectionForVote = () => {
    if (props.walletstatus.status === "connected") {
      window.location.href = "/dashboard";
    } else {
      if ((window as any).ethereum) {
        (window as any).ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .then((accounts: string[]) => {
            window.location.href = "/dashboard";
          })
          .catch((error: any) => {
            alert(`Something went wrong: ${error}`);
          });
      } else {
        alert("Please install Metamask wallet!");
      }
    }
  };

  const checkWalletConnection = () => {
    // if (props.walletstatus.status === "connected") {
    //   setOpen(true);
    // } else {
    //   if ((window as any).ethereum) {
    //     (window as any).ethereum
    //       .request({
    //         method: "eth_requestAccounts",
    //       })
    //       .then((accounts: string[]) => {
    //         props.saveWalletStatus("connected");
    //         setOpen(true);
    //       })
    //       .catch((error: any) => {
    //         alert(`Something went wrong: ${error}`);
    //       });
    //   } else {
    //     alert("Please install Metamask wallet!");
    //   }
    // }
    setOpen(true);
  };

  return (
    <div className={style.vote}>
      <h2 className={style.title}>
        {/*vote for a chance to win $20.000*/}
        Whilst you're waiting. vote for a chance to win $20.000
      </h2>

      <img src={mainMobile} alt="" className={style.mainMobile} />
      <img src={mainDesktop} alt="" className={style.mainDesktop} />

      <img src={groupMobile} alt="" className={style.groupMobile} />
      <img src={groupDesktop} alt="" className={style.groupDesktop} />

      <p className={style.text}>
        Vote in the first ever pick or rick poll for a chance to win $20,000
      </p>

      {props.auth.isAuthenticated ? (
        <button
          className={style.voteBtn}
          onClick={() => checkWalletConnectionForVote()}
        >
          <p>free vote</p>
        </button>
      ) : (
        <button
          className={style.voteBtn}
          onClick={() => checkWalletConnection()}
        >
          <p>free vote</p>
        </button>
      )}

      <div className={style.btns}>
        <a
          href="/Pick_Or_Rick_Whitepaper.pdf"
          target="_blank"
          className={style.btn}
        >
          <p>Whitepaper</p>
        </a>

        <button className={style.btn}>
          <p>Audit</p>
        </button>
      </div>

      <SocialLinks className={style.socialLinks} />

      <ChooseModal
        open={open}
        onClose={() => setOpen(false)}
        step={step}
        stepHandler={(step) => setStep(step)}
        setAlertOpenFunc={setAlertOpen}
      />

      <Snackbar
        open={alertopen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Code sent! Please check your Email.
        </Alert>
      </Snackbar>
    </div>
  );
};

Vote.propTypes = {
  saveWalletStatus: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
  walletstatus: state.walletstatus,
});

export default connect(mapStateToProps, { saveWalletStatus })(Vote);
