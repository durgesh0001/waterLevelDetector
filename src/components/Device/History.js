import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Picker,Left,Icon,Right,Body,Item,Footer,CardItem,Content,Text,Form} from 'native-base';
import {HeaderComponent,Button, CardView,DatePickerInput, Input,Number, Spinner,EmailInput,CardSection} from "../common";
import {SideNavigationBar} from '../SideMenu';
import {ScrollView,View,TouchableOpacity,Dimensions,Platform} from 'react-native';
import {getDevices,resetDeviceDetails,onDeviceIdChanged,getHistory} from '../../actions';
import _ from 'lodash';
import {Grid,Col,Row} from 'react-native-easy-grid';
import {Bar} from 'react-native-pathjs-charts';
import {dropdownPicker,centerAlign} from '../../actions/style';

class History extends Component {
    state = {menuActive: false,isSubmitted:false,filterDate:new Date(),filterType:"day"};

    componentWillMount()
    {
        this.props.getDevices();
    }

    /*
@Method : componentDidMount
@Params :
@Returns : *
*/
    componentDidMount()
    {
        if(this.props.device_id_temp)
        {
            this.props.getHistory({time_filter:this.state.filterType,device_id:this.props.device_id_temp,type:'history',date:new Date()});
        }
    }

    /*
 @Method : renderChartContent
 @Params :
 @Returns : *
 */
    renderChartContent() {
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

        if (this.props.loading) {
            return (
                <Spinner size="large"/>
            )
        }
        else {
            if(this.props.history.length > 0)
            {
                return (
                    <View>
                        <Bar  data={this.props.history} options={options} accessorKey='v'/>
                    </View>

                );
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



    }





    /*
@Method : OnFilterTypeChanged
@Params :
@Returns : *
*/
    OnFilterTypeChanged(type) {
        this.setState({filterType:type});
        if(this.props.device_id != undefined && this.props.device_id)
        {
            this.props.getHistory({time_filter:type,device_id:this.props.device_id,type:'history',date:new Date()});
        }
        else
        {
            this.props.getHistory({time_filter:type,device_id:this.props.device_id_temp,type:'history',date:new Date()});
        }

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
    @Method : renderPickerItems
    @Params :
    @Returns : *
    */
    renderPickerItems()
    {
        if(this.props.device_id)
        {
            return(
                <Item rounded style={styles.pickerStyle}>
                <Picker headerBackButtonTextStyle={{ paddingTop:10 }} headerBackButtonText={this.renderBackButton()} style={{color:"#949dac",width:160,backgroundColor:"transparent",zIndex:1}} selectedValue={this.props.device_id}
                        onValueChange={this.onDeviceIdChanged.bind(this)} value={this.props.device_id}
                        mode="dropdown">
                    {this.renderPickerItemsAndValues()}
                </Picker>
                    {this.renderDropDownIcon()}

                </Item>
            );
        }
        else
        {
            return(
                <Item rounded style={styles.pickerStyle}>
                <Picker headerBackButtonTextStyle={{ paddingTop:10 }} headerBackButtonText={this.renderBackButton()} style={{color:"#949dac",width:160,backgroundColor:"transparent",zIndex:1}} selectedValue={this.props.device_id_temp}
                        onValueChange={this.onDeviceIdChanged.bind(this)} value={this.props.device_id_temp}
                        mode="dropdown">
                    {this.renderPickerItemsAndValues()}
                </Picker>
                    {this.renderDropDownIcon()}

                </Item>
            );
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
                <Icon  style={{color:"#b3c7f9",position:"absolute",top:10,right:1,zIndex:-1}} name='md-arrow-dropdown'/>

            )
        }
    }


        /*
        @Method : renderPickerItemsWithHistoryType
        @Params :
        @Returns : *
        */
        renderPickerItemsWithHistoryType()
        {
            return(
                <Item rounded style={styles.pickerStyle}>
                    <Picker headerBackButtonTextStyle={{ paddingTop:10 }} headerBackButtonText={this.renderBackButton()}  style={{color:"#949dac",width:160,backgroundColor:"transparent",zIndex:1}} selectedValue={this.state.filterType}
                            onValueChange={this.OnFilterTypeChanged.bind(this)} value={this.state.filterType}
                            mode="dropdown">
                        <Picker.Item  value="day" label="Daily"/>
                        <Picker.Item  value="week" label="Weekly"/>
                        <Picker.Item  value="month" label="Monthly"/>
                    </Picker>
                    {this.renderDropDownIcon()}
                </Item>
            );
        }



    /*
     @Method : renderContent
     @Params :
     @Returns : *
     */
    renderContent() {
        return (
            <View>
                <Grid>
                    <Col style={{paddingRight:7}}>
                            {this.renderPickerItems()}
                    </Col>
                    <Col style={{paddingLeft:7}}>
                            {this.renderPickerItemsWithHistoryType()}
                    </Col>
                </Grid>
                <View  style={styles.headerStyle} header>
                    <Text style={{color:'black',fontSize:20}}>Water Reading Level</Text>
                </View>
                <View  style={styles.headerStyle}>
                    <Text note>Consumption(%)</Text>
                </View>
            </View>
        );
    }


    /*
@Method : renderContentData
@Params :
@Returns : *
*/
    renderContentData()
    {
        if(this.props.deviceData.length > 0)
        {
            return(
                <View style={{flex:1}} >
                    <Content bounces={false} style={{maxHeight:130,marginTop:-30,paddingLeft:15,paddingRight:15}}>
                        {this.renderContent()}
                    </Content>
                    <Content  bounces={false} padder>
                        {this.renderChartContent()}
                    </Content>
                </View>
            )
        }
        else
        {
            return(
                <Content style={centerAlign}>
                    <Text>No device Found</Text>
                </Content>
            )
        }


    }
    /*
@Method : render
@Params :
@Returns : *
*/

    render() {
        return (
            <Container style={styles.containerBackgroundColor}>
                <HeaderComponent  isHeight={this.props.deviceData.length > 0} label="Your History" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false}/>
                {this.renderContentData()}
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
        alignItems: 'center',
        marginTop:15
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
        borderColor:'#ddd',
        overflow:'hidden'
    },
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
}
const mapStateToProps = ({device}) => {
    const {device_id,loading,history} = device;
    let device_name = device.device_name;
    let tank_name = device.tank_name;

    if(device_name){
        device_name =  device_name.trim();
    }

    if(tank_name){
        tank_name =  tank_name.trim();
    }

    let deviceData =[];
    let device_id_temp = "";
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
        device_id_temp = deviceData[0].device_id;
    }
    deviceData = deviceData.reverse();
    return {device_id,device_id_temp,deviceData, device_name,tank_name,loading,history};

};

export default connect(mapStateToProps, {getDevices,getHistory,resetDeviceDetails,onDeviceIdChanged})(History);
