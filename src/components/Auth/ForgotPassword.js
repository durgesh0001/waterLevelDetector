import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View,ScrollView,Keyboard,Platform} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {emailChanged, forgotPassword,resetForm} from '../../actions';
import {Button, Card,Spinner,AuthFooter,EmailInput} from "../common";
import {Right,CardItem,Form, Button as ButtonNative, Content,Container, Label,Text, Header, Title} from 'native-base';


class ForgotPassword extends Component {
    state = {isLoaded: false, validationError: '', isSubmitted: false,showFooter:true};

    constructor(props) {
        super(props);

    }

    /*
   @Method : componentWillMount
   @Desc   : will check that user is logged in or not
   @Params :
   @Returns : *
   */
    componentWillMount() {
        this.props.resetForm();
        Keyboard.dismiss();
    }
    /*
@Method : componentWillUnmount
@Desc   :
@Params :
@Returns : *
*/
    componentWillUnmount () {
        this.props.resetForm();
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
    /*
 @Method : removeInvalidChars
 @Params :
 @Returns : *
 */
    removeInvalidChars(text) {
        let regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
        return text.replace(regex, '');
    }

    _keyboardDidHide () {
        this.setState({showFooter: true});
    }
    /*
        @Method : onChangeEmail
        @Params : email props
        @Returns : *
        */
    onChangeEmail(text) {
        this.props.emailChanged(this.removeInvalidChars(text));
    }
    /*
@Method : validateEmail
@Params : email
@Returns : *
*/
    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    /*
      @Method : onButtonPress
      @Params :
      @Returns : *
      */
    onButtonPress() {
        this.setState({isSubmitted: true});
        const {email} = this.props;
        if (this.validateEmail(email)) {
            this.props.forgotPassword({email});

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
                    Submit
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
                <Form style={{backgroundColor:'transparent'}}>
                    <Card style={{backgroundColor:'transparent',elevation:0}}>
                            <CardItem header style={styles.headerStyle}>
                                <Text style={styles.textStyle}>Forgot Password?</Text>
                            </CardItem>
                            <CardItem header style={styles.headerStyle}>
                                <Text note>Enter your email address to
                                recover your password
                                </Text>
                            </CardItem>
                            <CardItem>

                            </CardItem>

                            <CardItem>
                                <EmailInput  placeholder="user@example.com" label="Email"
                                            onChangeText={this.onChangeEmail.bind(this)} value={this.props.email}
                                            isSubmitted={this.state.isSubmitted}/>
                            </CardItem>
                            <CardItem>
                                {this.renderAction()}
                            </CardItem>
                        </Card>
                    </Form>
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
                    Actions.loginFast();
                }}  buttonText="Back to Log In"  />
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
                <Content bounces={false} style={{position: 'relative'}}>
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
    const {email, loading} = auth;
    return {email, loading};

};

export default connect(mapStateToProps, {emailChanged,resetForm,forgotPassword})(ForgotPassword);
