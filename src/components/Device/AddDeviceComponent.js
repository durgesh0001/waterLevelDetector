import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Picker,Item,CardItem,Content,Text,Form,Icon} from 'native-base';
import {HeaderComponent,Button, CardView, Input,Number, Spinner,EmailInput,CardSection} from "../common";
import {SideNavigationBar} from '../SideMenu';
import {ScrollView,View,Alert,Platform,Image} from 'react-native';
import {resetDeviceDetails,onDeviceIdChanged,onDeviceNameChanged,onTankNameChanged,onTankLocationChanged,onTankHeightChanged,onTankWidthChanged,onTankDepthChanged,addDevice,onTankTypeChanged,onTankCityChanged,onTankAreaChanged,getCity,getArea,onTankContryChanged,getCountry} from '../../actions';
import _ from 'lodash';
import {Grid,Col,Row} from 'react-native-easy-grid';
import {inputShadow} from '../../actions';
import {formStyle, dropdownPickerForDevice,centerAlign} from '../../actions/style';
import {BLUETOOTH_DEVICE_NAME} from '../../actions/types';
import {BleManager} from 'react-native-ble-plx';
import firebase from 'firebase';
import {showToast} from '../../actions/types';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';







class AddDeviceComponent extends Component {
    state = {menuActive: false,isSubmitted:false,isQrActive:false,info:"Please wait....",isHeaderActive:false,isLoading:true, isSearchBluetoothActive:true,masterDeviceUid:""};

    constructor() {
        super();
        this.manager = new BleManager();

    }

    /*
@Method : validateNumber
@Params :
@Returns : *
*/
    validateText(text) {

        return text;
    }

    /*
@Method : validateAddress
@Params :
@Returns : *
*/
    validateAddress(text) {
        return text;
    }


    /*
@Method : info
@Params :
@Returns : *
*/
    info(message) {
        //showToast('success',message);
        this.setState({info:message});
    }

    /*
@Method : error
@Params :
@Returns : *
*/
    error(message) {
       // showToast('danger',message);
        this.setState({info:message});
    }


    componentWillMount()
    {
        // this.setState({isLoading: false});
        // this.setState({isHeaderActive:true,isSearchBluetoothActive:false});


        this.getDevices();
        this.props.getCountry();
        this.props.resetDeviceDetails();
        if(this.props.deviceId)
        {
            this.onDeviceIdChanged(this.props.deviceId);
        }



    }

    /*
@Method : getDevices
@Params :
@Returns : *
*/
    getDevices()
    {
        const subscription = this.manager.onStateChange((state) => {
            if (state === 'PoweredOn') {
                this.scanAndConnect();
                subscription.remove();
            }
            else
            {
                    this.error("Please turn on bluetooth");
                    this.setState({isHeaderActive:true});
                    this.setState({isLoading: false});
            }
        }, true);
    }


    /*
@Method : scanAndConnect
@Params :
@Returns : *
*/
    scanAndConnect() {
             this.info("Scanning devices...");
        setTimeout(function() {

            this.setState({isLoading: false});
            this.setState({info:"No Device Found"});
            this.manager.destroy();
            this.setState({isHeaderActive:true});

        }.bind(this), 20000);

        let scanDevicesTemp =[];
        this.manager.startDeviceScan(null,
            null, (error, device) => {
                if (error) {
                    this.error(error.message)
                    return
                }
                if (device.name && device.serviceUUIDs != null && device.serviceUUIDs.length > 0) {
                    if (Platform.OS === 'ios') {
                        let deviceId = device.name;
                        deviceId = deviceId.toString().match(/.{2}/g).join(':');

                        let ref = firebase.database().ref("/master_devices");
                        ref.orderByChild("device_id").equalTo(`${deviceId}`).once("value", snapshot => {
                            if(snapshot.val() == null)
                            {

                            }
                            else
                            {
                                _.map(snapshot.val(),(val,uid)=>{
                                    if((val.is_deleted == false) || (val.is_deleted == "false"))
                                    {
                                        this.info("Device Found Successfully");
                                        this.manager.stopDeviceScan();
                                        this.setState({isLoading: false});
                                        this.setState({isHeaderActive:true,isSearchBluetoothActive:false});
                                        this.onDeviceIdChanged(deviceId);
                                        this.setState({masterDeviceUid:uid});

                                    }
                                });
                            }

                        });


                    }
                    else
                    {
                        let ref = firebase.database().ref("/master_devices");
                        ref.orderByChild("device_id").equalTo(`${device.id}`).once("value", snapshot => {
                            if(snapshot.val() == null)
                            {

                            }
                            else
                            {
                                _.map(snapshot.val(),(val,uid)=>{
                                    if((val.is_deleted == false) || (val.is_deleted == "false"))
                                    {
                                        this.info("Device Found Successfully");
                                        this.manager.stopDeviceScan();
                                        this.setState({isLoading: false});
                                        this.setState({isHeaderActive:true,isSearchBluetoothActive:false});
                                        this.onDeviceIdChanged(device.id);
                                        this.setState({masterDeviceUid:uid});

                                    }
                                });
                            }

                        });

                    }

                }
            });
    }


    /*
@Method : renderTankImage
@Params :
@Returns : *
*/

    renderTankImage(){
        if(this.props.tank_type == 'vertical')
        {
            return (
                <Image source={require('../../images/water_level_app-2_april/tank_image/centre_align/tank_opt1.png')}  />
            );
        }
        else{
            return (
                <Image source={require('../../images/water_level_app-2_april/tank_image/centre_align/tank_opt2.png')}  />
            );

        }
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
        const {tank_country,device_id, device_name,tank_name,tank_location,tank_height,tank_width,tank_depth,tank_type,tank_city,tank_area} = this.props;
        let uid = this.state.masterDeviceUid;
        if(!(device_name))
        {
            showToast('danger',"Please add device name");

        }
        else if(!(tank_country))
        {
            showToast('danger',"Please select Country");

        }
        else if(!(tank_location))
        {
            showToast('danger',"Please add tank location");

        }
        else
        {
            if(this.props.tank_type == 'horizontal_capsule')
            {
                if (tank_country && device_id && device_name && tank_name && tank_location && tank_height && tank_width && tank_depth && uid && tank_city && tank_area) {
                    this.props.addDevice({tank_country,device_id, device_name,tank_name,tank_location,tank_height,tank_width,tank_depth,tank_type,uid,tank_city,tank_area});
                }
            }
            else
            {
                if (tank_country && device_id && device_name && tank_name && tank_location && tank_height && tank_width && uid && tank_city && tank_area) {
                    this.props.addDevice({tank_country,device_id, device_name,tank_name,tank_location,tank_height,tank_width,tank_depth,tank_type,uid,tank_city,tank_area});
                }
            }
        }

    }
    /*
@Method : onDeviceIdChanged
@Params :
@Returns : *
*/
    onDeviceIdChanged(text) {
        this.props.onDeviceIdChanged(text);
    }


    /*
@Method : onDeviceNameChanged
@Params :
@Returns : *
*/
    onDeviceNameChanged(text) {
        this.props.onDeviceNameChanged(this.validateText(text));
        this.props.onTankNameChanged(text);
    }


    /*
@Method : onTankLocationChanged
@Params :
@Returns : *
*/
    onTankLocationChanged(text) {
        this.props.onTankLocationChanged(this.validateAddress(text));
    }


    /*
@Method : validateNumber
@Params :
@Returns : *
*/
    validateNumber(text) {
        let newText = '';
        let numbers = '0123456789.';

        for (var i = 0; i < text.length; i++) {
            if ( numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
        }

        return newText;
    }
    /*
@Method : onTankHeightChanged
@Params :
@Returns : *
*/
    onTankHeightChanged(text) {
        this.props.onTankHeightChanged(this.validateNumber(text));
    }

    /*
@Method : onTankWidthChanged
@Params :
@Returns : *
*/
    onTankWidthChanged(text) {
        this.props.onTankWidthChanged(this.validateNumber(text));
    }

    /*
@Method : onTankDepthChanged
@Params :
@Returns : *
*/
    onTankDepthChanged(text) {
        this.props.onTankDepthChanged(this.validateNumber(text));
    }

    /*
@Method : onTankTypeChanged
@Params :
@Returns : *
*/
    onTankTypeChanged(text) {
        this.props.onTankTypeChanged(text);
    }

    /*
@Method : onTankCityChanged
@Params :
@Returns : *
*/
    onTankCityChanged(id) {
        this.props.onTankCityChanged(id);
        this.props.getArea(id);

    }

    /*
@Method : onTankAreaChanged
@Params :
@Returns : *
*/
    onTankAreaChanged(id) {
        this.props.onTankAreaChanged(id);
    }

    /*
@Method : renderDepth
@Params :
@Returns : *
*/
    renderDepth()
    {
        if(this.props.tank_type == 'horizontal_capsule')
        {
            return (
                <Col style={{paddingLeft:7}}>
                        <Number placeholder="Depth(Mtr)" label="Depth(Mtr)" maxLength={3}
                                    onChangeText={this.onTankDepthChanged.bind(this)} value={this.props.tank_depth}
                                    isSubmitted={this.state.isSubmitted}/>
                </Col>
            );
        }
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
@Method : renderDropDownIcon
@Params :
@Returns : *
*/
    renderDropDownIcon() {
        if (Platform.OS === 'ios') {
            return (
                <Icon  style={{color:"#b3c7f9"}} name='md-arrow-dropdown'/>

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
    renderAreaData() {
        return (
            <Item rounded style={{borderColor:"#fff",height:54}}>
                <Picker headerBackButtonTextStyle={{ paddingTop:10 }} headerBackButtonText={this.renderBackButton()}  selectedValue={this.props.tank_area} placeholder="Select Area"
                        onValueChange={this.onTankAreaChanged.bind(this)} value={this.props.tank_area}
                        mode="dropdown" style={dropdownPickerForDevice}>

                    {
                        _.map(this.props.area, (val, i) => {
                            return (
                                <Picker.Item value={val.id} label={val.name}/>
                            )
                        })
                    }
                </Picker>
                {this.renderDropDownIcon()}
            </Item>
        );

    }

    /*
@Method : onTankContryChanged
@Params :
@Returns : *
*/
    onTankContryChanged(id) {
        this.props.onTankContryChanged(id);
        this.props.getCity(id);
    }


    /*
@Method : renderCountryData
@Params :
@Returns : *
*/
    renderCountryData() {
        return (
            <Item rounded style={{borderColor:"#fff"}}>
                <Picker headerBackButtonTextStyle={{ paddingTop:10 }} headerBackButtonText={this.renderBackButton()}  placeholder="Select Country" selectedValue={this.props.tank_country}
                        onValueChange={this.onTankContryChanged.bind(this)} value={this.props.tank_country}
                        mode="dropdown" style={dropdownPickerForDevice}>

                    {
                        _.map(this.props.country, (val, i) => {
                            return (
                                <Picker.Item value={val.id} label={val.name}/>
                            )
                        })
                    }

                </Picker>
                {this.renderDropDownIcon()}
            </Item>
        );

    }


    /*
@Method : renderCityData
@Params :
@Returns : *
*/
    renderCityData() {
        return (
            <Item rounded style={{borderColor:"#fff"}}>
                <Picker headerBackButtonTextStyle={{ paddingTop:10 }} headerBackButtonText={this.renderBackButton()} selectedValue={this.props.tank_city} placeholder="Select City"
                        onValueChange={this.onTankCityChanged.bind(this)} value={this.props.tank_city}
                        mode="dropdown" style={dropdownPickerForDevice}>

                    {
                        _.map(this.props.city, (val, i) => {
                            return (
                                <Picker.Item value={val.id} label={val.name}/>
                            )
                        })
                    }

                </Picker>
                {this.renderDropDownIcon()}
            </Item>
        );

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
                <Form style={formStyle}>
                    <View style={formStyle.formInputs}>
                        <Input isDisabled={true} isShadow={true} placeholder="Device Id" isQrActive={this.state.isQrActive} label="Device Id" iconName="md-tablet-portrait"
                        onChangeText={this.onDeviceIdChanged.bind(this)} value={this.props.device_id}
                        isSubmitted={this.state.isSubmitted}/>
                    </View>
                    <View style={formStyle.formInputs}>
                        <Input placeholder="Device Name" label="Device Name" iconName="md-pint"
                        onChangeText={this.onDeviceNameChanged.bind(this)} value={this.props.device_name}
                        isSubmitted={this.state.isSubmitted}/>
                    </View>
                    <View style={formStyle.formInputs}>
                        <CardSection value={this.props.tank_country} isSubmitted={this.state.isSubmitted}>
                            {this.renderCountryData()}
                        </CardSection>
                    </View>
                    <View style={formStyle.formInputs}>
                        <CardSection value={this.props.tank_city} isSubmitted={this.state.isSubmitted}>
                                {this.renderCityData()}
                        </CardSection>
                    </View>
                    <View style={formStyle.formInputs}>
                        <CardSection value={this.props.tank_area} isSubmitted={this.state.isSubmitted}>
                                {this.renderAreaData()}
                        </CardSection>
                    </View>
                        <View style={formStyle.formInputs}>
                                <GooglePlacesAutocomplete
                                    placeholder='Search Location'
                                    minLength={2}
                                    autoFocus={false}
                                    returnKeyType={'search'}
                                    listViewDisplayed='false'    // true/false/undefined

                                    fetchDetails={true}
                                    renderDescription={row => row.description}
                                    onPress={(data, details = null) => {
                                        this.onTankLocationChanged(data.description)
                                    }}
                                    getDefaultValue={() => this.props.tank_location}

                                    query={{
                                        key: 'AIzaSyAiTCtvTSA9JGq0f6oPWVCtsocDi91bu6o',
                                        language: 'en'
                                    }}

                                    styles={{
                                        textInputContainer: {
                                            borderWidth:0,
                                            backgroundColor:'#fff',
                                            borderRadius:100,
                                            justifyContent:'flex-start',
                                            flexDirection:'row',
                                            borderColor:'#ddd',
                                            elevation: 2,
                                            marginBottom:3,
                                            shadowOpacity: 0.3,
                                            borderBottomWidth:0.3,
                                            borderTopWidth:0.3,
                                            height:50
                                        },
                                        textInput: {
                                            color: '#949dac',
                                            fontSize: 14
                                        },
                                        description: {
                                            fontWeight: 'bold'
                                        },
                                        predefinedPlacesDescription: {
                                            color: '#949dac'
                                        }
                                    }}
                                    nearbyPlacesAPI='GooglePlacesSearch'
                                    GoogleReverseGeocodingQuery={{
                                    }}
                                    GooglePlacesSearchQuery={{

                                    }}
                                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                                    debounce={200}

                                />
                    </View>
                    <View style={formStyle.formInputs}>
                        <CardSection value={this.props.tank_type} isSubmitted={this.state.isSubmitted}>
                               <Item rounded style={{borderColor:"#fff"}}>
                                    <Picker headerBackButtonTextStyle={{ paddingTop:10 }} headerBackButtonText={this.renderBackButton()} selectedValue={this.props.tank_type} onValueChange={this.onTankTypeChanged.bind(this)} value={this.props.tank_type} mode="dropdown" style={dropdownPickerForDevice}>
                                        <Picker.Item value="" label="Select Tank Type"/>
                                        <Picker.Item value="vertical" label="Vertical Cylinder"/>
                                        <Picker.Item value="horizontal" label="Horizontal Cylinder"/>
                                        <Picker.Item value="horizontal_capsule" label="Horizontal Capsule Cylinder"/>
                                    </Picker>
                                    {this.renderDropDownIcon()}
                                </Item>
                        </CardSection>
                    </View>
                    <View style={formStyle.formInputs}>
                        {this.renderTankImage()}
                    </View>
                    <View style={formStyle.formInputs}>
                        <Grid >
                            <Col style={{paddingRight:7}}>
                                <Number placeholder="Height(Mtr)" label="Height(Mtr)" maxLength={3}
                                onChangeText={this.onTankHeightChanged.bind(this)} value={this.props.tank_height}
                                isSubmitted={this.state.isSubmitted}/>
                            </Col>
                            <Col style={{paddingLeft:7}}>
                                <Number placeholder="Width(Mtr)" label="Width(Mtr)" maxLength={3}
                                onChangeText={this.onTankWidthChanged.bind(this)} value={this.props.tank_width}
                                isSubmitted={this.state.isSubmitted}/>
                            </Col>
                            {this.renderDepth()}
                        </Grid>
                    </View>
                    <View>
                        {this.renderAction()}
                    </View>
                </Form>
            );
        }


    /*
@Method : onBarCodeRead
@Params :
@Returns : *
*/
    onBarCodeRead(e) {
        console.log(
            "Barcode Found!",
            "Type: " + e.type + "\nData: " + e.data
        );
    }

    /*
@Method : renderLoader
@Params :
@Returns : *
*/
    renderLoader()
    {
        if(this.state.isLoading)
        {
            return(
                <Spinner size="large"/>
            )
        }
    }

    /*
@Method : renderData
@Params :
@Returns : *
*/

    renderData()
    {

        return (
            <Content bounces={false}  style={centerAlign}>
                <Text>{this.state.info}</Text>
            </Content>

        )

    }


    /*
@Method : renderHeader
@Params :
@Returns : *
*/

    renderHeader()
    {
        if(this.state.isHeaderActive)
        {
            return(
                <HeaderComponent isHeight={this.props.device_id != ''} label="Add Device" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false}/>
            )
        }

    }
    /*
@Method : render
@Params :
@Returns : *
*/

    render() {
         if(this.state.isSearchBluetoothActive)
         {
             return (
                 <Container style={styles.containerBackgroundColor}>
                     {this.renderHeader()}
                     {this.renderData()}
                     {this.renderLoader()}
                 </Container>
             );
         }
         else
         {
             return (
                 <Container style={styles.containerBackgroundColor}>
                     <HeaderComponent isHeight={true} label="Add Device" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false}/>
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
    },
    formStyle:{paddingLeft:15,
        paddingRight:15,
        formInputs:{
            marginBottom:15
        }
    }
}
const mapStateToProps = ({device}) => {
     const {tank_city,tank_area,city,area,device_id, device_name,tank_name,tank_location,loading,tank_height,tank_width,tank_depth,tank_type,country,tank_country} = device;
    return {tank_city,tank_area,city,area,device_id,device_name,tank_name,tank_location,loading,tank_height,tank_width,tank_depth,tank_type,country,tank_country};

};

export default connect(mapStateToProps, {resetDeviceDetails,onDeviceIdChanged,onDeviceNameChanged,onTankNameChanged,onTankLocationChanged,onTankHeightChanged,onTankWidthChanged,onTankDepthChanged,addDevice,onTankTypeChanged,onTankCityChanged,onTankAreaChanged,getCity,getArea,onTankContryChanged,getCountry})(AddDeviceComponent);
