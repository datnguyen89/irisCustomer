import React from 'react'
import PropTypes from 'prop-types'
import { Avatar } from 'antd'
import IMAGES from '../../images'

const UserAvatar = props => {
  const { avatarUrl } = props
  return (
    <>
      {
        avatarUrl
          ?
          <Avatar shape={'circle'} src={avatarUrl} alt={''} height={24} width={24} />
          :
          <Avatar shape={'circle'} src={IMAGES.DEFAULT_AVATAR} alt={''} height={24} width={24} />
      }
    </>
  )
}

UserAvatar.propTypes = {
  avatarUrl: PropTypes.string,
}

export default UserAvatar