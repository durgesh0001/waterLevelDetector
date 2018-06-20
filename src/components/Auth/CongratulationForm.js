import React, {Component} from 'react';
import {View,ScrollView,Keyboard,Image} from 'react-native';
import {Geolocation} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {Button, Card, Spinner} from "../common";
import {Right,CardItem,Form, Content,Container, Label,Text, Header, Title} from 'native-base';
import firebase from 'firebase';

class CongratulationForm extends Component {
    state = {isLoaded: null};

    /*
     @Method : onButtonPress
     @Params :
     @Returns : *
     */
    onButtonPress() {
        if(firebase.auth().currentUser.emailVerified)
        {
            Actions.Auth();
        }
        else
        {
            Actions.Verify();
        }
    }

    /*
    @Method : renderAction
    @Params :
    @Returns : *
    */
    renderAction() {

        if (this.props.loading) {
            return (
                <Spinner size="large"/>
            )
        }
        else {
            return (
                <Button onPress={this.onButtonPress.bind(this)}>
                    GO TO HOME
                </Button>
            );
        }
    }




    /*
   @Method : renderContent
   @Params :
   @Returns : *
   */
    renderContent() {
            return (
                <ScrollView style={{flux:1}}>
                    <Form>
                        <Card>
                            <CardItem header style={styles.headerStyle}>
                                <Text style={styles.textStyle}>Congratulation! </Text>
                            </CardItem>
                            <CardItem style={styles.headerStyle}>
                                <Text note>You have been registered Successfully!
                                </Text>
                            </CardItem>
                            <CardItem style={styles.headerStyle}>
                                <Image source={require("../../images/congratulations/congrats.png")} style={{height: 121, width: 134}} />
                            </CardItem>
                            <CardItem style={styles.headerStyle}>
                                {this.renderAction()}
                            </CardItem>
                        </Card>
                    </Form>
                </ScrollView>
            );
    }

    /*
 @Method : render
 @Params :
 @Returns : *
 */
    render() {
        return (
            <Container style={styles.containerBackgroundColor} >
                <Content bounces={false}>
                    {this.renderContent()}
                </Content>
            </Container>
        );
    };
}

const styles = {
    containerBackgroundColor:{
        backgroundColor: '#fbfbfe'
    },
    headerStyle:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    forgotPasswordButtonCardItemStyle:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle:{
        color:'black'
    },
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
}


export default CongratulationForm;
