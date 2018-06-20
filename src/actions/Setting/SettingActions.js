import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {IntervalInMinutesForMinuteshanged,IntervalInMinutesForHoursChanged,NOTIFICATION_SETTING_FETCH_FAIL,FromDateChanged,SETTING_FETCH_FAIL,TitleChanged,ToDateChanged,IntervalInMinutesChanged,RepeatChanged,RepeatDurationChanged,AlertLevelChanged,SendNotificationChanged,SETTING_FETCH_SUCCESS,NOTIFICATION_FETCH_SUCCESS,LoadingStart,LoadingEnd,showToast} from '../types'
import _ from 'lodash';



/*
   @Method : OnTitleChanged
   @Params :
   @Returns : *
   */
export const OnTitleChanged = (text) => {

    return {
        type: TitleChanged,
        payload: text

    }
};
/*
   @Method : OnFromDateChanged
   @Params :
   @Returns : *
   */
export const OnFromDateChanged = (text) => {

    return {
        type: FromDateChanged,
        payload: text

    }
};
/*
   @Method : OnToDateChanged
   @Params :
   @Returns : *
   */
export const OnToDateChanged = (text) => {

    return {
        type: ToDateChanged,
        payload: text

    }
};

/*
   @Method : OnIntervalInMinutesChanged
   @Params :
   @Returns : *
   */
export const OnIntervalInMinutesChanged = (text) => {

    return {
        type: IntervalInMinutesChanged,
        payload: text

    }
};
/*
   @Method : OnIntervalInMinutesChangedForMinutes
   @Params :
   @Returns : *
   */
export const OnIntervalInMinutesChangedForMinutes = (text) => {

    return {
        type: IntervalInMinutesForMinuteshanged,
        payload: text

    }
};


/*
   @Method : OnIntervalInMinutesChangedForHours
   @Params :
   @Returns : *
   */
export const OnIntervalInMinutesChangedForHours = (text) => {

    return {
        type: IntervalInMinutesForHoursChanged,
        payload: text

    }
};

/*
   @Method : OnRepeatChanged
   @Params :
   @Returns : *
   */
export const OnRepeatChanged = (text) => {

    return {
        type: RepeatChanged,
        payload: text

    }
};

/*
   @Method : OnRepeatDurationChanged
   @Params :
   @Returns : *
   */
export const OnRepeatDurationChanged = (text) => {

    return {
        type: RepeatDurationChanged,
        payload: text

    }
};

/*
   @Method : OnAlertLevelChanged
   @Params :
   @Returns : *
   */
export const OnAlertLevelChanged = (text) => {

    return {
        type: AlertLevelChanged,
        payload: text

    }
};

/*
   @Method : OnSendNotificationChanged
   @Params :
   @Returns : *
   */
export const OnSendNotificationChanged = (text) => {

    return {
        type: SendNotificationChanged,
        payload: text

    }
};

/*
   @Method : getUserDetailsForNotificationSettings
   @Params :
   @Returns : *
   */
export const getUserDetailsForNotificationSettings=()=>{
    return (dispatch) => {
        dispatch({type: LoadingStart});
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref("/users");
        ref.orderByChild("id").equalTo(`${currentUser.uid}`).on("value", snapshot => {
            _.map(snapshot.val(),(val,uid)=>{
                val.userId = uid;
                if(val.is_user_notification)
                {
                    dispatch({type: NOTIFICATION_FETCH_SUCCESS, payload:val});

                }
                else
                {
                    dispatch({type: NOTIFICATION_SETTING_FETCH_FAIL, payload:val});

                }
            });
        });
    };
}
/*
   @Method : getUserDetailsForSettingsForBluetooth
   @Params :
   @Returns : *
   */
export const getUserDetailsForSettingsForBluetooth=(callback)=>{
    return (dispatch) => {
        dispatch({type: LoadingStart});
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref("/users");
        ref.orderByChild("id").equalTo(`${currentUser.uid}`).on("value", snapshot => {
            _.map(snapshot.val(),(val,uid)=>{
                val.userId = uid;
                if(val.settings)
                {
                    dispatch({type: SETTING_FETCH_SUCCESS, payload:val});
                    callback();

                }
                else
                {
                    dispatch({type: SETTING_FETCH_FAIL, payload:val});
                    callback();

                }
            });
        });
    };
}
/*
   @Method : getUserDetailsForSettings
   @Params :
   @Returns : *
   */
export const getUserDetailsForSettings=(device_id)=>{
    return (dispatch) => {
        dispatch({type: LoadingStart});
        const {currentUser} = firebase.auth();
        let ref = firebase.database().ref(`/devices/${currentUser.uid}`);
        ref.orderByChild("device_id").equalTo(`${device_id}`).on("value", snapshot => {
            _.map(snapshot.val(),(val,uid)=>{
                val.uid= uid;
                if(val.settings)
                {
                    dispatch({type: SETTING_FETCH_SUCCESS, payload:val});


                }
                else
                {
                    dispatch({type: SETTING_FETCH_FAIL, payload:val});

                }
            });
        });
    };
}


/*
   @Method : addNotificationSettings
   @Params :
   @Returns : *
   */
export const addNotificationSettings = ({is_user_notification,userId}) => {
    return (dispatch) => {
        dispatch({type: LoadingStart});
        firebase.database().ref(`/users/${userId}`)
            .update({is_user_notification})
            .then(() => {
                showToast("success","Setting has been saved successfully");
                dispatch ({type: LoadingEnd});

            })
            .catch(function (error) {
                showToast("danger","Sorry some error occurred, please try again later!");
                dispatch({type: LoadingEnd});

            });
    };
}
/*
   @Method : addReminderSettings
   @Params :
   @Returns : *
   */
export const addReminderSettings = ({interval_in_minutes_for_minutes,interval_in_minutes_for_hours,device_id,title,from_date,to_date,interval_in_minutes,repeat_duration,alert_level_change,repeat,uid}) => {
        return (dispatch) => {
            dispatch({type: LoadingStart});
            const {currentUser} = firebase.auth();
            firebase.database().ref(`/devices/${currentUser.uid}/${uid}`)
                .update({settings:{title,from_date,to_date,interval_in_minutes,repeat_duration,alert_level_change,repeat,interval_in_minutes_for_minutes,interval_in_minutes_for_hours}})
                .then(() => {
                    showToast("success","Setting has been saved successfully");
                    dispatch ({type: LoadingEnd});

                })
                .catch(function (error) {
                    showToast("danger","Sorry some error occurred, please try again later!");
                    dispatch({type: LoadingEnd});

                });
        };
}