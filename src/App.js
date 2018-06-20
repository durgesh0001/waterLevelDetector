import  React,{Component} from 'react';
import  {Provider} from 'react-redux';
import  {createStore,applyMiddleware} from 'redux';
import  {NetInfo,Image,View,StatusBar,BackHandler,Dimensions} from 'react-native';
import  firebase from 'firebase';
import  ReduxThunk from 'redux-thunk';
import  reducers from './reducers';
import  Router from './Router';
import {Container,Content} from 'native-base';
let     store = createStore(reducers,{},applyMiddleware(ReduxThunk));
import {StyleProvider,Root } from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';

import {NetWorkError} from './components/NetWorkError';
import {Actions} from 'react-native-router-flux';
import FCM from 'react-native-fcm';






class  App extends Component {
    state={isLoggedIn:null,networkStatus:true,isflashShow:false}


    renderFlash()
    {
        return (
                    <Image source={require('./images/splash/splash.jpg')} style={{flex: 1,bottom:0,height: Dimensions.get('window').height, width:Dimensions.get('window').width,justifyContent: 'center'}}/>
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

          NetInfo.isConnected.addEventListener('change', this.handleConnectionChange);

          NetInfo.isConnected.fetch().done(
              (isConnected) => { this.setState({ networkStatus: isConnected }); }
          );



      }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('change', this.handleConnectionChange);
    }

    componentDidMount() {
        FCM.requestPermissions().then(()=>{

        }).catch(()=>{
            alert('notification permission rejected');
        });
    }



    handleConnectionChange = (isConnected) => {
        this.setState({ networkStatus: isConnected });
    }

    render()
    {
        return (
            <View style={{flex: 1}}>
                <StatusBar backgroundColor="#2eb9f9" barStyle="light-content" />
                {this.renderContent()}
            </View>
        )
    }


    renderContent()
    {

        if(this.state.networkStatus)
                {
                return (
                    <Provider store={store}  >
                        <StyleProvider style={getTheme(material)}>
                            <Root>
                                <Router toggle={false} />
                            </Root>
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

