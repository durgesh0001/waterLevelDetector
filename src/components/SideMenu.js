import React from 'react';
import {View,TouchableOpacity,ScrollView,Alert} from 'react-native';
import {Container,Thumbnail,Content,Icon,CardItem,Item,Card,Text,Header,Drawer,Button} from 'native-base';
import {Menues} from './common';
import {Actions} from 'react-native-router-flux';
import _ from 'lodash';
import firebase from 'firebase';


const SideNavigationBar =({children,isMenuActive,onSideMenuChange})=>
{
    const {currentUser} = firebase.auth();
    return (
        <Drawer
            style={{border:0}}
            ref={(ref) => { drawer = ref; }}
            open={isMenuActive}
            content={MenuComponent(currentUser)}
        >
            {children}
        </Drawer>
    )
}


const renderProfile =(currentUser)=>
{
    return (
        <CardItem header avatar style={{backgroundColor: '#23b5f7',paddingBottom:7,paddingTop:7,border:0}}>
            {renderPicture(currentUser)}
            <Text style={{paddingLeft:10,color:'white'}}>{currentUser.displayName}</Text>
        </CardItem>
    )
}

renderPicture=(currentUser)=>
{
    if(currentUser.photoURL)
    {
        return(
            <Thumbnail  source={{ uri: currentUser.photoURL }} />
        )
    }
    else
    {
        return(
            <Thumbnail source={require("../images/no_photo.jpg")} />
        )
    }
}

const onRowPress=(val)=>{

    if(val)
    {

        if(val == "Home")
        {
            Actions.Home({type:'reset'});
        }
        else if(val == "Devices")
        {
            Actions.Devices();
        }
        else if(val == "Profile")
        {
            Actions.Profile();
        }
        else if(val == "ReminderSetting")
        {
            Actions.ReminderSetting();
        }
        else if(val == "NotificationSetting")
        {
            Actions.NotificationSetting();
        }
        else if(val == "ContactUs")
        {
            Actions.ContactUs();
        }
        else if(val == "Alerts")
        {
            Actions.Alerts();
        }
        else if(val == "TermsAndPolicy")
        {
            Actions.TermsAndPolicy();
        }
        else if(val == "History")
        {
            Actions.History();
        }
        else if(val == "Logout")
        {
            firebase.auth().signOut().then(function() {
                Actions.Auth({type:'reset'});
            }, function(error) {
                Alert.alert('Error', 'Something is wrong,Please try again');
            });
        }
    }

}

const MenuComponent=(currentUser) => {
    return(
        <ScrollView style={{backgroundColor: '#fbfbfe'}}>
                {renderProfile(currentUser)}

                {
                    _.map(Menues.menu,(val)=>{
                        return(
                            <TouchableOpacity style={TouchableLink} onPress={()=>{
                                onRowPress(val.link);
                            }}>
                                <CardItem style={{}}>
                                    <Icon  name={val.icon}   style={{marginLeft:10, color:"#2eb9f9"}}   />
                                    <Text>{val.name}</Text>
                                </CardItem>
                            </TouchableOpacity>
                        )
                    })
                }
        </ScrollView>
    );
}


const TouchableLink = {
    backgroundColor: '#2eb9f9'
}

export {SideNavigationBar};