import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Picker,Item,Icon,CardItem,Content,Text,Label,Right,Left,Form,Switch} from 'native-base';
import {HeaderComponent,Button, CardView,DatePickerInput, Input,Number, Spinner,EmailInput,CardSection} from "../common";
import {SideNavigationBar} from '../SideMenu';
import {ScrollView,View,DatePickerAndroid} from 'react-native';
import {OnTitleChanged,addReminderSettings,getUserDetailsForSettings,OnFromDateChanged,OnToDateChanged,OnIntervalInMinutesChanged,OnRepeatChanged,OnRepeatDurationChanged,OnAlertLevelChanged} from '../../actions';
import _ from 'lodash';
import { Col, Row, Grid } from 'react-native-easy-grid';
import DatePicker from 'react-native-datepicker'

class ReminderSetting extends Component {
    state = {menuActive: false,isSubmitted:false};

    componentWillMount()
    {
       this.props.getUserDetailsForSettings();
    }

    /*
 @Method : onButtonPress
 @Params :
 @Returns : *
 */
    onButtonPress() {
        this.setState({isSubmitted: true})
        const {title,from_date,to_date,interval_in_minutes,repeat_duration,alert_level_change,repeat,userId} = this.props;
            if (title && from_date && to_date && interval_in_minutes && repeat_duration && alert_level_change && userId) {
                this.props.addReminderSettings({title,from_date,to_date,interval_in_minutes,repeat_duration,alert_level_change,repeat,userId});
            }
    }

    /*
  @Method : OnTitleChanged
  @Params :
  @Returns : *
  */
    OnTitleChanged(text) {
        this.props.OnTitleChanged(text);
    }

  /*
@Method : OnFromDateChanged
@Params :
@Returns : *
*/
    OnFromDateChanged(text) {
        this.props.OnFromDateChanged(text);
    }


    /*
@Method : OnToDateChanged
@Params :
@Returns : *
*/
    OnToDateChanged(text) {
        this.props.OnToDateChanged(text);
    }

    /*
@Method : OnIntervalInMinutesChanged
@Params :
@Returns : *
*/
    OnIntervalInMinutesChanged(text) {
        this.props.OnIntervalInMinutesChanged(text);
    }

    /*
@Method : OnRepeatChanged
@Params :
@Returns : *
*/
    OnRepeatChanged(text) {
        this.props.OnRepeatChanged(text);
    }

    /*
@Method : OnRepeatDurationChanged
@Params :
@Returns : *
*/
    OnRepeatDurationChanged(text) {
        this.props.OnRepeatDurationChanged(text);
    }

    /*
@Method : OnAlertLevelChanged
@Params :
@Returns : *
*/
    OnAlertLevelChanged(text) {
        this.props.OnAlertLevelChanged(text);
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
                    Save
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
            <Content>
                    <Form>
                        <CardItem>
                            <Input placeholder="Title" label="Title" iconName="ios-paper" onChangeText={this.OnTitleChanged.bind(this)} value={this.props.title} isSubmitted={this.state.isSubmitted}/>
                        </CardItem>
                        <CardItem>
                        <Content>
                            <Grid>
                                <Col style={{paddingRight:5}}>
                                        <DatePickerInput minDate={new Date()} placeholder="From Date" label="From Date" iconName="calendar"
                                                          onDateChange={this.OnFromDateChanged.bind(this)} value={this.props.from_date}
                                                isSubmitted={this.state.isSubmitted} style={{color:"#949dac"}}/>
                                </Col>
                                <Col style={{paddingLeft:5}}>
                                    <DatePickerInput minDate={new Date()}  placeholder="To Date" label="To Date" iconName="calendar"
                                                      onDateChange={this.OnToDateChanged.bind(this)} value={this.props.to_date}
                                                isSubmitted={this.state.isSubmitted} style={{color:"#949dac"}}/>
                                </Col>
                            </Grid>
                        </Content>
                        </CardItem>
                        <CardItem>
                            <Number  placeholder="Interval in mins" label="Interval in mins" iconName="ios-stopwatch"
                                    onChangeText={this.OnIntervalInMinutesChanged.bind(this)} value={this.props.interval_in_minutes}
                                    isSubmitted={this.state.isSubmitted}/>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Label>
                                    Repeat
                                </Label>
                            </Left>
                            <Right>
                                <Switch onValueChange={this.OnRepeatChanged.bind(this)} value={this.props.repeat} />
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Number  placeholder="Repeat Duration" label="Repeat Duration" iconName="md-repeat"
                                    onChangeText={this.OnRepeatDurationChanged.bind(this)} value={this.props.repeat_duration}
                                    isSubmitted={this.state.isSubmitted}/>
                        </CardItem>
                        <CardItem>
                            <Number  placeholder="Alert Level" label="Alert Level" iconName="ios-notifications"
                                    onChangeText={this.OnAlertLevelChanged.bind(this)} value={this.props.alert_level_change}
                                    isSubmitted={this.state.isSubmitted}/>
                        </CardItem>
                        <CardItem>
                            {this.renderAction()}
                        </CardItem>
                    </Form>
                
            </Content>
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
                    <HeaderComponent label="Reminder Settings" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false}/>
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
const mapStateToProps = ({setting}) => {
    const {title,from_date,to_date,interval_in_minutes,repeat_duration,error,alert_level_change,repeat,loading,userId} = setting;
    return {title,from_date,to_date,interval_in_minutes,repeat_duration,error,alert_level_change,repeat,loading,userId};

};

export default connect(mapStateToProps, {addReminderSettings,getUserDetailsForSettings,OnTitleChanged,OnFromDateChanged,OnToDateChanged,OnIntervalInMinutesChanged,OnRepeatChanged,OnRepeatDurationChanged,OnAlertLevelChanged})(ReminderSetting);
