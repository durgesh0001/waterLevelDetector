import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Picker,Item,CardItem,Content,Text,Form,Icon,Header,Title} from 'native-base';
import {HeaderComponent,Button,ButtonDelete,CardView, Input,Number, Spinner,EmailInput,CardSection} from "../common";
import {SideNavigationBar} from '../SideMenu';
import {ScrollView,View,Platform,Alert,Image} from 'react-native';
import {getDevicesByDeviceId,onDeviceIdChanged,onDeviceNameChanged,onTankNameChanged,onTankLocationChanged,onTankHeightChanged,onTankWidthChanged,onTankDepthChanged,updateDeviceDetails,onTankTypeChanged,onTankCityChanged,onTankAreaChanged,getCity,getArea,deleteDeviceDetails,onTankContryChanged,getCountry} from '../../actions';
import _ from 'lodash';
import {Grid,Col,Row} from 'react-native-easy-grid';
import {Actions} from 'react-native-router-flux';
import {inputShadow} from '../../actions';
import {formStyle, dropdownPickerForDevice} from '../../actions/style';
import {showToast} from '../../actions/types';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


class EditDeviceComponent extends Component {
    state = {menuActive: false,isSubmitted:false,location:"",is_location_active:false};

    componentWillMount()
    {
        if(this.props.deviceId)
        {
            this.props.getDevicesByDeviceId(this.props.deviceId);
            this.props.getCountry();
        }

        if(this.props.tankCityId)
        {

            this.props.getArea(this.props.tankCityId);
        }
        if(this.props.tankCountryId)
        {
            this.props.getCity(this.props.tankCountryId);
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
        const {tank_country,uid,device_id, device_name,tank_name,tank_location,tank_height,tank_width,tank_depth,tank_type,tank_city,tank_area} = this.props;
        if(!(device_name))
        {
            showToast('danger',"Device Name is not valid");


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
            if (tank_country && device_id && device_name && tank_name && tank_location && tank_height && tank_width && tank_city && tank_area && tank_city && tank_area) {
                    this.props.updateDeviceDetails({tank_country,uid,device_id, device_name,tank_name,tank_location,tank_height,tank_width,tank_depth:"",tank_type,tank_city,tank_area});
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
@Method : validateNumber
@Params :
@Returns : *
*/
    validateText(text) {

        return text;
    }


    /*
@Method : renderAreaData
@Params :
@Returns : *
*/
    renderAreaData() {
        return (
            <Item   rounded  style={{borderColor:"#fff",height:54}}>
                <Picker headerBackButtonTextStyle={{ paddingTop:10 }} headerBackButtonText={this.renderBackButton()} placeholder="Select Area" selectedValue={this.props.tank_area} onValueChange={this.onTankAreaChanged.bind(this)} value={this.props.tank_area} mode="dropdown" style={dropdownPickerForDevice} >

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
                <Picker headerBackButtonTextStyle={{ paddingTop:10 }} headerBackButtonText={this.renderBackButton()}  placeholder="Select City" selectedValue={this.props.tank_city}
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
@Method : validateAddress
@Params :
@Returns : *
*/
    validateAddress(text) {

        return text;
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
@Method : onTankLocationChanged
@Params :
@Returns : *
*/
    onTankLocationChanged(text) {
        this.props.onTankLocationChanged(this.validateAddress(text));
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
@Method : onTankContryChanged
@Params :
@Returns : *
*/
    onTankContryChanged(id) {
        this.props.onTankContryChanged(id);
        this.props.getCity(id);
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
                        <Number placeholder="Depth(Mtr)" label="Depth(Mtr)"
                                onChangeText={this.onTankDepthChanged.bind(this)} value={this.props.tank_width}
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
                    Edit
                </Button>
            );
        }
    }

    /*
@Method : renderActionDelete
@Params :
@Returns : *
*/
    renderActionDelete() {
            return (
                <ButtonDelete  onPress={this.onButtonPressDelete.bind(this)}>
                    Delete
                </ButtonDelete>
            );

    }


    /*
@Method : onButtonPressDelete
@Params :
@Returns : *
*/
    onButtonPressDelete() {
        const {uid,master_id} = this.props;
        if((master_id) || (master_id != undefined))
        {
            Alert.alert(
                'Confirm',
                'Are you sure,you want to delete this device ?',
                [
                    {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'Yes', onPress: () => {
                        this.props.deleteDeviceDetails({uid,master_id});
                    }},
                ],
                { cancelable: false }
            );
        }
        else
        {
            Alert.alert(
                'Confirm',
                'Are you sure,you want to delete this device ?',
                [
                    {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'Yes', onPress: () => {
                        this.props.deleteDeviceDetails({uid,master_id:""});
                    }},
                ],
                { cancelable: false }
            );
        }


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
@Method : onSideMenuChange
@Params :
@Returns : *
*/
    onSideMenuChange() {
        this.setState({menuActive: true});
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
     @Method : renderContent
     @Params :
     @Returns : *
     */
    renderContent() {
        return (

                <Form style={formStyle}>
                    <View style={formStyle.formInputs}>
                        <Input isShadow={true} isDisabled={true}  placeholder="Device Id" label="Device Id" iconName="md-tablet-portrait"
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
                                    elevation: 3,
                                    marginBottom:3,
                                    shadowOpacity: 0.3,
                                    borderBottomWidth:0.3,
                                    borderTopWidth:0.3,
                                    height:50
                                },
                                textInput: {
                                    color: '#949dac',
                                    fontSize: 14,
                                    height:30
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
                                    <Picker   headerBackButtonTextStyle={{ paddingTop:10 }} headerBackButtonText={this.renderBackButton()}   selectedValue={this.props.tank_type} onValueChange={this.onTankTypeChanged.bind(this)} value={this.props.tank_type}
                                       mode="dropdown" style={dropdownPickerForDevice}>
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
                        <Grid>
                            <Col style={{paddingRight:7}}>
                                    <Number placeholder="Height(Mtr)" label="Height(Mtr)"
                                            onChangeText={this.onTankHeightChanged.bind(this)} value={this.props.tank_height}
                                            isSubmitted={this.state.isSubmitted}/>
                            </Col>
                            <Col style={{paddingLeft:7}}>
                                    <Number placeholder="Width(Mtr)" label="Width(Mtr)"
                                            onChangeText={this.onTankWidthChanged.bind(this)} value={this.props.tank_width}
                                            isSubmitted={this.state.isSubmitted}/>

                            </Col>
                        </Grid>
                    </View>
                    <View>
                        {this.renderAction()}
                    </View>
                    <View style={{paddingTop:10}}>
                        {this.renderActionDelete()}
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
                    <HeaderComponent isHeight={true} label="Device Details" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={true}/>
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
    
}
const mapStateToProps = ({device}) => {
    const {master_id,tank_city,tank_area,city,area,uid,device_id, device_name,tank_name,tank_location,loading,tank_height,tank_width,tank_depth,tank_type,country,tank_country} = device;

    return {master_id,tank_city,tank_area,city,area,uid,device_id, device_name,tank_name,tank_location,loading,tank_height,tank_width,tank_depth,tank_type,country,tank_country};
};

export default connect(mapStateToProps, {getDevicesByDeviceId,onDeviceIdChanged,onDeviceNameChanged,onTankNameChanged,onTankLocationChanged,onTankHeightChanged,onTankWidthChanged,onTankDepthChanged,updateDeviceDetails,onTankTypeChanged,onTankCityChanged,onTankAreaChanged,getCity,getArea,deleteDeviceDetails,onTankContryChanged,getCountry})(EditDeviceComponent);
