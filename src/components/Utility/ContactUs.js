import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Picker,Item,Icon,Toast,CardItem,Content,Text,Label,Right,Left,Form,Switch} from 'native-base';
import {HeaderComponent,Button, CardView, Input, Spinner,EmailInput} from "../common";
import {ScrollView,View,DatePickerAndroid} from 'react-native';
import {addContactUsDetails,OnNameChanged,OnEmailChanged,OnQueryChanged} from '../../actions';
import firebase from 'firebase';
import {formStyle} from '../../actions/style';
import {showToast} from '../../actions/types';


class ContactUs extends Component {
    state = {menuActive: false,isSubmitted:false};

   componentWillMount()
   {
       this.props.OnNameChanged(firebase.auth().currentUser.displayName);
       this.props.OnEmailChanged(firebase.auth().currentUser.email);


   }


    /*
 @Method : onButtonPress
 @Params :
 @Returns : *
 */
    onButtonPress() {
        this.setState({isSubmitted: true})
        const {email,name,query} = this.props;
            if (email && name && query) {
                this.setState({isSubmitted: false})
                this.props.addContactUsDetails({name,email,query});
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
  @Method : OnNameChanged
  @Params :
  @Returns : *
  */
    OnNameChanged(text) {
        this.props.OnNameChanged(text);
    }

    /*
  @Method : OnEmailChanged
  @Params :
  @Returns : *
  */
    OnEmailChanged(text) {
        this.props.OnEmailChanged(text);
    }

    /*
@Method : validateText
@Params :
@Returns : *
*/
    validateText(text) {
        let newText = '';
        let numbers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ';

        for (var i = 0; i < text.length; i++) {
            if ( numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
        }

        return newText;
    }
    /*
@Method : OnQueryChanged
@Params :
@Returns : *
*/
    OnQueryChanged(text) {
        this.props.OnQueryChanged(text);
    }

    /*
@Method : validateFirstSpace
@Params :
@Returns : *
*/
    validateFirstSpace(text)
    {
        let myString = text;

        let spacesAtStart = myString.length - myString.trimLeft().length

        return spacesAtStart;
    }


    /*
    @Method : renderAction
    @Params :
    @Returns : *
    */
    renderAction() {

        
            return (
                <Button onPress={this.onButtonPress.bind(this)}>
                    Submit
                </Button>
            );
        
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
                    <Input isShadow={true} placeholder="Name" label="Name" iconName="person"
                            onChangeText={this.OnNameChanged.bind(this)} value={this.props.name}
                            isSubmitted={this.state.isSubmitted}/>
                </View>
                <View style={formStyle.formInputs}>
                    <EmailInput isDisabled={true} placeholder="Email" label="Email"
                                onChangeText={this.OnEmailChanged.bind(this)} value={this.props.email}
                                isSubmitted={this.state.isSubmitted}/>
                </View>
                <View style={formStyle.formInputs}>
                    <Input  placeholder="Comment/Query" iconName="md-text" label="Comment/Query" multiline={true} numberOfLines={5}
                            onChangeText={this.OnQueryChanged.bind(this)} value={this.props.query}
                            isSubmitted={this.state.isSubmitted}/>
                </View>
                
                {this.renderAction()}
                
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
        else
        {
            return (
                <Container style={styles.containerBackgroundColor}>
                    <HeaderComponent isHeight={true} label="Contact US" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false}/>
                    <Content bounces={false} style={{marginTop:-30}}>
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
const mapStateToProps = ({utility}) => {
    const {email,name,query,loading} = utility;
    return {email,name,query,loading};

};

export default connect(mapStateToProps, {addContactUsDetails,OnNameChanged,OnEmailChanged,OnQueryChanged})(ContactUs);
