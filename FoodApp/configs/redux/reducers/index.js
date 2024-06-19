import { combineReducers } from 'redux';
import infor from './InfoReducer';

const rootReducer = combineReducers({
  personalInfor: infor,
});

export default rootReducer;
