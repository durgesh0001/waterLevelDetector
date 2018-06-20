import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Fab,Body,Input,Header,Icon,Content,Right,Text,Card,Button,CardItem,List,Item} from 'native-base';
import {HeaderComponent,Spinner} from '../common';
import {SideNavigationBar} from '../SideMenu';
import {getDevices,getSearchDeviceList} from '../../actions';
import ListItemView from './ListItem';
import {ListView,View,TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import _ from 'lodash';
import {Grid,Col,Row} from 'react-native-easy-grid';
import * as Progress from 'react-native-progress';






class Home extends Component {
    state = {menuActive: false,isSearchClicked:false};
    /*
@Method : componentWillMount
@Params :
@Returns : *
*/
    componentWillMount()
    {
        this.props.getDevices();
        this.createDataSource(this.props);
    }
    /*
@Method : componentWillReceiveProps
@Params :
@Returns : *
*/

    componentWillReceiveProps(nextProps)
    {

        this.createDataSource(nextProps);
    }
    /*
@Method : createDataSource
@Params :
@Returns : *
*/
    createDataSource({deviceData})
    {

        const ds = new ListView.DataSource({
            rowHasChanged:(r1,r2) => r1 !== r2
        });

        this.dataSource = ds.cloneWithRows(deviceData);
    }
    /*
@Method : renderRow
@Params :
@Returns : *
*/
    renderRow(device)
    {
        return (
            <ListItemView device={device}/>
        );


    }
    /*
@Method : filter
@Params :
@Returns : *
*/
    filter(text)
    {
        let filteredDevices = this.props.deviceData.filter(devices => {
            if(!(devices.tank_name == undefined))
            {
                return devices.tank_name.indexOf(text) > -1;
            }
            else
            {
                return {};
            }
        });
        this.props.getSearchDeviceList({"search":filteredDevices});


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
@Method : onChangeSearch
@Params :
@Returns : *
*/
    onChangeSearch(text)
    {
        if(text)
        {
            this.filter(text);

        }
        else
        {
            this.props.getDevices();
        }
    }

    /*
@Method : onRowPress
@Params :
@Returns : *
*/
    onRowPress(data) {
        if(data.device_id)
        {
            Actions.ViewDevice({deviceId:data.device_id});
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
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    /*
@Method : convertNumberToDetcimal
@Params :
@Returns : *
*/
    convertNumberToDetcimal(number)
    {
        let numberTemp = parseFloat(number)/100;
        return numberTemp;

    }

    /*
@Method : render
@Params :
@Returns : *
*/


    /*
    @Method : renderLastGridData
    @Params :
    @Returns : *
    */

    renderLastGridData()
    {
        if((this.props.deviceData.length>1) && (this.props.deviceData.length%2==1)) {
            return(
                <Grid>
                    <Col style={styles.listItemStyle} >
                        <TouchableOpacity   onPress={()=>{
                            this.onRowPress(this.props.deviceData[this.props.deviceData.length-1])
                        }}
                        >
                            <Card style={styles.progressStyle}>
                                <Row>
                                    <CardItem>
                                        <Progress.Circle textStyle={styles.progressBardTextStyle}
                                                         borderColor={styles.progressBarBorderColor}
                                                         color={styles.progressBarBorderColor} formatText={() => {
                                            return `${this.props.deviceData[this.props.deviceData.length-1].tank_status.percentage}%`
                                        }} progress={this.convertNumberToDetcimal(this.props.deviceData[this.props.deviceData.length-1].tank_status.percentage)} showsText={true} size={50}/>
                                    </CardItem>
                                </Row>
                                <Row>
                                    <Text style={styles.textStyle}>{this.props.deviceData[this.props.deviceData.length-1].tank_name}</Text>
                                </Row>
                                <Row>
                                    <Text note>{this.props.deviceData[this.props.deviceData.length-1].tank_status.percentage}% Full </Text>
                                </Row>
                                <Row>
                                    <Text note>at {this.formatAMPM(new Date(this.props.deviceData[this.props.deviceData.length-1].tank_status.time))}</Text>
                                </Row>
                                <Row>
                                    <Icon  name="md-arrow-round-forward" style={styles.progressLinkIcon} />
                                </Row>
                            </Card>
                        </TouchableOpacity>
                    </Col>
                    <Col>
                    </Col>
                </Grid>
            )
        }
    }

    /*
    @Method : renderListViewData
    @Params :
    @Returns : *
    */
    renderListViewData() {
        if(this.props.loading)
        {
            return(
                <Spinner size="large"/>
            )
        }
        else
        {
            if(this.props.deviceData.length>0)
            {
                if(this.props.deviceData.length ==1)
                {
                    return(
                        _.map(this.props.deviceData,(val,i)=>{
                            const {device_id,tank_name,tank_status} = val;
                                return(
                                    <Grid>
                                        <Col style={styles.listItemStyle}>
                                            <TouchableOpacity   onPress={()=>{
                                                this.onRowPress(val)
                                            }}>
                                                <Card style={styles.progressStyle}>
                                                    <Row>
                                                        <CardItem>
                                                            <Progress.Circle textStyle={styles.progressBardTextStyle}
                                                                             borderColor={styles.progressBarBorderColor}
                                                                             color={styles.progressBarBorderColor} formatText={() => {
                                                                return `${tank_status.percentage}%`
                                                            }} progress={this.convertNumberToDetcimal(tank_status.percentage)} showsText={true} size={50}/>
                                                        </CardItem>
                                                    </Row>
                                                    <Row>
                                                        <Text style={styles.textStyle}>{tank_name}</Text>
                                                    </Row>
                                                    <Row>
                                                        <Text note>{tank_status.percentage}% Full </Text>
                                                    </Row>
                                                    <Row>
                                                        <Text note>at {this.formatAMPM(new Date(tank_status.time))}</Text>
                                                    </Row>
                                                    <Row>
                                                        <Icon  name="md-arrow-round-forward" style={styles.progressLinkIcon} />
                                                    </Row>
                                                </Card>
                                            </TouchableOpacity>
                                        </Col>
                                        <Col>
                                        </Col>
                                    </Grid>
                                )
                        })
                    );
                }
                else
                {
                    return(
                        _.map(this.props.deviceData,(val,i)=>{
                            const {device_id,tank_name,tank_status} = val;
                            let tempId = i+1;
                            if(tempId%2==0)
                            {
                                return(
                                    <Grid>
                                        <Col style={styles.listItemStyle}>
                                            <TouchableOpacity   onPress={()=>{
                                                this.onRowPress(val)
                                            }}>
                                                <Card style={styles.progressStyle}>
                                                    <Row >
                                                        <CardItem>
                                                            <Progress.Circle textStyle={styles.progressBardTextStyle}
                                                                             borderColor={styles.progressBarBorderColor}
                                                                             color={styles.progressBarBorderColor} formatText={() => {
                                                                return `${this.props.deviceData[i-1].tank_status.percentage}%`
                                                            }} progress={this.convertNumberToDetcimal(this.props.deviceData[i-1].tank_status.percentage)} showsText={true} size={50}/>
                                                        </CardItem>
                                                    </Row>
                                                    <Row >
                                                        <Text  style={styles.textStyle}>{this.props.deviceData[i-1].tank_name}</Text>
                                                    </Row>
                                                    <Row >
                                                        <Text note>{this.props.deviceData[i-1].tank_status.percentage}% Full </Text>
                                                    </Row>
                                                    <Row>
                                                        <Text note>at {this.formatAMPM(new Date(this.props.deviceData[i-1].tank_status.time))}</Text>
                                                    </Row>
                                                    <Row>
                                                        <Icon  name="md-arrow-round-forward" style={styles.progressLinkIcon} />
                                                    </Row>
                                                </Card>
                                            </TouchableOpacity>
                                        </Col>
                                        <Col style={styles.listItemStyle}>
                                            <TouchableOpacity   onPress={()=>{
                                                this.onRowPress(val)
                                            }}>
                                                <Card style={styles.progressStyle}>
                                                    <Row>
                                                        <CardItem>
                                                            <Progress.Circle textStyle={styles.progressBardTextStyle}
                                                                             borderColor={styles.progressBarBorderColor}
                                                                             color={styles.progressBarBorderColor} formatText={() => {
                                                                return `${this.props.deviceData[i].tank_status.percentage}%`
                                                            }} progress={this.convertNumberToDetcimal(this.props.deviceData[i].tank_status.percentage)} showsText={true} size={50}/>
                                                        </CardItem>
                                                    </Row>
                                                    <Row>
                                                        <Text style={styles.textStyle}>{this.props.deviceData[i].tank_name}</Text>
                                                    </Row>
                                                    <Row>
                                                        <Text note>{this.props.deviceData[i].tank_status.percentage}% Full </Text>
                                                    </Row>
                                                    <Row>
                                                        <Text note>at {this.formatAMPM(new Date(this.props.deviceData[i].tank_status.time))}</Text>
                                                    </Row>
                                                    <Row>
                                                        <Icon  name="md-arrow-round-forward" style={styles.progressLinkIcon} />
                                                    </Row>
                                                </Card>
                                            </TouchableOpacity>
                                        </Col>
                                    </Grid>
                                )
                            }
                        })
                    );

                }


            }



            // return (
            //     <ListView enableEmptySections
            //               dataSource={this.dataSource}
            //               renderRow={this.renderRow}
            //     />
            // )
        }
    }

    renderHeader()
    {
        if(this.state.isSearchClicked)
        {
            return(
                <Header  style={styles.customHeaderStyle} searchBar rounded>
                    <Item rounded>
                        <Icon name="ios-search" />
                        <Input onChangeText={this.onChangeSearch.bind(this)} placeholder="Search" />
                        <Button transparent
                                onPress={()=>{
                                    this.setState({isSearchClicked:false,menuActive:false})

                                }}
                        >
                            <Icon name="close" />
                        </Button>
                    </Item>

                </Header>
            )
        }
        else
        {
            return(
                <HeaderComponent label="Dashboard" onPress={this.onSideMenuChange.bind(this)} isBackActive={false} isSearchActive={true} isSettingActive={false}>
                    <Button transparent onPress={()=>{
                        this.setState({isSearchClicked:true,menuActive:false})

                    }} >
                        <Icon name="search" />
                    </Button>
                </HeaderComponent>
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
            <SideNavigationBar isMenuActive={this.state.menuActive}>
                <Container style={styles.containerBackgroundColor}>
                    {this.renderHeader()}
                    <Content>
                        {this.renderListViewData()}
                        {this.renderLastGridData()}
                    </Content>
                </Container>
            </SideNavigationBar>
        );
    };
}

const styles = {

    containerBackgroundColor: {
        backgroundColor: '#fbfbfe'
    },
    customHeaderStyle:{
        backgroundColor:'#2eb9f9',
    },
    titleStyle: {
        fontSize: 18,
        paddingLeft: 15
    },
    listItemStyle:{
        borderWidth:8,
        borderColor:'#fbfbfe'

    },
    progressBardTextStyle:
        {
            color: '#2eb9f9'
        },
    textStyle: {
        color:'#000'
    },
    progressStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:7,
        paddingBottom:10
    },
    progressLinkIcon:{
        color:"#2eb9f9",
        fontSize:22
    },
    progressBarBorderColor: '#2eb9f9',
}
const mapStateToProps = ({device}) => {
    let deviceData =[];
    if(device.deviceData)
    {
        deviceData =[];
        _.map(device.deviceData,(val,uid)=>{
            deviceData.push(val)
        });
    }
    deviceData = deviceData.reverse();
    const {loading} = device;
    return {loading, deviceData};
};

export default connect(mapStateToProps, {getDevices,getSearchDeviceList})(Home);
