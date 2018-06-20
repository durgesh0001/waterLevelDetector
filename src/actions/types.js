import {Alert} from 'react-native';
import {Toast} from 'native-base';
//common
export const LOADER_START = 'loader_start';
export const LOADER_END = 'loader_end';

//Auth
export const EMAIL_CHANGED = 'email_changed';
export const PASSWORD_CHANGED = 'password_changed';
export const PHONE_CHANGED = 'phone_changed';
export const FIRST_NAME_CHANGED = 'first_name_changed';
export const LAST_NAME_CHANGED = 'last_name_changed';
export const LOGIN_USER_SUCCESS = 'login_user_success';
export const LOGIN_USER_FAIL = 'login_user_fail';
export const ON_ADDRESS_CHANGE = 'on_address_change';
export const LOGIN_USER = 'login_user';
export const FORGOT_PASSWORD_REQUEST = 'forgot_password_request';
export const FORGOT_PASSWORD_SUCCESS = 'forgot_password_success';
export const FETCH_AUTH_DETAIL_SUCCESS = 'fetch_auth_detail_success';
export const CONFIRM_PASSWORD_CHANGED = "confirm_password_changed";
export const ON_CHANGE_IMAGE_SUCCESS = "on_change_image_success";
export const RESET_USER = "reset_user";
export const NAME_CHANGED = "name_changed";

// Device
export const DeviceIdChanged = 'device_id_changed';
export const DeviceNameChanged = 'device_name_changed';
export const TankNameChanged = 'tank_name_changed';
export const TankLocationChanged = 'tank_location_changed';
export const TankHeightChanged = 'tank_height_changed';
export const TankWidthChanged = 'tank_width_changed';
export const TankDepthChanged = 'tank_depth_changed';
export const TankTypeChanged = 'tank_type_changed';
export const TankCityChanged = 'tank_city_changed';
export const TankCountryChanged = 'tank_country_changed';
export const TankAreaChanged = 'tank_area_changed';
export const RESET_DEVICE_DETAILS = 'reset_device_details';
export const DEVICE_FETCH_SUCCESS = 'device_fetch_success';
export const AREA_FETCH_SUCCESS = 'area_fetch_success';
export const CITY_FETCH_SUCCESS = 'city_fetch_success';
export const DEVICE_ID_FETCH_SUCCESS = 'device_id_fetch_success';
export const DEVICE_FETCH_SUCCESS_FOR_FILTER ='device_fetch_success_for_filter';
export const COUNTRY_FETCH_SUCCESS ='country_fetch_success';



//Setting
export const TitleChanged = 'title_changed';
export const FromDateChanged = 'from_date_changed';
export const ToDateChanged = 'to_date_changed';
export const IntervalInMinutesChanged = 'interval-in-minutes';
export const RepeatChanged = 'repeat';
export const RepeatDurationChanged = 'repeat-duration';
export const IntervalInMinutesForHoursChanged = 'Interval-in-minutes-for-hours-changed';
export const IntervalInMinutesForMinuteshanged = 'Interval-in-minutes-for-minutes-changed';

export const AlertLevelChanged = 'alert-level';
export const SendNotificationChanged = 'send-notification';
export const LoadingStart = 'loading-start';
export const LoadingEnd = 'loading-end';
export const SETTING_FETCH_SUCCESS = 'setting_fetch_success';
export const SETTING_FETCH_FAIL = 'setting_fetch_fail';
export const NOTIFICATION_SETTING_FETCH_FAIL = 'notification_setting_fetch_fail';
export const NOTIFICATION_FETCH_SUCCESS = 'notification_fetch_success';

//Utility
export const QUERY_CHANGED = "query_changed";
export const SUBMIT_QUERY_SUCCESS = "submit_query_success";
export const SUBMIT_QUERY_FAIL = "submit_query_fail";
export const ALERT_FETCH_SUCCESS = "alert_fetch_success";
export const SUPPLIER_FETCH_SUCCESS = "supplier_fetch_success";
export const SUPPLIER_FETCH_SUCCESS_FILTER = "supplier_fetch_success_filter";
export const GET_HISTORY_SUCCESS = "get_history_success";
export const DeviceIdForConnection = "device_id_for_connection";
export const BASE_URL = "http://183.182.84.77:1337/v1/webservices/";
export const BLUETOOTH_DEVICE_NAME = "SIPL";

export const showToast=(type="success",message)=>
{
    if(type =='success')
    {
        Alert.alert('Success',message);

    }
    else
    {
        Alert.alert('Error',message);

    }
    // Toast.show({
    //     text: message,
    //     position: 'top',
    //     type:type,
    //     duration:4000
    // });

}
export const alerts = [10,20,30,40,50,60,70,80,90];
export const hours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
export const minutes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59];












