import React, { useState } from "react";
import { FC } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Modal from "@mui/material/Modal";
import style from "./ChooseModal.module.scss";
import { svgIcons } from "../../../assets/svgIcons";
import mainDesktop from "../../../assets/png/B2_Vote/mainDesktop.png";
import pot0 from "../../../assets/png/B7_Plan/spot2.png";
import pot1 from "../../../assets/png/B6_Tokenomics/pot1.png";
import { FormikErrors, FormikHelpers, useFormik } from "formik";
import { TextField } from "@mui/material";
import clsx from "clsx";
import { mailAPI } from "../../../api/mail.api";
import { emailVerifyFunc } from "../../../actions/votestatusActions";
import Sumbitloadingsrc from "../../../assets/png/button-loading.gif";

interface IValues {
  email: string;
}

interface IChooseModal {
  open: boolean;
  onClose: () => void;
  step: number;
  stepHandler: (step: number) => void;
  setAlertOpenFunc: (flag: boolean) => void;
  emailVerifyFunc: (email: string, flags: boolean) => void;
}

const ChooseModal: FC<IChooseModal> = ({
  open,
  onClose,
  step,
  stepHandler,
  setAlertOpenFunc,
  emailVerifyFunc,
}) => {
  const [sumbitbtnflag, setSubmitBtnFlag] = useState(false);

  // true: pick  && false: rick
  const [flagForPickOrRick, setFlagForPickOrRick] = useState(true);
  const [flagSelect, setFlagSelect] = useState(false);

  const initialValues: IValues = {
    email: "",
  };

  const onSubmit = async (
    { email }: IValues,
    formikHelpers: FormikHelpers<IValues>
  ) => {
    try {
      if (flagSelect) {
        sendEmailCode(email, flagForPickOrRick);
      } else {
        alert("Please select your pak");
      }
    } catch (e: any) {
      console.log(e.message);
    } finally {
      formikHelpers.resetForm();
    }
  };

  const sendEmailCode = async (email: string, flagForPickOrRick: boolean) => {
    setSubmitBtnFlag(true);
    await emailVerifyFunc(email, flagForPickOrRick);
    setSubmitBtnFlag(false);
    setAlertOpenFunc(true);
    stepHandler(2);
  };

  const validate = ({ email }: IValues): FormikErrors<IValues> => {
    const errors = {} as FormikErrors<IValues>;
    if (!email) {
      errors.email = "Email is required";
    }
    if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      errors.email = "Not a valid email";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  });

  return (
    <Modal open={open} onClose={onClose}>
      <div className={style.chooseModal}>
        <button className={style.closeBtn} onClick={onClose}>
          {svgIcons.close}
        </button>

        {step === 1 && (
          <>
            <p className={style.title}>
              Choose your pickle jar and make your vote count!
            </p>

            <img src={mainDesktop} alt="" className={style.img} />

            <p className={clsx(style.label, style.label_1)}>Pick your jar!</p>

            <div className={style.btns}>
              <div>
                <button
                  onClick={() => {
                    setFlagForPickOrRick(true);
                    setFlagSelect(true);
                  }}
                >
                  <img src={pot0} alt="" />
                </button>
                <button
                  onClick={() => {
                    setFlagForPickOrRick(false);
                    setFlagSelect(true);
                  }}
                >
                  <img src={pot1} alt="" />
                </button>
              </div>
              <div className={style.selectableView}>
                <div>{flagSelect && flagForPickOrRick && "Selected"}</div>
                <div>{flagSelect && !flagForPickOrRick && "Selected"}</div>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit} className={style.form}>
              <TextField
                placeholder="Your email"
                size="small"
                {...formik.getFieldProps("email")}
                //disabled={!window.ethereum || loading}
                className={style.field}
                sx={{
                  "& .MuiFormHelperText-root": {
                    position: "absolute",
                    left: 0,
                    bottom: "-30px",
                  },
                }}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />

              <button
                disabled={sumbitbtnflag ? true : false}
                type="submit"
                className={clsx(style.btn, style.btn_submit)}
              >
                {sumbitbtnflag ? (
                  <img src={Sumbitloadingsrc} style={{ height: "100%" }} />
                ) : (
                  <p>submit</p>
                )}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <p className={clsx(style.label)}>
              Join our exclusive Telegram group to stay updated on who the
              winner is!.
            </p>

            <img src={mainDesktop} alt="" className={style.imgStep2} />

            <p className={clsx(style.label, style.label_2)}>
              You'll be the first to know if you're the lucky winner when the
              competition concludes. Vote, join, and win.
            </p>

            <a href="/dashboard" className={clsx(style.btn, style.btn)}>
              <p>Join Now</p>
            </a>
          </>
        )}
      </div>
    </Modal>
  );
};

ChooseModal.propTypes = {
  emailVerifyFunc: PropTypes.func.isRequired,
};

const mapStateToProps = (state: any) => ({
  votestatus: state.votestatus,
});

export default connect(mapStateToProps, { emailVerifyFunc })(ChooseModal);
