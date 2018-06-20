import React from 'react';
import {Button,Text} from 'native-base';
import {View,ImageBackground} from 'react-native';

const AuthFooter =({onPress,children,buttonText})=>
{
    return(
        <View>
            <View style={styles.footerStyle}>
                <ImageBackground source={require('../../images/sign_up/bg.png')} style={styles.footerBackgroundImageStyle}>
                    <View style={styles.footerButtomStyle}>
                        <Button  block transparent onPress={onPress}>
                            <Text uppercase={false} style={styles.footerImageTextColor}>
                                {buttonText}
                            </Text>
                        </Button>
                    </View>
                </ImageBackground>
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
        height: 107,
        width: null,
        flex: 1
    },
    footerButtomStyle:{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerStyle: {
        position: 'absolute',
        bottom: 0,
        left:0,
        right:0
    }
}

