import React from 'react'
import PropTypes from 'prop-types'
import IMAGES from '../../images'
import { ColorTitleNoBg, RowCenterDiv } from '../CommonStyled/CommonStyled'

const EmptyProduct = props => {
  // region props, hook, state =================
  const { description } = props
  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================

  // endregion
  return (
    <RowCenterDiv flexDirection={'column'}>
      <img src={IMAGES.EMPTY_PACK} alt={''} />
      <ColorTitleNoBg marginTop={'8px'} marginBottom={'8px'}>
        {description ? description : 'Không có thông tin'}
      </ColorTitleNoBg>
    </RowCenterDiv>
  )
}

EmptyProduct.propTypes = {
  description: PropTypes.node,
}

export default EmptyProduct