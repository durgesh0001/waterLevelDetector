import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Picker,Item,CardItem,Content,Text,Form} from 'native-base';
import {HeaderComponent,Button,Icon, CardView, Input,Number, Spinner,EmailInput,CardSection} from "../common";
import {SideNavigationBar} from '../SideMenu';
import {ScrollView,View} from 'react-native';
import {getDevicesByDeviceId,onDeviceIdChanged,onDeviceNameChanged,onTankNameChanged,onTankLocationChanged,onTankHeightChanged,onTankWidthChanged,onTankDepthChanged,updateDeviceDetails,onTankTypeChanged} from '../../actions';
import _ from 'lodash';
import {Grid,Col,Row} from 'react-native-easy-grid';
import {Actions} from 'react-native-router-flux';
import {inputShadow} from '../../actions';



class EditDeviceComponent extends Component {
    state = {menuActive: false,isSubmitted:false};

    componentWillMount()
    {
        this.props.getDevicesByDeviceId(this.props.deviceId);

    }
    /*
 @Method : onButtonPress
 @Params :
 @Returns : *
 */
    onButtonPress() {
        this.setState({isSubmitted: true})
        const {uid,device_id, device_name,tank_name,tank_location,tank_height,tank_width,tank_depth,tank_type} = this.props;
        if(this.props.tank_type == 'horizontal_capsule')
        {
            if (device_id && device_name && tank_name && tank_location && tank_height && tank_width && tank_depth) {
                this.props.updateDeviceDetails({uid,device_id, device_name,tank_name,tank_location,tank_height,tank_width,tank_depth,tank_type});
            }
        }
        else
        {
            if (device_id && device_name && tank_name && tank_location && tank_height && tank_width) {
                this.props.updateDeviceDetails({uid,device_id, device_name,tank_name,tank_location,tank_height,tank_width,tank_depth:"",tank_type});
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
        this.props.onDeviceNameChanged(text);
        this.props.onTankNameChanged(text);
    }


    /*
@Method : onTankLocationChanged
@Params :
@Returns : *
*/
    onTankLocationChanged(text) {
        this.props.onTankLocationChanged(text);
    }

    /*
@Method : onTankHeightChanged
@Params :
@Returns : *
*/
    onTankHeightChanged(text) {
        this.props.onTankHeightChanged(text);
    }

    /*
@Method : onTankWidthChanged
@Params :
@Returns : *
*/
    onTankWidthChanged(text) {
        this.props.onTankWidthChanged(text);
    }

    /*
@Method : onTankDepthChanged
@Params :
@Returns : *
*/
    onTankDepthChanged(text) {
        this.props.onTankDepthChanged(text);
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
                        <Number placeholder="Depth" label="Depth"
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
                    Edit
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

                <Form>
                    <CardItem>
                        <Input isDisabled={true} placeholder="Device Id" label="Device Id" iconName="md-tablet-portrait"
                                onChangeText={this.onDeviceIdChanged.bind(this)} value={this.props.device_id}
                                isSubmitted={this.state.isSubmitted}/>
                    </CardItem>
                    <CardItem>
                        <Input placeholder="Device Name" label="Device Name" iconName="md-pint"
                               onChangeText={this.onDeviceNameChanged.bind(this)} value={this.props.device_name}
                               isSubmitted={this.state.isSubmitted}/>
                    </CardItem>
                    <CardItem>
                        <Input   placeholder="Tank Location" label="Tank Location"  iconName="md-pin"
                                 onChangeText={this.onTankLocationChanged.bind(this)} value={this.props.tank_location}
                                 isSubmitted={this.state.isSubmitted}/>
                    </CardItem>
                    <CardItem>
                        <CardSection value={this.props.tank_type} isSubmitted={this.state.isSubmitted}>
                            <Content>
                                <View style={{ marginLeft:5 ,marginRight:10}}>
                                    <Picker  selectedValue={this.props.tank_type}
                                             onValueChange={this.onTankTypeChanged.bind(this)} value={this.props.tank_type}
                                             mode="dropdown" style={inputShadow}>
                                        <Picker.Item value="" label="Select Tank Type"/>
                                        <Picker.Item value="vertical" label="Vertical Cylinder"/>
                                        <Picker.Item value="horizontal" label="Horizontal Cylinder"/>
                                        <Picker.Item value="horizontal_capsule" label="Horizontal Capsule Cylinder"/>
                                    </Picker>
                                </View>
                            </Content>
                        </CardSection>
                    </CardItem>
                    <CardItem>
                        <Grid>
                            <Col style={{paddingRight:7}}>
                                    <Number placeholder="Height" label="Height"
                                            onChangeText={this.onTankHeightChanged.bind(this)} value={this.props.tank_height}
                                            isSubmitted={this.state.isSubmitted}/>
                            </Col>
                            <Col style={{paddingLeft:7}}>
                                    <Number placeholder="Width" label="Width"
                                            onChangeText={this.onTankWidthChanged.bind(this)} value={this.props.tank_width}
                                            isSubmitted={this.state.isSubmitted}/>

                            </Col>
                            {this.renderDepth()}
                        </Grid>
                    </CardItem>
                    <CardItem>
                        <Text note style={{textAlign:'center'}}>Tank Capacity:(Computed by system in ltr)</Text>
                    </CardItem>

                    <CardItem>
                        {this.renderAction()}
                    </CardItem>
                </Form>

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
                <HeaderComponent label="Device Details" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={true}/>
                <Content >
                    {this.renderContent()}
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
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
}
const mapStateToProps = ({device}) => {
    const {uid,device_id, device_name,tank_name,tank_location,loading,tank_height,tank_width,tank_depth,tank_type} = device;
    return {uid,device_id, device_name,tank_name,tank_location,loading,tank_height,tank_width,tank_depth,tank_type};

};

export default connect(mapStateToProps, {getDevicesByDeviceId,onDeviceIdChanged,onDeviceNameChanged,onTankNameChanged,onTankLocationChanged,onTankHeightChanged,onTankWidthChanged,onTankDepthChanged,updateDeviceDetails,onTankTypeChanged})(EditDeviceComponent);
