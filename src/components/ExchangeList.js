import React,{ useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import { fetchExchangeList, selectPair, setTickerData } from '../store/actions/pairActions'


export const ExchangeList = (props) => {
    const [search, setSearch] = useState('')

    //the below commented code is for fetching list from api but api is throwing "cors" error
    //and successfully did with proxy but for every different sysytem after some time needs to take permission
    //so hardcoded the list


    // useEffect(() => {
    //     // props.fetchExchangeList()
    // }, [])


    const handleListItemClick = (symbol) => {
        // console.log("clicked")
        props.selectPair(symbol)
        props.setTickerData({})
        setSearch("")
    }


    return (
        <div className="list-search">
            <input
                type="text"
                name="search"
                placeholder="&#xF002; Search..."
                value={search}
                onChange={(e)=>setSearch(e.target.value.toUpperCase())}
            />
            <table >
                {props.exchangeList && props.exchangeList.filter(ele => ele.includes(search)).map(item=>(
                    <tr key={item} onClick={()=>handleListItemClick(item)}>
                        <td><img src={`https://static.bitfinex.com/images/icons/${item.length ===6 ? item.slice(0,3):item.split(":")[0]}-alt.svg`} width="26px" /></td>
                        <td>{item}</td>
                    </tr>
                ))}
            </table>
        </div>
    )
}

const mapStateToProps = (state) => ({
    exchangeList: state.ticker.items,
    selectedPair: state.ticker.selected_pair
})

ExchangeList.propTypes = {
    selectPair: PropTypes.func.isRequired,
    fetchExchangeList: PropTypes.func.isRequired,
    setTickerData: PropTypes.func.isRequired,
    selectedPair: PropTypes.string
  };

export default connect(mapStateToProps, { fetchExchangeList, selectPair, setTickerData })(ExchangeList)

