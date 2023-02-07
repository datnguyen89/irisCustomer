import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Descriptions } from 'antd'
import numberUtils from '../../utils/numberUtils'
import { DescriptionsCustomWrapper } from './DescriptionsCustomStyled'

const DescriptionsCustom = props => {
  const { fields } = props;
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (fields) {
      let arr = [];
      Object.keys(fields).map(function(key,index) {
        arr.push(<Descriptions.Item key={index} label={key} labelStyle={{width: "35%"}}>{fields[key]}</Descriptions.Item>)
      });
      setItems(arr);
    }
  }, [fields])

  return (
    <DescriptionsCustomWrapper bordered column={1}>
      {items}
    </DescriptionsCustomWrapper>
  )
}

DescriptionsCustom.propTypes = {}

export default DescriptionsCustom