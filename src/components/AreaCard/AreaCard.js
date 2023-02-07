import React from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'
import {
  AreaAddCard,
  AreaCardWrapper,
  AreaEnterpriseInfoLabel,
  AreaPanelAdminCard,
  SpanAreaAccountInfoLabel,
} from './AreaCardStyled'
import IMAGES from '../../images'

const AreaCard = props => {

  const handleAddNewCard = () => {

  }

  return (
    <AreaCardWrapper>
      <AreaPanelAdminCard
        arrowPrev={IMAGES.PREVIEW}
        arrowNext={IMAGES.NEXT}>
        <AreaEnterpriseInfoLabel>
          <SpanAreaAccountInfoLabel>Thông tin tài khoản</SpanAreaAccountInfoLabel>
        </AreaEnterpriseInfoLabel>
        <Slider {...props.settings}>
          <div>
            <img src={IMAGES.CARD} />
          </div>
          <div>
            <img src={IMAGES.CARD} />
          </div>
          <div>
            <img src={IMAGES.CARD} />
          </div>
        </Slider>
      </AreaPanelAdminCard>
      <AreaAddCard>
        <div>
          <span><img src={IMAGES.ADD} /></span>
          <span onClick={() => handleAddNewCard()}>Liên kết thẻ mới</span>
        </div>
      </AreaAddCard>
    </AreaCardWrapper>
  )
}

AreaCard.propTypes = {}

export default AreaCard