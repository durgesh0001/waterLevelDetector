import React, {Component} from 'react';
import firebase from 'firebase';
import {View,ScrollView,Keyboard,Image,Alert} from 'react-native';
import {Geolocation} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {Button, Card, Spinner} from "../common";
import {Right,CardItem,Form, Content,Container, Label,Text, Header, Title} from 'native-base';
import {showToast} from '../../actions/types';


class VerificationForm extends Component {
    state = {isLoaded: null,email:""};

    componentWillMount()
    {
        setTimeout(function() { this.setEmail()}.bind(this), 2000);
    }

    setEmail()
    {
        firebase.auth().onAuthStateChanged((user)=>
        {
            this.setState({isLoaded:true})
            if(user)
            {
                this.setState({email:user.email});

            }
        });
    }


    /*
     @Method : onButtonPressBack
     @Params :
     @Returns : *
     */
    onButtonPressBack() {
                firebase.auth().signOut().then(()=>{
                    Actions.Auth();
                },(error)=> {
                    showToast("danger","Sorry some error occurred, please try again later!");
                });
    }

    /*
     @Method : onButtonPress
     @Params :
     @Returns : *
     */
    onButtonPress() {
        firebase.auth().currentUser.sendEmailVerification()
            .then(()=>{
                firebase.auth().signOut().then(()=>{
                    showToast('success','We have received your request and an email containing verification link has been send to your registered email.');
                   Actions.Auth({type:'reset'});
                },(error)=> {
                    showToast("danger","Sorry some error occurred, please try again later!");
                });
            })
            .catch(() => {
                showToast("danger","Sorry some error occurred, please try again later!");
            })
    }

    /*
  @Method : renderAction
  @Params :
  @Returns : *
  */
    renderActionBack() {

            return (
                <Button onPress={this.onButtonPressBack.bind(this)}>
                   Cancel
                </Button>
            );

    }


    /*
    @Method : renderAction
    @Params :
    @Returns : *
    */
    renderAction() {

            return (
                <Button onPress={this.onButtonPress.bind(this)}>
                    Resend Verification Link
                </Button>
            );
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
                            <Text style={styles.textStyle}>Hi {this.state.email} </Text>
                        </CardItem>
                        <CardItem style={styles.headerStyle}>
                            <Text note>Your email is not verified,To resend the verification email, Click Resend next to the email address that you want to verify, and we'll send an email to that address
                            </Text>
                        </CardItem>
                        <CardItem style={styles.headerStyle}>
                            <Text note>
                                لم يتم التحقق من بريدك الإلكتروني ، لإعادة إرسال رسالة التحقق ، انقر فوق إعادة إرسال بجوار عنوان البريد الإلكتروني الذي تريد التحقق منه ، وسنرسل رسالة بريد إلكتروني إلى هذا العنوان
                            </Text>
                        </CardItem>
                        <CardItem style={styles.headerStyle}>
                            <Image source={require("../../images/congratulations/congrats.png")} style={{height: 121, width: 134}} />
                        </CardItem>
                        <CardItem style={styles.headerStyle}>
                            {this.renderAction()}
                        </CardItem>
                        <CardItem style={styles.headerStyle}>
                            {this.renderActionBack()}
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
        if(this.state.isLoaded  == null)
        {
            return (
            <Spinner size="large"/>
            );
        }
        else
        {
            return (
                <Container style={styles.containerBackgroundColor} >
                    <Content bounces={false} padder>
                        {this.renderContent()}
                    </Content>
                </Container>
            );
        }
    };
}

const styles = {
    containerBackgroundColor:{
        backgroundColor: '#fbfbfe'
    },
    headerStyle:{
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:5,
        marginRight:5
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
