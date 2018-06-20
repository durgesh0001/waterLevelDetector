import React from 'react';
import {TextInput,View } from 'react-native';
import {
    Content,
    Item,
    Input as InputText,
    Label,
    Icon
} from 'native-base';

const Phone =({label,value,onChangeText,placeholder,secureTextEntry,isSubmitted=false,isDisabled=false})=>
{

    /*
   @Method : validatePhone
   @Params : password
   @Returns : *
   */
    validatePhone = (phone) => {
        if(phone.length > 9)
        {
            return true;
        }
        else
        {
            return false;
        }
    };

    return(
        <Content>
            <Item rounded style={{elevation: 2,marginBottom:3,shadowOpacity: 0.3}} error={(isSubmitted == true && !(validatePhone(value)))}
                  success={(isSubmitted == true && (validatePhone(value)))}>
                <Icon  name="call"   style={{color:"#2eb9f9"}}   />
                <InputText disabled={isDisabled}  placeholder={label} secureTextEntry={secureTextEntry}  autoCorrect={false}  value={value} onChangeText={onChangeText} maxLength={30} keyboardType="phone-pad"  placeholderTextColor="#949dac" style={{color:"#949dac"}}/>
            </Item>
        </Content>
    );

}

export {Phone};
