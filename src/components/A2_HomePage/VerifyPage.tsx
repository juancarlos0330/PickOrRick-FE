import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import style from "../A3_Dashboard/Dashboard.module.scss";
import { emailConfirmFunc } from "../../actions/votestatusActions";
import Loadingsrc from "../../assets/png/button-loading.gif";

declare const window: Window;

const VerifyPage = (props: any) => {
  const [verifycode, setVerifycode] = useState("");

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code: any = urlParams.get("code");
    const email: any = urlParams.get("email");
    const params = {
      code: code,
      useremail: email,
      pakflag: props.pakstatus.status,
    };
    setVerifycode(code);
    return () => {
      props.emailConfirmFunc(params);
    };
  }, []);

  return (
    <div className={style.dashboard}>
      <div className={style.verifyPage}>
        <h2 className={style.verifytext}>Verifying Email...</h2>
        <img src={Loadingsrc} style={{ width: "200px", height: "200px" }} />
      </div>
    </div>
  );
};

VerifyPage.propTypes = {
  emailConfirmFunc: PropTypes.func.isRequired,
};

const mapStateToProps = (state: any) => ({
  votestatus: state.votestatus,
  pakstatus: state.pakstatus,
});

export default connect(mapStateToProps, { emailConfirmFunc })(VerifyPage);
