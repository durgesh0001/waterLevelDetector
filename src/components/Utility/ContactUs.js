import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Picker,Item,Icon,CardItem,Content,Text,Label,Right,Left,Form,Switch} from 'native-base';
import {HeaderComponent,Button, CardView, Input, Spinner,EmailInput} from "../common";
import {ScrollView,View,DatePickerAndroid} from 'react-native';
import {addContactUsDetails,OnNameChanged,OnEmailChanged,OnQueryChanged} from '../../actions';
import firebase from 'firebase';


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
@Method : OnQueryChanged
@Params :
@Returns : *
*/
    OnQueryChanged(text) {
        this.props.OnQueryChanged(text);
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
            <CardView>

                <Form>
                    <CardItem>
                        <Input  placeholder="Name" label="Name" iconName="person"
                                 onChangeText={this.OnNameChanged.bind(this)} value={this.props.name}
                                 isSubmitted={this.state.isSubmitted}/>
                    </CardItem>
                    <CardItem>
                        <EmailInput placeholder="Email" label="Email"
                                    onChangeText={this.OnEmailChanged.bind(this)} value={this.props.email}
                                    isSubmitted={this.state.isSubmitted}/>
                    </CardItem>
                    <CardItem>
                        <Input  placeholder="Comment/Query" iconName="md-text" label="Comment/Query" multiline={true} numberOfLines={5}
                                onChangeText={this.OnQueryChanged.bind(this)} value={this.props.query}
                                isSubmitted={this.state.isSubmitted}/>
                    </CardItem>
                    <CardItem>
                        {this.renderAction()}
                    </CardItem>
                </Form>
            </CardView>

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
                    <HeaderComponent label="Contact US" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false}/>
                    <Content>
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
