import React from 'react';
import {View,Image} from 'react-native';
import {Card as nativeCard} from 'native-base';

const CardView =(props)=>
{
    // {props.children}  = adding its childern <Text>{props.album.title}</Text>
    return (
        <View>
            <View style={styles.containerStyle}>
                {props.children}
            </View>
        </View>
    );
}
export {CardView};

const styles = {
    containerStyle:{
        borderRadius:2,
        shadowColor:'#000',
        shadowOffset:{width:0,height:2},
        shadowOpacity:0.1,
        shadowRadius:5,
        elevation:1,
        marginLeft:10,
        marginRight:10,
        marginTop:20,
        backgroundColor: '#fff',
    }
}