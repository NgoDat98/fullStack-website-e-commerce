import { BrowserRouter, Route, Switch } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Context/AuthContext";
import Chat from "./Chat/Chat";
import Header from "./Header/Header";
import History from "./History/History";
import DetailHistory from "./History/DetailHistory";
import Home from "./Home/Home";
import Menu from "./Menu/Menu";
import Products from "./Products/Products";
import Users from "./Users/Users";
import Login from "./Login/Login";
import NewProduct from "./New/NewProduct";
import axios from "axios";

function App() {
  const { user } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(user ? user.isLogin : false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (user) {
      const test = async () => {
        const res = await axios.post(
          "http://localhost:5000/admin/checkIsAuth",
          {
            userId: user.userId,
          }
        );
        const data = res.data;

        setIsAuth(data.isAuth);
      };
      test();
    }
  }, [user]);

  console.log(isAuth);

  useEffect(() => {
    if (user) {
      setIsLogin(user.userId);
    }
  }, [user]);

  return (
    <div className="App">
      <BrowserRouter>
        <div
          id="main-wrapper"
          data-theme="light"
          data-layout="vertical"
          data-navbarbg="skin6"
          data-sidebartype="full"
          data-sidebar-position="fixed"
          data-header-position="fixed"
          data-boxed-layout="full"
        >
          {isLogin && <Header />}

          <Menu isLogin={isLogin} isAuth={isAuth} />
          {!isLogin && (
            <Switch>
              <Route path="/" component={Login} />
            </Switch>
          )}
          {isLogin && !isAuth && (
            <React.Fragment>
              <Switch>
                <Route path="/" component={Chat} />
              </Switch>
            </React.Fragment>
          )}

          {isLogin && isAuth && (
            <React.Fragment>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/chat" component={Chat} />
                <Route path="/users" component={Users} />
                <Route path="/products" component={Products} />
                <Route exact path="/history" component={History} />
                <Route path="/history/:id" component={DetailHistory} />
                <Route path="/new" component={NewProduct} />
                <Route path="/edit" component={NewProduct} />
              </Switch>
            </React.Fragment>
          )}
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
