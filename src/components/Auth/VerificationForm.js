import React, {Component} from 'react';
import firebase from 'firebase';
import {View,ScrollView,Keyboard,Image,Alert} from 'react-native';
import {Geolocation} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {Button, Card, Spinner} from "../common";
import {Toast,Right,CardItem,Form, Content,Container, Label,Text, Header, Title} from 'native-base';

class VerificationForm extends Component {
    state = {isLoaded: null};

    /*
     @Method : onButtonPress
     @Params :
     @Returns : *
     */
    onButtonPress() {
        firebase.auth().currentUser.sendEmailVerification()
            .then(()=>{
                firebase.auth().signOut().then(function() {
                    Alert.alert('Success', 'Please check your mail for verification link');
                    Actions.Auth({type:'reset'});
                }, function(error) {
                    Alert.alert('Error', 'Something is wrong,Please try again');
                });
            })
            .catch(() => {
                Alert.alert('Error', 'Something is wrong,Please try again');
            })

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
                    Resend Verification Link
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
                            <Text style={styles.textStyle}>Hi {firebase.auth().currentUser.email} </Text>
                        </CardItem>
                        <View style={styles.headerStyle}>
                            <Text note>Your email is not verified,To resend the verification email, Click Resend next to the email address that you want to verify, and we'll send an email to that address
                            </Text>
                        </View>
                        <CardItem style={styles.headerStyle}>
                            <Image source={require("../../images/congratulations/congrats.png")} style={{height: 121, width: 134}} />
                        </CardItem>
                        <CardItem>
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
                <Content>
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


export default VerificationForm;
