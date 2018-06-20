import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Fab,Body,Input,Header,Icon,Content,Right,Text,Card,Button,CardItem,List,Item} from 'native-base';
import {HeaderComponent,Spinner} from '../common';
import {SideNavigationBar} from '../SideMenu';
import {getAlerts,getUserDetailsForSettings} from '../../actions';
import ListItemView from './ListItem';
import {ListView,View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import _ from 'lodash';



class Alerts extends Component {
    state = {menuActive: false,isSearchClicked:false};
    /*
@Method : componentWillMount
@Params :
@Returns : *
*/
    componentWillMount()
    {
        this.props.getUserDetailsForSettings();
        this.props.getAlerts();
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
    createDataSource({alerts})
    {

        const ds = new ListView.DataSource({
            rowHasChanged:(r1,r2) => r1 !== r2
        });
        this.dataSource = ds.cloneWithRows(alerts);
    }
    /*
@Method : renderRow
@Params :
@Returns : *
*/
    renderRow(alert)
    {
        return (
            <ListItemView alert={alert}/>
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

    /*
@Method : render
@Params :
@Returns : *
*/

    render() {

        return(
            <Container style={styles.containerBackgroundColor}>
                <HeaderComponent label="Alerts" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSettingActive={false}/>
                <Content padder>
                    <List>
                        {this.renderListViewData()}
                    </List>
                </Content>
            </Container>
            )
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
const mapStateToProps = ({utility}) => {
    let alerts =[];
    if(utility.alerts)
    {
        alerts =[];
        _.map(utility.alerts,(val,uid)=>{
            alerts.push(val)
        });
    }
    alerts = alerts.reverse();
    const {loading} = utility;
    return {alerts,loading};
};

export default connect(mapStateToProps, {getUserDetailsForSettings,getAlerts})(Alerts);
