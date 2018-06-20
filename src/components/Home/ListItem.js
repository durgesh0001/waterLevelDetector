import React, {Component} from 'react';
import {TouchableWithoutFeedback, View, ToastAndroid} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {ListItem,CardItem, Text, Body, Right, Left, Button, Icon} from 'native-base';
import * as Progress from 'react-native-progress';
import {Col, Row, Grid} from 'react-native-easy-grid';



class ListItemView extends Component {

    /*
@Method : onRowPress
@Params :
@Returns : *
*/
    onRowPress() {
      Actions.ViewDevice(this.props);
    }

    /*
@Method : formatAMPM
@Params :
@Returns : *
*/
     formatAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    /*
@Method : convertNumberToDetcimal
@Params :
@Returns : *
*/
    convertNumberToDetcimal(number)
    {
        let numberTemp = parseFloat(number)/100;
        return numberTemp;

    }

    /*
@Method : render
@Params :
@Returns : *
*/

    render() {
        const {device_id,tank_name,tank_status} = this.props.device;
             return (
                 <TouchableWithoutFeedback onPress={this.onRowPress.bind(this)}>
                     <ListItem style={styles.listItemStyle}>

                                     <CardItem style={styles.progressStyle}>
                                         <Progress.Circle textStyle={styles.progressBardTextStyle}
                                                          borderColor={styles.progressBarBorderColor}
                                                          color={styles.progressBarBorderColor} formatText={() => {
                                             return `${tank_status.percentage}%`
                                         }} progress={this.convertNumberToDetcimal(tank_status.percentage)} showsText={true} size={50}/>
                                     </CardItem>
                                     <CardItem style={styles.progressStyle}>
                                         <Text style={styles.textStyle}>{tank_name}</Text>
                                     </CardItem>
                                     <CardItem style={styles.progressStyle}>
                                         <Text>{tank_status.percentage}% Full </Text>
                                         <Text>at {this.formatAMPM(new Date(tank_status.time))}</Text>
                                     </CardItem>

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

    },
    progressBardTextStyle:
        {
            color: '#2eb9f9'
        },
    textStyle: {
        fontWeight: 'bold'
    },
    progressStyle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressBarBorderColor: '#2eb9f9'
}