import React, {Component} from 'react';
import {Container,Item,Input,Content,Icon,Text,Title,Button, Thumbnail,CardItem,List, Card,Right,Left,Header,Body,ListItem} from 'native-base';
import {Spinner} from '../common';
import {connect} from 'react-redux';
import {SideNavigationBar} from '../SideMenu';
import _ from 'lodash';
import {NameChanged,getUserDetails,uploadPhoto,updateProfile,onChangeName,onAddressChange} from '../../actions';
import {Actions} from 'react-native-router-flux';
import firebase from 'firebase';
import {View,TouchableOpacity,Platform} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {ImageBackground} from 'react-native';
import {showToast} from '../../actions/types';


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
@Method : validateFirstSpace
@Params :
@Returns : *
*/
    validateFirstSpace(text)
    {
        let myString = text;

        let spacesAtStart = myString.length - myString.trimLeft().length

        return spacesAtStart;
    }


    /*
   @Method : onButtonPress
   @Desc   :
   @Params :
   @Returns : *
   */

    onButtonPress()
    {
        const  {name,profile_picture,userId,address} = this.props;
        if(userId)
        {
            if((name != undefined) || (profile_picture != undefined) || (address != undefined))
            {
                this.props.updateProfile({name,profile_picture,address,userId});
            }
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
        if(this.props.address != undefined)
        {
                if(this.props.address)
                {
                    this.setState({isAddressEditActive:false})
                    this.onButtonPress();
                }

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
        if(this.props.name != undefined) {

                if (this.props.name) {
                    this.setState({isNameEditActive: false})
                    this.onButtonPress();
                }

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
 @Method : removeInvalidChars
 @Params :
 @Returns : *
 */
    removeInvalidChars(text) {
        return text;
    }

    /*
@Method : removeInvalidChars
@Params :
@Returns : *
*/
    removeInvalidCharsAddress(text) {
       return text;
    }
    /*
 @Method : onChangeAddress
 @Params :
 @Returns : *
 */
    onChangeAddress(text)
    {
        this.props.onAddressChange(this.removeInvalidCharsAddress(text));

    }
    /*
   @Method : onChangeName
   @Params :
   @Returns : *
   */
    onChangeName(text)
    {
        this.props.NameChanged(this.removeInvalidChars(text));

    }

    /*
      @Method : renderAddressTextBoxOrEditIcon
      @Params :
      @Returns : *
     */

    renderAddressTextBoxOrEditIcon()
    {
        if(Platform.OS === 'android')
        {
            if(this.state.isAddressEditActive)
            {
                return(
                    <CardItem>
                        <Item last error={(this.props.address == '')}>
                            <Icon name='pin' style={styles.iconStyle} ></Icon>

                            <Input  multiline={true} maxLength={130} numberOfLines={5} style={{maxHeight:180,height:100}} onChangeText={this.onChangeAddress.bind(this)} value={this.props.address} onSubmitEditing={ (event) => {
                                this.updateAddress();
                            }}  placeholder="Address" />
                            <Button transparent
                                    onPress={()=>{
                                        this.updateAddress();

                                    }}
                            >
                                <Text> </Text>
                                <Icon name="md-create"  style={styles.iconSmall} />
                            </Button>
                            <Button transparent
                                    onPress={()=>{
                                        this.setState({isAddressEditActive:false})
                                        this.props.getUserDetails();
                                    }}
                            >
                                <Text> </Text>
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
                                <Text> </Text>
                                <Icon style={styles.iconSmall} name='md-create'></Icon>
                            </Button>
                        </Right>
                    </CardItem>
                );
            }
        }
        else
        {
            if(this.state.isAddressEditActive)
            {
                return(
                    <CardItem>
                        <Item last error={(this.props.address == '')}>
                            <Icon name='pin' style={styles.iconStyle} ></Icon>
                            <Body style={{flex:1,alignItems:'stretch'}}>
                                <Input  multiline={true} maxLength={130} numberOfLines={5} style={{maxHeight:180,height:100}} onChangeText={this.onChangeAddress.bind(this)} value={this.props.address}   placeholder="Address" />
                            </Body>
                            <Right style={{flex:1,alignItems: 'flex-end',alignSelf: 'flex-start',flexDirection: 'row',maxWidth:90,display:'flex'}}>
                                <Button  style={{flex:1}} transparent
                                        onPress={()=>{
                                            this.updateAddress();

                                        }}
                                >
                                    <Icon name="md-create"  style={styles.iconSmall} />
                                    <Text> </Text>
                                </Button>
                                <Button style={{flex:1}} transparent
                                        onPress={()=>{
                                            this.setState({isAddressEditActive:false})
                                            this.props.getUserDetails();
                                        }}
                                >
                                    <Icon name="close" style={styles.iconStyleClose} />
                                    <Text> </Text>
                                </Button>

                            </Right>
                        </Item>
                    </CardItem>
                );
            }
            else
            {
                return(
                    <CardItem style={{justifyContent:'space-between',display:'flex'}}>
                        <Icon name='pin' style={styles.iconStyle} ></Icon>
                            <Body style={{flex:1,alignItems:'stretch'}}>
                                <Text style={styles.listItemStyle.title}>Address</Text>
                                <Text note>{this.props.address}</Text>
                            </Body>

                        <Right style={{flex:1,alignItems: 'flex-start',alignSelf: 'flex-start',maxWidth:30}}>
                            <Button transparent onPress={()=>{
                                this.setState({isAddressEditActive:true});
                            }}>
                                <Text> </Text>
                                <Icon style={styles.iconSmall} name='md-create'></Icon>
                            </Button>
                        </Right>
                    </CardItem>
                );
            }

        }

}

    /*
@Method : renderNameTextBoxOrEditIcon
@Params :
@Returns : *
*/
    renderNameTextBoxOrEditIcon()
    {
        if(Platform.OS === 'android')
        {
            if(this.state.isNameEditActive)
            {
                return(
                    <CardItem style={styles.editProfileName}>
                        <Item error={(this.props.name == '')} rounded>
                            <Input onChangeText={this.onChangeName.bind(this)} value={this.props.name} placeholder="Name" placeholderTextColor="#fff" onSubmitEditing={ (event) => {
                                this.updateName();
                            }}   style={styles.editProfileName.button} />
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
        else
        {
            if(this.state.isNameEditActive)
            {
                return(
                    <CardItem style={styles.editProfileName}>
                        <Item error={(this.props.name == '')} rounded>
                            <Input onChangeText={this.onChangeName.bind(this)} value={this.props.name} placeholder="Name"  placeholderTextColor="#fff"   style={styles.editProfileName.button} />
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
                        <Header  androidStatusBarColor="#2eb9f9"  style={styles.headerStyle}>
		                    <Left style={{ flex: 1 }}>
		                        <Button transparent onPress={()=>{
		                            Actions.pop();
		                        }}>
		                            <Icon style={styles.iconStyleBackButton} name='ios-arrow-back'></Icon>
                                    <Text>   </Text>
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
                       <CardItem>
                               <Icon name='mail' style={styles.iconStyle} ></Icon>
                           <Body>
                             <Text style={styles.listItemStyle.title}>Email ID</Text>
                            <Text note>{this.props.email}</Text>
                         </Body>
                       </CardItem>
               </ListItem>
               <ListItem style={styles.listItemStyle}>
                   <CardItem>
                               <Icon name='call' style={styles.iconStyle} ></Icon>
                           <Body>
                           <Text style={styles.listItemStyle.title}>Mobile Number</Text>
                           <Text note>{this.props.phone}</Text>
                           </Body>
                       </CardItem>
               </ListItem>
               <ListItem style={styles.listItemStyle}>
                       {this.renderAddressTextBoxOrEditIcon()}
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
                    <Container style={styles.containerBackgroundColor}>

                        <Content bounces={false}>
                        	{this.renderHeader()}
                            {this.renderData()}
                        </Content>
                    </Container>
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
		    placeholderText:"#fff",
			color:'white',
			fontSize:16,
            placeholderTextColor:'#fff'
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
        marginRight:15,
        borderBottomWidth:0,
        borderColor:'transparent',
        borderBottomWidth:2,
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

