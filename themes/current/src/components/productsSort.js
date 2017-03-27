import React from 'react'
import text from '../lib/text'
import config from '../lib/config'

const Sort = ({ defaultSort, currentSort, setSort }) => {
  return (
    <div className="columns">
      <div className="column is-3">{text.sort}:</div>
      <div className="column">
      <span className="select is-fullwidth">
        <select onChange={e => {setSort(e.target.value)}} value={currentSort}>
          <option value={defaultSort}>{text.sortFavorite}</option>
          <option value={config.sort_newest}>{text.sortNewest}</option>
          <option value={config.sort_price_low}>{text.sortPriceLow}</option>
          <option value={config.sort_price_high}>{text.sortPriceHigh}</option>
        </select>
      </span>
      </div>
    </div>
  )
}

export default Sort
