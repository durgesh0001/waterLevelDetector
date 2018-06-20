import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Fab,Body,Input,Header,Icon,Content,Right,Text,Card,Button,CardItem,List,Item} from 'native-base';
import {HeaderComponent,Spinner} from '../common';
import {SideNavigationBar} from '../SideMenu';
import {getDevices,getSearchDeviceList} from '../../actions';
import ListItemView from './ListItem';
import {ListView,View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import _ from 'lodash';



class DeviceComponent extends Component {
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
          <ListView enableEmptySections
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
          <HeaderComponent label="My Devices" onPress={this.onSideMenuChange.bind(this)} isBackActive={false} isSearchActive={true} isSettingActive={false}>
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
                    <Content  >
                         <List>
                             {this.renderListViewData()}
                         </List>
                    </Content>
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
        backgroundColor:'#2eb9f9',
    },
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

export default connect(mapStateToProps, {getDevices,getSearchDeviceList})(DeviceComponent);
