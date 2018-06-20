import React from 'react';
import {
    Header,
    Left,
    Button,
    Body,
    Title,
    Icon,
    Right,
    Item,
    Text,
    Input,
    Drawer
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import {ImageBackground,StatusBar} from 'react-native';



/*
@Method : HeaderComponent
@Params :
@Returns : *
*/

const HeaderComponent =({label,onPress,isBackActive,isSettingActive=false,isSearchActive=false,isHeight=false,children,isBleActive})=>
{

    if(isHeight)
    {
        return(
            <ImageBackground source={require('../../images/header-bg.jpg')} style={styles.headerStyleWithHeight}>
                <Header  androidStatusBarColor="#2eb9f9"  style={{ backgroundColor: "transparent",elevation: 0,shadowOpacity:0,borderBottomWidth:0}}  searchBar rounded>

                    <Left style={{ flex: 1 }}>
                        {renderBackOrMenuButton(onPress,isBackActive,isSettingActive,isBleActive)}
                    </Left>
                    <Body style={{ flex: 3,  justifyContent: 'center', alignItems: 'center' }}>
                    <Title  style={styles.titleStyle} >
                        {label}
                    </Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                        {children}
                    </Right>
                </Header>

            </ImageBackground>
        );
    }
    else
    {
        return(
            <ImageBackground source={require('../../images/header-bg.jpg')} style={styles.headerStyle}>
                <Header androidStatusBarColor="#2eb9f9" style={{ backgroundColor: "transparent",elevation: 0,shadowOpacity:0,borderBottomWidth:0}}  searchBar rounded>

                    <Left style={{ flex: 1 }}>
                        {renderBackOrMenuButton(onPress,isBackActive,isSettingActive,isBleActive)}
                    </Left>
                    <Body style={{ flex: 3,  justifyContent: 'center', alignItems: 'center' }}>
                    <Title  style={styles.titleStyle} >
                        {label}
                    </Title>
                    </Body>
                    <Right style={{ flex: 1 }}>
                        {children}
                    </Right>
                </Header>

            </ImageBackground>
        );
    }


}

/*
@Method : renderSettingIcon
@Params :
@Returns : *
*/
const renderSettingOrSearchIcon=(isSettingActive,isSearchActive)=>
{
    if(isSettingActive)
    {
        return(
            <Button transparent >
                <Icon name="settings" />
                <Text>   </Text>
            </Button>
        ) ;
    }
    else if(isSearchActive)
    {
        return(
            <Button transparent >
                <Icon name="search" />
                <Text>   </Text>
            </Button>
        ) ;

    }
    else
    {

    }

}
/*
@Method : renderBackOrMenuButton
@Params :
@Returns : *
*/
const renderBackOrMenuButton=(onPress,isBackActive,isSettingActive,isBleActive)=>
{
    if(isBleActive)
    {
        return(
            <Button  large transparent onPress={()=>{
                Actions.Home();
            }}>
                <Icon name='ios-arrow-back'></Icon>
                <Text>   </Text>
            </Button>
        ) ;
    }

    else if(isBackActive)
    {
            return(
                <Button  large transparent onPress={()=>{
                    Actions.pop();
                }}>
                    <Icon name='ios-arrow-back'></Icon>
                    <Text>   </Text>
                </Button>
            ) ;
    }
    else
    {
        return(
            <Button large  transparent onPress={onPress}>
                <Icon name='ios-menu'></Icon>
                <Text>   </Text>
            </Button>
        ) ;
    }

}


export {HeaderComponent};

const styles = {
    headerStyle:{
        // backgroundColor:'#2eb9f9',
        textAlign:'center',
        resizeMode: 'contain'
    },
    headerStyleWithHeight:{
        // backgroundColor:'#2eb9f9',
        textAlign:'center',
        resizeMode: 'contain',
        paddingBottom:30
    },
    titleStyle : {
        textAlign:'center'
    }
};
