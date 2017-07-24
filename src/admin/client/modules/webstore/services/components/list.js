import React from 'react';
import messages from 'lib/text'
import ServicesListItem from './item'
import style from './style.css'

export default class ServicesList extends React.Component {
    constructor(props){
      super(props);
    }

    componentDidMount(){
      this.props.fetchData();
    }

    render(){
      const { services } = this.props;

      if(services && services.data) {
        const items = services.data.map((service, index) => (
          <ServicesListItem key={index} service={service} />
        ));

        return (
          <div>
            <div className="row row--no-gutter scroll col-full-height" style={{ padding: 20, alignContent: 'flex-start' }}>
              {items}
            </div>
          </div>
        )
      } else {
        return null;
      }
    }
}
