import React from 'react';
import {TextInput,View } from 'react-native';
import {
    Content,
    Item,
    Input as InputText,
    Label,
    Icon,
    Button,
    Text
} from 'native-base';

const renderEyeIcon=(secureTextEntry,onEyeClick)=>
{
    if(onEyeClick == undefined)
    {

    }
    else
    {
        if(secureTextEntry)
        {
            return(
                <Button transparent onPress={onEyeClick}>
                    <Icon  name="eye"   style={{color:"#2eb9f9"}}   />
                </Button>
            )
        }
        else
        {
            return(
                <Button transparent onPress={onEyeClick}>
                    <Icon  name="eye-off"   style={{color:"#2eb9f9"}}   />
                </Button>
            )
        }
    }

}


/*
@Method : renderError
@Params : email
@Returns : *
*/
renderErrorPassword = (isSubmitted,isValid,value,isLengthMessageShow)=>
{
    if(isSubmitted && value=='')
    {
        return (
            <View style={{flex:1,paddingLeft:30}}>
                <Text note style={{color:'red'}}>Password is required</Text>
            </View>
        )
    }
    else if(isSubmitted && (!(isValid)))
    {
        if(isLengthMessageShow)
        {
            return (
                <View style={{flex:1,paddingLeft:30}}>
                    <Text note style={{color:'red'}}>Password should have minimum 8 Charcters and 1 capital letter </Text>
                </View>
            )
        }

    }

}

const PasswordField =({label,isShadow,iconName,isLengthMessageShow,oldPassword,onEyeClick,value,onChangeText,placeholder,secureTextEntry,isSubmitted=false,isDisabled=false})=>
{

    /*
   @Method : validatePassword
   @Params : password
   @Returns : *
   */
    /*
  @Method : validatePassword
  @Params : password
  @Returns : *
  */
    validatePassword = (password) => {
        var re = /^(?=.*[A-Z]).{8,}$/;
        return re.test(password);
    };
    if(isShadow)
    {
        if(oldPassword)
        {
            return(
                <View style={{flex:1}}>
                    <Item rounded style={{elevation: 2,marginBottom:3,shadowOpacity: 0,backgroundColor:'#fff'}}  error={(isSubmitted == true && !(validatePassword(value)) && (oldPassword != value))}
                          success={(isSubmitted == true && (validatePassword(value)) && (oldPassword == value))}>
                        <Icon  name="lock"   style={{color:"#2eb9f9",marginLeft:5}}   />
                        <InputText   placeholderTextColor="#949dac"  placeholder={label} disabled={isDisabled} secureTextEntry={secureTextEntry}  autoCorrect={false}  value={value} onChangeText={onChangeText} maxLength={30}  />
                        {renderEyeIcon(secureTextEntry,onEyeClick)}
                    </Item>
                </View>
            );

        }
        else
        {
            return(
                <View style={{flex:1}}>
                    <Item rounded  style={{elevation: 2,marginBottom:3,shadowOpacity: 0,backgroundColor:'#fff'}} error={(isSubmitted == true && !(validatePassword(value)))}
                          success={(isSubmitted == true && (validatePassword(value)))}>
                        <Icon  name="lock"   style={{color:"#2eb9f9",marginLeft:5}}  />
                        <InputText   placeholderTextColor="#949dac"  placeholder={label} disabled={isDisabled} secureTextEntry={secureTextEntry}  autoCorrect={false}  value={value} onChangeText={onChangeText} maxLength={30}  />
                        {renderEyeIcon(secureTextEntry,onEyeClick)}
                    </Item>
                </View>
            );

        }
    }
    else
    {
        if(oldPassword)
        {
            return(
                <View style={{flex:1}}>
                    <Item rounded style={{elevation: 2,marginBottom:3,shadowOpacity: 0.3,backgroundColor:'#fff'}}  error={(isSubmitted == true && !(validatePassword(value)) && (oldPassword != value))}
                          success={(isSubmitted == true && (validatePassword(value)) && (oldPassword == value))}>
                        <Icon  name="lock"   style={{color:"#2eb9f9",marginLeft:5}}   />
                        <InputText   placeholderTextColor="#949dac"  placeholder={label} disabled={isDisabled} secureTextEntry={secureTextEntry}  autoCorrect={false}  value={value} onChangeText={onChangeText} maxLength={30}  />
                        {renderEyeIcon(secureTextEntry,onEyeClick)}
                    </Item>
                </View>
            );

        }
        else
        {
            return(
                <View style={{flex:1}}>
                    <Item rounded  style={{elevation: 2,marginBottom:3,shadowOpacity: 0.3,backgroundColor:'#fff'}} error={(isSubmitted == true && !(validatePassword(value)))}
                          success={(isSubmitted == true && (validatePassword(value)))}>
                        <Icon  name="lock"   style={{color:"#2eb9f9",marginLeft:5}}  />
                        <InputText   placeholderTextColor="#949dac"  placeholder={label} disabled={isDisabled} secureTextEntry={secureTextEntry}  autoCorrect={false}  value={value} onChangeText={onChangeText} maxLength={30}  />
                        {renderEyeIcon(secureTextEntry,onEyeClick)}
                    </Item>
                </View>
            );

        }
    }




}

export {PasswordField};
