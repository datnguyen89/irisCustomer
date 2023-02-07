import React from 'react'
import PropTypes from 'prop-types'
import {AreaAccountInfoWrapper} from './DetailPacksStyled'
import { Descriptions } from 'antd'

const DetailPacks = props => {
  const { data } = props
  return (
    <AreaAccountInfoWrapper>
      <Descriptions bordered column={1}>
        {
          data.map(item => (
              <Descriptions.Item key={item.id} label={item.key} labelStyle={{width: "30%"}}>{item.value}</Descriptions.Item>
            )
          )
        }
        <Descriptions.Item label={"Số tiền"} labelStyle={{width: "30%"}}></Descriptions.Item>
      </Descriptions>
    </AreaAccountInfoWrapper>
  )
}

DetailPacks.propTypes = {}

export default DetailPacks