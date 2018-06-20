import React from 'react';
import {View,TouchableOpacity,ScrollView,Alert,StatusBar,Dimensions} from 'react-native';
import {Container,Thumbnail,Content,Icon,CardItem,Item,Card,Text,Header,Drawer,Button,Left,Right,Body} from 'native-base';
import {Menues} from './common';
import {Actions} from 'react-native-router-flux';
import _ from 'lodash';
import firebase from 'firebase';
import FCM from 'react-native-fcm';
import MenuPanel from './MenuPanel';

let deviceHeight = Dimensions.get("window").height;
deviceHeight = parseFloat(deviceHeight) - 632;






const SideNavigationBar =({children,isMenuActive,onSideMenuChange,onClose})=>
{
  const {currentUser} = firebase.auth();
  if(Actions.currentScene =="Devices" || Actions.currentScene =="HomeComponent" || Actions.currentScene =="Home")
  {
    return (
      <Drawer
      style={{border:0}}
      ref={(ref) => { drawer = ref; }}
      open={isMenuActive}
      content={MenuComponent(currentUser)}
      onClose={onClose}
      >
      {children}
      </Drawer>
    )
  }
  else
  {
    return (
      <Drawer
      style={{border:0}}
      ref={(ref) => { drawer = ref; }}
      open={false}
      content={MenuComponent(currentUser)}
      >
      {children}
      </Drawer>
    )
  }
}


const renderProfile =(currentUser)=>
{
  if(currentUser)
  {
    return (
      <Header style={{height:100,paddingTop:20,paddingBottom:7,backgroundColor: '#23b5f7'}}>
      <Left>
      {renderPicture(currentUser)}
      </Left>
      <Body style={{paddingLeft:10}}>
      <Text style={{color:'#fff'}}>{currentUser.displayName}</Text>
      </Body>
      <Right>

      </Right>
      </Header>
    )
  }
}

renderPicture=(currentUser)=>
{
  if(currentUser)
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
}

const onRowPress=(val)=>{

  if(val)
  {

    if(val == "HomeComponent")
    {
      Actions.Home();
    }
    else if(val == "Devices")
    {
      Actions.Devices();
    }
    else if(val == "Profile")
    {
      Actions.Profile();
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
    else if(val == "BluetoothComponents")
    {
      Actions.BluetoothComponents();
    }
    else if(val == "ChangePasswordForm")
    {
      Actions.ChangePasswordForm();
    }
    else if(val == "Logout")
    {
      Alert.alert(
        'Logout',
        'Are you sure, you want to logout?',
        [
          {text: 'No', onPress: () => console.log('Cancel Pressed')},
          {text: 'Yes', onPress: () => {
            FCM.getFCMToken().then(token => {
              let user = firebase.auth().currentUser;
              let ref = firebase.database().ref(`/tokens/${user.uid}`);
              ref.orderByChild("device_token").equalTo(token).once('value')
              .then(function(dataSnapshot) {
                if(dataSnapshot.val() == null)
                {
                  firebase.auth().signOut().then(function() {
                    Actions.Auth({type:'reset'});
                  }, function(error) {
                    Alert.alert('Error', 'Something is wrong,Please try again');
                  });
                }
                else
                {
                  _.map(dataSnapshot.val(),(value,key)=>{
                    firebase.database().ref(`/tokens/${user.uid}/${key}`)
                    .remove()
                    .then(() => {
                      firebase.auth().signOut().then(function() {
                        Actions.Auth();
                      }, function(error) {
                        Alert.alert('Error', 'Something is wrong,Please try again');
                      });
                    })
                    .catch(() => {
                      Alert.alert('Error', 'Something is wrong,Please try again');
                    })
                  });

                }
              })
              .catch(() => {
                Alert.alert('Error', 'Something is wrong,Please try again');

              });
            }).catch(() => {
              Alert.alert('Error', 'Something is wrong,Please try again');

            });

          }},
        ],
        { cancelable: false }
      )

    }
  }

}


const MenuComponent=(currentUser) => {
  return(
    <Container >
    <Content bounces={false} style={{overflow:"hidden",backgroundColor:'#fff'}}>
    {renderProfile(currentUser)}

    {
      _.map(Menues.menu,(val)=>{
        return(
          renderMenus(val.name,val.link,val.icon,val.submenu)
        )
      })
    }


    </Content>
    </Container>
  );
}

/*
@Method : renderSubMenu
@Params :
@Returns : *
*/
renderSubMenu=(name,submenu) =>
{
  return(
    _.map(submenu,(val,key) =>{
      if(Actions.currentScene == val.link)
      {
        return(
          <TouchableOpacity style={TouchableLink} onPress={()=>{onRowPress(val.link,(Actions.currentScene == val.link))}}
          >
          <CardItem style={{backgroundColor:'#2eb9f9',borderWidth:0,borderRightWidth:0,borderRadius:0}}>
          <Text >       </Text>
          <Icon  name={val.icon}   style={{paddingLeft:5,color:"#fff"}}   />
          <Text style={{color:'#fff'}}>{val.name}</Text>
          </CardItem>

          </TouchableOpacity>
        )

      }else{
        return(
          <TouchableOpacity style={TouchableLink} onPress={()=>{onRowPress(val.link,(Actions.currentScene == val.link))}}
          >
          <CardItem style={{backgroundColor:'#fff',border:0}} >
          <Text >       </Text>
          <Icon  name={val.icon}   style={{paddingLeft:5, color:"#2eb9f9"}}   />
          <Text>{val.name}</Text>
          </CardItem>
          </TouchableOpacity>
        )
      }
    })
  )
}

/*
@Method : renderMenus
@Params :
@Returns : *
*/
const renderMenus = (name,link,icon,submenu) => {
  if(_.isEmpty(submenu))
  {
    if(Actions.currentScene == link)
    {
      return(
        <TouchableOpacity style={TouchableLink} onPress={() => {
          onRowPress(link,(Actions.currentScene == link));
        }}>
        <CardItem style={{backgroundColor:'#2eb9f9',borderWidth:0,borderRightWidth:0,borderRadius:0}}>
        <Icon  name={icon}   style={{paddingLeft:5,color:"#fff"}}   />
        <Text style={{color:'#fff'}}>{name}</Text>
        </CardItem>
        </TouchableOpacity>
      )
    }else{
      return(
        <TouchableOpacity style={TouchableLink} onPress={()=>{
          onRowPress(link,(Actions.currentScene == link));
        }}>
        <CardItem style={{backgroundColor:'#fff',border:0}} >
        <Icon  name={icon}   style={{paddingLeft:5, color:"#2eb9f9"}}   />
        <Text>{name}</Text>
        </CardItem>
        </TouchableOpacity>
      )
    }
  }else{
    return(
      <MenuPanel title={name} iconVal={icon}>
      <View>
      {renderSubMenu(name,submenu)}
      </View>
      </MenuPanel>
    )
  }
}




const TouchableLink = {
  backgroundColor: '#fff'
}

export {SideNavigationBar};
