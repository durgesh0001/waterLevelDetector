import  React,{Component} from 'react';
import  {Provider} from 'react-redux';
import  {createStore,applyMiddleware} from 'redux';
import  {NetInfo} from 'react-native';
import  firebase from 'firebase';
import  ReduxThunk from 'redux-thunk';
import  reducers from './reducers';
import  Router from './Router';
let     store = createStore(reducers,{},applyMiddleware(ReduxThunk));
import {StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';

import PushNotification from 'react-native-push-notification';
import {NetWorkError} from './components/NetWorkError';
import {Actions} from 'react-native-router-flux';
class  App extends Component {
    state={isLoggedIn:null,networkStatus:true,isflashShow:true}
    componentWillMount()
    {
        firebase.auth().onAuthStateChanged((user)=>
            {
                if(user)
                {
                    this.setState({isLoggedIn:true})
                }
                else
                {
                    this.setState({isLoggedIn:false})

                }
            }
        )
    }

    componentDidMount()
    {
        setTimeout(function() { this.setState({isflashShow: false}); }.bind(this), 3000);

    }
    renderFlash()
    {
        return (
            <Card style={{paddingTop:100}}>
                <CardItem cardBody>
                    <Image source={require('./images/splash/splash.png')} style={{height: 300, width: null, flex: 1}}/>
                </CardItem>
            </Card>
        )
    }


    componentWillMount()
      {
        const config = {
            apiKey: "AIzaSyCf8FWItY_h43oS9KfJdvcDrvULZ3xLx0E",
            authDomain: "waterleveldetector-db2b3.firebaseapp.com",
            databaseURL: "https://waterleveldetector-db2b3.firebaseio.com",
            projectId: "waterleveldetector-db2b3",
            storageBucket: "waterleveldetector-db2b3.appspot.com",
            messagingSenderId: "978606290204"

        };
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }


          PushNotification.configure({

              // (optional) Called when Token is generated (iOS and Android)
              onRegister: function(token) {
                  console.log(token);
              },

              // (required) Called when a remote or local notification is opened or received
              onNotification: function(notification) {
                  console.log( 'NOTIFICATION:', notification );
              },

              // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)


              // Should the initial notification be popped automatically
              // default: true
              permissions: {
                  alert: true,
                  badge: true,
                  sound: true
              },
              popInitialNotification: true,

              /**
               * (optional) default: true
               * - Specified if permissions (ios) and token (android and ios) will requested or not,
               * - if not, you must call PushNotificationsHandler.requestPermissions() later
               */
              requestPermissions: true,
          });


      }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('change', this.handleConnectionChange);

        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({ networkStatus: isConnected }); }
        );
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('change', this.handleConnectionChange);
    }

    handleConnectionChange = (isConnected) => {
        this.setState({ networkStatus: isConnected });
    }


    render()
    {
        if(this.state.networkStatus)
        {
            return (
                <Provider store={store}  >
                    <StyleProvider style={getTheme(material)}>
                    <Router toggle={false} />
                    </StyleProvider>
                </Provider>
            )
        }
        else
        {
            return(
                <NetWorkError/>
            )
        }

    }
}
export default App;

