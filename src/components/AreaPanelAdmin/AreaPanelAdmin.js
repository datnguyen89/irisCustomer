import React from 'react'
import PropTypes from 'prop-types'
import IMAGES from '../../images'
import {
  EnterpriseInfoDetailLine,
  DetailLineInfoLeft,
  AreaEnterpriseInfoAreaDetailLineInfoRight,
  AreaPanelAdminAvatar,
  AreaPanelAdminLabel,
  AreaPanelAdminWrapper,
  AreaPanelAdminInfo, DivLabel,
} from './AreaPanelAdminStyled'

const AreaPanelAdmin = props => {
  let dataAdministratorPanel = props.dataAdministratorPanel

  return (
    <AreaPanelAdminWrapper>
      <AreaPanelAdminLabel background={IMAGES.ADMIN_BG}>
        <AreaPanelAdminAvatar>
          <img src={IMAGES.AVATAR_ADMIN} alt='Avatar Administrator' />
        </AreaPanelAdminAvatar>
        <DivLabel>Adminstrator</DivLabel>
      </AreaPanelAdminLabel>
      <AreaPanelAdminInfo>
        {
          dataAdministratorPanel.map(item =>
            <EnterpriseInfoDetailLine key={item.id}>
              <DetailLineInfoLeft><span>{item.key}</span></DetailLineInfoLeft>
              <AreaEnterpriseInfoAreaDetailLineInfoRight>{item.value}</AreaEnterpriseInfoAreaDetailLineInfoRight>
            </EnterpriseInfoDetailLine>)
        }
      </AreaPanelAdminInfo>
    </AreaPanelAdminWrapper>
  )
}

AreaPanelAdmin.propTypes = {}

export default AreaPanelAdmin