import React, { Fragment, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { HomeServicesWrapper, SaleBadge, ServiceBox, ServiceName } from './HomeServicesStyled'
import { Col, Modal, Row } from 'antd'
import { BANKSERVICETYPE, GROUP_EXECUTION_TYPE_ID, PAGES, ROLE_TYPE } from '../../utils/constant'
import { useHistory } from 'react-router-dom'
import { ColorTitleNoBg, RowCenterDiv, WhiteRoundedBox } from '../CommonStyled/CommonStyled'

const HomeServices = props => {
  const { commonStore, saleStore, authenticationStore, bankStore } = props
  const { appTheme } = commonStore
  const { listHomeProduct } = saleStore
  const { jwtDecode, accessToken, tokenKey } = authenticationStore
  const { listLinkedBanks } = bankStore
  const history = useHistory()

  const handleClickItem = (item) => {
    switch (jwtDecode?.RoleType) {
      case ROLE_TYPE.INIT:
        let detail = {}
        if (item?.Detail) {
          detail = JSON.parse(item?.Detail)
        }
        let product = { ...item }
        if (detail?.replacementId) {
          product.ProductID = detail?.replacementId
        }
        if (item.ProductCode.includes('INVOICE')) {
          history.push(`${PAGES.PAY_BILL.PATH}/${product.ProductID}`)
        } else if (item.ProductCode.includes('PREPAID')) {
          history.push(`${PAGES.PREPAID.PATH}/${product.ProductID}`)
        } else if (item.ProductCode.includes('POSTPAID')) {
          history.push(`${PAGES.POSTPAID.PATH}/${product.ProductID}`)
        } else if (item.ProductCode.includes('CARD')) {
          history.push(`${PAGES.PHONE_CARD.PATH}/${product.ProductID}`)
        } else if (item.ProductCode.includes('DATA-REG')) {
          history.push(`${PAGES.PACK_DATA.PATH}/${product.ProductID}`)
        }
        break
      case ROLE_TYPE.REVIEW:
      case ROLE_TYPE.APPROVE:
        history.push({
          pathname: PAGES.TRANSACTION_MANAGE.PATH,
          state: { groupTypeID: GROUP_EXECUTION_TYPE_ID.PAYMENT },
        })
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (!tokenKey || !accessToken) return
    bankStore.getLinkBanks({ bankServiceType: BANKSERVICETYPE.ALL })
  }, [accessToken, tokenKey])

  return (
    <HomeServicesWrapper>
      <WhiteRoundedBox>
        {
          listHomeProduct && listHomeProduct.map((item, index) =>
            <Fragment key={index}>
              <ColorTitleNoBg
                color={appTheme.solidColor}
                marginBottom={'16px'}
              >
                {item?.ProductName}
              </ColorTitleNoBg>
              <Row align={'stretch'} gutter={[16, 16]} style={{ alignItems: 'stretch', marginBottom: 16 }}>
                {
                  item?.Childrens && item?.Childrens.map(item =>
                    <Col xxl={4} xl={6} lg={12} md={12} sm={12} xs={24} flex={'stretch'} key={item.ProductID}>
                      {
                        <ServiceBox
                          appTheme={appTheme}
                          onClick={() => handleClickItem(item)}>
                          <img src={item.Logo} alt={''} height={90} width={90} />
                          <ServiceName>
                            {item.ProductName}
                          </ServiceName>
                          {/*<ServiceDescription>*/}
                          {/*  {item.ProductName}*/}
                          {/*</ServiceDescription>*/}
                          {
                            item?.Detail && JSON.parse(item?.Detail)?.saleLabelEnt &&
                            <SaleBadge backgroundColor={JSON.parse(item?.Detail)?.saleLabelEnt?.color}>
                              {JSON.parse(item?.Detail)?.saleLabelEnt?.text}
                            </SaleBadge>
                          }
                        </ServiceBox>
                      }
                    </Col>,
                  )
                }
              </Row>
            </Fragment>,
          )
        }
      </WhiteRoundedBox>


    </HomeServicesWrapper>
  )
}

HomeServices.propTypes = {}

export default inject('commonStore', 'saleStore', 'authenticationStore', 'bankStore')(observer(HomeServices))