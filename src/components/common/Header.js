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
    Input,
    Drawer
} from 'native-base';
import {Actions} from 'react-native-router-flux';
import {ImageBackground} from 'react-native';



/*
@Method : HeaderComponent
@Params :
@Returns : *
*/

const HeaderComponent =({label,onPress,isBackActive,isSettingActive=false,isSearchActive=false,children})=>
{
    return(
        <ImageBackground source={require('../../images/header-bg.jpg')} style={styles.headerStyle}>
            <Header  style={{ backgroundColor: "transparent" }} searchBar rounded>

                <Left style={{ flex: 1 }}>
                    {renderBackOrMenuButton(onPress,isBackActive,isSettingActive)}
                </Left>
                <Body style={{ flex: 1,  justifyContent: 'center', alignItems: 'center' }}>
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
            </Button>
        ) ;
    }
    else if(isSearchActive)
    {
        return(
            <Button transparent >
                <Icon name="search" />
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
const renderBackOrMenuButton=(onPress,isBackActive)=>
{
    if(isBackActive)
    {
            return(
                <Button transparent onPress={()=>{
                    Actions.pop();
                }}>
                    <Icon name='ios-arrow-back'></Icon>
                </Button>
            ) ;
    }
    else
    {
        return(
            <Button transparent onPress={onPress}>
                <Icon name='ios-menu'></Icon>
            </Button>
        ) ;
    }

}


export {HeaderComponent};

const styles = {
    headerStyle:{
        // backgroundColor:'#2eb9f9',
        textAlign:'center'
    },
    titleStyle : {
        textAlign:'center'
    }

};
