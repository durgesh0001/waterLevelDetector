import React, {Component} from 'react';
import {connect} from 'react-redux';
import firebase from 'firebase';
import {View,ScrollView,Keyboard} from 'react-native';
import {Geolocation} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {emailChanged, passwordChanged, loginUser, resetForm, facebookLogin,phoneChanged} from '../../actions';
import {Button, Card, Input,Password, Spinner,AuthFooter,EmailInput} from "../common";
import {Toast,Right,CardItem,Form, Button as ButtonNative, Content,Container, Label,Text, Header, Title} from 'native-base';

class LoginForm extends Component {
    state = {isLoaded: null,isEmailVerified:false, validationError: '', isSubmitted: false,showFooter:true};

    /*
       @Method : componentWillMount
       @Desc   : will check that user is logged in or not
       @Params :
       @Returns : *
       */
    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this));
        firebase.auth().onAuthStateChanged((user) => {
                this.setState({isLoaded: true})
                if (user) {
                    if(user.emailVerified)
                    {
                        this.setState({isEmailVerified:user.emailVerified})
                        Actions.Home({type:'reset'});
                    }
                    else
                    {
                        Actions.VerificationForm({type:'reset'});
                    }
                }
            }

        )
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
@Method : onChangePhoneNumber
@Params :
@Returns : *
*/
    onChangePhoneNumber(text) {
        this.props.phoneChanged(text);
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
        const {email, password} = this.props;

        if (email && password) {
            this.setState({validationError: ''});
            this.props.loginUser({email, password});
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
                    LogIn
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
                <View style={{paddingTop: 200}}>
                    <Spinner size="large"/>
                </View>
            );
        }
        else {
            return (
                <ScrollView style={{flux:1}}>
                    <Form>
                        <Card>
                            <CardItem header style={styles.headerStyle}>
                                <Text style={styles.textStyle}>Login </Text>
                            </CardItem>
                            <CardItem>
                                <EmailInput placeholder="Email" label="Email"
                                            onChangeText={this.onChangeEmail.bind(this)} value={this.props.email}
                                            isSubmitted={this.state.isSubmitted}/>
                            </CardItem>
                            <CardItem>
                                <Password iconName='lock' secureTextEntry={true} placeholder="password" label="Password"
                                       onChangeText={this.onChangePassword.bind(this)} value={this.props.password}
                                       isSubmitted={this.state.isSubmitted}/>
                            </CardItem>
                            <CardItem>
                                {this.renderAction()}
                            </CardItem>
                            <CardItem  style={styles.forgotPasswordButtonCardItemStyle}>
                                 <ButtonNative transparent dark onPress={()=>{
                                            Actions.forgotPassword();
                                        }}>
                                            <Text style={{color:'#949dac'}} uppercase={false}>Forgot Password?</Text>
                                  </ButtonNative>
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
                    Actions.signUp();
                }}  buttonText="New user? Sign Up" />
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
    forgotPasswordButtonCardItemStyle:{
        justifyContent: 'center',
        alignItems: 'center',
        color:'#949dac'
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
    const {email,phone,password, error, loading} = auth;
    return {email, phone,password, error, loading};

};

export default connect(mapStateToProps, {
    emailChanged,
    passwordChanged,
    loginUser,
    resetForm,
    facebookLogin,
    phoneChanged
})(LoginForm);
