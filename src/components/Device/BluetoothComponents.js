import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container, Picker, Left, Icon, Right, Item, Footer, Card, CardItem, Content, Text, Form} from 'native-base';
import {HeaderComponent, Spinner,Base64} from "../common";
import {View,Platform} from 'react-native';
import {addReading,bluetoothDiconnect,OndeviceIdForConnection, updateDeviceDetailsByBlutooth, getDevicesForBluetooth, resetDeviceDetails, onDeviceIdChanged, getHistory, getUserDetailsForSettingsForBluetooth,getDevicesForBluetoothForShowHistory} from '../../actions';
import _ from 'lodash';
import {BleManager} from 'react-native-ble-plx';
import * as Progress from 'react-native-progress';
import {Grid, Col, Row} from 'react-native-easy-grid';
import {BatteryManager} from 'NativeModules';
import {NativeModules} from 'react-native';
import {BLUETOOTH_DEVICE_NAME} from '../../actions/types';
import firebase from 'firebase';
import {centerAlign} from '../../actions/style';
import {Actions} from 'react-native-router-flux';






class BluetoothComponents extends Component {
    constructor() {
        super()
        this.state = {
            info: "Please wait..",
            menuActive: false,
            isSubmitted: false,
            tankStatus: "0",
            batteryStatus: "0",
            mobileStatus: "0",
            isLoading: true,
            time: Date.now(),
            tank_name: "",
            tank_height:"",
            device_id:"",
            device_name:"",
            isActive: false,
            deviceIdForConnection:""
        }

    }

    /*
 @Method : createUUID
 @Params :
 @Returns : *
 */
    createUUID(service_uuid, num) {
        let prefixUUID = service_uuid.substring(0, 7);
        let suffixUUID = service_uuid.substring(8, 36);
        let uuid = prefixUUID + num + suffixUUID;
        return uuid;

    }

    /*
@Method : serviceUUID
@Params :
@Returns : *
*/
    serviceUUID(service_uuid) {
        return this.createUUID(service_uuid, "0");
    }


    /*
@Method : notifyUUID
@Params :
@Returns : *
*/
    notifyUUID(service_uuid) {
        return this.createUUID(service_uuid, "1");
    }

    /*
@Method : writeUUID
@Params :
@Returns : *
*/
    writeUUID(service_uuid) {
        return this.createUUID(service_uuid, "1");
    }

    /*
@Method : info
@Params :
@Returns : *
*/
    info(message) {
        this.setState({info: message})
    }

    /*
@Method : error
@Params :
@Returns : *
*/
    error(message) {
        this.props.bluetoothDiconnect({device_name:this.state.device_name});
        this.setState({info: "Reconnecting..."});
        this.reconnectBle();
    }

    /*
@Method : reconnect
@Params :
@Returns : *
*/
    reconnect()
    {
        this.manager = new BleManager()
        this.setState({info: "Reconnecting..."});
        const subscription = this.manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                this.scanAndConnect();
                subscription.remove();
            }
            else
            {
                this.info("Please wait..");
                this.setState({tank_name:""});
                subscription.remove();
                this.reconnect();


                if (state === 'Unknown')
                {
                    this.info("Please wait..");
                    this.setState({tank_name:""});
                    subscription.remove();
                    this.reconnect();


                }
                else
                {
                    this.info("Please turn on bluetooth");
                    this.setState({tank_name:""});
                    subscription.remove();
                    this.reconnect();

                }
            }
        }, true);
    }

    /*
@Method : getBatteryLevel
@Params :
@Returns : *
*/
    getBatteryLevel = (callback) => {
        NativeModules.BatteryStatus.getBatteryStatus(callback);
    }

    /*
@Method : convertToPersentage
@Params :
@Returns : *
*/
    convertToPersentage(device_height,tank_level)
    {
        let deviceHeightInCm = parseFloat(device_height) * 100;
        let remainingTank = deviceHeightInCm - parseFloat(tank_level);
        let persentage = (remainingTank/parseFloat(deviceHeightInCm)) * 100;
        persentage = parseFloat(persentage).toFixed(1);
        if((persentage % 1) == 0)
        {
            persentage = parseInt(persentage);
        }
        return persentage;
    }

    /*
@Method : b64EncodeUnicode
@Params :
@Returns : *
*/
    b64EncodeUnicode(str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return Base64.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
            function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
    }

    /*
@Method : b64DecodeUnicode
@Params :
@Returns : *
*/
    b64DecodeUnicode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(Base64.atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }


    /*
@Method : updateValue
@Params :
@Returns : *
*/
    updateValue(key, value, setting, uid) {
        value = this.b64DecodeUnicode(value);
        let blutoothDataTemp=value.split(",");
        if(blutoothDataTemp.length ==3)
        {
            let blutoothData = {TankLevel:blutoothDataTemp[0],TankLevelTemp:blutoothDataTemp[0],BatteryLevel:blutoothDataTemp[1],isPlugged:blutoothDataTemp[3]};

            if(Platform.OS === 'ios')
            {
                NativeModules.BatteryStatus.updateBatteryLevel((info) => {
                    let  batteryLevel = Math.ceil(info.level);
                    this.setState({isActive: true});
                    blutoothData.TankLevelTemp = parseFloat(blutoothData.TankLevel);
                    blutoothData.TankLevel = parseFloat(blutoothData.TankLevel);
                    let persentageWaterLevel = this.convertToPersentage(this.state.tank_height,blutoothData.TankLevel);
                    if(blutoothData.TankLevelTemp >=0 && blutoothData.TankLevelTemp <=30)
                    {
                        persentageWaterLevel =100;
                    }
                    if((persentageWaterLevel >= 0) && (persentageWaterLevel<=100))
                    {
                        if (setting) {
                            if (new Date(setting.from_date) <= new Date()) {
                                this.info("Connected")
                                this.setState({isActive: true})
                                this.props.updateDeviceDetailsByBlutooth({uid, tank_status: {percentage: parseFloat(persentageWaterLevel), time: Date.now()}});
                                this.props.addReading({repeat_duration:setting.repeat_duration,repeat:setting.repeat,mobile_battery_level:batteryLevel,device_battery_level:blutoothData.BatteryLevel,interval_in_minutes:setting.interval_in_minutes,alert_level:setting.alert_level_change,tank_reading:persentageWaterLevel,is_plugged:blutoothData.isPlugged,tank_height:this.state.tank_height,device_id:this.state.device_id,device_name:this.state.device_name})
                            }
                            else {
                                this.info(`your service will start from ${setting.from_date}`)

                            }
                        }
                        else {
                            this.info("Connected")
                            this.setState({isActive: true})
                            this.props.updateDeviceDetailsByBlutooth({uid, tank_status: {percentage: parseFloat(persentageWaterLevel), time: Date.now()}});
                            this.props.addReading({repeat_duration:"",repeat:false,mobile_battery_level:batteryLevel,device_battery_level:blutoothData.BatteryLevel,interval_in_minutes:60,alert_level:20,tank_reading:persentageWaterLevel,is_plugged:blutoothData.isPlugged,tank_height:this.state.tank_height,device_id:this.state.device_id,device_name:this.state.device_name})
                        }
                        this.setState({
                            tankStatus: parseFloat(persentageWaterLevel),
                            time: Date.now(),
                            batteryStatus: parseFloat(blutoothData.BatteryLevel),
                            mobileStatus: parseFloat(batteryLevel)
                        });
                    }

                });

            }
            else
            {
                this.getBatteryLevel((batteryLevel) => {
                    this.setState({isActive: true});
                    blutoothData.TankLevelTemp = parseFloat(blutoothData.TankLevel);
                    blutoothData.TankLevel = parseFloat(blutoothData.TankLevel);
                    let persentageWaterLevel = this.convertToPersentage(this.state.tank_height,blutoothData.TankLevel);
                    if(blutoothData.TankLevelTemp >=0 && blutoothData.TankLevelTemp <=30)
                    {
                        persentageWaterLevel =100;
                    }
                    if((persentageWaterLevel >= 0) && (persentageWaterLevel<=100))
                    {
                        if (setting) {
                            if (new Date(setting.from_date) <= new Date()) {
                                this.info("Connected")
                                this.setState({isActive: true})
                                this.props.updateDeviceDetailsByBlutooth({uid, tank_status: {percentage: parseFloat(persentageWaterLevel), time: Date.now()}});
                                this.props.addReading({repeat_duration:setting.repeat_duration,repeat:setting.repeat,mobile_battery_level:batteryLevel,device_battery_level:blutoothData.BatteryLevel,interval_in_minutes:setting.interval_in_minutes,alert_level:setting.alert_level_change,tank_reading:persentageWaterLevel,is_plugged:blutoothData.isPlugged,tank_height:this.state.tank_height,device_id:this.state.device_id,device_name:this.state.device_name})
                            }
                            else {
                                this.info(`your service will start from ${setting.from_date}`)

                            }
                        }
                        else {
                            this.info("Connected")
                            this.setState({isActive: true})
                            this.props.updateDeviceDetailsByBlutooth({uid, tank_status: {percentage: parseFloat(persentageWaterLevel), time: Date.now()}});
                            this.props.addReading({repeat_duration:"",repeat:false,mobile_battery_level:batteryLevel,device_battery_level:blutoothData.BatteryLevel,interval_in_minutes:60,alert_level:20,tank_reading:persentageWaterLevel,is_plugged:blutoothData.isPlugged,tank_height:this.state.tank_height,device_id:this.state.device_id,device_name:this.state.device_name})
                        }
                        this.setState({
                            tankStatus: parseFloat(persentageWaterLevel),
                            time: Date.now(),
                            batteryStatus: parseFloat(blutoothData.BatteryLevel),
                            mobileStatus: parseFloat(batteryLevel)
                        });
                    }

                });
            }
        }
        else
        {

        }
    }



    /*
@Method : componentWillMount
@Params :
@Returns : *
*/
    reconnectBle() {

        this.manager = new BleManager()
        this.manager.destroy();
        this.manager = new BleManager();

        const subscription = this.manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                this.scanAndConnect();
                subscription.remove();
            }
            else
            {
                if (state === 'PoweredOff')
                {
                    // this.props.bluetoothDiconnect({device_name:this.state.device_name});
                    this.info("Please turn on bluetooth");
                    this.setState({tank_name:""});

                }
            }
        }, true);

    }


    /*
@Method : componentWillMount
@Params :
@Returns : *
*/
    componentWillMount() {

        this.manager = new BleManager();
        this.manager.destroy();
        this.manager = new BleManager();

        if(Platform.OS === 'ios') {
            NativeModules.BatteryStatus.updateBatteryLevel((info) => {
                let batteryLevel = Math.ceil(info.level);
                this.props.getDevicesForBluetoothForShowHistory((dataDevice)=>{
                    if(dataDevice){
                        _.map(dataDevice, (data, uid) => {
                            this.setState({
                                device_id:data.device_id,
                                tank_name:data.device_name,
                                device_name:data.device_name,
                                tank_height:data.tank_height,
                                tankStatus: parseFloat(data.tank_reading),
                                time: data.created_at,
                                batteryStatus: parseFloat(data.device_battery_level),
                                mobileStatus: parseFloat(batteryLevel)
                            });
                        })
                    }
                    this.props.getDevicesForBluetooth(() => {
                        this.setState({isLoading: false});
                    });

                });
            });
        }
        else{
            this.getBatteryLevel((batteryLevel) => {
            this.props.getDevicesForBluetoothForShowHistory((dataDevice)=>{
                if(dataDevice){
                    _.map(dataDevice, (data, uid) => {
                        this.setState({
                            device_id:data.device_id,
                            tank_name:data.device_name,
                            device_name:data.device_name,
                            tank_height:data.tank_height,
                            tankStatus: parseFloat(data.tank_reading),
                            time: data.created_at,
                            batteryStatus: parseFloat(data.device_battery_level),
                            mobileStatus: parseFloat(batteryLevel)
                        });
                    })
                }
                this.props.getDevicesForBluetooth(() => {
                    this.setState({isLoading: false});
                });

            });
            })
        }


            const subscription = this.manager.onStateChange((state) => {
                if (state === 'PoweredOn') {
                    this.scanAndConnect();
                    subscription.remove();

                }
                else
                {
                    if (state === 'PoweredOff')
                    {
                        // this.props.bluetoothDiconnect({device_name:this.state.device_name});
                        this.info("Please turn on bluetooth");
                        this.setState({tank_name:""});

                    }
                }
            }, true);

    }

    /*
@Method : connectWithBlutooth
@Params :
@Returns : *
*/
    connectWithBlutooth() {
        this.manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                this.info("Please wait...")
                this.scanAndConnect()
            }
            else if (state === 'PoweredOff') {
                this.info("blutooth disconnected...");
            }
        })
    }

    /*
@Method : scanAndConnect
@Params :
@Returns : *
*/
    scanAndConnect() {
        if (this.props.deviceData.length > 0) {

            this.manager.startDeviceScan(null,
                null, (error, device) => {
                    this.info("Scanning...")
                    console.log(device);

                    if (error) {
                        this.error(error.message)
                        return
                    }
                    if (device.name && device.serviceUUIDs != null && device.serviceUUIDs.length > 0) {
                        console.log(device);
                        let deviceserviceUUIDs = device.serviceUUIDs[0];
                        let deviceDetails = device;
                        this.info("Connecting to TI Sensor")
                        this.manager.stopDeviceScan()
                        _.map(this.props.deviceData, (val, i) => {
                            const {device_id, tank_name, tank_status,tank_height,device_id_iphone} = val;
                            let setting = "";
                            if (val.settings) {
                                setting = val.settings;
                                let deviceIdTemp = device.name;
                                deviceIdTemp = deviceIdTemp.toString().match(/.{2}/g).join(':');

                                if ((device_id == deviceIdTemp)) {
                                    device.connect()
                                        .then((device) => {
                                            console.log(device)
                                            this.info("Discovering services and characteristics");
                                            return device.discoverAllServicesAndCharacteristics()
                                        })
                                        .then((device) => {
                                            this.props.OndeviceIdForConnection(device.id);
                                            this.info("device connected")
                                            this.setState({tank_name:tank_name,tank_height:tank_height,device_id:device_id,device_name:tank_name});
                                            return this.setupNotifications(deviceDetails, deviceserviceUUIDs, setting, val.uid)
                                        })
                                        .then(() => {
                                            this.setState({isActive: true});
                                            this.info("Listening...")
                                        }, (error) => {
                                            this.error(error.message)
                                        })
                                }
                                else {
                                    if (i == this.props.deviceData.length - 1) {
                                        if (device.name === 'SIPL_BLE') {
                                            this.info(`Unable to connect,Please add device( ${deviceIdTemp} ) first `);

                                        }
                                    }
                                }
                            }
                            else
                            {
                                Actions.ReminderSetting();
                            }
                        });
                    }

                });
        }
        else {

            this.info("Your device has not been registered in the app.Please purchase device and registered it or visit our website www.qatrah.com to purchase.");

        }
    }

    /*
@Method : formatAMPM
@Params :
@Returns : *
*/
    formatAMPM(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
        return strTime;
    }

    async setupNotifications(device, serviceUUId, setting, uid) {
        let writeSettingData = {"sv":1};
        if(setting)
        {
            let tempInterval = ((parseFloat(setting.interval_in_minutes) * 60)/8);
            tempInterval = parseInt(tempInterval);
            writeSettingData = {"sv":tempInterval};
        }
        else
        {
            let tempInterval = ((1 * 60)/8);
            tempInterval = parseInt(tempInterval);
            writeSettingData = {"sv":tempInterval};
        }
        writeSettingData = JSON.stringify(writeSettingData);
        writeSettingData = this.b64EncodeUnicode(writeSettingData);

        const service = this.serviceUUID(serviceUUId)
        const characteristicW = this.writeUUID(serviceUUId)
        const characteristicN = this.notifyUUID(serviceUUId)
        const characteristic = await device.writeCharacteristicWithResponseForService(
            serviceUUId, characteristicW, writeSettingData
        )
        console.log("writedata  " +writeSettingData)

        device.monitorCharacteristicForService(serviceUUId, characteristicN, (error, characteristic) => {
            if (error) {
                this.error(error.message)
                return
            }
            console.log(characteristic);
            this.updateValue(characteristic.uuid, characteristic.value, setting, uid)
        })

    }

    /*
@Method : convertNumberToDetcimal
@Params :
@Returns : *
*/
    convertNumberToDetcimal(number) {
        if (parseFloat(number)) {
            let numberTemp = parseFloat(number) / 100;
            return numberTemp;
        }
        else {
            let numberTemp = 0;
            return numberTemp;
        }

    }

    /*
         @Method : renderProgressBar
         @Params :
         @Returns : *
         */
    renderProgressBar() {
        if (this.state.tank_name) {
            return (
                <Grid>
                    <Col style={styles.listItemStyle}>
                        <Card style={styles.progressStyle}>
                            <Row>
                                <Text style={{color: 'black', fontSize: 15}}>Tank Status(%)</Text>
                            </Row>
                            <Row>
                                <CardItem>
                                    <Progress.Circle textStyle={styles.progressBardTextStyle}
                                                     borderColor={styles.progressBarBorderColor}
                                                     color={styles.progressBarBorderColor} formatText={() => {
                                        return `${this.state.tankStatus}%`
                                    }} progress={this.convertNumberToDetcimal(this.state.tankStatus)} showsText={true}
                                                     size={100}/>
                                </CardItem>
                            </Row>
                            <Row>
                                <Text style={styles.textStyle}>{this.state.tank_name}</Text>
                            </Row>
                            <Row>
                                <Text note>{this.state.tankStatus}% Full </Text>
                            </Row>
                            <Row>
                                <Text note>at {this.formatAMPM(new Date(this.state.time))}</Text>
                            </Row>
                        </Card>
                    </Col>
                </Grid>
            )
        }
        else {
            {/*<Content style={{paddingTop:20,justifyContent:'center',alignItems: 'center'}}>*/}

            return(
                <Content style={centerAlign} >
                <Text>No device Found</Text>
                </Content>
            )

        }
    }

    /*
     @Method : renderBatteryStatus
     @Params :
     @Returns : *
     */
    renderBatteryStatus() {
        if (this.state.tank_name) {
            return (
                <Grid>
                    <Col style={styles.listItemStyle}>
                        <Card style={styles.progressStyle}>
                            <Row>
                                <Text style={{color: 'black', fontSize: 10}}>Device Battery Status(%)</Text>
                            </Row>
                            <Row>
                                <CardItem>
                                    <Progress.Bar textStyle={styles.progressBardTextStyle}
                                                  borderColor={styles.progressBarBorderColor}
                                                  color={styles.progressBarBorderColor} formatText={() => {
                                        return `${this.state.batteryStatus}%`
                                    }} progress={this.convertNumberToDetcimal(this.state.batteryStatus)}
                                                  showsText={true}
                                                  size={100}/>
                                </CardItem>
                            </Row>
                            <Row>
                                <Text note>{this.state.batteryStatus}% Full </Text>
                            </Row>
                        </Card>
                    </Col>
                </Grid>
            )
        }
    }

    /*
 @Method : renderMobileBatteryStatus
 @Params :
 @Returns : *
 */
    renderMobileBatteryStatus() {
        if (this.state.tank_name) {
            return (
                <Grid>
                    <Col style={styles.listItemStyle}>
                        <Card style={styles.progressStyle}>
                            <Row>
                                <Text style={{color: 'black', fontSize: 15}}>Mobile Battery Status(%)</Text>
                            </Row>
                            <Row>
                                <CardItem>
                                    <Progress.Bar textStyle={styles.progressBardTextStyle}
                                                  borderColor={styles.progressBarBorderColor}
                                                  color={styles.progressBarBorderColor} formatText={() => {
                                        return `${this.state.mobileStatus}%`
                                    }} progress={this.convertNumberToDetcimal(this.state.mobileStatus)} showsText={true}
                                                  size={100}/>
                                </CardItem>
                            </Row>
                            <Row>
                                <Text note>{this.state.mobileStatus}% Full </Text>
                            </Row>
                        </Card>
                    </Col>
                </Grid>
            )
        }
    }

    /*
        @Method : renderConnectionState
        @Params :
        @Returns : *
        */
    renderConnectionState() {
        if (this.state.isActive) {
            return (
                <View style={styles.headerStyle} header>
                    <Text style={{color: 'green', fontSize: 20}}>Connection state : {this.state.info}</Text>
                </View>
            );
        }
        else {
            return (
                <View style={styles.headerStyle} header>
                    <Text style={{color: 'black', fontSize: 20}}>Connection state : {this.state.info}</Text>
                </View>
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
            <View>
                {this.renderConnectionState()}
            </View>
        );
    }

    /*
@Method : renderHeader
@Params :
@Returns : *
*/
    renderHeader() {
        return (
            <HeaderComponent label="Bluetooth"  isBleActive={true}   isSettingActive={false}/>
        )
    }

    /*
@Method : render
@Params :
@Returns : *
*/

    render() {
        if (this.state.isLoading) {
            return (
                <Spinner size="large"/>
            )
        }
        else {
            if(this.state.isActive)
            {
                return (
                    <Container style={styles.containerBackgroundColor}>
                        <Content bounces={false} padder>
                            {this.renderContent()}
                            {this.renderProgressBar()}
                            {this.renderBatteryStatus()}
                            {this.renderMobileBatteryStatus()}
                        </Content>
                    </Container>
                );
            }
            else
            {
                return (
                    <Container style={styles.containerBackgroundColor}>
                        {this.renderHeader()}
                        <Content bounces={false} padder>
                            {this.renderContent()}
                            {this.renderProgressBar()}
                            {this.renderBatteryStatus()}
                            {this.renderMobileBatteryStatus()}
                        </Content>
                    </Container>
                );
            }

        }

    };
}


const styles = {
    containerBackgroundColor: {
        backgroundColor: '#fbfbfe'
    },
    containerBackgroundColorWithoutHeader: {
        backgroundColor: '#fbfbfe',
        paddingTop: 20
    },
    customHeaderStyle: {
        backgroundColor: 'transparent',
        elevation: 0
    },
    headerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    titleStyle: {
        fontSize: 18,
        paddingLeft: 15
    },
    listItemStyle: {
        borderWidth: 8,
        borderColor: 'transparent'

    },
    progressBardTextStyle:
        {
            color: '#2eb9f9'
        },
    textStyle: {
        color: '#000'
    },
    progressStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        paddingBottom: 10
    },
    progressLinkIcon: {
        color: "#2eb9f9",
        fontSize: 22
    },
    progressBarBorderColor: '#2eb9f9',
}
const mapStateToProps = ({device, setting}) => {
    const {device_id,loading,deviceIdForConnection} = device;
    const {title, from_date, to_date, interval_in_minutes, repeat_duration, error, alert_level_change, repeat, userId} = setting;
    let device_name = device.device_name;
    let tank_name = device.tank_name;

    if(device_name){
        device_name =  device_name.trim();
    }

    if(tank_name){
        tank_name =  tank_name.trim();
    }
    let deviceData = [];
    if (device.deviceData) {
        deviceData = [];
        _.map(device.deviceData, (val, uid) => {
            val.uid = uid;
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
    return {device_id, loading, deviceData, device_name, tank_name, title, from_date, to_date, interval_in_minutes, repeat_duration, error, alert_level_change, repeat,userId,deviceIdForConnection};

};

export default connect(mapStateToProps, {
    addReading,
    OndeviceIdForConnection,
    bluetoothDiconnect,
    updateDeviceDetailsByBlutooth,
    getDevicesForBluetooth,
    getHistory,
    resetDeviceDetails,
    onDeviceIdChanged,
    getUserDetailsForSettingsForBluetooth,
    getDevicesForBluetoothForShowHistory
})(BluetoothComponents);
