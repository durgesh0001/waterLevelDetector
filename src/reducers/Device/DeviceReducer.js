import {RESET_DEVICE_DETAILS,DEVICE_ID_FETCH_SUCCESS,GET_HISTORY_SUCCESS,DEVICE_FETCH_SUCCESS,TankTypeChanged,DeviceIdChanged,DeviceNameChanged,TankNameChanged,TankLocationChanged,TankHeightChanged,TankWidthChanged,TankDepthChanged,LOADER_START,LOADER_END} from '../../actions/types';
const INITIAL_STATE = {deviceData:[],device_id:'',device_name:'',history:[],tank_name:'',tank_location:'',error:'',tank_height:'',tank_width:'',tank_depth:'',loading:false,tank_type:''};
export default (state=INITIAL_STATE,action) =>
{
    switch(action.type)
    {
        case DeviceIdChanged:
            return {...state,device_id:action.payload};
        case DeviceNameChanged:
            return {...state,device_name:action.payload};
        case TankNameChanged:
            return {...state,tank_name:action.payload};
        case TankLocationChanged:
            return {...state,tank_location:action.payload};
        case TankHeightChanged:
            return {...state,tank_height:action.payload};
        case TankWidthChanged:
            return {...state,tank_width:action.payload};
        case TankDepthChanged:
            return {...state,tank_depth:action.payload};
        case TankTypeChanged:
            return {...state,tank_type:action.payload};
        case LOADER_START:
            return {...state,loading:true};
        case LOADER_END:
            return {...state,loading:false};
        case DEVICE_ID_FETCH_SUCCESS:
            return {...state,device_id:action.payload.device_id,device_name:action.payload.device_name,tank_name:action.payload.tank_name,tank_location:action.payload.tank_location,error:'',tank_height:action.payload.tank_height,tank_width:action.payload.tank_width,tank_depth:action.payload.tank_depth,loading:false,tank_type:action.payload.tank_type,uid:action.payload.uid};
        case RESET_DEVICE_DETAILS:
            return {...state,device_id:'',device_name:'',tank_name:'',tank_location:'',error:'',tank_height:'',tank_width:'',tank_depth:'',loading:false,tank_type:'vertical'};
        case DEVICE_FETCH_SUCCESS:
            return {...state,deviceData:action.payload,loading:false};
        case GET_HISTORY_SUCCESS:
            return {...state,history:action.payload,loading:false};
        default:
        return state;
    }
}
