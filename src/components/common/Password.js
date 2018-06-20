import React from 'react';
import {TextInput,View } from 'react-native';
import {
    Content,
    Item,
    Input as InputText,
    Label,
    Icon
} from 'native-base';

const Password =({label,iconName,value,onChangeText,placeholder,secureTextEntry,isSubmitted=false,isDisabled=false})=>
{
    /*
   @Method : validatePassword
   @Params : password
   @Returns : *
   */
    validatePassword = (password) => {
     if(password.length > 5)
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
            <Item style={{elevation: 2,marginBottom:3,shadowOpacity: 0.3}} rounded  error={(isSubmitted == true && !(validatePassword(value)))}
                  success={(isSubmitted == true && (validatePassword(value)))}>
                <Icon  name="lock"   style={{color:"#2eb9f9"}}   />
                <InputText  placeholder={label} disabled={isDisabled} secureTextEntry={secureTextEntry}  autoCorrect={false}  value={value} onChangeText={onChangeText} maxLength={30}  placeholderTextColor="#949dac" style={{color:"#949dac"}} />
            </Item>
        </Content>
    );

}

export {Password};
