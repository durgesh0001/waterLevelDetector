import React, {Component} from 'react';
import {TouchableWithoutFeedback, View, ToastAndroid} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {ListItem, Text, Body, Right, Left, Button, Icon} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';



class ListItemView extends Component {

    onRowPress(device_id) {
      Actions.EditDeviceComponent({deviceId:device_id});
    }

    render() {
        const {device_id,tank_name} = this.props.device;
             return (
                 <TouchableWithoutFeedback onPress={()=>{
                     this.onRowPress(device_id)
                 }}>
                     <ListItem style={styles.listItemStyle}>
                         <Body>
                         <Text style={{color:'black'}}>{tank_name}</Text>
                         <Text note><Text style={{color:'black'}}>Devie ID</Text> : {device_id}</Text>
                         </Body>
                         <Right>
                             <Icon name='ios-arrow-forward'></Icon>
                         </Right>
                     </ListItem>
                 </TouchableWithoutFeedback>

             );
    }
}

export default ListItemView;

const styles = {
    titleStyle: {
        fontSize: 18,
        paddingLeft: 15
    },
    listItemStyle:{
        borderBottomWidth:12,
        borderColor:'#fbfbfe'

    }
}