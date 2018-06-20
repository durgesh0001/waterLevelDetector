import React, {Component} from 'react';
import {TouchableWithoutFeedback, View, ToastAndroid} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {ListItem, Text,Card,CardItem, Body, Right, Left, Button, Icon} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';



class ListItemView extends Component {

    renderAlertIcon(percentage)
    {
        if(percentage <=25)
        {
            return(
                <Icon  name="warning"   style={{color:"red"}}  />
            )
        }
        else
        {
            return(
                <Icon  name="alert"   style={{color:"#2eb9f9"}} color="#2eb9f9"  />
            )
        }
    }
    render() {
        const {message,percentage} = this.props.alert;
        return (
                <ListItem style={styles.listItemStyle}>
                    {this.renderAlertIcon(percentage)}
                    <Body>
                    <Text note>{message}</Text>
                    </Body>
                    {/*<Right>*/}
                        {/*<Icon name='close'></Icon>*/}
                    {/*</Right>*/}
                </ListItem>
        );
    }
}

export default ListItemView;

const styles = {
    listItemStyle:{
        borderBottomWidth:12,
        borderColor:'#fbfbfe'

    },
    cardBackgroundColor:{
        backgroundColor: '#fbfbfe'
    }
}