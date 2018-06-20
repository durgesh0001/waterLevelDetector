import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Picker,Left,Icon,Right,Body,Item,Footer,CardItem,Content,Text,Form} from 'native-base';
import {HeaderComponent,Button, CardView,DatePickerInput, Input,Number, Spinner,EmailInput,CardSection} from "../common";
import {SideNavigationBar} from '../SideMenu';
import {ScrollView,View,TouchableOpacity} from 'react-native';
import {getDevices,resetDeviceDetails,onDeviceIdChanged,getHistory} from '../../actions';
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
            this.props.onDeviceIdChanged(this.props.deviceId);
            this.props.getHistory({time_filter:'day',device_id:this.props.device_id,date:new Date(),type:"device"});
        }
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
            width: 300,
            height: 300,
            margin: {
                top: 20,
                left: 25,
                bottom: 50,
                right: 20
            },
            color: '#2980B9',
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
                    fill: '#34495E'
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
                    fill: '#34495E'
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
                <CardView>
                    {this.renderChartDataView(this.props.history,options)}
                </CardView>

            );
        }
    }


    renderChartDataView(data,options)
    {
        if(data.length >0 )
        {
            return(
                <Bar data={this.props.history} options={options} accessorKey='v'/>
            )
        }
        else
        {
            return(
                <Text note > No record found</Text>
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
                <TouchableOpacity onPress={()=>{
                    Actions.Supplier();
                }}>
                    <Content padder>
                        <Left>
                            <Text note>Click here to search the supplier</Text>
                        </Left>
                        <Right>
                            <Icon  name="ios-arrow-round-forward"   style={{color:"#2eb9f9"}}   />
                        </Right>
                    </Content>
                </TouchableOpacity>
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
        this.props.getHistory({time_filter:'day',device_id:deviceId,date:this.props.filterDate,type:"device"});


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
            <Picker  selectedValue={this.props.device_id}
                     onValueChange={this.onDeviceIdChanged.bind(this)} value={this.props.device_id}
                     mode="dropdown">
                {this.renderPickerItemsAndValues()}
            </Picker>
        );
    }

    /*
     @Method : renderContent
     @Params :
     @Returns : *
     */
    renderContent() {
        return (
                        <Grid style={{paddingTop:15}}>
                            <Col style={{paddingRight:7}}>
                                
                                    
                                        // <View style={styles.pickerStyle} >
                                            {this.renderPickerItems()}
                                        // </View>
                                    
                                
                            </Col>
                            <Col style={{paddingLeft:7}}>
                                
                                    <DatePickerInput maxDate={new Date()} placeholder="Select Date" label="Select Date" iconName="calendar"  onDateChange={this.OnToDateChanged.bind(this)}  value={this.state.filterDate}
                                                      isSubmitted={this.state.isSubmitted}/>

                                
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
                <HeaderComponent label="View Device" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false}/>
                <Content >
                    <Content padder>
                    {this.renderContent()}
                    </Content>
                    {this.renderChartContent()}
                    {this.renderFooter()}

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
    pickerStyle:{
        borderWidth:1,
        backgroundColor:'#fff',
        borderRadius:100,
        justifyContent:'flex-start',
        borderColor:'#ddd'
    },
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
}
const mapStateToProps = ({device}) => {
    const {device_id,device_name,tank_name,loading,history} = device;
    let deviceData =[];
    if(device.deviceData)
    {
        deviceData =[];
        _.map(device.deviceData,(val,uid)=>{
            deviceData.push(val)
        });
    }
    deviceData = deviceData.reverse();
    return {device_id,deviceData, device_name,tank_name,loading,history};

};

export default connect(mapStateToProps, {getDevices,resetDeviceDetails,onDeviceIdChanged,getHistory})(ViewDevice);
