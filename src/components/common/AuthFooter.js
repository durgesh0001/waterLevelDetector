import React from 'react';
import {Button,Text,Content} from 'native-base';
import {View,ImageBackground,Image,Dimensions} from 'react-native';

const AuthFooter =({onPress,children,buttonText})=>
{


    return(
            <View style={styles.footerStyle}>
                 <Image source={require('../../images/sign_up/bg.png')} style={styles.footerBackgroundImageStyle} />
                 <View style={styles.footerButtomStyle}>
                    <Button  block transparent onPress={onPress}>
                        <Text uppercase={false} style={styles.footerImageTextColor}>
                            {buttonText}
                        </Text>
                    </Button>
                </View>
            </View>

    )
}
export {AuthFooter};


const styles = {
    footerImageTextColor:{
        color:'#fff'
    },
    footerBackgroundImageStyle:{
        height: 105,
        width: null,
        resizeMode :'stretch',
    },
    footerButtomStyle:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        landscape: {
          position: 'relative'
        }
    },
    footerStyle: {
        minHeight:105,
        paddingTop:10,
        height: 105,
        position: 'relative',
        bottom: 0,
        left:0,
        right:0,
        landscape: {
          position: 'relative'
        }
    }
}

