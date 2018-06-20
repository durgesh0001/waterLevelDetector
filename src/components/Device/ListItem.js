import React, {Component} from 'react';
import {TouchableWithoutFeedback, View, ToastAndroid} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {ListItem, Text, Body, Right, Left, Button, Icon} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';



class ListItemView extends Component {

    onRowPress(device_id,tank_city,tank_country) {
      Actions.EditDeviceComponent({deviceId:device_id,tankCityId:tank_city,tankCountryId:tank_country});
    }

    render() {
        const {device_id,tank_name,tank_city,tank_country} = this.props.device;
             return (
                 <TouchableWithoutFeedback onPress={()=>{
                     this.onRowPress(device_id,tank_city,tank_country)
                 }}>
                     <ListItem style={styles.listItemStyle}>
                         <Body>
                         <Text style={{color:'black'}}>{tank_name}</Text>
                         <Text note><Text style={{color:'black',fontSize:14}}>Devie ID</Text> : {device_id}</Text>
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
        marginBottom:12,    
        borderRadius:5,
        elevation: 2,
        borderColor:'#fbfbfe'

    }
}