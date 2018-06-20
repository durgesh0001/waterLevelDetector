import {IntervalInMinutesForMinuteshanged,IntervalInMinutesForHoursChanged,FromDateChanged,NOTIFICATION_SETTING_FETCH_FAIL,TitleChanged,ToDateChanged,IntervalInMinutesChanged,RepeatChanged,LoadingEnd,RepeatDurationChanged,AlertLevelChanged,SendNotificationChanged,SETTING_FETCH_SUCCESS,NOTIFICATION_FETCH_SUCCESS,LoadingStart,SETTING_FETCH_FAIL} from '../../actions/types';
const INITIAL_STATE = {interval_in_minutes_for_minutes:"",interval_in_minutes_for_hours:"",from_date:'',title:'',to_date:'',interval_in_minutes:'',repeat_duration:'',error:'',alert_level_change:'',repeat:false,loading:false,send_notification:false,userId:''};
export default (state=INITIAL_STATE,action) =>
{
    switch(action.type)
    {
        case FromDateChanged:
            return {...state,from_date:action.payload};
        case TitleChanged:
            return {...state,title:action.payload};
        case ToDateChanged:
            return {...state,to_date:action.payload};
        case IntervalInMinutesChanged:
            return {...state,interval_in_minutes:action.payload};
        case IntervalInMinutesForMinuteshanged:
            return {...state,interval_in_minutes_for_minutes:action.payload};
        case IntervalInMinutesForHoursChanged:
            return {...state,interval_in_minutes_for_hours:action.payload};
        case RepeatChanged:
            return {...state,repeat:action.payload};
        case RepeatDurationChanged:
            return {...state,repeat_duration:action.payload};
        case AlertLevelChanged:
            return {...state,alert_level_change:action.payload};
        case SendNotificationChanged:
            return {...state,send_notification:action.payload};
        case NOTIFICATION_FETCH_SUCCESS:
            return {...state,loading:false,is_user_notification:action.payload.is_user_notification,userId:action.payload.userId}
        case SETTING_FETCH_SUCCESS:
            return {...state,loading:false,title:action.payload.settings.title,from_date:action.payload.settings.from_date,to_date:action.payload.settings.to_date,interval_in_minutes:action.payload.settings.interval_in_minutes,repeat_duration:action.payload.settings.repeat_duration,alert_level_change:action.payload.settings.alert_level_change,repeat:action.payload.settings.repeat,send_notification:action.payload.settings.send_notification,uid:action.payload.uid,interval_in_minutes_for_minutes:action.payload.settings.interval_in_minutes_for_minutes,interval_in_minutes_for_hours:action.payload.settings.interval_in_minutes_for_hours}
        case SETTING_FETCH_FAIL:
            return {...state,from_date:'',title:'',to_date:'',interval_in_minutes:'',repeat_duration:'',error:'',alert_level_change:'',repeat:false,uid:action.payload.uid,loading:false}
        case NOTIFICATION_SETTING_FETCH_FAIL:
            return {...state,is_user_notification:false,userId:action.payload.userId,loading:false}
        case LoadingStart:
            return {...state,loading:true}
        case LoadingEnd:
            return {...state,loading:false}
        default:
            return state;
    }
}
