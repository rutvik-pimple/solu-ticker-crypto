import React,{ useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { setTickerData } from '../store/actions/pairActions'
import PropTypes from 'prop-types';

const redStyle = {
    color:"rgb(228,74,67)"
}
const greenStyle = {
    color:"rgb(0,166,129)"
}
const textStyle = {
    color:"rgb(255,255,255)"
}

let ws = new WebSocket('ws://api-pub.bitfinex.com/ws/2');

export const Ticker = (props) => {
    const [isSocketConnected, setIsSocketConnected] = useState(true)
    
      useEffect(() => {        
        let msg = JSON.stringify({ 
          event: 'subscribe', 
          channel: 'ticker', 
          symbol: `tBTCUSD` 
        })
        ws.onopen = () => {
          console.log('WebSocket client Connected');
          ws.send(msg)
        };
        return () => {
          handleSocketDisconnect()
        }
      }, [])

      useEffect(() => {
        
        channelSubscribe()
        
        return () => {
            handleSocketDisconnect()
        }
      }, [props.selected_pair])



      const channelSubscribe = () => {
        let msg = JSON.stringify({ 
            event: 'subscribe', 
            channel: 'ticker', 
            symbol: `t${props.selectedPair}` 
          })
          ws.onopen = () => {
            ws.send(msg)
            console.log('WebSocket client Connected');
            setIsSocketConnected(true)
          };
      }

      const handleSocketConnect = async() => {
        let msg = JSON.stringify({ 
            event: 'subscribe', 
            channel: 'ticker', 
            symbol: `t${props.selectedPair}` 
          })
        ws = await new WebSocket('ws://api-pub.bitfinex.com/ws/2');
        ws.onopen = () => {
            ws.send(msg)
            console.log('WebSocket client Connected');
            setIsSocketConnected(true)
          };
      }

      const handleSocketDisconnect = () => {
          setIsSocketConnected(false)
        ws.close(1000,"Work complete")
        ws.onclose = () => {
            props.setTickerData({})
            console.log('WebSocket client Disconnected')
          }
      }
    
      ws.onmessage = (message) => {
        // console.log(message.data,"see",typeof(message.data));
        if (typeof(message.data)==="string"){
          let data = JSON.parse(message.data)
          if (typeof(data[1])==="object"){
            props.setTickerData({
              LastPrice: data[1][6],
              Vol: data[1][7],
              High: data[1][8],
              Low: data[1][9],
              DailyChange: data[1][4],
              DailyChangeRelative: data[1][5]
            })
          }
          
        }  
      };

      ws.onclose = () => {
        props.setTickerData({})
        console.log('WebSocket client Disconnected')
      }


    return (
        <div style={{width:"fit-content",margin:"0 auto"}}>
            {isSocketConnected ? (
                <button onClick={handleSocketDisconnect}>Disconnect Socket</button>
            ):(
                <button onClick={handleSocketConnect}>Connect Socket</button>
            )}
            <div className="ticker-container">
                <div className="dc1">
                    <img src={`https://static.bitfinex.com/images/icons/${props.selectedPair.length ===6 ? props.selectedPair.slice(0,3):props.selectedPair.split(":")[0]}-alt.svg`} className="image-width" />
                </div>
                <div className="dc2">
                    <div className="dd1 ddl">{props.selectedPair.length ===6 ? props.selectedPair.slice(0,3)+"/"+props.selectedPair.slice(3):props.selectedPair.split(":")[0]+"/"+props.selectedPair.split(":")[1]}</div>
                    <div className="dd2 ddl">
                        <span className="grey-text">VOL</span> {props.tickerData.Vol && Math.abs(props.tickerData.Vol.toFixed(2))}
                    </div>
                    <div className="dd3 ddl">
                        <span className="grey-text">HIGH</span> {props.tickerData.High && Math.abs(props.tickerData.High.toFixed(2))}
                    </div>
                </div>
                <div className="dc3">
                    <div className="dd1 ddr">{props.tickerData.LastPrice ? Math.abs(props.tickerData.LastPrice.toFixed(2)): (isSocketConnected ? "loading.." : "Not Connected")}</div>
                    <div className="dd2 ddr" style={(props.tickerData.DailyChange<0) ? redStyle : greenStyle}>
                        {Math.abs(props.tickerData.DailyChange?.toFixed(2))}{(props.tickerData.DailyChange<0)?<i class="fa fa-caret-down fa-fw"/>:<i class="fas fa-caret-up fa-fw"/>}({Math.abs(props.tickerData.DailyChangeRelative*100).toFixed(2)}%)
                    </div>
                    <div className="dd3 ddr">
                        <span className="grey-text">LOW</span> {props.tickerData.Low && Math.abs(props.tickerData.Low.toFixed(2))}
                    </div>
                </div>
            </div>
        </div>
    )
}

Ticker.propTypes = {
    setTickerData: PropTypes.func.isRequired,
    pairList: PropTypes.array.isRequired,
    selectedPair: PropTypes.string,
    tickerData: PropTypes.object
  };

const mapStateToProps = (state) => ({
    exchangeList: state.ticker.items,
    selectedPair: state.ticker.selected_pair,
    tickerData: state.ticker.ticker_data
})


export default connect(mapStateToProps, { setTickerData })(Ticker)

