import React from 'react'
import PropTypes from 'prop-types'
import { MainBreadCrumbWrapper } from './MainBreadCrumbStyled'
import { Breadcrumb } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

const MainBreadCrumb = props => {
  const { breadcrumbData } = props
  return (
    <MainBreadCrumbWrapper>
      <Breadcrumb separator={<RightOutlined />}>
        {
          breadcrumbData && breadcrumbData.map(item =>
            <Breadcrumb.Item key={item.ID}>
              {
                item.PATH
                  ?
                  <Link to={item.PATH}>{item.LABEL}</Link>
                  :
                  <span>{item.LABEL}</span>
              }
            </Breadcrumb.Item>,
          )
        }
      </Breadcrumb>
    </MainBreadCrumbWrapper>
  )
}

MainBreadCrumb.propTypes = {
  breadcrumbData: PropTypes.array,
}

export default MainBreadCrumb