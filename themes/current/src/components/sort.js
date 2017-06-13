import React from 'react'
import text from '../lib/text'
import config from '../lib/config'

const Sort = ({ defaultSort, currentSort, setSort }) => {
  return (
    <div className="columns" style={{ alignItems: 'center', textAlign: 'right' }}>
      <div className="column is-4">{text.sort}:</div>
      <div className="column">
      <span className="select is-fullwidth">
        <select onChange={e => {setSort(e.target.value)}} value={currentSort}>
          <option value={defaultSort}>{text.sortFavorite}</option>
          <option value={config.sortNewest}>{text.sortNewest}</option>
          <option value={config.sortPriceLow}>{text.sortPriceLow}</option>
          <option value={config.sortPriceHigh}>{text.sortPriceHigh}</option>
        </select>
      </span>
      </div>
    </div>
  )
}

export default Sort
