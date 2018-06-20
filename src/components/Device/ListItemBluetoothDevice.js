import React, {Component} from 'react';
import {TouchableWithoutFeedback, View, ToastAndroid} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {ListItem, Text, Body, Right, Left, Button, Icon} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';



class ListItemBluetoothDevice extends Component {


    onRowPress(device_id) {
        Actions.AddDeviceComponent({deviceId:device_id});
    }

    render() {
        const {id,name} = this.props.device;
        return (
            <TouchableWithoutFeedback onPress={()=>{
                this.onRowPress(id)
            }}>
                <ListItem style={styles.listItemStyle}>
                    <Body>
                    <Text style={{color:'black'}}>{name}</Text>
                    <Text note><Text style={{color:'black',fontSize:14}}>Devie ID</Text> : {id}</Text>
                    </Body>
                    <Right>
                        <Icon name='ios-arrow-forward'></Icon>
                    </Right>
                </ListItem>
            </TouchableWithoutFeedback>

        );
    }
}

export default ListItemBluetoothDevice;

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