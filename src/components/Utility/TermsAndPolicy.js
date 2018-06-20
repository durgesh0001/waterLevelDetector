import React, {Component} from 'react';
import {Container,Picker,Item,Icon,Body,CardItem,Content,Text,Label,Right,Left,Form,Switch,H2} from 'native-base';
import {HeaderComponent, CardView,DatePickerInput, Input,Number} from "../common";
import {ScrollView,View,DatePickerAndroid} from 'react-native';
import {connect} from 'react-redux';
import {resetForm} from '../../actions';
class TermsAndPolicy extends Component {
    state = {menuActive: false,isSubmitted:false};

    /*
@Method : componentWillMount
@Params :
@Returns : *
*/
    componentWillMount()
    {
        this.props.resetForm();

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
            <Content  bounces={false} padder>
                <H2>
                    <Text style={{marginBottom:15,color:'black'}}>1.YOUR AGREEMENT</Text>
                </H2>
                
                <Text note style={styles.text}>
                    By using this Site, you agree to be bound by, and to comply with, these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use this site.

                    PLEASE NOTE: We reserve the right, at our sole discretion, to change, modify or otherwise alter these Terms and Conditions at any time. Unless otherwise indicated, amendments will become effective immediately. Please review these Terms and Conditions periodically. Your continued use of the Site following the posting of changes and/or modifications will constitute your acceptance of the revised Terms and Conditions and the reasonableness of these standards for notice of changes. For your information, this page was last updated as of the date at the top of these terms and conditions.
                </Text>
                <H2>
                    <Text style={{marginBottom:15,color:'black'}}>2.PRIVACY</Text>
                </H2>


                <Text note style={styles.text}>
                    Please review our Privacy Policy, which also governs your visit to this Site, to understand our practices.
                </Text>
                    

                <H2>
                    <Text style={{marginBottom:15,color:'black'}}>3. LINKED SITES</Text>
                </H2>

                <Text note style={styles.text}>
                    This Site may contain links to other independent third-party Web sites ("Linked Sites”). These Linked Sites are provided solely as a convenience to our visitors. Such Linked Sites are not under our control, and we are not responsible for and does not endorse the content of such Linked Sites, including any information or materials contained on such Linked Sites.

                </Text>
                <Text>

                </Text>
                <Text>

                </Text>
            </Content>

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
                    <HeaderComponent label="Terms & Policy" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false}/>
                        {this.renderContent()}
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
    text:{
        textAlign:'justify',
        fontSize:16
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
    const {loading} = utility;
    return {loading};
};

export default connect(mapStateToProps,{resetForm})(TermsAndPolicy);


