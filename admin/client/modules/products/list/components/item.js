import React from 'react';
import { Link } from 'react-router'
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import style from './style.css'
import ProductsListItemMenu from './menu'

const ProductsListItem = ({ data }) => {
  return (
    <div>
    <ListItem
    innerDivStyle={{paddingTop: '0px', paddingBottom: '0px'}}

              rightIconButton={ProductsListItemMenu}
              primaryText={
                <div className="row row--no-gutter middle-xs">
                  <div className="col-xs-1 col--no-gutter"><Checkbox /></div>
                  <div className="col-xs-11 col--no-gutter">

    <Link to={'/admin/product/'+data.id}>
                  <div className="row row--no-gutter middle-xs">
                  <div className="col-xs-2 col--no-gutter"><img src={data.image} className={style.image} /></div>
                    <div className="col-xs-6 col--no-gutter">{data.title}<br /><small>{data.sku}</small></div>
                    <div className="col-xs-2 col--no-gutter">{data.stock_level}</div>
                    <div className="col-xs-2 col--no-gutter">{data.price}</div>
                  </div>
    </Link>

                  </div>
                </div>
              }
            />
            <Divider />
            </div>
  )
};

export default ProductsListItem
