import React, {Component} from 'react';
import {Container,Item,Input,Content,Icon,Text,Title,Button, Thumbnail,CardItem,List, Card,Right,Left,Header,Body,ListItem} from 'native-base';
import {Spinner} from '../common';
import {connect} from 'react-redux';
import {SideNavigationBar} from '../SideMenu';
import _ from 'lodash';
import {NameChanged,getUserDetails,uploadPhoto,updateProfile,onChangeName,onAddressChange} from '../../actions';
import {Actions} from 'react-native-router-flux';
import firebase from 'firebase';
import {View,TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {ImageBackground} from 'react-native';


class Profile extends Component {
    state = {menuActive: false,isLoaded:null,isNameEditActive:false,isAddressEditActive:false};
    /*
     @Method : componentWillMount
     @Desc   : will check that user is logged in or not
     @Params :
     @Returns : *
     */
    componentWillMount() {
        this.props.getUserDetails();

    }

    /*
   @Method : onButtonPress
   @Desc   :
   @Params :
   @Returns : *
   */

    onButtonPress()
    {
        const {name,profile_picture,userId,address} = this.props;
        if(userId)
        {
            this.props.updateProfile({name,profile_picture,address,userId});
        }
    }


    /*
 @Method : updateAddress
 @Desc   :
 @Params :
 @Returns : *
 */

    updateAddress()
    {
        if(this.props.address)
        {
            this.setState({isAddressEditActive:false})
            this.onButtonPress();
        }

    }


    /*
  @Method : updateName
  @Desc   :
  @Params :
  @Returns : *
  */

    updateName()
    {
        if(this.props.name)
        {
            this.setState({isNameEditActive:false})
            this.onButtonPress();
        }

    }

    /*
    @Method : onUploadProfilePress
    @Desc   :
    @Params :
    @Returns : *
    */

    onUploadProfilePress()
    {
        ImagePicker.openPicker({
            width: 400,
            height: 250,
            cropping: true
        }).then(image => {
            //this.props.changeProfilePicture(image);
            this.props.uploadPhoto(image,this.props.userId);
        });
    }



    /*
 @Method : renderProfilePicture
 @Params :
 @Returns : *
 */
 renderProfilePicture() {
     if(this.props.loading)
     {
         return (
             <Spinner size="large"/>
         )
     }
     else
     {

         if(this.props.profile_picture)
         {
             return(
                 <TouchableOpacity  onPress={()=>{
                     this.onUploadProfilePress();
                 }}>
                     <Thumbnail  source={{ uri: this.props.profile_picture }} />
                 </TouchableOpacity>
             );
         }
         else
         {
             return(
                 <TouchableOpacity onPress={()=>{
                     this.onUploadProfilePress();
                 }}>
                     <Thumbnail source={require("../../images/no_photo.jpg")} />
                 </TouchableOpacity>

             );
         }
     }


}


    /*
 @Method : onChangeAddress
 @Params :
 @Returns : *
 */
    onChangeAddress(text)
    {
        this.props.onAddressChange(text);

    }
    /*
   @Method : onChangeName
   @Params :
   @Returns : *
   */
    onChangeName(text)
    {
        this.props.NameChanged(text);

    }

    /*
      @Method : renderAddressTextBoxOrEditIcon
      @Params :
      @Returns : *
     */

    renderAddressTextBoxOrEditIcon()
    {
    if(this.state.isAddressEditActive)
    {
        return(
            <CardItem>
               	<Item last error={(this.props.address == '')}>
                   <Icon name='pin' style={styles.iconStyle} ></Icon>

                   	<Input  multiline={true} numberOfLines={5}  onChangeText={this.onChangeAddress.bind(this)} value={this.props.address} placeholder="Address" />
                    <Button transparent
                            onPress={()=>{
                                this.updateAddress();

                            }}
                    >
                        <Icon name="md-create"  style={styles.iconSmall} />
                    </Button>
                    <Button transparent
                            onPress={()=>{
                                this.setState({isAddressEditActive:false})
                                this.props.getUserDetails();
                            }}
                    >
                        <Icon name="close" style={styles.iconStyleClose} />
                    </Button>
				</Item>
            </CardItem>
        );
    }
    else
    {
        return(
            <CardItem>
                <Icon name='pin' style={styles.iconStyle} ></Icon>
                <Body>
                <Text style={styles.listItemStyle.title}>Address</Text>
                <Text note>{this.props.address}</Text>
                </Body>
                <Right>
                    <Button transparent onPress={()=>{
                        this.setState({isAddressEditActive:true});
                    }}>
                        <Icon style={styles.iconSmall} name='md-create'></Icon>
                    </Button>
                </Right>
            </CardItem>
        );
    }

}

    /*
@Method : renderNameTextBoxOrEditIcon
@Params :
@Returns : *
*/
    renderNameTextBoxOrEditIcon()
    {
        if(this.state.isNameEditActive)
        {
            return(
                <CardItem style={styles.editProfileName}>
                    <Item error={(this.props.name == '')} rounded>
                        <Input onChangeText={this.onChangeName.bind(this)} value={this.props.name} placeholder="Name" style={styles.editProfileName.button} />
                        <Button transparent
                                onPress={()=>{
                                    this.updateName();

                                }} 
                                style={styles.editProfileName.button}
                        >
                            <Icon name="md-create" style={styles.editProfileName.button}  />
                        </Button>
                        <Button transparent
                                onPress={()=>{
                                    this.setState({isNameEditActive:false});
                                    this.props.getUserDetails();
                                }}
                                style={styles.editProfileName.button}
                        >
                            <Icon name="close"  style={styles.iconStyleClose}/>
                        </Button>
                    </Item>
                </CardItem>

            );
        }
        else
        {
            return(
                <CardItem style={styles.editProfileName}>
                    <Text style={styles.editProfileName.button}>{this.props.name}</Text>
                    <Icon onPress={()=>{
                        this.setState({isNameEditActive:true});
                    }} style={styles.editProfileName.editButton} name='md-create'></Icon>
                </CardItem>
            );
        }

    }



    /*
 @Method : renderHeader
 @Params :
 @Returns : *
 */
    renderHeader() {
   
            return(

                <ImageBackground source={require('../../images/my-profile-bg.jpg')} style={{width:null}}>
                	
                    <View style={styles.profileHeader}>
                        <Header style={styles.headerStyle}>
		                    <Left style={{ flex: 1 }}>
		                        <Button transparent onPress={()=>{
		                            Actions.pop();
		                        }}>
		                            <Icon style={styles.iconStyleBackButton} name='ios-arrow-back'></Icon>
		                        </Button>
		                    </Left>
		                    <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
		                        <Title>
		                            My Profile
		                        </Title>
		                    </Body>
		                    <Right style={{ flex: 1 }}>
			                 	<Button transparent >
		                            <Icon style={{color:"#19adf3"}} name='ios-arrow-back'></Icon>
		                        </Button>
			                </Right>
		                </Header>
                        <View style={styles.profileHeader.cardItemBackgroundColor}>
                        	<ImageBackground source={require('../../images/my-profile-avatar-bg.png')} style={{width:null}}>
	                            <CardItem rounded header avatar  style={styles.profileHeader.cardItemBackgroundColor.styleAvatar}>
	                            	{this.renderProfilePicture()}
	                            </CardItem>
                            </ImageBackground>
                        </View>
                        {this.renderNameTextBoxOrEditIcon()}
                    </View>
                </ImageBackground>
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
@Method : renderGridData
@Params :
@Returns : *
*/
    renderData() {
        return (
           <List style={styles.listStyle}>

               <ListItem style={styles.listItemStyle}>
                   <Card>
                       <CardItem>
                               <Icon name='mail' style={styles.iconStyle} ></Icon>
                           <Body>
                             <Text style={styles.listItemStyle.title}>Email ID</Text>
                            <Text note>{this.props.email}</Text>
                         </Body>
                       </CardItem>
                   </Card>
               </ListItem>
               <ListItem style={styles.listItemStyle}>
                   <Card>
                       <CardItem>
                               <Icon name='call' style={styles.iconStyle} ></Icon>
                           <Body>
                           <Text style={styles.listItemStyle.title}>Mobile Number</Text>
                           <Text note>{this.props.phone}</Text>
                           </Body>
                       </CardItem>
                   </Card>
               </ListItem>
               <ListItem style={styles.listItemStyle}>
                   <Card>
                       {this.renderAddressTextBoxOrEditIcon()}
                   </Card>
               </ListItem>
           </List>
        )

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
                <SideNavigationBar isMenuActive={this.state.menuActive}>
                    <Container style={styles.containerBackgroundColor}>
                        
                        <Content>
                        	{this.renderHeader()}
                            {this.renderData()}
                        </Content>
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

    headerStyle:{
        backgroundColor:'transparent',
        shadowOpacity: 0,
        elevation: 0
    },
    cardItemBackgroundColor : {
        backgroundColor: 'transparent'
    },
    editProfileName:{
		backgroundColor: 'transparent',
		textAlign:'center',
		justifyContent: 'center',
		paddingBottom:85,
		paddingTop:30,
		display:'flex',
		button:{
			color:'white',
			fontSize:16
		},
		editButton:{
			color:'white',
			fontSize:16,
			paddingLeft:10
		}
    },
    profileHeader:{
        backgroundColor: 'transparent',
        cardItemBackgroundColor :{
        	paddingTop:20,
            backgroundColor: 'transparent',
            textAlign:'center',
            justifyContent: 'center',
            alignItems: 'center',
            styleAvatar : {
                backgroundColor: 'transparent',
                padding:5,
                borderColor:'white',
                alignItems: 'center'
            }
        }
    },
    listItemStyle:{
        borderBottomWidth:0,
        borderColor:'transparent',
        paddingBottom:5,
        shadowOpacity: 0.2,
        elevation: 0.2,
        title:{
        	color:'black'
        }
    },
    iconStyle:{
        color:"#2eb9f9",
    },
    iconSmall:{
    	color:"#2eb9f9",
        fontSize:16
    },
    iconStyleClose:{
        color:"red"
    },
    iconStyleBackButton:{
        color:"#fff"
    },
    listStyle:{
        paddingTop:12
    },
    nameStyle:{
        justifyContent:'flex-start',
        flexDirection:'row',
    }
}
const mapStateToProps = ({auth}) => {
    const {profile_picture,address,userId,name,loading,phone,email} = auth;
    return {loading,profile_picture,address,userId,name,phone,email};

};
export default connect(mapStateToProps, {
    getUserDetails,
    NameChanged,
    uploadPhoto,
    updateProfile,
    onChangeName,
    onAddressChange
})(Profile);

