import React from 'react'
import PropTypes from 'prop-types'
import { NotFoundPageWrapper } from './NotFoundPageStyled'
import { Button, Result, Space } from 'antd'
import { useHistory } from 'react-router-dom'
import { PAGES } from '../../utils/constant'

const NotFoundPage = props => {
  const history = useHistory()
  const handleClickBack = (num) => {
    switch (num) {
      case 1:
        history.goBack()
        break
      case 2:
        history.push(PAGES.HOME.PATH)
        break
      default:
        break
    }
  }
  return (
    <NotFoundPageWrapper>
      <Result
        status='404'
        title='404'
        subTitle='Trang bạn tìm kiếm không tồn tại.'
        extra={
          <Space>
            <Button onClick={() => handleClickBack(1)}>Về trang trước</Button>
            <Button type='primary' onClick={() => handleClickBack(2)}>Về trang chủ</Button>
          </Space>
        }
      />
    </NotFoundPageWrapper>
  )
}

NotFoundPage.propTypes = {}

export default NotFoundPage