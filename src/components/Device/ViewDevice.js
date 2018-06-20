import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Picker,Left,Icon,Right,Body,Item,Footer,CardItem,Content,Text,Form,FooterTab,Button as NativeBaseButton} from 'native-base';
import {HeaderComponent,Button, CardView,DatePickerInput, Input,Number, Spinner,EmailInput,CardSection} from "../common";
import {SideNavigationBar} from '../SideMenu';
import {ScrollView,View,TouchableOpacity,Dimensions,Platform} from 'react-native';
import {getDevices,resetDeviceDetails,onDeviceIdChanged,getHistory,getDevicesByDeviceId} from '../../actions';
import _ from 'lodash';
import {Grid,Col,Row} from 'react-native-easy-grid';
import {Bar} from 'react-native-pathjs-charts';
import {Actions} from 'react-native-router-flux';


class ViewDevice extends Component {
    state = {menuActive: false,isSubmitted:false,filterDate:new Date()};

    componentWillMount()
    {
        this.props.getDevices();
        if(this.props.deviceId)
        {
            this.props.getDevicesByDeviceId(this.props.deviceId);
            this.props.onDeviceIdChanged(this.props.deviceId);
            this.props.getHistory({time_filter:'day',device_id:this.props.deviceId,date:this.formatDate(new Date()),type:"device"});
        }
    }

    /*
@Method : formatDate
@Params :
@Returns : *
*/
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    /*
 @Method : renderChartContent
 @Params :
 @Returns : *
 */
    renderChartContent() {
        let data = [
            [{
                "v": 49,
                "name": "1 PM"
            }, {
                "v": 42,
                "name": "2 PM"
            },
                {
                    "v": 29,
                    "name": "3 PM"
                },
                {
                    "v": 50,
                    "name": "4 PM"
                },
                {
                    "v": 60,
                    "name": "5 PM"
                }
            ]
        ]

        let options = {
            width:Dimensions.get('window').width - 40,
            margin: {
                top: 20,
                left: 25,
                bottom: 50,
                right: 20
            },
            color: '#2eb9f9',
            gutter: 20,
            animate: {
                type: 'oneByOne',
                duration: 3000,
                fillTransition: 3
            },
            axisX: {
                showAxis: true,
                showLines: true,
                showLabels: true,
                showTicks: true,
                zeroAxis: false,
                orient: 'bottom',
                label: {
                    fontFamily: 'Arial',
                    fontSize: 8,
                    fontWeight: true,
                    fill: '#2eb9f9'
                }
            },
            axisY: {
                showAxis: true,
                showLines: true,
                showLabels: true,
                showTicks: true,
                zeroAxis: false,
                orient: 'left',
                label: {
                    fontFamily: 'Arial',
                    fontSize: 8,
                    fontWeight: true,
                    fill: '#2eb9f9'
                }
            }
        }
        if(this.props.loading)
        {
            return (
                <Spinner size="large"/>
            )
        }
        else
        {

            return (
                <Content padder>
                    {this.renderChartDataView(this.props.history,options)}
                </Content>

            );
        }
    }


    renderChartDataView(data,options)
    {
        if(data.length >0 )
        {
            return(
                <Bar data={this.props.history}  options={options} accessorKey='v'/>
            )
        }
        else
        {
            return(

                <View style={styles.headerStyle}>
                    <Text note>No records found</Text>
                </View>

            )
        }
    }


    /*
  @Method : renderFooter
  @Params :
  @Returns : *
  */
    renderFooter()
    {
        return(
            <Footer style={styles.containerBackgroundColor}>
                <NativeBaseButton  onPress={()=>{
                  Actions.Supplier({tankCity:this.props.tank_city,tankArea:this.props.tank_area});
                 }} block iconRight transparent style={{paddingTop:15}} >
                    <Text note uppercase={false} >Click here to search the supplier</Text>
                  <Icon name="ios-arrow-round-forward"  style={{ color:'#2eb9f9'}} />
              </NativeBaseButton>
            </Footer>
        )
    }



    /*
@Method : OnToDateChanged
@Params :
@Returns : *
*/
    OnToDateChanged(date) {
        this.setState({filterDate:date});
        this.props.getHistory({time_filter:'day',device_id:this.props.device_id,date:date,type:"device"});

    }

    /*
@Method : onDeviceIdChanged
@Params :
@Returns : *
*/
    onDeviceIdChanged(deviceId) {
        this.props.onDeviceIdChanged(deviceId);
        this.props.getHistory({time_filter:'day',device_id:deviceId,date:this.state.filterDate,type:"device"});


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
   @Method : renderPickerItemsAndValues
   @Params :
   @Returns : *
   */
    renderPickerItemsAndValues()
    {
        return(
            _.map(this.props.deviceData,(val,i)=>{
                const {device_id,tank_name,tank_status} = val;
                return(
                    <Picker.Item key={i} value={device_id} label={tank_name}/>
                )
            })
        );

    }

    /*
    @Method : renderPickerItems
    @Params :
    @Returns : *
    */
    renderPickerItems()
    {
        return(
            <Picker  headerBackButtonTextStyle={{ paddingTop:10 }} headerBackButtonText={this.renderBackButton()} style={{color:"#949dac",width:128}} selectedValue={this.props.device_id}
                     onValueChange={this.onDeviceIdChanged.bind(this)} value={this.props.device_id}
                     mode="dropdown">
                {this.renderPickerItemsAndValues()}
            </Picker>
        );
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
     @Method : renderContent
     @Params :
     @Returns : *
     */
    renderContent() {
        return (
            <Grid style={{paddingRight:15,paddingLeft:15}}>
                <Col style={{paddingRight:7}}>
                    <Row>
                        <Content>
                            <Item rounded style={styles.pickerStyle}>
                                {this.renderPickerItems()}
                                {this.renderDropDownIcon()}
                            </Item>
                        </Content>
                    </Row>
                </Col>
                <Col style={{paddingLeft:7}}>
                    <Row>
                        <DatePickerInput maxDate={new Date()} placeholder="Select Date" label="Select Date" iconName="calendar"  onDateChange={this.OnToDateChanged.bind(this)}  value={this.state.filterDate}
                                          isSubmitted={this.state.isSubmitted}/>

                    </Row>
                </Col>
            </Grid>
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
                <HeaderComponent label="View Device" isHeight={true} onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false} >
                    <NativeBaseButton transparent onPress={()=>{ Actions.ReminderSetting({device_id:this.props.device_id})}}>
                        <Icon name="settings" />
                    </NativeBaseButton>
                </HeaderComponent>
                <Content bounces={false} style={{marginTop:-30,maxHeight:60}}>
                    {this.renderContent()}
                </Content>
                <Content bounces={false} >
                    {this.renderChartContent()}
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
    forgotPasswordButtonCardItemStyle:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:15
    },
    textStyle:{
        fontWeight:'bold'
    },
    pickerStyle:{
        borderWidth:1,
        backgroundColor:'#fff',
        borderRadius:100,
        justifyContent:'flex-start',
        borderColor:'#ddd',
        overflow:'hidden',
        height:52
    },
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
}
const mapStateToProps = ({device}) => {
    const {device_id,loading,history,tank_city,tank_area} = device;

    let device_name = device.device_name;
    let tank_name = device.tank_name;

    if(device_name){
        device_name =  device_name.trim();
    }

    if(tank_name){
        tank_name =  tank_name.trim();
    }

    let deviceData =[];
    if(device.deviceData)
    {
        deviceData =[];
        _.map(device.deviceData,(val,uid)=>{
            if(val.tank_name){
                val.tank_name = val.tank_name.trim()
            }
            if(val.device_name){
                val.device_name = val.device_name.trim()
            }
            deviceData.push(val)
        });
    }
    deviceData = deviceData.reverse();
    return {device_id,deviceData, device_name,tank_name,loading,history,tank_city,tank_area};

};

export default connect(mapStateToProps, {getDevices,resetDeviceDetails,onDeviceIdChanged,getHistory,getDevicesByDeviceId})(ViewDevice);
