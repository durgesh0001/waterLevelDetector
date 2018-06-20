import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Button as Btn,Content,Text} from 'native-base';

const Button =({onPress,children})=>
{
    return (
          <Btn rounded block  style={styles.butonStyle} onPress={onPress}>
           <Text  >
               {children}
           </Text>
          </Btn>
    );
}
export {Button};
const styles = {
    butonStyle:{
      flex:1,
      alignSelf:'stretch',
      backgroundColor:'#2eb9f9',
      borderWidth:1,
      borderColor:'#2eb9f9',
      marginLeft:5,
      marginRight:5
    }
};