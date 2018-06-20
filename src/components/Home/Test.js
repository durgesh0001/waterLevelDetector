import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Picker,Item,CardItem,Content,Text,Form} from 'native-base';
import {HeaderComponent,Button, CardView, Input,Number, Spinner,EmailInput} from "../common";
import {SideNavigationBar} from '../SideMenu';
import {ScrollView} from 'react-native';
import {onDeviceIdChanged,onDeviceNameChanged,onTankNameChanged,onTankLocationChanged,onTankHeightChanged,onTankWidthChanged,onTankDepthChanged,addDevice,onTankTypeChanged} from '../../actions';
import _ from 'lodash';
import {Bar} from 'react-native-pathjs-charts';
class ViewDevice extends Component {
    state = {menuActive: false};
    /*
  @Method : renderContent
  @Params :
  @Returns : *
  */
    renderContent() {
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

        return (
            <CardView>
                <Bar data={data} options={options} accessorKey='v'/>
            </CardView>

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
@Method : renderFilter
@Params :
@Returns : *
*/
    renderFilter()
    {
        return(
            <Content>
                <Grid>
                    <Col >
                        <Row>
                            <CardSection value={this.props.tank_type} isSubmitted={this.state.isSubmitted}>
                                <Content>
                                    <View style={{ marginLeft:5 ,marginRight:10}}>
                                        <Picker  selectedValue={this.props.tank_type}
                                                 onValueChange={this.onTankTypeChanged.bind(this)} value={this.props.tank_type}
                                                 mode="dropdown">
                                            <Picker.Item value="" label="Select Tank Type"/>
                                            <Picker.Item value="vertical" label="Vertical Cylinder"/>
                                            <Picker.Item value="horizontal" label="Horizontal Cylinder"/>
                                            <Picker.Item value="horizontal_capsule" label="Horizontal Capsule Cylinder"/>
                                        </Picker>
                                    </View>
                                </Content>
                            </CardSection>
                        </Row>

                    </Col>
                    <Col >
                        <Row>
                            <DatePickerInput  placeholder="To Date" label="To Date" iconName="calendar"
                                              onDateChange={this.OnToDateChanged.bind(this)} value={this.props.to_date}
                                              isSubmitted={this.state.isSubmitted}/>
                        </Row>
                    </Col>
                </Grid>
            </Content>
        )
    };

    /*
@Method : render
@Params :
@Returns : *
*/

    render() {

        return (
            <Container style={styles.containerBackgroundColor}>
                <HeaderComponent label="Device Details" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false}/>
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
    }
}
export default ViewDevice;