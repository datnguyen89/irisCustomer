import React from 'react'
import PropTypes from 'prop-types'
import {
  AreaAccountInfoAreaDetail,
  AreaAccountInfoAreaDetailLineInfo, AreaAccountInfoAreaDetailLineInfoLeft, AreaAccountInfoAreaDetailLineInfoRight,
  AreaAccountInfoLabel, AreaAccountInfoWrapper, AreaIdentityInfoAreaDetailBox, SpanAreaAccountInfoLabel,
} from './AreaAccountInfoStyled'

const AreaAccountInfo = props => {
  return (
    <AreaAccountInfoWrapper>
      <AreaAccountInfoLabel>
        <SpanAreaAccountInfoLabel>Thông tin tài khoản</SpanAreaAccountInfoLabel>
      </AreaAccountInfoLabel>
      <AreaAccountInfoAreaDetail>
        <AreaIdentityInfoAreaDetailBox>
          {
            props.dataAccountInfo.map(item =>
              <AreaAccountInfoAreaDetailLineInfo key={item.id}>
                <AreaAccountInfoAreaDetailLineInfoLeft>{item.key}</AreaAccountInfoAreaDetailLineInfoLeft>
                <AreaAccountInfoAreaDetailLineInfoRight>{item.value}</AreaAccountInfoAreaDetailLineInfoRight>
              </AreaAccountInfoAreaDetailLineInfo>,
            )
          }
        </AreaIdentityInfoAreaDetailBox>
      </AreaAccountInfoAreaDetail>
    </AreaAccountInfoWrapper>
  )
}

AreaAccountInfo.propTypes = {}

export default AreaAccountInfo