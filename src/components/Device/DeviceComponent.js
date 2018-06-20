import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Fab,Body,Input,Header,Icon,Content,Right,Text,Card,Button,CardItem,List,Item} from 'native-base';
import {HeaderComponent,Spinner} from '../common';
import {SideNavigationBar} from '../SideMenu';
import {getDevices,getSearchDeviceList} from '../../actions';
import ListItemView from './ListItem';
import {ListView,View,ImageBackground} from 'react-native';
import {Actions} from 'react-native-router-flux';
import _ from 'lodash';
import {centerAlign} from '../../actions/style';



class DeviceComponent extends Component {
    state = {menuActive: false,isSearchClicked:false,searchText:""};
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
@Method : onClose
@Params :
@Returns : *
*/
    onClose(){
        this.setState({menuActive:false});
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
      return (
          <ListView style={styles.listStyle} enableEmptySections
                    dataSource={this.dataSource}
                    renderRow={this.renderRow}
          />
      )
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
                    <Input value={this.state.searchText} onChangeText={this.onChangeSearch.bind(this)} placeholder="Search" />
                    
                        <Icon style={{color:'red'}}
                         onPress={()=>{
                                this.setState({isSearchClicked:false,menuActive:false})
                                this.onChangeSearch("");

                         }}
                             name="close" />
                </Item>

            </Header>
            </ImageBackground>
        )
    }
    else
    {
      return(
          <HeaderComponent label="My Devices" onPress={this.onSideMenuChange.bind(this)} isBackActive={false} isSearchActive={this.props.deviceData.length > 0} isSettingActive={false} isHeight={this.props.deviceData.length > 0}>
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
                <Content bounces={false} style={{marginTop:-30}} >
                    <List>
                        {this.renderListViewData()}
                    </List>
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
                <Content  bounces={false} style={centerAlign} padder>
                    <Text note> Your device has not been registered in the app.Please purchase device and registered it or visit our website www.qatrah.com to purchase.</Text>
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
    };
}

const styles = {
    containerBackgroundColor: {
        backgroundColor: '#fbfbfe'
    },
    customHeaderStyle:{
        backgroundColor:'transparent',elevation: 0,
        shadowOpacity:0,borderBottomWidth:0
    },
    listStyle:{
        
        marginRight:17
    }
}
const mapStateToProps = ({device}) => {
    let deviceData =[];
    let deviceDataTemp=[];
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
    const {loading} = device;
    return {loading, deviceData,deviceDataTemp};
};

export default connect(mapStateToProps, {getDevices,getSearchDeviceList})(DeviceComponent);
