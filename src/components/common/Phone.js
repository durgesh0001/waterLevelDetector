import React from 'react';
import {TextInput,View } from 'react-native';
import {
    Content,
    Item,
    Input as InputText,
    Label,
    Icon,
    Text
} from 'native-base';

const Phone =({label,value,onChangeText,placeholder,secureTextEntry,isSubmitted=false,isDisabled=false,onFocus="",onBlur=""})=>
{

    /*
@Method : renderErrorPhone
@Params : email
@Returns : *
*/
    renderErrorPhone = (isSubmitted,isValid,value)=>
    {
        if(isSubmitted && (value == ''))
        {
            return (
                <View style={{flex:1,paddingLeft:30}}>
                    <Text note style={{color:'red'}}>Mobile Number is required</Text>
                </View>
            )
        }
        else if(isSubmitted && (!(isValid)))
        {
            return (
                <View style={{flex:1,paddingLeft:30}}>
                    <Text note style={{color:'red'}}>Mobile Number is not valid, it should be like (+966---------) </Text>
                </View>
            )
        }

    }

    /*
   @Method : validatePhone
   @Params : password
   @Returns : *
   */
    validatePhone = (phone) => {
        if(phone.length > 9)
        {
            let re = /^\+[1-9]{1}[0-9]{3,14}$/;
            return re.test(phone);
        }
        else
        {
            return false;
        }
    };

    return(
        <View style={{flex:1}}>
            <Item rounded style={{elevation: 2,marginBottom:3,shadowOpacity: 0.3,backgroundColor:'#fff'}} error={(isSubmitted == true && !(validatePhone(value)))}
                  success={(isSubmitted == true && (validatePhone(value)))}>
                <Icon  name="call"   style={{color:"#2eb9f9",marginLeft:5}} />
                <InputText  onFocus={onFocus} onBlur={onBlur} disabled={isDisabled}   placeholder={label} secureTextEntry={secureTextEntry}  autoCorrect={false}  value={value} onChangeText={onChangeText} maxLength={13} keyboardType="phone-pad"  placeholderTextColor="#949dac" style={{color:"#949dac"}}/>
            </Item>
            {this.renderErrorPhone(isSubmitted,validatePhone(value),value)}
        </View>
    );

}

export {Phone};