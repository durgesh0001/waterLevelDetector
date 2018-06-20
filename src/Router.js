import React from 'react';
import {BackAndroid,View} from 'react-native';
import {Scene,Router,Stack,Actions,ActionConst} from 'react-native-router-flux';
import LoginForm from './components/Auth/LoginForm';
import RegistrationForm from './components/Auth/RegistrationForm';
import ForgotPassword from './components/Auth/ForgotPassword';
import Home from './components/Home/Home';
import DeviceComponent from './components/Device/DeviceComponent';
import AddDeviceComponent  from './components/Device/AddDeviceComponent';
import EditDeviceComponent  from './components/Device/EditDeviceComponent';
import History  from './components/Device/History';
import CongratulationForm  from './components/Auth/CongratulationForm';
import VerificationForm  from './components/Auth/VerificationForm';
import ViewDevice  from './components/Device/ViewDevice';
import Profile  from './components/Auth/Profile';
import ReminderSetting from './components/Setting/ReminderSetting';
import NotificationSetting from './components/Setting/NotificationSetting';
import ContactUs from './components/Utility/ContactUs';
import Alerts from './components/Utility/Alerts';
import TermsAndPolicy from './components/Utility/TermsAndPolicy';
import  Supplier  from './components/Utility/Supplier';
import ChangePasswordForm from './components/Auth/ChangePasswordForm';
import  BluetoothComponents from './components/Device/BluetoothComponents';
import  SplashPage from './components/SplashScreen';

const RouterComponent =({toggle}) => {
    return (
            <Router   panHandlers={null} sceneStyle ={{backgroundColor: '#fbfbfe'}}>
                 <Scene  key="root">
                     <Scene key="Auth" hideNavBar ={true} type={ActionConst.RESET}   >
                         <Scene key="login"  component={LoginForm}    title="Login"  initial />
                         <Scene key="loginFast"  component={LoginForm}    title="loginFast"   />
                         <Scene key="signUp"  component={RegistrationForm}  title="Sign Up" />
                         <Scene key="forgotPassword"  component={ForgotPassword}   title="Forgot Password" />
                     </Scene>
                     <Scene key="Congrats" type={ActionConst.RESET}  hideNavBar ={true}>
                         <Scene key="CongratulationForm"  component={CongratulationForm}   title="CongratulationForm"   />
                     </Scene>
                     <Scene key="Verify" type={ActionConst.RESET}  hideNavBar ={true} >
                         <Scene key="VerificationForm"  component={VerificationForm}   title="VerificationForm"   />
                     </Scene>
                     <Scene key="Splash" type={ActionConst.RESET}  hideNavBar ={true} initial>
                         <Scene key="SplashPage"  component={SplashPage}   title="SplashPage"   />
                     </Scene>
                <Scene key="Home" type={ActionConst.RESET}  hideNavBar ={true}  >
                    <Scene key="Devices"  component={DeviceComponent}   title="Device Details"    />
                  <Scene key="HomeComponent"  component={Home}   title="Dashboard" initial   />
                  <Scene key="AddDeviceComponent"  component={AddDeviceComponent}   title="Add Device Details"    />
                  <Scene key="ViewDevice"  component={ViewDevice}   title="View Device"    />
                  <Scene key="Profile"  component={Profile}   title="View Profile"    />
                  <Scene key="ReminderSetting"  component={ReminderSetting}   title="Reminder Setting"    />
                  <Scene key="NotificationSetting"  component={NotificationSetting}   title="Notification Setting"    />
                  <Scene key="ContactUs"  component={ContactUs}   title="ContactUs"    />
                  <Scene key="Alerts"  component={Alerts}   title="Alerts"    />
                  <Scene key="TermsAndPolicy"  component={TermsAndPolicy}   title="Terms And Policy"    />
                  <Scene key="EditDeviceComponent"  component={EditDeviceComponent}   title="Edit Device Component"    />
                  <Scene key="History"  component={History}   title="History"    />
                  <Scene key="Supplier"  component={Supplier}   title="Supplier"    />
                  <Scene key="ChangePasswordForm"  component={ChangePasswordForm}   title="Change Password"    />
                   <Scene key="BluetoothComponents"  component={BluetoothComponents}   title="Bluetooth"    />


               </Scene>
                </Scene>

          </Router>
           );
};
export default RouterComponent;

