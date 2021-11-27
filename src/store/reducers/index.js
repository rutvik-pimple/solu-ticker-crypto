import { combineReducers } from "redux";
import tickerReducer from "./tickerReducer";


export default combineReducers({
    ticker: tickerReducer
  });