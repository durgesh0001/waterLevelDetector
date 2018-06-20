import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Fab,Body,Input,Header,Icon,Content,Right,Text,Card,Button,CardItem,List,Item,ListItem} from 'native-base';
import {HeaderComponent,Spinner} from '../common';
import {SideNavigationBar} from '../SideMenu';
import {getDevices,getSearchDeviceList,getUserDetails} from '../../actions';
import ListItemView from './ListItem';
import {ListView,View,TouchableOpacity,ImageBackground} from 'react-native';
import {Actions} from 'react-native-router-flux';
import _ from 'lodash';
import {Grid,Col,Row} from 'react-native-easy-grid';
import * as Progress from 'react-native-progress';
import firebase from 'firebase';
import {centerAlign} from '../../actions/style';







class Home extends Component {
    state = {menuActive: false,isSearchClicked:false,isLoading:true,searchText:""};
    /*
@Method : componentWillMount
@Params :
@Returns : *
*/
    componentWillMount() {
        this.setState({isLoading:false})
        this.props.getDevices();
        this.createDataSource(this.props);
        this.props.getUserDetails();
    }





    /*
@Method : componentWillReceiveProps
@Params :
@Returns : *
*/

    componentWillReceiveProps(nextProps) {
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
            <ListItemView device={device} />
        );


    }

    /*
@Method : filter
@Params :
@Returns : *
*/
    filter(text)
    {
        let filteredDevices = this.props.deviceDataTemp.filter(devices => {
            if(!(devices.tank_name == undefined))
            {
                return ((devices.tank_name.indexOf(text) > -1)||((devices.tank_name.toLowerCase().indexOf(text) > -1))||((devices.tank_name.toUpperCase().indexOf(text) > -1))) ;
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
@Method : removeInvalidChars
@Params :
@Returns : *
*/
    removeInvalidChars(text) {
        return text;
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
            this.setState({searchText:this.removeInvalidChars(text)});
            this.filter(this.removeInvalidChars(text));

        }
        else
        {
            this.setState({searchText:""});
            this.props.getDevices();
        }
    }

    /*
@Method : onClose
@Params :
@Returns : *
*/
    onClose(){
        this.setState({menuActive:false});
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
@Method : convertDate
@Params :
@Returns : *
*/
    convertDate(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
    }

    /*
@Method : formatAMPM
@Params :
@Returns : *
*/
    formatAMPM(date) {
        let deviceDate = this.convertDate((new Date(date)));
        let Today = this.convertDate((new Date()))
        if(deviceDate == Today)
        {
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0'+minutes : minutes;
            let strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }
        else
        {
            return deviceDate;
        }

    }

    /*
@Method : convertNumberToDetcimal
@Params :
@Returns : *
*/
    convertNumberToDetcimal(number)
    {
        if(parseFloat(number))
        {
            let numberTemp = parseFloat(number)/100;
            return numberTemp;
        }
        else
        {
            let numberTemp = 0;
            return numberTemp;
        }

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

            let colorProgress = styles.progressBarBorderColor;
            if (this.props.deviceData[this.props.deviceData.length-1].settings){
                {
                    if(parseFloat(this.props.deviceData[this.props.deviceData.length-1].settings.alert_level_change) > parseFloat(this.props.deviceData[this.props.deviceData.length-1].tank_status.percentage))
                    {
                        colorProgress =styles.progressBarBorderColorDenger;

                    }
                }
            }

            return(
                <Grid>
                    <Col style={styles.listItemStyle} >
                        <TouchableOpacity   onPress={()=>{
                            this.onRowPress(this.props.deviceData[this.props.deviceData.length-1])
                        }}
                        >
                            <Card style={styles.progressStyle}>
                                <Row>
                                    <Text style={styles.progressBardTextStyle}> Water Level Status</Text>
                                </Row>
                                <Row>
                                    <CardItem>
                                        <Progress.Circle textStyle={colorProgress}
                                                         borderColor={colorProgress}
                                                         color={colorProgress} formatText={() => {
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
        if(this.props.loading || this.state.isLoading)
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
                            let colorProgress = styles.progressBarBorderColor;
                            if (val.settings){
                             {
                                 if(parseFloat(val.settings.alert_level_change) > parseFloat(tank_status.percentage))
                                 {
                                     colorProgress =styles.progressBarBorderColorDenger;

                                 }
                             }

                            }

                            return(
                                    <Grid>
                                        <Col style={styles.listItemStyle}>
                                            <TouchableOpacity   onPress={()=>{
                                                this.onRowPress(val)
                                            }}>
                                                <Card style={styles.progressStyle}>
                                                    <Row>
                                                        <Text style={styles.progressBardTextStyle}> Water Level Status</Text>
                                                    </Row>
                                                    <Row>
                                                        <CardItem>
                                                            <Progress.Circle textStyle={colorProgress}
                                                                             borderColor={colorProgress}
                                                                             color={colorProgress} formatText={() => {
                                                                return `${tank_status.percentage}%`
                                                            }} progress={this.convertNumberToDetcimal(tank_status.percentage)} showsText={true} size={50}/>
                                                        </CardItem>
                                                    </Row>
                                                    <Row>
                                                        <Text style={styles.progressBardTextStyle}>{tank_name}</Text>
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
                            let colorProgress = styles.progressBarBorderColor;
                            if (val.settings){
                                {
                                    if(parseFloat(val.settings.alert_level_change) > parseFloat(tank_status.percentage))
                                    {
                                        colorProgress =styles.progressBarBorderColorDenger;

                                    }
                                }
                            }
                            let tempId = i+1;
                            if(tempId%2==0)
                            {
                                return(
                                    <Grid>
                                        <Col style={styles.listItemStyle}>
                                            <TouchableOpacity   onPress={()=>{
                                                this.onRowPress(this.props.deviceData[i-1])
                                            }}>
                                                <Card style={styles.progressStyle}>
                                                    <Row>
                                                        <Text style={styles.progressBardTextStyle}> Water Level Status</Text>
                                                    </Row>
                                                    <Row >
                                                        <CardItem>
                                                            <Progress.Circle textStyle={colorProgress}
                                                                             borderColor={colorProgress}
                                                                             color={colorProgress} formatText={() => {
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
                                            <TouchableOpacity onPress={()=>{
                                                this.onRowPress(this.props.deviceData[i])
                                            }}>
                                                <Card style={styles.progressStyle}>
                                                    <Row>
                                                        <Text style={styles.progressBardTextStyle}> Water Level Status</Text>
                                                    </Row>
                                                    <Row>
                                                        <CardItem>
                                                            <Progress.Circle textStyle={colorProgress}
                                                                             borderColor={colorProgress}
                                                                             color={colorProgress} formatText={() => {
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

        }
    }

    renderHeader()
    {
        if(this.state.isSearchClicked)
        {
            return(
                <ImageBackground source={require('../../images/header-bg.jpg')} style={{textAlign:'center',resizeMode: 'contain',paddingBottom:30}}>
                    <Header androidStatusBarColor="#2eb9f9"  style={styles.customHeaderStyle} searchBar rounded>
                        <Item rounded>
                            <Icon name="ios-search" />
                            <Input onChangeText={this.onChangeSearch.bind(this)} value={this.state.searchText} placeholder="Search" />
                            
                                <Icon style={{color:'red'}}
                                    onPress={()=>{
                                        this.setState({isSearchClicked:false,menuActive:false})
                                        this.onChangeSearch("");

                                    }}
                                 name="close"  />
                        </Item>
                    </Header>
                 </ImageBackground>
            )
        }
        else
        {
            return(
                <HeaderComponent label="Dashboard" onPress={this.onSideMenuChange.bind(this)} isBackActive={false} isSearchActive={this.props.deviceData.length > 0} isSettingActive={false} isHeight={this.props.deviceData.length > 0}>
                    {this.renderSearch()}
                </HeaderComponent>
            )
        }
    }

    /*
@Method : renderSearch
@Params :
@Returns : *
*/

    renderSearch()
    {
        if(this.props.deviceData.length > 0)
        {
            return (
                <Button transparent onPress={()=>{
                    this.setState({isSearchClicked:true,menuActive:false})

                }} >
                    <Icon name="search" />
                </Button>
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
        if(this.props.deviceData.length >0)
        {

            return(
                <Content bounces={false} style={{marginTop:-40}}>
                    {this.renderListViewData()}
                    {this.renderLastGridData()}
                </Content>
            )
        }
        else if((this.props.deviceDataTemp.length >0) && (this.props.deviceData.length == 0))
        {

            return(
                <Content bounces={false}  style={centerAlign} padder>
                    <Text note>
                        No Record Found
                    </Text>
                </Content>
            )
        }
        else
        {
            return (
                <Content bounces={false}  style={centerAlign} padder>
                    <Text note>
                        Your device has not been registered in the app.Please purchase device and registered it or visit our website www.qatrah.com to purchase.
                    </Text>
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
        if(this.props.loading)
        {
            return (
                <Spinner size="large"/>
            )
        }
        else
        {
            return (
                <SideNavigationBar isMenuActive={this.state.menuActive} onClose={this.onClose.bind(this)}>
                    <Container style={styles.containerBackgroundColor}>
                        {this.renderHeader()}
                        {this.renderData()}
                        <Fab
                            containerStyle={{ }}
                            style={{ backgroundColor: '#2eb9f9' }}
                            position="bottomRight"
                            onPress={() =>  Actions.AddDeviceComponent()}>
                            <Icon name="md-add" />
                        </Fab>
                    </Container>
                </SideNavigationBar>
            );
        }
    };
}

const styles = {

    containerBackgroundColor: {
        backgroundColor: '#fbfbfe'
    },
    customHeaderStyle:{
        backgroundColor:'transparent',
        elevation: 0,
        shadowOpacity:0,borderBottomWidth:0
    },
    titleStyle: {
        fontSize: 18,
        paddingLeft: 15
    },
    listItemStyle:{
        borderWidth:8,
        borderColor:'transparent'

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
    progressBarBorderColorDenger: 'red',
}
const mapStateToProps = ({device}) => {
    let deviceData =[];
    let deviceDataTemp= [];
    let loading = true;
    if(device.deviceData)
    {
        deviceData =[];
        _.map(device.deviceData,(val,uid)=>{
            if(val.tank_name){
                val.tank_name = val.tank_name.trim()
            }
            deviceData.push(val)
        });
    }
    if(device.deviceDataTemp)
    {
        deviceDataTemp =[];
        _.map(device.deviceDataTemp,(val,uid)=>{
            if(val.tank_name){
                val.tank_name = val.tank_name.trim()
            }
            deviceDataTemp.push(val)
        });
    }
    deviceData = deviceData.reverse();
     loading = device.loading;
    return {loading, deviceData,deviceDataTemp};
};

export default connect(mapStateToProps, {getDevices,getSearchDeviceList,getUserDetails})(Home);
