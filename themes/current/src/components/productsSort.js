import React from 'react'
import text from '../lib/text'

const Sort = ({ defaultSort, currentSort, setSort }) => {
  return (
    <div className="columns">
      <div className="column is-3">{text.sort}:</div>
      <div className="column">
      <span className="select is-fullwidth">
        <select>
          <option>Not implemented</option>
        </select>
      </span>
      </div>
    </div>
  )
}

export default Sort
