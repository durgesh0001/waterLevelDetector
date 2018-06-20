import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Button as Btn,Content,Text} from 'native-base';

const ButtonDelete =({onPress,children})=>
{
    return (
        <Btn rounded block  style={styles.butonStyle} onPress={onPress}>
            <Text  >
                {children}
            </Text>
        </Btn>
    );
}
export {ButtonDelete};
const styles = {
    butonStyle:{
        flex:1,
        alignSelf:'stretch',
        backgroundColor:'red',
        borderWidth:1,
        borderColor:'red',
        marginLeft:5,
        marginRight:5
    }
};