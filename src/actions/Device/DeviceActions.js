import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {TankCountryChanged,COUNTRY_FETCH_SUCCESS,DeviceIdForConnection,RESET_DEVICE_DETAILS,DEVICE_FETCH_SUCCESS_FOR_FILTER,GET_HISTORY_SUCCESS,BASE_URL,DEVICE_ID_FETCH_SUCCESS,LOADER_START,LOADER_END,DEVICE_FETCH_SUCCESS,TankTypeChanged,DeviceIdChanged,DeviceNameChanged,TankNameChanged,TankLocationChanged,TankHeightChanged,TankWidthChanged,TankDepthChanged,TankCityChanged,TankAreaChanged,AREA_FETCH_SUCCESS,CITY_FETCH_SUCCESS,showToast} from '../types'
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
   @Method : deviceIdForConnection
   @Params :
   @Returns : *
   */
export const OndeviceIdForConnection = (text) => {

    return {
        type: DeviceIdForConnection,
        payload: text

    }
};


/*
   @Method : onTankTypeChanged
   @Params :
   @Returns : *
   */
export const onTankCityChanged = (text) => {

    return {
        type: TankCityChanged,
        payload: text

    }
};
/*
   @Method : onTankTypeChanged
   @Params :
   @Returns : *
   */
export const onTankAreaChanged = (text) => {
    return {
        type: TankAreaChanged,
        payload: text

    }
};

/*
   @Method : onTankContryChanged
   @Params :
   @Returns : *
   */
export const onTankContryChanged = (text) => {
    return (dispatch)=> {
        dispatch({type: TankCountryChanged, payload:text});
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
        const {currentUser} = firebase.auth();
        let d = new Date();
        let n = d.getTimezoneOffset();
        let mileSeconds = parseFloat(n) * 6000;
        dispatch({type: LOADER_START})
        axios.post(BASE_URL+'reading/tankReading', {
            deviceId: device_id,
            timeFilter: time_filter,
            date:date,
            type:type,
            timeDifference:mileSeconds,
            userId:currentUser.uid
        }).then(function (response) {
                dispatch({type: GET_HISTORY_SUCCESS, payload:response.data});
            })
            .catch(function (error) {
                showToast("danger","Sorry some error occurred, please try again later!");
                requestFail(dispatch);
            });
    };
}

/*
   @Method : getCity
   @Params :
   @Returns : *
   */
export const getCity=(country_id)=>{
   return (dispatch) => {
        dispatch({type: LOADER_START})
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref(`/cities`);
        ref.orderByChild("country_id").equalTo(`${country_id}`).on("value", snapshot => {
            requestSuccess(dispatch);
            let city =[];
            _.map(snapshot.val(),(val,uid)=>{
                if(val.is_deleted == false) {
                    val.id = uid;
                    city.push(val);
                }
            });
            dispatch({type: CITY_FETCH_SUCCESS, payload:city});
        });
    };
}

/*
   @Method : getCity
   @Params :
   @Returns : *
   */
export const getCountry=()=>{
    return (dispatch) => {
        dispatch({type: LOADER_START})
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref(`/countries`);
        ref.on("value", snapshot => {
            requestSuccess(dispatch);
            let country =[];
            _.map(snapshot.val(),(val,uid)=>{
                if(val.is_deleted == false) {
                    val.id = uid;
                    country.push(val);
                }
            });
            dispatch({type: COUNTRY_FETCH_SUCCESS, payload:country});
        });
    };
}



/*
   @Method : getCity
   @Params :
   @Returns : *
   */
export const getArea=(id)=>{
    return (dispatch) => {
        dispatch({type: LOADER_START})
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref(`/locations`);
        ref.orderByChild("city_id").equalTo(`${id}`).on("value", snapshot => {
            requestSuccess(dispatch);
            let area =[];
            _.map(snapshot.val(),(val,uid)=>{
                if(val.is_deleted == false) {
                    val.id = uid;
                    area.push(val);
                }
            });
            dispatch({type: AREA_FETCH_SUCCESS, payload:area});
        });
    };
}
/*
   @Method : bluetoothDiconnect
   @Params :
   @Returns : *
   */
export const bluetoothDiconnect=({device_name})=>{
    return (dispatch) => {
        dispatch({type: LOADER_START})
        const {currentUser} = firebase.auth();
        axios.post(BASE_URL+'reading/bluetoothDiconnect', {
            deviceName: device_name,
            userId: currentUser.uid
        }).then(function (response) {
            requestSuccess(dispatch);
        })
            .catch(function (error) {
                requestFail(dispatch);
            });
    };
}

/*
   @Method : getDevicesForBluetooth
   @Params :
   @Returns : *
   */
export const getDevicesForBluetooth=(callback)=>{
    return (dispatch) => {
        dispatch({type: LOADER_START})
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref(`/devices/${currentUser.uid}`);
        ref.orderByChild("userId").equalTo(`${currentUser.uid}`).on("value", snapshot => {
            requestSuccess(dispatch);
            dispatch({type: DEVICE_FETCH_SUCCESS, payload:snapshot.val()});
            callback();
        });
    };
}

/*
   @Method : getDevicesForBluetooth
   @Params :
   @Returns : *
   */
export const getDevicesForBluetoothForShowHistory=(callback)=>{
    return (dispatch) => {
        dispatch({type: LOADER_START})
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref(`/device_reading/${currentUser.uid}`);
        ref.orderByChild("created_at").once("value", snapshot => {
            callback(snapshot.val());
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
        let ref = firebase.database().ref(`/devices/${currentUser.uid}`);
        ref.orderByChild("userId").equalTo(`${currentUser.uid}`).on("value", snapshot => {
            requestSuccess(dispatch);
            dispatch({type: DEVICE_FETCH_SUCCESS, payload:snapshot.val()});
            dispatch({type: DEVICE_FETCH_SUCCESS_FOR_FILTER, payload:snapshot.val()});
        });
    };
}
/*
   @Method : addReading
   @Params :
   @Returns : *
   */

export const addReading=({repeat_duration,repeat,mobile_battery_level,device_battery_level,interval_in_minutes,alert_level,tank_reading,tank_height,device_id,device_name})=> {
    return (dispatch) => {
        dispatch({type: LOADER_START})
        const {currentUser} = firebase.auth();
        firebase.database().ref(`/device_reading/${currentUser.uid}`)
            .push({repeat_duration,repeat,mobile_battery_level,device_battery_level,interval_in_minutes,alert_level,tank_reading,tank_height,user_id:currentUser.uid,device_id,device_name,created_at:Date.now(),is_deleted:false,updated_at:Date.now()})
            .then(() => {
                axios.post(BASE_URL+'reading/readingNotification', {
                    mobileBatteryLevel: mobile_battery_level,
                    deviceBatteryLevel:device_battery_level,
                    intervalInMinutes:interval_in_minutes,
                    alertLevel:alert_level,
                    tankReading:tank_reading,
                    tankHeight:tank_height,
                    userId:currentUser.uid,
                    deviceId:device_id,
                    deviceName:device_name,
                    repeatDuration:repeat_duration,
                    repeat:repeat
                }).then(function (response) {
                    requestSuccess(dispatch);
                }).catch(function (error) {
                     requestFail(dispatch);
                });
            })
            .catch(function (error) {
                requestFail(dispatch);
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
        let ref = firebase.database().ref(`/devices/${currentUser.uid}`);
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


/*
   @Method : updateDeviceDetailsByBlutooth
   @Params :
   @Returns : *
   */
export const updateDeviceDetailsByBlutooth=({uid,tank_status})=>{
    return(dispatch)=>{
        dispatch({type: LOADER_START})
        const {currentUser} = firebase.auth();
        firebase.database().ref(`/devices/${currentUser.uid}/${uid}`)
            .update({tank_status,updated_at:Date.now()})
            .then(() => {
                requestSuccess(dispatch);
            })
            .catch(function (error) {
                requestFail(dispatch);
            });
    }
}

export const updateDeviceDetails=({tank_country,uid,device_id, device_name,tank_name,tank_location,tank_height,tank_width,tank_depth,tank_type,tank_city,tank_area})=>{
    return(dispatch)=>{
        dispatch({type: LOADER_START})
        const {currentUser} = firebase.auth();
        firebase.database().ref(`/devices/${currentUser.uid}/${uid}`)
            .update({tank_country,device_name,tank_name,tank_location,tank_height,tank_width,tank_type,tank_depth,tank_city,tank_area,is_deleted:false,updated_at:Date.now()})
            .then(() => {
                showToast("success","Device has been updated successfully");
                requestSuccess(dispatch);
                Actions.pop();

            })
            .catch(function (error) {
                showToast("danger","Sorry some error occurred, please try again later!");
                requestFail(dispatch);

            });
    }
}
/*
   @Method : updateDeviceDetails
   @Params :
   @Returns : *
   */

export const deleteDeviceDetails=({uid,master_id})=>{
    return(dispatch)=>{
        dispatch({type: LOADER_START})
        const {currentUser} = firebase.auth();
        firebase.database().ref(`/devices/${currentUser.uid}/${uid}`)
            .remove()
            .then(() => {
                     if(master_id)
                     {
                         const {currentUser} = firebase.auth();
                         firebase.database().ref(`/master_devices/${master_id}`)
                             .update({user_id:"",id:""})
                             .then(() => {
                                 showToast("success","Device deleted successfully");
                                 Actions.pop();
                                 dispatch({type: RESET_DEVICE_DETAILS});
                                 requestSuccess(dispatch);
                             })
                             .catch(function (error) {
                                 showToast("success","Device deleted successfully");
                                 Actions.pop();
                                 dispatch({type: RESET_DEVICE_DETAILS});
                                 requestSuccess(dispatch);
                             });
                     }
                     else
                     {
                         showToast("success","Device deleted successfully");
                         Actions.pop();
                         dispatch({type: RESET_DEVICE_DETAILS});
                         requestSuccess(dispatch);
                     }
            })
            .catch(function (error) {
                showToast("danger","Sorry some error occurred, please try again later!");
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

export const addDevice = ({tank_country,device_id, device_name,tank_name,tank_location,is_plugged,tank_height,tank_width,tank_depth,tank_type,uid,tank_city,tank_area}) => {
    return (dispatch) => {
        const tankStatus = {
            percentage :0,
            time : Date.now()

        };
        dispatch({type: LOADER_START});
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref(`/devices/${currentUser.uid}`);
        ref.orderByChild("device_id").equalTo(device_id).once('value')
            .then(function(dataSnapshot) {
                if(dataSnapshot.val() == null)
                {
                    let user = firebase.auth().currentUser;
                    let masterDevice = firebase.database().ref(`/devices/${user.uid}`)
                        .push({tank_country,master_id:uid,device_id,is_plugged:false,device_name,tank_name,tank_location,tank_height,tank_width,tank_type,tank_depth,tank_city,tank_area,userId:user.uid,created_at:Date.now(),is_deleted:false,tank_status:tankStatus,updated_at:Date.now()})
                        .then((snapshot) => {
                            const {currentUser} = firebase.auth();
                             firebase.database().ref(`/master_devices/${uid}`)
                                .update({user_id:currentUser.uid,id:snapshot.getKey()})
                                .then(() => {
                                    showToast("success","Device added successfully");
                                    Actions.pop();
                                    dispatch({type: RESET_DEVICE_DETAILS});
                                    requestSuccess(dispatch);
                                })
                                .catch(function (error) {
                                    requestFail(dispatch);
                                });
                        })
                        .catch(() => {
                            requestFail(dispatch);
                            showToast("danger","Sorry some error occurred, please try again later!");
                        })
                }
                else
                {
                    requestFail(dispatch);
                    showToast("danger","Device already registered");
                }
            })
             .catch(() => {
                 requestFail(dispatch);
                 showToast("danger","Sorry some error occurred, please try again later!");

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


