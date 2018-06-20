import React from 'react';
import {TextInput,View,Image } from 'react-native';
import {
    Content,
    Item,
    Input as InputText,
    Label,
    Icon,
    Text
} from 'native-base';

const EmailInput =({label,value,onChangeText,placeholder,secureTextEntry,isSubmitted=false,isDisabled=false,onFocus="",onBlur=""})=>
{

    /*
@Method : renderError
@Params : email
@Returns : *
*/
    renderError = (isSubmitted,isValid,value)=>
    {
        if(isSubmitted && (value == ''))
        {
            return (
                <View style={{flex:1,paddingLeft:30}}>
                    <Text note style={{color:'red'}}>Email is required</Text>
                </View>
            )
        }
        else if(isSubmitted && (!(isValid)))
        {
            return (
                <View style={{flex:1,paddingLeft:30}}>
                <Text note style={{color:'red'}}>Email is Invalid</Text>
                </View>
            )
        }

    }

    /*
  @Method : validateEmail
  @Params : email
  @Returns : *
  */
    validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };

    return(
           <View style={{flex:1}}>
            <Item  style={{elevation: 2,marginBottom:3,shadowOpacity: 0.3,backgroundColor:'#fff'}} rounded  error={(isSubmitted == true && !(validateEmail(value)))}
                   success={(isSubmitted == true && (validateEmail(value)))}>

                <Icon  name='mail' style={{color:"#2eb9f9",marginLeft:5}}/>
                <InputText  onFocus={onFocus} onBlur={onBlur} disabled={isDisabled} placeholder={label} secureTextEntry={secureTextEntry}  autoCorrect={false}   value={value} onChangeText={onChangeText} maxLength={45} keyboardType="email-address" placeholderTextColor="#949dac" style={{color:"#949dac"}} />
            </Item>

               {renderError(isSubmitted,validateEmail(value),value)}
           </View>

);

}

export {EmailInput};
