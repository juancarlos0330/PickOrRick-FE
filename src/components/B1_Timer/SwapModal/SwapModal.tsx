import React, { useState, useEffect } from "react";
import { FC } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Modal from "@mui/material/Modal";
import { ethers } from "ethers";
import style from "./SwapModal.module.scss";
import { svgIcons } from "../../../assets/svgIcons";
import mainDesktop from "../../../assets/png/B2_Vote/mainDesktop.png";
import pot0 from "../../../assets/png/B7_Plan/spot2.png";
import pot1 from "../../../assets/png/B6_Tokenomics/pot1.png";
import UniswapTokenAbi from "../../../abi/UniswapToken.json";
import { FormikErrors, FormikHelpers, useFormik } from "formik";
import { TextField } from "@mui/material";
import clsx from "clsx";
import Sumbitloadingsrc from "../../../assets/png/button-loading.gif";
import { saveWalletStatus } from "../../../actions/walletActions";
import axios from "axios";

interface IValues {
  wethamount: any;
}

interface ISwapModal {
  open: boolean;
  onClose: () => void;
  saveWalletStatus: (str: string) => void;
}

const uniswapcontractaddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const wethtestgoerlitokenaddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
const pickorricktesttokenaddress = "0xd30a5F0EE78befd520DB3eb62941F0a8522AC897";

const SwapModal: FC<ISwapModal> = (props: any) => {
  const [account, setAccount] = useState<string | null>(null);
  const [connectFlag, setConnectFlag] = useState(false);
  const [swapFlag, setSwapFlag] = useState(false);
  const [ricktokenAmount, setRickTokenAmount] = useState(0);
  const [wethtokenAmount, setWethTokenAmount] = useState(0);
  const [wethPrice, setWethPrice] = useState(0);
  const [UniswapContract, setUniswapContract] = useState<any>(null);

  useEffect(() => {
    const apiEndpoint =
      "https://api.coingecko.com/api/v3/simple/price?ids=weth&vs_currencies=usd";
    axios
      .get(apiEndpoint)
      .then((response) => {
        const wethPriceToUsd = response.data.weth.usd;
        setWethPrice(wethPriceToUsd);
      })
      .catch((error) => {
        console.log(`Error fetching WETH price: ${error}`);
      });
  }, []);

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (props.walletstatus.status === "connected") {
      setConnectFlag(true);
      if ((window as any).ethereum) {
        (window as any).ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .then((accounts: string[]) => {
            setAccount(accounts[0]);

            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const UniswapContract = new ethers.Contract(
              uniswapcontractaddress,
              UniswapTokenAbi,
              signer
            );
            setUniswapContract(UniswapContract);
          })
          .catch((error: any) => {
            alert(`Something went wrong: ${error}`);
            setConnectFlag(false);
          });
      } else {
        alert("Please install Metamask wallet!");
        setConnectFlag(false);
      }
    }
  }, [props.walletstatus]);

  const initialValues: IValues = {
    wethamount: 0,
  };

  const onSubmit = async (
    { wethamount }: IValues,
    formikHelpers: FormikHelpers<IValues>
  ) => {
    try {
      if (UniswapContract) {
        try {
          setSwapFlag(true);
          const swapresult = await UniswapContract.swapExactTokensForTokens(
            ethers.utils.parseUnits(String(wethtokenAmount), 18),
            ethers.utils.parseUnits(String(ricktokenAmount), 18),
            [wethtestgoerlitokenaddress, pickorricktesttokenaddress],
            account,
            Date.now()
          );
          await swapresult.wait();
          setSwapFlag(false);
        } catch (err) {
          console.log(err);
          setSwapFlag(false);
        }
      }
    } catch (e: any) {
      console.log(e.message);
    } finally {
      formikHelpers.resetForm();
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  const getAssets = async () => {
    if (UniswapContract) {
      try {
        setSwapFlag(true);
        const getbalance = await UniswapContract.getAmountsOut(
          ethers.utils.parseUnits(String(wethtokenAmount), 18),
          [wethtestgoerlitokenaddress, pickorricktesttokenaddress]
        );
        setRickTokenAmount(
          Number(
            Number(Number(String(getbalance[1])) / 1000000000000000000).toFixed(
              2
            )
          )
        );
        setSwapFlag(false);
      } catch (err) {
        console.log(err);
        setSwapFlag(false);
      }
    }
  };

  useEffect(() => {
    getAssets();
  }, [wethtokenAmount]);

  const connectWallet = () => {
    setConnectFlag(true);
    //check if Metamask wallet is installed
    if ((window as any).ethereum) {
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
          setConnectFlag(false);
        });
    } else {
      alert("Please install Metamask wallet!");
      setConnectFlag(false);
    }
  };

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <div className={style.chooseModal}>
        <button className={style.closeBtn} onClick={props.onClose}>
          {svgIcons.close}
        </button>

        <p className={style.title}>BUY $RICK TOKEN WITH WETH</p>

        <form onSubmit={formik.handleSubmit} className={style.form}>
          <TextField
            placeholder="Your WETH"
            size="small"
            type="number"
            {...formik.getFieldProps("wethamount")}
            //disabled={!window.ethereum || loading}
            className={style.field}
            sx={{
              "& .MuiFormHelperText-root": {
                position: "absolute",
                left: 0,
                bottom: "-30px",
              },
            }}
            onChange={(e) => setWethTokenAmount(Number(e.target.value))}
            value={wethtokenAmount}
            error={
              formik.touched.wethamount && Boolean(formik.errors.wethamount)
            }
          />
          <TextField
            placeholder="Your Rick"
            size="small"
            type="number"
            value={ricktokenAmount}
            disabled={true}
            className={style.field}
            sx={{
              "& .MuiFormHelperText-root": {
                position: "absolute",
                left: 0,
                bottom: "-30px",
              },
            }}
          />

          <p className={style.RatePText}>
            = $
            {Number(
              Number(Number(wethPrice) * Number(wethtokenAmount)).toFixed(2)
            )}
          </p>
          <p className={style.WethPText}>WETH</p>
          <p className={style.RickPText}>$Rick</p>

          {account ? (
            <button type="submit" className={clsx(style.btn, style.btn_submit)}>
              {swapFlag ? (
                <img src={Sumbitloadingsrc} style={{ height: "100%" }} />
              ) : (
                <p>Buy</p>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => connectWallet()}
              className={clsx(style.btn, style.btn_submit)}
            >
              {connectFlag ? (
                <img src={Sumbitloadingsrc} style={{ height: "100%" }} />
              ) : (
                <p>Connect Wallet</p>
              )}
            </button>
          )}
        </form>
      </div>
    </Modal>
  );
};

SwapModal.propTypes = {
  saveWalletStatus: PropTypes.func.isRequired,
};

const mapStateToProps = (state: any) => ({
  walletstatus: state.walletstatus,
});

export default connect(mapStateToProps, { saveWalletStatus })(SwapModal);
