import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Container,Fab,Body,Input,Header,Icon,Content,Right,Text,Card,Button,CardItem,List,ListItem,Item} from 'native-base';
import {HeaderComponent,Spinner,Confirm} from '../common/';
import {SideNavigationBar} from '../SideMenu';
import {getSuppliers,likeSupplier,getSearchSupplier,getLocalSearchSupplierList} from '../../actions';
import {ListView,View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import _ from 'lodash';
import MapView from 'react-native-maps';
import {Grid,Col,Row} from 'react-native-easy-grid';
import Slider  from 'react-native-slider';







class Supplier extends Component {
    state = {menuActive: false,isSearchClicked:false,isMapActive:false,region:{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    },
        isFilterShow:false,
        sliderValue:100,
        markers:[
            {
                latlng:{
                    latitude: 38.78825,
                    longitude: -123.4324
                },
                title:"test",
                description:"test"
            },
            {
                latlng:{
                    latitude: 39.78825,
                    longitude: -124.4324
                },
                title:"test2",
                description:"test2"

            },
            {
                latlng:{
                    latitude: 40.78825,
                    longitude: -125.4324
                },
                title:"test3",
                description:"test3"
            }
        ]
    };
    /*
@Method : componentWillMount
@Params :
@Returns : *
*/
    componentWillMount()
    {
        this.props.getSuppliers();
    }
    /*
@Method : filter
@Params :
@Returns : *
*/
    filter(text)
    {
        let filteredDevices = this.props.suppliers.filter(supplier => {
            if(!(supplier.company_name == undefined))
            {
                return ((supplier.company_name.indexOf(text.toUpperCase()) > -1) || (supplier.company_name.indexOf(text.toUpperCase()) > -1) || (supplier.company_name.indexOf(text) > -1));
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
            this.props.getSuppliers();
        }
    }
    /*
       @Method : renderMarkers
       @Params :
       @Returns : *
       */
    renderMarkers()
    {
        return   _.map(this.props.suppliers,(marker)=>{
            return(
                <MapView.Marker
                    coordinate={marker.latlng}
                    title={marker.company_name}
                    description={`${marker.area} , ${marker.city_name}`}
                />
            )
        });
    }

    renderLikeButton(supplier)
    {
        if(supplier.is_like)
        {
            return(
                <Button transparent
                        onPress={()=>{
                            this.props.likeSupplier(supplier.email,false)
                        }}
                >
                    <Icon name="ios-heart"  style={{color:"#2eb9f9"}}/>
                </Button>
            )
        }
        else
        {
            return(
                <Button transparent
                        onPress={()=>{
                            this.props.likeSupplier(supplier.email,false)
                        }}
                >
                    <Icon name="ios-heart-outline"  style={{color:"#2eb9f9"}}/>
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
        return   _.map(this.props.suppliers,(supplier)=>{
            return(
                <ListItem style={styles.listItemStyle}>
                    <Grid>
                        <Col size={80}>
                            <Row>
                                <Text >{supplier.company_name}</Text>
                            </Row>
                            <Row>
                                <Item style={styles.itemStyle}>
                                <Icon  name="pin"   style={{color:"#2eb9f9"}}   />
                                <Text note>{`${supplier.area} , ${supplier.city_name}`}</Text>
                                </Item>
                            </Row>

                            <Row>
                                <Item  style={styles.itemStyle}>
                                <Icon  name="mail"   style={{color:"#2eb9f9"}}   />
                                <Text note>{supplier.email}</Text>
                                </Item>
                            </Row>
                            <Row>
                                <Item style={styles.itemStyle}>
                                <Icon  name="call"   style={{color:"#2eb9f9"}}   />
                                <Text note>{supplier.mobile_number}</Text>
                                </Item>
                            </Row>
                        </Col>
                        <Col size={20}>
                            <Row>
                                <Item style={styles.listItemStyle}>
                                    {this.renderLikeButton(supplier)}
                                </Item>
                            </Row>
                        </Col>
                    </Grid>
                </ListItem>
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
                    <MapView
                        style={ styles.map }
                        initialRegion={{
                            latitude: 37.78825,
                            longitude: -122.4324,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        {this.renderMarkers()}
                    </MapView>
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
                    return (
                        <Content  >
                            <List>

                                {this.renderListItem()}
                            </List>
                        </Content>
                    )

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
                <Header  style={styles.customHeaderStyle} searchBar rounded>
                    <Item rounded>
                        <Icon name="ios-search" />
                        <Input onChangeText={this.onChangeSearch.bind(this)} placeholder="Search" />
                        <Button transparent
                                onPress={()=>{
                                    this.setState({isSearchClicked:false,menuActive:false})
                                    this.props.getSuppliers();


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
                <HeaderComponent label="Search Supplier" onPress={this.onSideMenuChange.bind(this)} isBackActive={true} isSearchActive={true} isSettingActive={false}>

                    <Button transparent onPress={()=>{
                        this.setState({isFilterShow:true,menuActive:false})

                    }} >
                        <Icon name="ios-funnel" />
                    </Button>
                    <Button transparent onPress={()=>{
                        this.setState({isSearchClicked:true,menuActive:false})

                    }} >
                        <Icon name="search" />
                    </Button>
                </HeaderComponent>
            )
        }

    }
    renderSliderFilter()
    {
        return(
            <Confirm visible={this.state.isFilterShow} onAccept={()=>{
                this.props.getSearchSupplier('tank_capacity',this.state.sliderValue);
                this.setState({isFilterShow:false});
            }} onDecline={()=>{
                this.setState({isFilterShow:false});
            }}>
                <View style={styles.sliderContainer}>
                    <Slider  minimumValue="0" maximumValue="16000"
                            minimumTrackTintColor='#2eb9f9'
                            maximumTrackTintColor='#2eb9f9'
                            thumbTintColor='#2eb9f9'
                            value={this.state.sliderValue}
                            onValueChange={sliderValue => this.setState({ sliderValue })}
                    />
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
        return (
            <Grid >
                <Col >
                    <Row>
                        <Content>
                        <Button rounded block onPress={()=>{
                            this.setState({isMapActive:!this.state.isMapActive})
                        }}
                        >
                            <Text>Map View</Text>
                        </Button>
                        </Content>
                    </Row>
                </Col>
                <Col >
                    <Row>
                        <Content>
                            <Button rounded block
                                    onPress={()=>{
                                        this.setState({isMapActive:!this.state.isMapActive})

                                    }}
                            >
                                <Text>List View</Text>
                            </Button>
                        </Content>
                    </Row>
                </Col>
            </Grid>
        );
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
                    {this.renderSliderFilter()}
                    {this.renderHeader()}
                    {/*{this.renderNavigatorButtons()}*/}
                    {this.renderMapOrListData()}
                </Container>
            </SideNavigationBar>
        );
    };
}

const styles = {
    customHeaderStyle:{
        backgroundColor:'#2eb9f9',
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
        height:'100%',
        width:null
    },
    listItemStyle:{
        borderBottomWidth:12,
        borderColor:'#fbfbfe'

    },
    itemStyle:{
        borderBottomWidth:0,
    }
}
const mapStateToProps = ({utility}) => {
    const {loading,suppliers} = utility;
    return {loading, suppliers};
};


export default connect(mapStateToProps, {getSuppliers,likeSupplier,getLocalSearchSupplierList,getSearchSupplier})(Supplier);
