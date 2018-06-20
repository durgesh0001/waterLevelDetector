import React from 'react';
import {View} from 'react-native';
import {CardItem,Card} from 'native-base';
const CardSection =({children,label,iconName,value,onChangeText,placeholder,secureTextEntry,isSubmitted=false,isDisabled=false})=>
{
    // {props.children}  = adding its childern <Text>{props.album.title}</Text>
    if((value == '' && isSubmitted == true))
    {
        return (
            <View style={styles.containerStyleError}>
                {children}
            </View>
        );
    }
    else if((!(value == '') && isSubmitted == true))
    {
        return (
            <View style={styles.containerStyleSuccess}>
                {children}
            </View>
        );
    }
    else
    {
        return (
            <View style={styles.containerStyle}>
                {children}
            </View>
        );
    }
}
export {CardSection};

const styles = {
    containerStyle:{
        borderWidth:1,
        backgroundColor:'#fff',
        borderRadius:100,
        justifyContent:'flex-start',
        flexDirection:'row',
        borderColor:'#ddd',
    },
    containerStyleSuccess:{
        borderWidth:1,
        backgroundColor:'#fff',
        borderRadius:100,
        justifyContent:'flex-start',
        flexDirection:'row',
        borderColor:'#228B22',
    },
    containerStyleError:{
        borderWidth:1,
        backgroundColor:'#fff',
        borderRadius:100,
        justifyContent:'flex-start',
        flexDirection:'row',
        borderColor:'#DC143C',
    }
}
