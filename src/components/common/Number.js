import React from 'react';
import {TextInput,View } from 'react-native';
import {
    Content,
    Item,
    Input as InputText,
    Label,
    Icon
} from 'native-base';
const Number =({label,iconName,value,onChangeText,placeholder,secureTextEntry,maxLength,isSubmitted=false,isDisabled=false})=>
{


    return(
            <Item style={{elevation: 2,marginBottom:3,marginTop:1,shadowOpacity: 0.3,backgroundColor:'#fff'}} rounded  error={(value == '' && isSubmitted == true)}
                  success={(!(value == '') && isSubmitted == true)} >
                <Icon  name={iconName}   style={{color:"#2eb9f9",marginLeft:5}}  />
                <InputText placeholder={label} disabled={isDisabled}  blurOnSubmit={false}  secureTextEntry={secureTextEntry}  autoCorrect={false}  value={value} onChangeText={onChangeText} maxLength={maxLength} keyboardType="numeric"  placeholderTextColor="#949dac" style={{color:"#949dac"}} />
            </Item>
    );

}

export {Number};
