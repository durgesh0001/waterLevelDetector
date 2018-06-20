import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Picker,Item,CardItem,Content,Text,Form} from 'native-base';
import {HeaderComponent,Button, CardView, Spinner,PasswordField} from "../common";
import {ScrollView,View} from 'react-native';
import {changePassword,resetForm} from '../../actions';
import {Alert} from 'react-native';
import {formStyle} from '../../actions/style';
import {showToast} from '../../actions/types';




class ChangePasswordForm extends Component {
    state = {menuActive: false,isSubmitted:false,newPassword:"",confirmPassword:"",oldPassword:""};

    componentWillMount()
    {
        this.props.resetForm();

    }

    /*
@Method : validatePasswordOnSubmmit
@Params : password
@Returns : *
*/
    validatePasswordOnSubmmit = (password) => {
        var re = /^(?=.*[A-Z]).{8,}$/;
        return re.test(password);
    };

    /*
 @Method : onButtonPress
 @Params :
 @Returns : *
 */
    onButtonPress() {
        this.setState({isSubmitted: true})
        const {newPassword,confirmPassword,oldPassword} = this.state;
        if(newPassword && confirmPassword && oldPassword)
        {
            if(confirmPassword == newPassword)
            {
                if(this.validatePasswordOnSubmmit(newPassword))
                {
                    this.props.changePassword({old_password:oldPassword,password:newPassword});

                }
                else
                {
                    showToast("danger","Password should have minimum 6 Charcters, 1 caps,1small, 1 Special charcter, 1 number.");
                }

            }
            else
            {
                showToast("danger","Password and Confirm Password should be same.");
            }
        }

    }
    /*
 @Method : removeInvalidChars
 @Params :
 @Returns : *
 */
    removeInvalidChars(text) {
        let regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
        return text.replace(regex, '');
    }

    /*
@Method : onOldPasswordChanged
@Params :
@Returns : *
*/
    onOldPasswordChanged(text) {
        this.setState({oldPassword:this.removeInvalidChars(text.trim())});
    }


    /*
@Method : onConfirmPasswordChanged
@Params :
@Returns : *
*/
    onConfirmPasswordChanged(text) {
        this.setState({confirmPassword:this.removeInvalidChars(text.trim())});
    }


    /*
@Method : onNewPasswordChanged
@Params :
@Returns : *
*/
    onNewPasswordChanged(text) {
        this.setState({newPassword:this.removeInvalidChars(text.trim())});
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
@Method : onSideMenuChange
@Params :
@Returns : *
*/
    onSideMenuChange() {
        this.setState({menuActive: true});
    }

    /*
     @Method : renderContent
     @Params :
     @Returns : *
     */
    renderContent() {
        return (
                <Form style={formStyle}>
                    <View style={formStyle.formInputs}>
                        <PasswordField isShadow={true} isLengthMessageShow={false} secureTextEntry={true} placeholder="Old password" label="Old password" iconName="lock"
                                onChangeText={this.onOldPasswordChanged.bind(this)} value={this.state.oldPassword}
                                isSubmitted={this.state.isSubmitted}/>
                    </View>
                    <View style={formStyle.formInputs}>
                        <PasswordField isLengthMessageShow={true} secureTextEntry={true} placeholder="New password" label="New password" iconName="lock"
                                onChangeText={this.onNewPasswordChanged.bind(this)} value={this.state.newPassword}
                                isSubmitted={this.state.isSubmitted}/>
                    </View>
                    <View style={formStyle.formInputs}>
                        <PasswordField isLengthMessageShow={true} secureTextEntry={true} placeholder="Confirm password" oldPassword={this.state.newPassword} label="Confirm password" iconName="lock"
                                onChangeText={this.onConfirmPasswordChanged.bind(this)} value={this.state.confirmPassword}
                                isSubmitted={this.state.isSubmitted}/>
                    </View>
                    <View style={{flex:1}}>
                        {this.renderAction()}
                    </View>
                </Form>
            

        );
    }
    /*
@Method : render
@Params :
@Returns : *
*/

    render() {

        return (
            <Container style={styles.containerBackgroundColor}>
                <HeaderComponent isHeight={true} label="Change Password" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false}/>
                <Content bounces={false} style={{marginTop:-30}}>
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
        fontWeight:'bold'
    },
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
}
const mapStateToProps = ({auth}) => {
    const {loading} = auth;
    return {loading};

};

export default connect(mapStateToProps, {changePassword,resetForm})(ChangePasswordForm);
