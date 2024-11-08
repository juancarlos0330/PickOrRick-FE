import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import style from "./AdminDashboardPage.module.scss";
import {
  getStatusForAdmin,
  setStatusForAdmin,
} from "../../actions/adminActions";
import isEmpty from "../../validation/is-empty";

const AdminDashboardPage = (props: any) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Number>(0);

  const getstarted = () => {
    navigate("/admin");
  };

  useEffect(() => {
    props.admin.isAuthenticated === false
      ? getstarted()
      : props.getStatusForAdmin();
  }, []);

  const changeStatus = (num: Number) => {
    props.setStatusForAdmin({
      id: props.adminstatus.status._id,
      status: num,
    });
  };

  useEffect(() => {
    if (isEmpty(props.adminstatus.status)) {
      setStatus(0);
    } else {
      setStatus(props.adminstatus.status.status);
    }
  }, [props.adminstatus.status]);

  return (
    <div className={style.dashboard}>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>During Presale</td>
            <td>
              <input
                type="checkbox"
                name="check1"
                onChange={(e) => changeStatus(1)}
                checked={status === 0 ? false : true}
                disabled={status > 0 ? true : false}
              />
            </td>
          </tr>
          <tr>
            <td>Presale closed Before exchange launch</td>
            <td>
              <input
                type="checkbox"
                name="check2"
                onChange={(e) => changeStatus(2)}
                checked={status >= 2 ? true : false}
                disabled={status === 1 ? false : true}
              />
            </td>
          </tr>
          <tr>
            <td>Cex Launch</td>
            <td>
              <input
                type="checkbox"
                name="check3"
                onChange={(e) => changeStatus(3)}
                checked={status >= 3 ? true : false}
                disabled={status === 2 ? false : true}
              />
            </td>
          </tr>
          <tr>
            <td>Dex Launch (Happens 1H after cex launch)</td>
            <td>
              <input
                type="checkbox"
                name="check4"
                onChange={(e) => changeStatus(4)}
                checked={status === 4 ? true : false}
                disabled={status === 3 ? false : true}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

AdminDashboardPage.propTypes = {
  adminstatus: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  getStatusForAdmin: PropTypes.func.isRequired,
  setStatusForAdmin: PropTypes.func.isRequired,
};

const mapStateToProps = (state: any) => ({
  adminstatus: state.adminstatus,
  admin: state.admin,
});

export default connect(mapStateToProps, {
  getStatusForAdmin,
  setStatusForAdmin,
})(AdminDashboardPage);
