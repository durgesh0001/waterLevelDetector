import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Picker,Item,Icon,CardItem,Content,Text,Label,Right,Left,Form,Switch,Body,ListItem} from 'native-base';
import {HeaderComponent,Button, CardView,DatePickerInput, Input,Number, Spinner,EmailInput,CardSection} from "../common";
import {SideNavigationBar} from '../SideMenu';
import {ScrollView,View,DatePickerAndroid,Platform} from 'react-native';
import {OnTitleChanged,addReminderSettings,getUserDetailsForSettings,OnFromDateChanged,OnToDateChanged,OnIntervalInMinutesChanged,OnRepeatChanged,OnRepeatDurationChanged,OnAlertLevelChanged,OnIntervalInMinutesChangedForMinutes,OnIntervalInMinutesChangedForHours} from '../../actions';
import _ from 'lodash';
import { Col, Row, Grid } from 'react-native-easy-grid';
import DatePicker from 'react-native-datepicker'
import {formStyle,dropdownPickerForDevice} from '../../actions/style';
import {showToast,alerts,minutes,hours} from '../../actions/types';

class ReminderSetting extends Component {
    state = {menuActive: false,isSubmitted:false,interval_in_minutes_for_minutes:"",interval_in_minutes_for_hours:""};

    componentWillMount()
    {
       this.props.getUserDetailsForSettings(this.props.device_id);
    }

    componentDidMount(){
       // alert(this.props.interval_in_minutes)
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
 @Method : onButtonPress
 @Params :
 @Returns : *
 */
    onButtonPress() {
        this.setState({isSubmitted: true})
        const {device_id,title,from_date,to_date,repeat_duration,alert_level_change,repeat,uid,interval_in_minutes_for_hours,interval_in_minutes_for_minutes} = this.props;
        let interval_in_minutes = ""
      if(this.props.interval_in_minutes_for_minutes == 0 && this.props.interval_in_minutes_for_hours == 0){
            showToast('danger',"Please select minutes or hours");

        }
        else
        {
            if((this.props.interval_in_minutes_for_hours !== "" && this.props.interval_in_minutes_for_minutes !== "") || (this.props.interval_in_minutes_for_hours !== "0" && this.props.interval_in_minutes_for_minutes !== "0")){
                interval_in_minutes = parseFloat(this.props.interval_in_minutes_for_hours)  * 60
                if(this.props.interval_in_minutes_for_minutes){

                    interval_in_minutes = parseFloat(this.props.interval_in_minutes_for_hours)  * 60 + parseFloat(this.props.interval_in_minutes_for_minutes);

                }

                    if(new Date(from_date) > new Date(to_date))
                    {
                        showToast('danger',"From-Date can not be greater than To-Date");
                    }
                    else
                    {
                        if (device_id && title && from_date && to_date && interval_in_minutes && repeat_duration && alert_level_change && uid) {
                            this.props.addReminderSettings({interval_in_minutes_for_hours,interval_in_minutes_for_minutes,device_id,title,from_date,to_date,interval_in_minutes,repeat_duration,alert_level_change,repeat,uid});
                        }
                    }


            }
            else
            {
                showToast('danger',"Please select minutes or hours");
            }

        }

    }

    /*
@Method : validateText
@Params :
@Returns : *
*/
    validateText(text) {
        return text;
    }


    /*
  @Method : OnTitleChanged
  @Params :
  @Returns : *
  */
    OnTitleChanged(text) {
        this.props.OnTitleChanged(this.validateText(text));
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
    OnIntervalInMinutesChanged(type,text) {
        if(type == "minutes")
        {
            this.props.OnIntervalInMinutesChangedForMinutes(text);
        }
        else
        {
            this.props.OnIntervalInMinutesChangedForHours(text);

        }

        // interval_in_minutes_for_hours
        // this.props.OnIntervalInMinutesChanged(this.validateNumber(text));
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
        this.props.OnRepeatDurationChanged(this.validateNumber(text));
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
@Method : validateNumber
@Params :
@Returns : *
*/
    validateNumber(text) {
        let newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < text.length; i++) {
            if ( numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
        }

        return newText;
    }

    /*
@Method : renderDropDownIcon
@Params :
@Returns : *
*/
    renderDropDownIcon() {
        if (Platform.OS === 'ios') {
            return (
                <Icon  style={{color:"#b3c7f9",position:"absolute",top:10,right:0,zIndex:-1}} name='md-arrow-dropdown'/>

            )
        }
    }
    /*
 @Method : renderBackButton
 @Params :
 @Returns : *
 */
    renderBackButton(){
        if (Platform.OS === 'ios') {
            return (
                <Icon  style={{color:"#fff"}} name='ios-arrow-back'/>
            )
        }

    }



    /*
@Method : renderAreaData
@Params :
@Returns : *
*/
    renderIntervalInHours() {
        return (
            <CardSection  isSubmitted={this.state.isSubmitted}>
                <Item rounded style={{borderColor:"#fff"}}>
                    <Picker headerBackButtonTextStyle={{ paddingTop:10 }} headerBackButtonText={this.renderBackButton()}
                            placeholder="Select Hours"
                            selectedValue={this.props.interval_in_minutes_for_hours}
                            onValueChange={(text)=>{
                                this.OnIntervalInMinutesChanged("hours",text)
                            }}
                            value={this.props.interval_in_minutes_for_hours} mode="dropdown" style={dropdownPickerForDevice}>

                        {
                            _.map(hours, (val, i) => {
                                return (
                                    <Picker.Item value={val} label={`${val}`}/>
                                )
                            })
                        }

                    </Picker>
                    {this.renderDropDownIcon()}
                </Item>
            </CardSection>
        );
    }

    /*
@Method : renderAreaData
@Params :
@Returns : *
*/


    /*
@Method : renderAreaData
@Params :
@Returns : *
*/
    renderIntervalInMinutes() {
        return (
            <CardSection   isSubmitted={this.state.isSubmitted}>
                <Item rounded style={{borderColor:"#fff"}}>
                    <Picker headerBackButtonTextStyle={{ paddingTop:10 }} headerBackButtonText={this.renderBackButton()}
                            placeholder="Select Minutes"
                            selectedValue={this.props.interval_in_minutes_for_minutes}
                            onValueChange={(text)=>{
                                this.OnIntervalInMinutesChanged("minutes",text)
                            }}
                            value={this.props.interval_in_minutes_for_minutes} mode="dropdown" style={dropdownPickerForDevice}>

                        {
                            _.map(minutes, (val, i) => {
                                return (
                                    <Picker.Item value={val} label={`${val}`}/>
                                )
                            })
                        }

                    </Picker>
                    {this.renderDropDownIcon()}
                </Item>
            </CardSection>
        );
    }


    /*
@Method : renderAreaData
@Params :
@Returns : *
*/
    renderAlertLevel() {
        return (
            <CardSection value={this.props.alert_level_change} isSubmitted={this.state.isSubmitted}>
            <Item rounded style={{borderColor:"#fff"}}>
                <Picker headerBackButtonTextStyle={{ paddingTop:10 }} headerBackButtonText={this.renderBackButton()}
                        placeholder="Select Alert Level"
                        selectedValue={this.props.alert_level_change}
                        onValueChange={this.OnAlertLevelChanged.bind(this)}
                        value={this.props.alert_level_change} mode="dropdown" style={dropdownPickerForDevice}>

                    {
                        _.map(alerts, (val, i) => {
                            return (
                                <Picker.Item value={val} label={`${val} %`}/>
                            )
                        })
                    }

                </Picker>
                {this.renderDropDownIcon()}
            </Item>
            </CardSection>
        );
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
                            <Input placeholder="Title" label="Title" iconName="ios-paper" onChangeText={this.OnTitleChanged.bind(this)} value={this.props.title} isSubmitted={this.state.isSubmitted}/>
                        </View>

                        <View style={formStyle.formInputs}>
                            <Grid>
                                <Col style={{paddingTop:10}} size={30}>
                                    <Text>From Date</Text>
                                </Col>
                                <Col style={{paddingRight:5}} size={70}>
                                    <DatePickerInput minDate={new Date()} placeholder="From Date" label="From Date" iconName="calendar"
                                                     onDateChange={this.OnFromDateChanged.bind(this)} value={this.props.from_date}
                                                     isSubmitted={this.state.isSubmitted} style={{color:"#949dac"}}/>
                                </Col>
                            </Grid>

                        </View>
                        <View style={formStyle.formInputs}>

                            <Grid>
                                <Col style={{paddingTop:10}} size={30}>
                                    <Text>Alert Level</Text>
                                </Col>
                                <Col style={{paddingLeft:5}} size={70}>
                                    {this.renderAlertLevel()}

                                </Col>
                            </Grid>
                        </View>
                        <View style={formStyle.formInputs}>
                            <Grid>
                                <Col style={{paddingTop:10}} size={30}>
                                    <Text>Hours</Text>
                                </Col>
                                <Col style={{paddingLeft:5}}  size={70}>
                                    {this.renderIntervalInHours()}

                                </Col>
                            </Grid>

                        </View>
                        <View style={formStyle.formInputs}>
                            <Grid>
                                <Col style={{paddingTop:10}} size={30}>
                                    <Text>Minutes</Text>
                                </Col>
                                <Col style={{paddingLeft:5}} size={70}>
                                    {this.renderIntervalInMinutes()}

                                </Col>
                            </Grid>

                        </View>

                        <View style={formStyle.formInputs}>
                            <Content>
                                <Item style={{borderBottomWidth:0,paddingTop:5,paddingBottom:5}}>
                                    <Text>
                                        Repeat
                                    </Text>
                                    <Right>
                                        <Switch onValueChange={this.OnRepeatChanged.bind(this)} value={this.props.repeat} />
                                    </Right>
                                </Item>
                            </Content>
                        </View>
                        <View style={formStyle.formInputs}>
                            <Number  placeholder="Repeat Duration" label="Repeat Duration" iconName="md-repeat"
                                    onChangeText={this.OnRepeatDurationChanged.bind(this)} maxLength={3} value={this.props.repeat_duration}
                                    isSubmitted={this.state.isSubmitted}/>
                        </View>
                        <View>
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

        if (this.props.loading) {
            return (
                <Spinner size="large"/>
            )
        }
        else
        {
            return (
                <Container style={styles.containerBackgroundColor}>
                    <HeaderComponent isHeight={true} label="Reminder Settings" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false}/>
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
const mapStateToProps = ({setting}) => {
    const {title,from_date,to_date,interval_in_minutes,repeat_duration,error,alert_level_change,repeat,loading,uid,interval_in_minutes_for_hours,interval_in_minutes_for_minutes} = setting;
    return {title,from_date,to_date,interval_in_minutes,repeat_duration,error,alert_level_change,repeat,loading,uid,interval_in_minutes_for_hours,interval_in_minutes_for_minutes};

};

export default connect(mapStateToProps, {addReminderSettings,getUserDetailsForSettings,OnTitleChanged,OnFromDateChanged,OnToDateChanged,OnIntervalInMinutesChanged,OnRepeatChanged,OnRepeatDurationChanged,OnAlertLevelChanged,OnIntervalInMinutesChangedForMinutes,OnIntervalInMinutesChangedForHours})(ReminderSetting);
