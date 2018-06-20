import  React,{Component} from 'react';
import {View,StatusBar,Dimensions,Image,Platform} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {Spinner} from "./common";



class SplashPage extends Component {

    renderFlash()
    {
        if(Platform.OS === 'android')
        {
            return (
                <Spinner size="large"/>
            )

        }
        else
        {
            return (
                <Spinner size="large"/>
            )
        }
    }

    componentWillMount() {
        if(Platform.OS === 'android')
        {
            Actions.Auth();
        }
        else
        {
            Actions.Auth();
        }
    }

    render()
    {
        return (
            <View style={{flex: 1}}>
                {this.renderFlash()}
            </View>
        )
    }
}
export default connect(null, {})(SplashPage);
