import React from 'react'
import { Link } from 'react-router-dom'
import { Field, FieldArray, reduxForm } from 'redux-form'

import messages from 'lib/text'
import style from './style.css'

import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

class AttributesGrid extends React.Component {
  constructor(props) {
    super(props)
    const attributes = props.fields.getAll();
    this.state = {
      attributes: attributes
    };
  }

  componentWillReceiveProps(nextProps) {
    const attributes = nextProps.fields.getAll();
    if (attributes !== this.state.attributes) {
      this.setState({
        attributes: attributes
      });
    }
  }

  onDelete = (event) => {
    const attributeIndex = event.target.dataset.index * 1;

    let attributes = this.state.attributes;
    attributes.splice(attributeIndex, 1);

    this.setState({
      attributes: attributes
    });

    this.commitChanges();
  }


  onValueChange = (event) => {
    const attributeIndex = event.target.dataset.index * 1;
    const attributeValue = event.target.value;

    let attributes = this.state.attributes;
    attributes[attributeIndex].value = attributeValue;

    this.setState({
      attributes: attributes
    });
  }

  onNameChange = (event) => {
    const attributeIndex = event.target.dataset.index * 1;
    const attributeName = event.target.value;

    let attributes = this.state.attributes;
    attributes[attributeIndex].name = attributeName;

    this.setState({
      attributes: attributes
    });
  }

  commitChanges = () => {
    let attributes = this.state.attributes;
    this.props.fields.removeAll();

    for(const a of attributes){
      this.props.fields.push(a);
    }
  }

  handleAdd = () => {
    this.props.fields.push({ name: '', value: '' });
  }

  render() {
    const items = (this.state.attributes || []).map((attribute, index) =>
      <div className="row row--no-gutter middle-xs" key={index}>
        <div className="col-xs-5 col--no-gutter">
          <TextField
            fullWidth={true}
            data-index={index}
            hintText={messages.attributeName}
            value={attribute.name}
            id={`attributes.${index}.name`}
            onChange={this.onNameChange}
            onBlur={this.commitChanges}
          />
        </div>
        <div className="col-xs-6 col--no-gutter">
          <TextField
            fullWidth={true}
            data-index={index}
            hintText={messages.attributeValue}
            value={attribute.value}
            id={`attributes.${index}.value`}
            onChange={this.onValueChange}
            onBlur={this.commitChanges}
          />
        </div>
        <div className="col-xs-1 col--no-gutter">
          <IconButton title={messages.actions_delete} onClick={this.onDelete} tabIndex={-1}>
            <FontIcon color="#a1a1a1" className="material-icons" data-index={index}>delete</FontIcon>
          </IconButton>
        </div>
      </div>
    )

    return (
      <div>
        <div className="row row--no-gutter middle-xs">
          <div style={{ borderBottom: '1px solid #777', padding: '10px 0', marginBottom: '5px' }} className="col-xs-5 col--no-gutter">{messages.attributeName}</div>
          <div style={{ borderBottom: '1px solid #777', padding: '10px 0', marginBottom: '5px' }} className="col-xs-6 col--no-gutter">{messages.attributeValue}</div>
          <div className="col-xs-1 col--no-gutter"></div>
        </div>
        {items}
        <div style={{ marginTop: 20 }}>
          <RaisedButton label={messages.addAttribute} onClick={this.handleAdd} />
        </div>
      </div>
    )
  }
}








// onCheckboxChecked = (scope) => {
//   let values = this.state.selectedScopes;
//   if(values.includes(scope)) {
//     values = values.filter(item => item !== scope);
//   } else {
//     values.push(scope);
//   }
//   this.setState({ selectedScopes: values});
//   this.props.input.onChange(values)
// }

// isCheckboxChecked = (scope) => {
//   return this.state.selectedScopes.includes(scope);
// }



// <div className={style.gridRow}>
//   <div className={style.gridCol}><VariantInput type="text" placeholder="" variantId={variant.id} value={variant.sku} onChange={onSkuChange} /></div>
//   <div className={style.gridCol}><VariantInput type="number" placeholder="0" variantId={variant.id} value={variant.price} onChange={onPriceChange} /></div>
//   <div className={style.gridCol}><VariantInput type="number" placeholder="0" variantId={variant.id} value={variant.stock_quantity} onChange={onStockChange} /></div>
//   <div className={style.gridCol}><VariantInput type="number" placeholder="0" variantId={variant.id} value={variant.weight} onChange={onWeightChange} /></div>
//   {cols}
//   <div className={style.gridCol}>
//     <IconButton title={messages.actions_delete} onClick={() => { onDeleteVariant(variant.id) }} tabIndex={-1}>
//       <FontIcon color="#a1a1a1" className="material-icons">delete</FontIcon>
//     </IconButton>
//   </div>
// </div>











class ProductAttributesForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchData();
  }

  componentWillUnmount() {
    this.props.eraseData();
  }

  render() {
    let {
      handleSubmit,
      pristine,
      submitting,
      initialValues,
      settings } = this.props;

      return (
        <form onSubmit={handleSubmit} style={{ display: 'initial' }}>
              <Paper className="paper-box" zDepth={1}>
                <div className={style.innerBox}>
                  <FieldArray name="attributes" component={AttributesGrid}/>
                </div>
                <div className="buttons-box">
                  <Link to={'/admin/products'}>
                    <FlatButton label={messages.cancel} className={style.button} />
                  </Link>
                  <RaisedButton type="submit" label={messages.save} primary={true} className={style.button} disabled={submitting}/>
                </div>
              </Paper>
        </form>
      )
  }
}

export default reduxForm({
  form: 'ProductAttributesForm',
  enableReinitialize: true
})(ProductAttributesForm)
