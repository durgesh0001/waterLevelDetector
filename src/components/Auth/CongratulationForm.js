import React, {Component} from 'react';
import {View,ScrollView,Keyboard,Image} from 'react-native';
import {Geolocation} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {Button, Card, Spinner} from "../common";
import {Toast,Right,CardItem,Form, Content,Container, Label,Text, Header, Title} from 'native-base';

class CongratulationForm extends Component {
    state = {isLoaded: null};

    /*
     @Method : onButtonPress
     @Params :
     @Returns : *
     */
    onButtonPress() {
        Actions.Home({type:'reset'});
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
                    GO TO HOME
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
                                <Text style={styles.textStyle}>Congratulation! </Text>
                            </CardItem>
                            <View style={styles.headerStyle}>
                                <Text note>You have been registered Successfully!
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


export default CongratulationForm;
