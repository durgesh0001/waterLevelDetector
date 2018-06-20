import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Fab,Body,Input,Header,Icon,Content,Right,Text,Button,Card,CardItem,List,ListItem,CheckBox,Item} from 'native-base';
import {HeaderComponent,Spinner,Confirm,Button as CommonButton} from '../common/';
import {SideNavigationBar} from '../SideMenu';
import {getSuppliers,likeSupplier,getSearchSupplier,getLocalSearchSupplierList} from '../../actions';
import {ListView,View,ImageBackground,Dimensions,Alert,RefreshControl} from 'react-native';
import {Actions} from 'react-native-router-flux';
import _ from 'lodash';
import MapView from 'react-native-maps';
import {Grid,Col,Row} from 'react-native-easy-grid';
import Slider  from 'react-native-slider';
import {Toast} from 'native-base';
import {showToast} from '../../actions/types';
import {centerAlign} from '../../actions/style';
import {phonecall } from 'react-native-communications';




class Supplier extends Component {
    state = {menuActive: false,searchText:"",isFilterShow:false,isSearchClicked:false,isMapActive:false,isCheckedAll:true, latitude:0, longitude:0,supplierFilterValue:[true,true,true,true],refreshing:false }
    /*
@Method : componentWillMount
@Params :
@Returns : *
*/
    componentWillMount()
    {
        if((this.props.tankCity != undefined && this.props.tankArea != undefined) && (this.props.tankCity && this.props.tankArea))
        {
            this.props.getSearchSupplier([true,true,true,true],this.props.tankCity,this.props.tankArea);
        }
    }
    /*
@Method : _onRefresh
@Params :
@Returns : *
*/
    _onRefresh() {
        this.setState({refreshing: true});
        if(this.state.supplierFilterValue.length > 0)
        {
            this.props.getSearchSupplier(this.state.supplierFilterValue,this.props.tankCity,this.props.tankArea);
            this.setState({refreshing: false});

        }
    }

    /*
@Method : filter
@Params :
@Returns : *
*/
    filter(text)
    {
        let filteredDevices = this.props.suppliersTemp.filter(supplier => {
            if(!(supplier.company_name == undefined))
            {
                return ((supplier.company_name.indexOf(text) > -1)||((supplier.company_name.toLowerCase().indexOf(text) > -1))) ;
            }
            else
            {
                return {};
            }
        });
        this.props.getLocalSearchSupplierList({"search":filteredDevices});


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
            this.props.getSearchSupplier([true,true,true,true],this.props.tankCity,this.props.tankArea);
        }
    }

    /*
@Method : setSupplierFilterValue
@Params :
@Returns : *
*/

    setSupplierFilterValue(index)
    {
        let tempSupplierFilter = this.state.supplierFilterValue;
        tempSupplierFilter[index] = !(tempSupplierFilter[index]);
        if(tempSupplierFilter[0] && tempSupplierFilter[1] && tempSupplierFilter[2] && tempSupplierFilter[3])
        {
            this.setState({isCheckedAll:true});
        }
        else
        {
            this.setState({isCheckedAll:false});
        }
        this.setState({supplierFilterValue:tempSupplierFilter})
    }
    /*
@Method : setSupplierFilterValueWithCheckAll
@Params :
@Returns : *
*/

    setSupplierFilterValueWithCheckAll()
    {
        let tempSupplierFilter = [true,true,true,true];
        let isCheckedAll = !(this.state.isCheckedAll);
        if(isCheckedAll == false)
        {
            tempSupplierFilter = [false,false,false,false];
        }
        this.setState({supplierFilterValue:tempSupplierFilter})
        this.setState({isCheckedAll:isCheckedAll});
    }
    /*
       @Method : renderMarkers
       @Params :
       @Returns : *
       */
    renderMarkers()
    {
        return   _.map(this.props.suppliers,(marker,i)=>{
            let latitude = parseFloat(marker.latitude);
            let longitude = parseFloat(marker.longitude);
            return(
                <MapView.Marker
                    coordinate={{latitude:latitude,longitude:longitude}}
                    title={marker.company_name}
                    description={`${marker.area_name} , ${marker.city_name}`}
                />
            )
        });
    }

    renderLikeButton(supplier,uid)
    {
        if(supplier.is_fav)
        {
            return(
                <Button  transparent onPress={()=>{
                    this.props.likeSupplier(supplier.supplier_id,supplier.email,false,uid,()=>{
                        if(this.state.supplierFilterValue.length > 0)
                        {
                            this.props.getSearchSupplier(this.state.supplierFilterValue,this.props.tankCity,this.props.tankArea);
                        }
                    })
                }}>
                    <Text>   </Text>
                    <Icon name='ios-heart' style={{color:"#2eb9f9"}}></Icon>
                  </Button>

            )
        }
        else
        {
            return(
                <Button  transparent onPress={()=>{
                    this.props.likeSupplier(supplier.supplier_id,supplier.email,true,uid,()=>{
                        if(this.state.supplierFilterValue.length > 0)
                        {
                            this.props.getSearchSupplier(this.state.supplierFilterValue,this.props.tankCity,this.props.tankArea);
                        }
                    })
                }}>
                    <Text>   </Text>
                    <Icon name='ios-heart-outline' style={{color:"#2eb9f9"}}></Icon>
                </Button>
            )

        }

    }

    /*
       @Method : renderMarkers
       @Params :
       @Returns : *
       */
    renderListItem()
    {
        return   _.map(this.props.suppliers,(supplier,uid)=>{
            return(
                <Card style={{marginLeft:10,marginRight:10,marginBottom:10,paddingBottom:10,paddingTop:10}}>
                    <CardItem style={styles.listItemStyle}>
                        <Body>
                            <Text style={{color:'black'}}>{supplier.company_name}</Text>
                        </Body>
                        <Right style={{textAlign:'right'}}>
                            {this.renderLikeButton(supplier,uid)}
                        </Right>
                    </CardItem>
                    <CardItem style={styles.listItemStyle}>
                        <Icon name="pin" style={styles.listItemStyle.listIcon} />
                        <Text note>{`${supplier.area_name} , ${supplier.city_name}`}</Text>
                    </CardItem>
                    <CardItem style={styles.listItemStyle}>
                        <Icon  name="mail" style={styles.listItemStyle.listIcon} />
                        <Text note>{supplier.email}</Text>
                    </CardItem>
                    <CardItem button style={styles.listItemStyle} onPress={()=>{
                        phonecall(supplier.mobile_number, true)

                    }}  >
                            <Icon name="call"style={styles.listItemStyle.listIcon} />
                            <Text note>{supplier.mobile_number}</Text>
                    </CardItem>
                </Card>
            )
        });
    }



    /*
    @Method : renderMapOrListData
    @Params :
    @Returns : *
    */
    renderMapOrListData() {
        if(this.props.loading)
        {
            return(
                <Spinner size="large"/>
            )
        }
        else
        {
            if(this.state.isMapActive)
            {
                return (
                    <View style={{flex:1,position: 'absolute',bottom:0,height: Dimensions.get('window').height -110}}>
                    <MapView
                        style={ styles.map }
                        initialRegion={{
                            latitude: this.props.latitude,
                            longitude: this.props.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421
                        }}
                    >
                        {this.renderMarkers()}
                    </MapView>
                    </View>
                )
            }
            else
            {
                if(this.props.loading)
                {
                    return(
                        <Spinner size="large"/>
                    )
                }
                else
                {
                    if(this.props.suppliers.length >0)
                    {

                        return (
                            <Content  refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh.bind(this)}
                                />
                            } >
                                <View >
                                    {this.renderListItem()}
                                </View>
                            </Content>
                        )
                    }
                    else
                    {
                        return (
                            <Content style={centerAlign} >
                                <Text>No Record Found</Text>
                            </Content>

                        )
                    }

                }

            }
        }
    }

    /*
      @Method : onRegionChange
      @Params :
      @Returns : *
      */
    onRegionChange(region) {
        this.setState({ region });
    }



    /*
    @Method : renderHeader
    @Params :
    @Returns : *
    */
    renderHeader()
    {
        if(this.state.isSearchClicked)
        {
            return(
                <ImageBackground source={require('../../images/header-bg.jpg')} style={{textAlign:'center',resizeMode: 'contain',paddingBottom:30,zIndex:1}}>
                <Header androidStatusBarColor="#2eb9f9"  style={styles.customHeaderStyle} searchBar rounded>
                    <Item rounded>
                        <Icon name="ios-search" />
                        <Input value={this.state.searchText} onChangeText={this.onChangeSearch.bind(this)} placeholder="Search" />
                        
                            <Icon
                            onPress={()=>{
                                    this.setState({isSearchClicked:false,menuActive:false})
                                     this.props.getSearchSupplier([true,true,true,true],this.props.tankCity,this.props.tankArea);


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
                <HeaderComponent label="Search Supplier" isHeight={true} onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSearchActive={true} isSettingActive={false}>

                    <Button transparent onPress={()=>{
                        this.setState({isFilterShow:true,menuActive:false})

                    }} >
                        <Icon name="ios-funnel" />
                    </Button>
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
        if(this.props.suppliers.length > 0)
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


    renderSliderFilter()
    {
        return(
            <Confirm visible={this.state.isFilterShow} onAccept={()=>{
                let tempValue = this.state.supplierFilterValue;
                if(tempValue[0] == false && tempValue[1] == false && tempValue[2] == false && tempValue[3] == false)
                {
                    showToast('denger','Please Select Tank Capacity')

                }
                else
                {
                    this.props.getSearchSupplier(this.state.supplierFilterValue,this.props.tankCity,this.props.tankArea);
                    this.setState({isFilterShow:false});
                }
            }} onDecline={()=>{
                let tempValue = this.state.supplierFilterValue;
                if(tempValue[0] == false && tempValue[1] == false && tempValue[2] == false && tempValue[3] == false)
                {
                    showToast('denger','Please Select Tank Capacity')

                }
                else
                {
                    this.setState({isFilterShow:false});

                }
            }}>
                <View style={styles.sliderContainer}>
                    <ListItem onPress={()=>{
                        this.setSupplierFilterValueWithCheckAll()
                    }}>
                        <CheckBox onPress={()=>{
                            this.setSupplierFilterValueWithCheckAll()
                        }} checked={this.state.isCheckedAll} />
                        <Body>
                        <Text>All</Text>
                        </Body>
                    </ListItem>

                        <ListItem onPress={()=>{
                            this.setSupplierFilterValue(0)
                        }}>
                            <CheckBox onPress={()=>{
                                this.setSupplierFilterValue(0)
                            }} checked={this.state.supplierFilterValue[0]} />
                            <Body>
                            <Text>5(m3)</Text>
                            </Body>
                        </ListItem>
                        <ListItem onPress={()=>{
                            this.setSupplierFilterValue(1)
                        }}>
                            <CheckBox onPress={()=>{
                                this.setSupplierFilterValue(1)
                            }} checked={this.state.supplierFilterValue[1]} />
                            <Body>
                            <Text>12(m3)</Text>
                            </Body>
                        </ListItem>

                        <ListItem onPress={()=>{
                            this.setSupplierFilterValue(2)
                        }}>
                            <CheckBox onPress={()=>{
                                this.setSupplierFilterValue(2)
                            }} checked={this.state.supplierFilterValue[2]} />
                            <Body>
                            <Text>18(m3)</Text>
                            </Body>
                        </ListItem>
                        <ListItem onPress={()=>{
                            this.setSupplierFilterValue(3)
                        }}>
                            <CheckBox onPress={()=>{
                                this.setSupplierFilterValue(3)
                            }} checked={this.state.supplierFilterValue[3]} />
                            <Body>
                            <Text>32(m3)</Text>
                            </Body>
                        </ListItem>

                    {/*<Slider  minimumValue="0" maximumValue="16000"*/}
                            {/*minimumTrackTintColor='#2eb9f9'*/}
                            {/*maximumTrackTintColor='#2eb9f9'*/}
                            {/*thumbTintColor='#2eb9f9'*/}
                            {/*value={this.state.supplierFilterValue}*/}
                            {/*onValueChange={supplierFilterValue => this.setState({ supplierFilterValue })}*/}
                    {/*/>*/}
                </View>
            </Confirm>
        )
    }

    /*
     @Method : renderContent
     @Params :
     @Returns : *
     */
    renderNavigatorButtons() {
        if(this.state.isMapActive)
        {
            return (

                <Grid>
                    <Col>
                        <Row style={{justifyContent: 'center',textAlign:'center'}}>
                            <Button block bordered rounded style={{borderBottomRightRadius:0,borderTopRightRadius:0,borderColor:'#ecf0f9',elevation: 2,marginTop:2,marginBottom:2,marginRight:0,paddingLeft:30,paddingRight:30,paddingTop:15,paddingBottom:15,backgroundColor:'#fff'}}
                                    onPress={()=>{
                                        this.setState({isMapActive:false})
                                    }}
                            >
                                <Text style={{color:'#949eaa'}}>List View</Text>
                            </Button>

                            <Button block bordered rounded node style={{borderBottomLeftRadius:0,borderTopLeftRadius:0,borderColor:'#ecf0f9',elevation: 2,marginTop:2,marginBottom:2,marginLeft:0,paddingLeft:30,paddingRight:30,paddingTop:15,paddingBottom:15,backgroundColor:'#fff'}}
                                    onPress={()=>{
                                        this.setState({isMapActive:true})
                                    }}
                            >
                                <Text style={{color:'#2eb9f9'}}>Map View</Text>
                            </Button>
                        </Row>
                    </Col>
                </Grid>

            );

        }
        else
        {
            return (

                <Grid>
                    <Col>
                        <Row style={{justifyContent: 'center',textAlign:'center'}}>
                            <Button block bordered rounded style={{borderBottomRightRadius:0,borderTopRightRadius:0,borderColor:'#ecf0f9',elevation: 2,marginTop:2,marginBottom:2,marginRight:0,paddingLeft:30,paddingRight:30,paddingTop:15,paddingBottom:15,backgroundColor:'#fff'}}
                                    onPress={()=>{
                                        this.setState({isMapActive:false})
                                    }}
                            >
                                <Text style={{color:'#2eb9f9'}}>List View</Text>
                            </Button>

                            <Button block bordered rounded node style={{borderBottomLeftRadius:0,borderTopLeftRadius:0,borderColor:'#ecf0f9',elevation: 2,marginTop:2,marginBottom:2,marginLeft:0,paddingLeft:30,paddingRight:30,paddingTop:15,paddingBottom:15,backgroundColor:'#fff'}}
                                    onPress={()=>{
                                        this.setState({isMapActive:true})
                                    }}
                            >
                                <Text style={{color:'#949eaa'}}>Map View</Text>
                            </Button>
                        </Row>
                    </Col>
                </Grid>

            );
        }

    }


    /*
@Method : render
@Params :
@Returns : *
*/

    render() {
        return (
                <Container style={styles.containerBackgroundColor}>

                    {this.renderHeader()}

                    <Content bounces={false} style={{maxHeight:50,top:-30,zIndex:1}}>
                        {this.renderNavigatorButtons()}
                    </Content>
                        {this.renderMapOrListData()}
                        {this.renderSliderFilter()}
                </Container>
        );
    };
}

const styles = {
    customHeaderStyle:{
        backgroundColor:'transparent',elevation: 0,
        shadowOpacity:0,borderBottomWidth:0
    },
    containerBackgroundColor:{
        backgroundColor: '#fbfbfe'
    },
    sliderContainer:{
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        alignItems: "stretch",
        justifyContent: "center"
    },
    map: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height +50
    },
    listItemStyle:{
        paddingBottom:5,
        paddingTop:5,
        listIcon: {
            color:'#2eb9f9',
            fontSize:14,
            maxWidth:20
        }
    },
    itemStyle:{
        borderBottomWidth:0,
    }
}
const mapStateToProps = ({utility}) => {
    let latitude = 0;
    let longitude = 0;

  if(utility.suppliersTemp.length > 0)
  {
       latitude = parseFloat(utility.suppliersTemp[0].latitude);
       longitude = parseFloat(utility.suppliersTemp[0].longitude);

  }
    const {loading,suppliers,suppliersTemp} = utility;
    return {loading, suppliers,suppliersTemp,latitude,longitude};
};


export default connect(mapStateToProps, {getSuppliers,likeSupplier,getLocalSearchSupplierList,getSearchSupplier})(Supplier);
