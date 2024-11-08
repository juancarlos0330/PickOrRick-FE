import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import style from "./AdminPage.module.scss";
import { adminLogin } from "../../actions/adminActions";

const AdminPage = (props: any) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [adminname, setAdminName] = useState("");

  useEffect(() => {
    props.admin.isAuthenticated
      ? navigate("/admin/dashboard")
      : console.log("hello");
  }, []);

  const loginFunc = () => {
    const params = {
      password,
      adminname,
    };
    props.adminLogin(params);
  };

  return (
    <div className={style.dashboard}>
      <div className={style.main}>
        <div className={style.itemgroup}>
          <label className={style.itemText}>Admin Name</label>
          <input
            type="text"
            className={style.itemInput}
            value={adminname}
            onChange={(e) => setAdminName(e.target.value)}
          />
        </div>
        <div className={style.itemgroup}>
          <label className={style.itemText}>Password</label>
          <input
            type="password"
            className={style.itemInput}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={style.itemgroup}>
          <button
            type="button"
            className={style.itemButton}
            onClick={() => loginFunc()}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

AdminPage.propTypes = {
  adminLogin: PropTypes.func.isRequired,
};

const mapStateToProps = (state: any) => ({
  admin: state.admin,
});

export default connect(mapStateToProps, { adminLogin })(AdminPage);
