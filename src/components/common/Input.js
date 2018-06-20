import React from 'react';
import {TextInput,View } from 'react-native';
import {
    Content,
    Item,
    Input as InputText,
    Label,
    Icon
} from 'native-base';

const Input =({label,onFocus,multiline,numberOfLines,iconName,value,onChangeText,placeholder,secureTextEntry,isSubmitted=false,isDisabled=false})=>
{


    return(
        <Content>
            <Item rounded  error={(value == '' && isSubmitted == true)}
                    success={(!(value == '') && isSubmitted == true)} 
                style={{ elevation: 2,marginBottom:3,shadowOpacity: 0.3}}
            >
                <Icon  name={iconName}   style={{color:"#2eb9f9"}} />
                <InputText onFocus={onFocus} multiline={multiline} numberOfLines={numberOfLines} placeholder={label} disabled={isDisabled} secureTextEntry={secureTextEntry}  autoCorrect={false}  value={value} onChangeText={onChangeText} maxLength={30}  placeholderTextColor="#949dac" style={{color:"#949dac"}} />
            </Item>
        </Content>
    );

}

export {Input};
