import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View,ScrollView,Keyboard} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {emailChanged, forgotPassword} from '../../actions';
import {Button, Card,Spinner,AuthFooter,EmailInput} from "../common";
import {Toast,Right,CardItem,Form, Button as ButtonNative, Content,Container, Label,Text, Header, Title} from 'native-base';


class ForgotPassword extends Component {
    state = {isLoaded: false, validationError: '', isSubmitted: false,showFooter:true};

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
        @Params : email props
        @Returns : *
        */
    onChangeEmail(text) {
        this.props.emailChanged(text);
    }

    /*
      @Method : onButtonPress
      @Params :
      @Returns : *
      */
    onButtonPress() {
        this.setState({isSubmitted: true});
        const {email} = this.props;
        if (email) {
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
                <ScrollView style={{flux:1}}>
                    <Form>
                        <Card>
                            <CardItem header style={styles.headerStyle}>
                                <Text style={styles.textStyle}>Forgot Password?</Text>
                            </CardItem>
                            <View style={styles.headerStyle}>
                           <Text note>Enter your email address to
                                        recover your password
                           </Text>
                            </View>
                            <CardItem>

                            </CardItem>

                            <CardItem>
                                <EmailInput placeholder="user@example.com" label="Email"
                                            onChangeText={this.onChangeEmail.bind(this)} value={this.props.email}
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
    const {email, loading} = auth;
    return {email, loading};

};

export default connect(mapStateToProps, {emailChanged, forgotPassword})(ForgotPassword);
