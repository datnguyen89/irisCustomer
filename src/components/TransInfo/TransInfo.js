import React from 'react'
import PropTypes from 'prop-types'
import {
  Wrapper,
  DesciptionLabel,
  DesciptionValue,
} from './TransInfoStyled'
import WrapperLabel from '../../components/WrapperLabel'
import { Row, Col } from 'antd'

const TransInfo = ({ title, data }) => {
  return (
    <Wrapper>
      <WrapperLabel value={title} color='primary' />
      {
        data.map(item => (
          <Row>
            <Col span={8}><DesciptionLabel>{item.label}</DesciptionLabel></Col>
            <Col span={16}><DesciptionValue>{item.value}</DesciptionValue></Col>
          </Row>
        ))
      }
    </Wrapper>

  )
}

TransInfo.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
}

export default TransInfo