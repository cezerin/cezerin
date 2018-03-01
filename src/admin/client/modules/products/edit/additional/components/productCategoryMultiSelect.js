import React from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import messages from 'lib/text'
import style from './style.css'
import CategoryMultiselect from 'modules/productCategories/components/multiselectList'
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
const Fragment = React.Fragment;

const CategoryItemActions = ({ fields, index }) => (
  <a title={messages.actions_delete} onClick={() => fields.remove(index)} className="react-tagsinput-remove"></a>
)

const CategoryItem = ({ categoryName, actions }) => (
  <span className="react-tagsinput-tag">{categoryName}{actions}</span>
)

export default class ProductCategoryMultiSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  close = () => {
    this.setState({open: false});
  }

  open = () => {
    this.setState({open: true});
  }

  handleCheck = (categoryId) => {
    const selectedIds = this.props.fields.getAll();
    if(selectedIds && selectedIds.includes(categoryId)){
      // remove
      this.props.fields.forEach((name, index, fields) => {
        if(fields.get(index) === categoryId) {
          fields.remove(index);
          return;
        }
      });
    } else {
      // add
      this.props.fields.push(categoryId);
    }
  }

  render() {
    const { categories, fields, meta: { touched, error, submitFailed } } = this.props;
    const { open } = this.state;
    const selectedIds = fields.getAll();

    const dialogButtons = [
      <FlatButton
        label={messages.cancel}
        onClick={this.close}
        style={{ marginRight: 10 }}
      />,
      <FlatButton
        label={messages.save}
        primary={true}
        keyboardFocused={true}
        onClick={this.close}
      />,
    ];

    return (
      <div className="react-tagsinput">
        <span>
          {fields.map((field, index) => {
            const categoryId = fields.get(index);
            const category = categories.find(item => item.id === categoryId);
            const categoryName = category ? category.name : '-';
            const actions = <CategoryItemActions fields={fields} index={index} />;
            return <CategoryItem key={index} categoryName={categoryName} actions={actions} />
          })}
          <Dialog
            title={messages.additionalCategories}
            actions={dialogButtons}
            modal={false}
            open={open}
            onRequestClose={this.close}
            autoScrollBodyContent={true}
          >
            <CategoryMultiselect
              items={categories}
              selectedIds={selectedIds}
              opened={false}
              onCheck={this.handleCheck}
            />
          </Dialog>
          <FlatButton
            style={{ minWidth: 52 }}
            onClick={this.open}
            icon={<FontIcon color="#333" className="material-icons">add</FontIcon>}
          />
        </span>
      </div>
    )
  }
}
