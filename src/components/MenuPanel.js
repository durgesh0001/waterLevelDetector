import React, { Component } from 'react';
import {StyleSheet,Text,View,Image,TouchableHighlight,Animated} from 'react-native';
import {Icon} from 'native-base';

class MenuPanel extends Component{
    constructor(props){
        super(props);
        this.state = {
            title       : props.title,
            iconVal       : props.iconVal,
            expanded    : false,
            animation   : new Animated.Value()
        };
    }


    toggle(){
        let initialValue    = this.state.expanded? this.state.maxHeight + this.state.minHeight : this.state.minHeight,
            finalValue      = this.state.expanded? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

        this.setState({
            expanded : !this.state.expanded
        });

        this.state.animation.setValue(initialValue);
        Animated.spring(
            this.state.animation,
            {
                toValue: finalValue
            }
        ).start();
    }

    _setMaxHeight(event) {
       if (!this.state.maxHeight) {
         this.setState({
           maxHeight: event.nativeEvent.layout.height,
         });
       }
     }

     _setMinHeight(event) {
       if (!this.state.minHeight) {
         this.setState({
           minHeight: event.nativeEvent.layout.height,
           animation: new Animated.Value(event.nativeEvent.layout.height),
         });
       }
     }

    render(){
        let icon = 'ios-add-outline';

        if(this.state.expanded){
            icon = 'ios-remove-outline';
        }

        return (
            <Animated.View
                style={[styles.container,{height: this.state.animation}]}>
                <TouchableHighlight
                    style={styles.button}
                    onPress={this.toggle.bind(this)}
                    underlayColor="#fff">
                <View style={styles.titleContainer} onLayout={this._setMinHeight.bind(this)}>
                    <Icon name={this.state.iconVal} style={{fontSize: 25,marginLeft:22,marginTop:18, color:"#23b5f7"}}   />
                    <Text style={styles.list_header}>{this.state.title}</Text>
                    <Icon name={icon} style={styles.iconStyle} />
                </View>
                </TouchableHighlight>
                <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
                    {this.props.children}
                </View>
            </Animated.View>
        );
    }
}

var styles = StyleSheet.create({
    container : {
        backgroundColor: '#fff',
        margin:-2,
        borderWidth: 2,
        borderRadius: 0,
        borderColor: 'transparent',
        overflow:'hidden',
        height : 52
    },
    iconStyle : {
        color : '#23b5f7',
        marginRight : 10,
        marginTop : 18,
        fontSize: 25
    },
    titleContainer : {
        flexDirection: 'row',
        marginTop : -2
    },
    title       : {
        flex    : 1,
        padding : 10,
        color   :'#2a2f43',
        fontWeight:'bold',
        marginTop : -2
    },
    button      : {

    },
    buttonImage : {
        width   : 30,
        height  : 25
    },
    body        : {
        paddingTop  : 0
    },
    list_container: {
        flex: 1,
        flexDirection: 'column',
        borderRadius: 4,
        margin:3,
        padding:10,
        backgroundColor : '#f4f7f9',
        paddingTop : 30,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,.2)'
      },
      list_item: {
        fontSize: 15,
      },
      list_header: {
        margin:10,
        marginTop:20,
        marginBottom:20,
        marginLeft:10,
        fontSize: 16,
        color:'#949dac',
        //fontWeight:'500'

            },
      list_sub_header: {
        fontSize: 17,
        fontWeight :'bold',
      },
});

export default MenuPanel;
