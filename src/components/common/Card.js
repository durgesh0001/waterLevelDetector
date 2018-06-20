import React from 'react';
import {View,Image,ImageBackground} from 'react-native';
import {Card as nativeCard} from 'native-base';

const Card =(props)=>
{
    // {props.children}  = adding its childern <Text>{props.album.title}</Text>
    return (
        <View style={{marginTop:50}}>
            <View style={styles.iconImageStyle}>
                <Image source={require('../../images/sign_up/logo.png')} style={{height: 65, width: 65}} />
            </View>
            <ImageBackground source={require('../../images/sign_up/login-bg.jpg')} style={{resizeMode: 'contain'}}>
                <View style={styles.containerStyle}>
                    {props.children}
                </View>
            </ImageBackground>
            {/*<Image source={require('../../images/sign_up/login-bottom-bg.jpg')} style={{height: 105,width: null,resizeMode :'stretch'}} />*/}
        </View>
    );
}
export {Card};

const styles = {
    containerStyle:{
        borderWidth:0,
        borderRadius:2,
        borderColor:'#ddd',
        borderBottomWidth:0,
        shadowColor:'#000',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.1,
        shadowRadius:2,
        elevation:0,
        marginLeft:5,
        marginRight:5,
        paddingTop:30,
        flex:1
        //backgroundColor: '#fff'
    },
    iconImageStyle:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:-35,
        zIndex:1
    }
}