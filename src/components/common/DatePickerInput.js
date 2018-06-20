import React from 'react';
import {TextInput,View } from 'react-native';
import {
    Content,
    Item,
    Input as InputText,
    Label,
    Icon
} from 'native-base';
import DatePicker from 'react-native-datepicker'


const DatePickerInput =({label,onFocus,iconName,onDateChange,minDate,maxDate,value,onChangeText,placeholder,secureTextEntry,isSubmitted=false,isDisabled=false})=>
{


    return(
        <Content>
            <Item  style={{backgroundColor:'#fff', elevation: 2,marginBottom:3,shadowOpacity: 0.3}} rounded  error={(value == '' && isSubmitted == true)}
                  success={(!(value == '') && isSubmitted == true)} >
                <Icon  name={iconName}   style={{color:"#2eb9f9"}} color="#2eb9f9"  />
                <DatePicker
                    style={{height:54,lineHeight:54}}
                    date={value}
                    showIcon={false}
                    mode="date"
                    placeholder={placeholder}
                    format="YYYY-MM-DD"
                    minDate={minDate}
                    maxDate={maxDate}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    onDateChange={onDateChange}
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0,
                            color:"#2eb9f9"
                        },
                        dateInput: {
                            backgroundColor:'#fff',
                            marginRight: 50,
                            borderWidth:0,borderBottomWidth:0,
                            placeholderTextColor:"#949dac",
                            color:"#949dac",
                            paddingTop:10
                        }
                    }}

                />
            </Item>
        </Content>
    );

}

export {DatePickerInput};
