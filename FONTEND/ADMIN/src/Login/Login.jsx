import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from 'react-router-dom';
import UserAPI from "../API/UserAPI";
import { AuthContext } from "../Context/AuthContext";

import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState([]);
  const { loading, error, dispatch } = useContext(AuthContext);

  const [emailErr, setEmailErr] = useState(false);
  const [passwordErr, setPasswordErr] = useState(false);
  const [roleErr, setRoleErr] = useState(false);
  // const navigate = useNavigate();

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       const response = await UserAPI.getAllData();

  //       setUser(response);
  //     };

  //     fetchData();
  //   }, []);

  const handleSubmit = () => {
    if (!email) {
      setEmailErr(true);
      return;
    } else {
      if (!password) {
        setPasswordErr(true);
        return;
      } else {
        const fetchSigin = async () => {
          try {
            const res = await axios.post(
              "http://localhost:5000/login-admin",
              {
                email: email,
                password: password,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );
            const data = await res.data;
            if (!data.isLogin) {
              data.message === "Account does not exist!" && setEmailErr(true);
              data.message === "account information password is not correct!" &&
                setPasswordErr(true);
              data.message ===
                "The account does not have permission to login to the web!" &&
                setRoleErr(true);
            } else {
              dispatch({ type: "LOGIN_SUCCESS", payload: data });
            }
          } catch (err) {
            console.log(err);
          }
        };

        // if (findUser && findUser.password === password) {
        //   dispatch({ type: "LOGIN_SUCCESS", payload: findUser });
        //   // navigate("/")
        // } else {
        //   alert("Email or password wrong!");
        // }

        // if (findUser.password !== password) {
        // 	setErrorPassword(true);
        // 	return;
        // } else {
        // 	setErrorPassword(false);

        // 	localStorage.setItem('id_user', findUser._id);

        // 	localStorage.setItem('name_user', findUser.fullname);

        // 	const action = addSession(localStorage.getItem('id_user'));
        // 	dispatch(action);

        // 	setCheckPush(true);
        // }

        fetchSigin(email, password);
      }
    }
  };

  const inputEmail = emailErr && !email;
  const inputPassword = passwordErr && !password;

  const inputErr = inputEmail
    ? "Email cannot be blank!"
    : inputPassword
    ? "password cannot be blank!"
    : emailErr
    ? "Account does not exist!"
    : passwordErr
    ? "account information password is not correct!"
    : roleErr
    ? " The account does not have permission to login to the web!"
    : "";

  return (
    <div className="">
      <div className="page-breadcrumb">
        <div className="row">
          <div className="login">
            <div className="heading">
              <h2>Sign in</h2>
              <p className="loginErr">{inputErr}</p>
              {/* {emailErr && <p className="loginErr">Account does not exist!</p>}
              {passwordErr && (
                <p className="loginErr">
                  account information password is not correct!
                </p>
              )}
              {roleErr && (
                <p className="loginErr">
                  The account does not have permission to login to the web!
                </p>
              )} */}
              <form>
                <div className="input-group input-group-lg">
                  <span className="input-group-addon">
                    <i className="fa fa-user"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onMouseDown={() => setEmailErr(false)}
                  />
                </div>

                <div className="input-group input-group-lg">
                  <span className="input-group-addon">
                    <i className="fa fa-lock"></i>
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onMouseDown={() => setPasswordErr(false)}
                  />
                </div>

                <button type="button" className="float" onClick={handleSubmit}>
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
