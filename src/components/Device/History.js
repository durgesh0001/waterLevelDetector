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


class History extends Component {
    state = {menuActive: false,isSubmitted:false,filterDate:new Date(),filterType:"day"};

    componentWillMount()
    {
        this.props.getDevices();
        this.props.getHistory({time_filter:this.state.filterType,device_id:this.props.device_id,type:'history',date:new Date()});
    }

    /*
 @Method : renderChartContent
 @Params :
 @Returns : *
 */
    renderChartContent() {
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

        if (this.props.loading) {
            return (
                <Spinner size="large"/>
            )
        }
        else {
            if(this.props.history.length > 0)
            {
                return (
                    <CardView>
                        <CardItem  style={styles.headerStyle} header>
                            <Text>Water Reading Level</Text>
                        </CardItem>
                        <CardItem  style={styles.headerStyle}>
                            <Text note>Consumption(%)</Text>
                        </CardItem>
                        <Bar data={this.props.history} options={options} accessorKey='v'/>
                    </CardView>

                );
            }
            else
            {
                return(
                    <CardView>
                        <CardItem  style={styles.headerStyle} header>
                            <Text>Water Reading Level</Text>
                        </CardItem>
                        <CardItem  style={styles.headerStyle}>
                            <Text note>Consumption(%)</Text>
                        </CardItem>
                        <CardItem  style={styles.headerStyle}>
                            <Text note>No records found</Text>
                        </CardItem>
                    </CardView>
                )
            }
        }



    }





    /*
@Method : OnFilterTypeChanged
@Params :
@Returns : *
*/
    OnFilterTypeChanged(type) {
        this.setState({filterType:type});
        this.props.getHistory({time_filter:type,device_id:this.props.device_id,type:'history',date:new Date()});

    }

    /*
@Method : onDeviceIdChanged
@Params :
@Returns : *
*/
    onDeviceIdChanged(deviceId) {
        this.props.onDeviceIdChanged(deviceId);
        this.props.getHistory({time_filter:this.state.filterType,device_id:deviceId,type:'history',date:new Date()});
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
    @Method : renderPickerItemsWithHistoryType
    @Params :
    @Returns : *
    */
    renderPickerItemsWithHistoryType()
    {
        return(
            <Picker  selectedValue={this.state.filterType}
                     onValueChange={this.OnFilterTypeChanged.bind(this)} value={this.state.filterType}
                     mode="dropdown">
                <Picker.Item  value="day" label="Daily"/>
                <Picker.Item  value="week" label="Weekly"/>
                <Picker.Item  value="month" label="Monthly"/>
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
                    <View style={styles.pickerStyle} >
                        {this.renderPickerItems()}
                    </View>
                </Col>
                <Col style={{paddingLeft:7}}>
                    <View style={styles.pickerStyle} >
                        {this.renderPickerItemsWithHistoryType()}
                    </View>
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
                <HeaderComponent label="Your History" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false}/>
                <Content >
                    <Content padder>
                        {this.renderContent()}
                    </Content>
                    {this.renderChartContent()}
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

export default connect(mapStateToProps, {getDevices,getHistory,resetDeviceDetails,onDeviceIdChanged})(History);
