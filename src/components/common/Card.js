import React from 'react';
import {View,Image} from 'react-native';
import {Card as nativeCard} from 'native-base';

const Card =(props)=>
{
    // {props.children}  = adding its childern <Text>{props.album.title}</Text>
    return (
        <View>
                <View style={styles.containerStyle}>
                    <View style={styles.iconImageStyle}>
                        <Image source={require('../../images/sign_up/logo.png')} style={{height: 65, width: 65}} />
                    </View>
                    {props.children}
                </View>
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
        shadowRadius:10,
        elevation:1,
        marginLeft:10,
        marginRight:10,
        marginTop:60,
        backgroundColor: '#fff',
    },
    iconImageStyle:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        top:-30
    }
}