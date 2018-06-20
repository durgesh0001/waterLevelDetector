import React from 'react';
import {View,Image} from 'react-native';
import {Content,CardItem,Text,Container,Form} from 'native-base';
import {Card,AuthFooter} from './common';

const NetWorkError =()=>
{

    return (
        <Container style={styles.containerBackgroundColor} >
            <Content bounces={false} >
                    <Form>
                        <Card>
                            <CardItem header style={styles.headerStyle}>
                                <Text style={styles.textStyle}>No Internet Connection </Text>
                            </CardItem>
                            <CardItem style={styles.headerStyle}>
                                <Text note>Please Check your Internet Settings
                                </Text>
                            </CardItem>
                            <CardItem style={styles.headerStyle}>
                                <Image source={require("../images/noInternet.png")} style={{height: 121, width: 134}} />
                            </CardItem>
                        </Card>
                    </Form>
            </Content>
            <AuthFooter />
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
        fontWeight:'bold'
    }
}

export {NetWorkError};
