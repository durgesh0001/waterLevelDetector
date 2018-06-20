import React,{Component} from 'react';
import {View,Modal,Dimensions} from 'react-native';
import {Card,CardItem,Button,Text,Left,Right} from 'native-base';

const Confirm =({children,visible,onAccept,onDecline})=>
{
 const {containerStyle,textStyle,cardSectionStyle} = styles;
return (
  <Modal
  transparent
  presentationStyle={"fullScreen"}
  visible={visible}
  animationType="slide"
  onRequestClose={()=>{}}
  >
      <Card style={containerStyle}>
          <CardItem style={cardSectionStyle}>
              <Text>Tank Capacity(m3) </Text>
          </CardItem>
      <CardItem style={cardSectionStyle}>
          {children}
      </CardItem>
      <CardItem style={cardSectionStyle}>
          <Left>
              <Button transparent onPress={onAccept}><Text>Apply</Text></Button>
          </Left>
          <Right>
              <Button  transparent onPress={onDecline}><Text>Cancel</Text></Button>
          </Right>
      </CardItem>
      </Card>
  </Modal>
);
}
const styles = {
    cardSectionStyle:{
        justifyContent:'center',
    },
    textStyle:{
        flex:1,
        fontSize:18,
        textAlign:'center',
        lineHeight:40

    },
    containerStyle:{
        backgroundColor:'#000',
        flex:1,
        justifyContent:'center'
    }

}
export {Confirm};