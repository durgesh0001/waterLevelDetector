import React from 'react';
import {ScrollView} from 'react-native';
import {Content,CardItem,Text,Container} from 'native-base';
import {Card} from './common';

const NetWorkError =()=>
{

    return(
        <Container style={styles.containerBackgroundColor} >
            <Content>
                <ScrollView style={{flux:1}}>
                        <Card>
                            <CardItem header style={styles.headerStyle}>
                                <Text style={styles.textStyle}>Please check your Internet connection</Text>
                            </CardItem>
                        </Card>
                </ScrollView>
            </Content>
        </Container>
    );

}
const styles = {
    containerBackgroundColor:{
        backgroundColor: '#fbfbfe'
    },
    headerStyle:{
        justifyContent: 'center',
        alignItems: 'center'
    },
    textStyle:{
        fontWeight:'bold',
        color:'red',
    }
}

export {NetWorkError};
