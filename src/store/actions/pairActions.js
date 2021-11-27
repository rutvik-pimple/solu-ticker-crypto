import ACTION_TYPE from './types';

export const fetchExchangeList = lists => dispatch => {
  //Used a heroku proxy server as the api was throwing cors error but to maeke this run, needs permission from https://cors-anywhere.herokuapp.com/corsdemo for evry system. So now i hardcoded the list 
  fetch('https://cors-anywhere.herokuapp.com/https://api-pub.bitfinex.com/v2/conf/pub:list:pair:exchange')
    .then(res => res.json())
    .then(lists =>
        {console.log(lists)
        dispatch({
            type: ACTION_TYPE.FETCH_EXCHANGE_LIST,
            payload: lists[0]
        })}
    ).catch(err=> console.log(err));
};

export const selectPair = pair => dispatch => {
    console.log(pair,"redux")
    dispatch({
        type: ACTION_TYPE.SELECT_PAIR,
        payload: pair
    })
};

export const setTickerData = pair => dispatch => {
    
    dispatch({
        type: ACTION_TYPE.SET_TICKER_DATA,
        payload: pair
    })
};