import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View,Keyboard} from 'react-native';
import {emailChanged, firstNameChanged, lastNameChanged, passwordChanged, registerUser,phoneChanged} from '../../actions';
import {Button,Card,Password,CardSection, Input, EmailInput, Spinner,Phone,AuthFooter} from "../common";
import {Container,Content,Toast,FooterTab,Footer, Button as ButtonNative,CardItem, Text, Header, Form,Body, Title, Icon, Left} from 'native-base';
import {Actions} from 'react-native-router-flux';
import {ScrollView} from 'react-native';



class RegistrationForm extends Component {
    state = { isLoaded: false, validationError: '', isSubmitted: false,showFooter:true};

    /*
   @Method : componentWillMount
   @Desc   : will check that user is logged in or not
   @Params :
   @Returns : *
   */
    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
    }
    /*
@Method : componentWillUnmount
@Desc   :
@Params :
@Returns : *
*/
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    /*
@Method : _keyboardDidShow
@Desc   :
@Params :
@Returns : *
*/
    _keyboardDidShow () {
        this.setState({showFooter: false});
    }

    /*
@Method : _keyboardDidHide
@Desc   :
@Params :
@Returns : *
*/

    _keyboardDidHide () {
        this.setState({showFooter: true});
    }

    /*
     @Method : onChangeEmail
     @Params :
     @Returns : *
     */
    onChangeEmail(text) {
        this.props.emailChanged(text);
    }

    /*
     @Method : onChangePassword
     @Params :
     @Returns : *
     */
    onChangePassword(text) {
        this.props.passwordChanged(text);
    }

    /*
     @Method : onButtonPress
     @Params :
     @Returns : *
     */
    onButtonPress() {
        this.setState({isSubmitted: true})
        const {email, password, phone} = this.props;
        if (email && password && phone && password.length > 5 && phone.length > 9) {
            this.setState({validationError: ''})
            // navigator.geolocation.getCurrentPosition(
            //     (position) => {
            //         this.props.registerUser({email,password,phone,position});
            //     },
            //     (error) => alert(error.message),
            //     {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000}
            // );
            this.props.registerUser({email,password,phone});



        }
    }

    /*
    @Method : onChangeFirstName
    @Params :
    @Returns : *
    */
    onChangeFirstName(text) {
        this.props.firstNameChanged(text);
    }

    /*
    @Method : onChangeLastName
    @Params :
    @Returns : *
    */
    onChangeLastName(text) {
        this.props.lastNameChanged(text);
    }

    /*
  @Method : onChangePhoneNumber
  @Params :
  @Returns : *
  */
    onChangePhoneNumber(text) {
        this.props.phoneChanged(text);
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
                <Button  onPress={this.onButtonPress.bind(this)}>
                    Sign Up
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
        if (this.state.isLoaded == null) {
            return (
                <View>
                    <CardSection>
                        <Spinner size="large"/>
                    </CardSection>
                </View>
            );
        }
        else {
            return (
                <ScrollView style={{flux:1}}>
                    <Form>
                    <Card>
                        <CardItem header style={styles.headerStyle}>
                            <Text style={styles.textStyle}>Sign Up</Text>
                        </CardItem>
                        <CardItem>
                            <EmailInput placeholder="user@example.com" label="Email"
                                        onChangeText={this.onChangeEmail.bind(this)} value={this.props.email}
                                        isSubmitted={this.state.isSubmitted}/>
                        </CardItem>
                        <CardItem>
                            <Password iconName='lock' secureTextEntry={true} placeholder="password" label="Password"
                                   onChangeText={this.onChangePassword.bind(this)} value={this.props.password}
                                   isSubmitted={this.state.isSubmitted}/>
                        </CardItem>
                        <CardItem>
                            <Phone placeholder="Mobile number" label="Mobile number"
                                   onChangeText={this.onChangePhoneNumber.bind(this)} value={this.props.phone}
                                   isSubmitted={this.state.isSubmitted}/>
                        </CardItem>
                        <CardItem>
                            {this.renderAction()}
                        </CardItem>
                    </Card>
                    </Form>
                </ScrollView>
            );
        }

    }

    /*
    @Method : renderFooter
    @Params :
    @Returns : *
    */
    renderFooter()
    {
        if (this.state.showFooter && this.state.isLoaded != null) {
            return (
                <AuthFooter onPress={() => {
                    Actions.login({type:'reset'});
                }}  buttonText="Already have an account? Login"  />
            )
        }
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
                {this.renderFooter()}
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
    textStyle:{
        color:'black'
    },
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
}

const mapStateToProps = ({auth}) => {
    const {email, password,phone, first_name, last_name, error, loading} = auth;
    return {email, password,phone, first_name, last_name, error, loading};

};

export default connect(mapStateToProps, {
    emailChanged,
    passwordChanged,
    registerUser,
    lastNameChanged,
    firstNameChanged,
    phoneChanged
})(RegistrationForm);
