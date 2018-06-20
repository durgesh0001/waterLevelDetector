import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Picker,Item,Icon,CardItem,Content,Text,Label,Right,Left,Form,Switch} from 'native-base';
import {HeaderComponent,Button, CardView, Spinner} from "../common";
import {ScrollView,View,DatePickerAndroid} from 'react-native';
import {addNotificationSettings,getUserDetailsForNotificationSettings,OnSendNotificationChanged} from '../../actions';

class NotificationSetting extends Component {
    state = {menuActive: false,isSubmitted:false};

    componentWillMount()
    {
        this.props.getUserDetailsForNotificationSettings();
    }

    /*
 @Method : onButtonPress
 @Params :
 @Returns : *
 */
    onButtonPress(text) {
        this.setState({isSubmitted: true})
        const {userId} = this.props;
        if (userId) {
            this.props.addNotificationSettings({is_user_notification:text,userId});
        }
    }

    /*
  @Method : OnSendNotificationChanged
  @Params :
  @Returns : *
  */
    OnSendNotificationChanged(text) {
        this.props.OnSendNotificationChanged(text);
        this.onButtonPress(text)
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
                <Form>
                    <CardItem>
                        <Left>
                            <Label>
                                Send Notification
                            </Label>
                        </Left>
                        <Right>
                            <Switch onValueChange={this.OnSendNotificationChanged.bind(this)} value={this.props.is_user_notification} />
                        </Right>
                    </CardItem>
                </Form>

        );
    }
    /*
@Method : render
@Params :
@Returns : *
*/

    render() {
        if (this.props.loading) {
            return (
                <Spinner size="large"/>
            )
        }
        else {
            return (
                <Container style={styles.containerBackgroundColor}>
                    <HeaderComponent label="Notification Settings" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false}/>
                    <Content bounces={false}>
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
const mapStateToProps = ({setting}) => {
    const {loading,is_user_notification,userId} = setting;
    return {loading,is_user_notification,userId};

};

export default connect(mapStateToProps, {addNotificationSettings,getUserDetailsForNotificationSettings,OnSendNotificationChanged})(NotificationSetting);
