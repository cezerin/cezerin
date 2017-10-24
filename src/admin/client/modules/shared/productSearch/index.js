import React from 'react'

import messages from 'lib/text'
import api from 'lib/api'
import * as helper from 'lib/helper'

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const SearchBox = ({ text, onChange }) => {
  return (
    <TextField
      fullWidth={true}
      floatingLabelText={messages.products_search}
      onChange={onChange}
      value={text}
    />
  )
}

const SearchResult = ({ products, selectedId, settings, onSelect }) => {
  const rows = products.map((product, index) => {
    let priceFormatted = helper.formatCurrency(product.price, settings);
    const isSelected = product.id === selectedId;

    return (
      <TableRow key={index} selected={isSelected}>
        <TableRowColumn>{product.name}</TableRowColumn>
        <TableRowColumn>{product.category_name}</TableRowColumn>
        <TableRowColumn>{product.sku}</TableRowColumn>
        <TableRowColumn style={{ textAlign: 'right' }}>{priceFormatted}</TableRowColumn>
      </TableRow>
    )
  });

  return (
    <Table
      height='400px'
      selectable={true}
      multiSelectable={false}
      onRowSelection={onSelect}>
      <TableBody>
        {rows}
      </TableBody>
    </Table>
  )
}

export default class ConfirmationDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.open,
      products: [],
      search: '',
      selectedId: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.open !== nextProps.open) {
      this.setState({
        open: nextProps.open
      })
    }
  }

  handleCancel = () => {
    this.setState({open: false});
    if(this.props.onCancel) {
      this.props.onCancel();
    }
  }

  handleSubmit = () => {
    this.setState({open: false});
    if(this.props.onSubmit) {
      this.props.onSubmit(this.state.selectedId);
    }
  }

  handleRowSelection = (selectedRows) => {
    if(selectedRows && selectedRows.length > 0){
      const selectedIndex = selectedRows[0];
      const selectedProductId = this.state.products && this.state.products.length >= selectedIndex ? this.state.products[selectedIndex].id : null;
      this.setState({
        selectedId: selectedProductId
      });
    }
  };

  handleSearch = (event, value) => {
    this.setState({search: value});

    api.products.list({
      limit: 50,
      enabled: true,
      discontinued: false,
      fields: 'id,name,category_id,category_name,sku,enabled,discontinued,price,on_sale,regular_price',
      search: value
    }).then(productsResponse => {
      this.setState({
        products: productsResponse.json.data
      });
    });
  }

  render() {
    const { title, submitLabel, cancelLabel, modal = false, settings } = this.props;

    const actions = [
      <FlatButton
        label={cancelLabel}
        onClick={this.handleCancel}
        style={{ marginRight: 10 }}
      />,
      <FlatButton
        label={submitLabel}
        primary={true}
        onClick={this.handleSubmit}
      />
    ];

    return (
        <Dialog
          title={title}
          actions={actions}
          actionsContainerStyle={{ borderTop: '1px solid rgb(224, 224, 224)' }}
          modal={modal}
          open={this.state.open}
          onRequestClose={this.handleCancel}
        >
          <div>
            <SearchBox text={this.state.search} onChange={this.handleSearch} />
            <SearchResult products={this.state.products} selectedId={this.state.selectedId} onSelect={this.handleRowSelection} settings={settings} />
          </div>
        </Dialog>
    )
  }
}
