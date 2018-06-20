import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {Alert} from 'react-native';
import {RESET_DEVICE_DETAILS,GET_HISTORY_SUCCESS,BASE_URL,DEVICE_ID_FETCH_SUCCESS,LOADER_START,LOADER_END,DEVICE_FETCH_SUCCESS,TankTypeChanged,DeviceIdChanged,DeviceNameChanged,TankNameChanged,TankLocationChanged,TankHeightChanged,TankWidthChanged,TankDepthChanged} from '../types'
import _ from 'lodash';
import axios from 'axios';


/*
   @Method : DeviceIdChanged
   @Params :
   @Returns : *
   */
export const onDeviceIdChanged = (text) => {

    return {
        type: DeviceIdChanged,
        payload: text

    }
};
/*
   @Method : onDeviceNameChanged
   @Params :
   @Returns : *
   */
export const onDeviceNameChanged = (text) => {

    return {
        type: DeviceNameChanged,
        payload: text

    }
};

/*
   @Method : onTankNameChanged
   @Params :
   @Returns : *
   */
export const onTankNameChanged = (text) => {

    return {
        type: TankNameChanged,
        payload: text

    }
};

/*
   @Method : onTankLocationChanged
   @Params :
   @Returns : *
   */
export const onTankLocationChanged = (text) => {

    return {
        type: TankLocationChanged,
        payload: text

    }
};

/*
   @Method : onTankHeightChanged
   @Params :
   @Returns : *
   */
export const onTankHeightChanged = (text) => {

    return {
        type: TankHeightChanged,
        payload: text

    }
};

/*
   @Method : onTankWidthChanged
   @Params :
   @Returns : *
   */
export const onTankWidthChanged = (text) => {

    return {
        type: TankWidthChanged,
        payload: text

    }
};

/*
   @Method : onTankDepthChanged
   @Params :
   @Returns : *
   */
export const onTankDepthChanged = (text) => {

    return {
        type: TankDepthChanged,
        payload: text

    }
};

/*
   @Method : onTankTypeChanged
   @Params :
   @Returns : *
   */
export const onTankTypeChanged = (text) => {

    return {
        type: TankTypeChanged,
        payload: text

    }
};
/*
   @Method : getSearchDeviceList
   @Params :
   @Returns : *
   */
export const getSearchDeviceList =(data)=>
{
    return (dispatch)=> {
        dispatch({type: DEVICE_FETCH_SUCCESS, payload:data.search});
    }
}


/*
   @Method : getHistory
   @Params :
   @Returns : *
   */
export const getHistory=({device_id,time_filter,date,type})=>{
    return (dispatch) => {
        dispatch({type: LOADER_START})
        axios.post(BASE_URL+'reading/tankReading', {
            deviceId: device_id,
            timeFilter: time_filter,
            date:date,
            type:type
        }).then(function (response) {
                dispatch({type: GET_HISTORY_SUCCESS, payload:response.data});
            })
            .catch(function (error) {
                Alert.alert('Error', 'Something is wrong,Please try again');
                requestFail(dispatch);
            });
    };
}


/*
   @Method : getDevices
   @Params :
   @Returns : *
   */
export const getDevices=()=>{
    return (dispatch) => {
        dispatch({type: LOADER_START})
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref("/devices");
        ref.orderByChild("userId").equalTo(`${currentUser.uid}`).on("value", snapshot => {
            requestSuccess(dispatch);
            dispatch({type: DEVICE_FETCH_SUCCESS, payload:snapshot.val()});
        });
    };
}

/*
   @Method : getDevicesByDeviceId
   @Params :
   @Returns : *
   */
export const getDevicesByDeviceId=(device_id)=>{
    return (dispatch) => {
        dispatch({type: LOADER_START})
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref("/devices");
        ref.orderByChild("device_id").equalTo(`${device_id}`).on("value", snapshot => {
            _.map(snapshot.val(),(val,uid)=>{
                val.uid = uid;
                if(val.device_id)
                {
                    dispatch({type: DEVICE_ID_FETCH_SUCCESS, payload:val});

                }
            });
            requestSuccess(dispatch);
        });
    };
}
export const updateDeviceDetails=({uid,device_id, device_name,tank_name,tank_location,tank_height,tank_width,tank_depth,tank_type})=>{
    return(dispatch)=>{
        dispatch({type: LOADER_START})
        firebase.database().ref(`/devices/${uid}`)
            .update({device_name,tank_name,tank_location,tank_height,tank_width,tank_type,tank_depth,is_deleted:false,updated_at:Date.now()})
            .then(() => {
                Alert.alert('Success', 'Device has been saved successfully');
                requestSuccess(dispatch);
                Actions.DeviceComponent();


            })
            .catch(function (error) {
                Alert.alert('Error', 'Something is wrong,Please try again');
                requestFail(dispatch);

            });
    }
}
/*
   @Method : resetDeviceDetails
   @Params :
   @Returns : *
   */

export const resetDeviceDetails=()=>{
    return (dispatch) => {
        dispatch({type: RESET_DEVICE_DETAILS});
    }
}

export const addDevice = ({device_id, device_name,tank_name,tank_location,tank_height,tank_width,tank_depth,tank_type}) => {
    return (dispatch) => {
        const tankStatus = {
            percentage :0,
            time : Date.now()

        };
        dispatch({type: LOADER_START});
        let ref = firebase.database().ref("/devices");
        ref.orderByChild("device_id").equalTo(device_id).once('value')
            .then(function(dataSnapshot) {
                if(dataSnapshot.val() == null)
                {
                    let user = firebase.auth().currentUser;
                    firebase.database().ref(`/devices`)
                        .push({device_id, device_name,tank_name,tank_location,tank_height,tank_width,tank_type,tank_depth,userId:user.uid,created_at:Date.now(),is_deleted:false,tank_status:tankStatus,updated_at:Date.now()})
                        .then(() => {
                            Alert.alert('Success', 'Device added successfully');
                            dispatch({type: RESET_DEVICE_DETAILS});
                            requestSuccess(dispatch);
                            Actions.DeviceComponent();
                        })
                        .catch(() => {
                            requestFail(dispatch);
                            Alert.alert('Error', 'Something is wrong,Please try again');
                        })
                }
                else
                {
                    requestFail(dispatch);
                    Alert.alert('Error', 'Device already exists');
                }
            })
             .catch(() => {
                 requestFail(dispatch);
                 Alert.alert('Error', 'Something is wrong,Please try again');

                });

    };
}

/*
   @Method : requestSuccess
   @Params :
   @Returns : *
   */
const requestSuccess = (dispatch) => {
    dispatch({type: LOADER_END});

};
/*
   @Method : requestFail
   @Params :
   @Returns : *
   */
const requestFail = (dispatch) => {
    dispatch({type: LOADER_END});

};


