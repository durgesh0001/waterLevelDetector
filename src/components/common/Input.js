import React from 'react';
import {TextInput,View } from 'react-native';
import {
    Content,
    Item,
    Input as InputText,
    Label,
    Icon
} from 'native-base';

const Input =({label,onFocus,multiline,isShadow,numberOfLines,iconName,value,onChangeText,placeholder,secureTextEntry,isSubmitted=false,isDisabled=false})=>
{
    if(multiline)
    {
        return(
            <Item rounded  error={(value == '' && isSubmitted == true)}
                  success={(!(value == '') && isSubmitted == true)}
                  style={{ elevation: 2,marginBottom:3,shadowOpacity: 0.3,backgroundColor:'#fff'}}
            >
                <Icon  name={iconName}   style={{color:"#2eb9f9",marginLeft:5}} />
                <InputText onFocus={onFocus}    multiline={true} numberOfLines={5}  blurOnSubmit={false} placeholder={label} disabled={isDisabled} autoCorrect={false}  value={value} onChangeText={onChangeText} maxLength={100}  placeholderTextColor="#949dac" style={{color:"#949dac",height:100, maxHeight:100}} />
            </Item>
        );
    }
    else if(isShadow)
    {
        return(
            <Item rounded  error={(value == '' && isSubmitted == true)}
                  success={(!(value == '') && isSubmitted == true)}
                  style={{ elevation: 2,marginBottom:3,shadowOpacity:0,backgroundColor:'#fff'}}
            >
                <Icon  name={iconName}   style={{color:"#2eb9f9",marginLeft:5}} />
                <InputText onFocus={onFocus}    multiline={multiline} numberOfLines={numberOfLines} blurOnSubmit={false} placeholder={label} disabled={isDisabled} secureTextEntry={secureTextEntry}  autoCorrect={false}  value={value} onChangeText={onChangeText} maxLength={100}  placeholderTextColor="#949dac" style={{color:"#949dac"}} />
            </Item>
        );
    }
    else
    {
        return(
            <Item rounded  error={(value == '' && isSubmitted == true)}
                  success={(!(value == '') && isSubmitted == true)}
                  style={{ elevation: 2,marginBottom:3,shadowOpacity: 0.3,backgroundColor:'#fff'}}
            >
                <Icon  name={iconName}   style={{color:"#2eb9f9",marginLeft:5}} />
                <InputText onFocus={onFocus}    multiline={multiline} numberOfLines={numberOfLines} blurOnSubmit={false} placeholder={label} disabled={isDisabled} secureTextEntry={secureTextEntry}  autoCorrect={false}  value={value} onChangeText={onChangeText} maxLength={100}  placeholderTextColor="#949dac" style={{color:"#949dac"}} />
            </Item>
        );
    }


}

export {Input};
