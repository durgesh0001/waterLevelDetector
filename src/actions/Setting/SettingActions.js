import firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {Alert} from 'react-native';
import {NOTIFICATION_SETTING_FETCH_FAIL,FromDateChanged,SETTING_FETCH_FAIL,TitleChanged,ToDateChanged,IntervalInMinutesChanged,RepeatChanged,RepeatDurationChanged,AlertLevelChanged,SendNotificationChanged,SETTING_FETCH_SUCCESS,NOTIFICATION_FETCH_SUCCESS,LoadingStart,LoadingEnd} from '../types'
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
                if(val.send_notification)
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
   @Method : getUserDetailsForSettings
   @Params :
   @Returns : *
   */
export const getUserDetailsForSettings=()=>{
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
export const addNotificationSettings = ({send_notification,userId}) => {
    return (dispatch) => {
        dispatch({type: LoadingStart});
        firebase.database().ref(`/users/${userId}`)
            .update({send_notification})
            .then(() => {
                Alert.alert('Success', 'Setting has been saved successfully');
                dispatch ({type: LoadingEnd});

            })
            .catch(function (error) {
                Alert.alert('Error', 'Something is wrong,Please try again');
                dispatch({type: LoadingEnd});

            });
    };
}
/*
   @Method : addReminderSettings
   @Params :
   @Returns : *
   */
export const addReminderSettings = ({title,from_date,to_date,interval_in_minutes,repeat_duration,alert_level_change,repeat,userId}) => {
        return (dispatch) => {
            dispatch({type: LoadingStart});
            firebase.database().ref(`/users/${userId}`)
                .update({settings:{title,from_date,to_date,interval_in_minutes,repeat_duration,alert_level_change,repeat}})
                .then(() => {
                    Alert.alert('Success', 'Setting has been saved successfully');
                    dispatch ({type: LoadingEnd});

                })
                .catch(function (error) {
                    Alert.alert('Error', 'Something is wrong,Please try again');
                    dispatch({type: LoadingEnd});

                });
        };
}