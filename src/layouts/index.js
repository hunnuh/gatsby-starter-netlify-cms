import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import minireset from 'minireset.css'
import tachyons from 'tachyons'

import Navbar from '../components/Navbar';


export default class TemplateWrapper extends React.Component{


  render(){
    const {children} = this.props;
    const {pathname} = this.props.location;
    console.log(minireset)
    return(
    <div>
      <Helmet title="Labor 411: The #1 Directory for Union Goods and Services" />
      {pathname !== "/" ? <Navbar /> : ''}
      <div>{children()}</div>
    </div>)
  }

};

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};
