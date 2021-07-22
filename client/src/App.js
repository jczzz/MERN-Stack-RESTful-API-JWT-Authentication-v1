
// import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

// 返回的也是route
import PrivateRoute from "./components/routing/privateRoute";

// Screens
import PrivateScreen from "./components/screens/PrivateScreen";
import LoginScreen from "./components/screens/LoginScreen";
import RegisterScreen from "./components/screens/RegisterScreen";
import ForgotPasswordScreen from "./components/screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./components/screens/ResetPasswordScreen";


const App = ()=> {
  return (
    <Router>
    <div className="app">
      <Switch>
        <PrivateRoute 
         exact 
         path="/" 
         component={PrivateScreen} 
         />
        <Route 
         exact 
         path="/login" 
         component={LoginScreen} 
         />
        <Route 
         exact 
         path="/register" 
         component={RegisterScreen}
        />
        <Route
          exact
          path="/forgotpassword"
          component={ForgotPasswordScreen}
        />
        {/* 通过email link 进入该路径 */}
        <Route
          exact
          path="/resetpassword/:resetToken"
          component={ResetPasswordScreen}
        />
      </Switch>
    </div>
  </Router>
  );
}

export default App;
