import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { IdentityInfoPageWrapper, NotLinkedCardBox, UserInfoBox, UserInfoBoxHeader } from './IdentityInfoPageStyled'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import { BANKSERVICETYPE, BREADCRUMB_DATA, PAGES, ROLES } from '../../utils/constant'
import { Avatar, Button, Col, Descriptions, Row } from 'antd'
import { ColorText, ColorTitle, RowCenterDiv, WhiteRoundedBox } from '../../components/CommonStyled/CommonStyled'
import { UserOutlined } from '@ant-design/icons'
import IMAGES from '../../images'
import LinkedCardCarousel from '../../components/LinkedCardCarousel'
import { useHistory } from 'react-router-dom'
import numberUtils from '../../utils/numberUtils'
import stringUtils from '../../utils/stringUtils'

const IdentityInfoPage = props => {
  // region props, hook, state =================
  const { commonStore, profileStore, bankStore, authenticationStore, propertyStore } = props
  const history = useHistory()

  // endregion
  // region destructuring ======================
  const { entUserProfile, entProfile } = profileStore
  const { listLinkedBanks } = bankStore
  const { accessToken, tokenKey, entTokenKey, jwtDecode } = authenticationStore
  const { commonProperty } = propertyStore
  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleClickAddLink = (path) => {
    history.push(path)
  }
  const renderRoleType = (v) => {
    return commonProperty?.roleType.find(item => item?.value === v)?.name || ''
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    if (!tokenKey || !accessToken) return
    profileStore.getProfile()
    bankStore.getLinkBanks({ bankServiceType: BANKSERVICETYPE.ALL })
  }, [tokenKey, accessToken])

  // endregion

  return (
    <>
      <Helmet>
        <title>Th??ng tin ?????nh danh</title>
      </Helmet>
      <IdentityInfoPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.IDENTITY} />
        <Row gutter={[16, 16]}>
          <Col
            xxl={{ span: 17, order: 1 }}
            xl={{ span: 24, order: 2 }}
            lg={{ span: 24, order: 2 }}
            md={{ span: 24, order: 2 }}
            sm={{ span: 24, order: 2 }}
            xs={{ span: 24, order: 2 }}
          >
            <WhiteRoundedBox height={'100%'}>
              <ColorTitle>
                Th??ng tin doanh nghi???p
              </ColorTitle>
              <Descriptions
                size={'small'}
                labelStyle={{ width: '20%' }}
                contentStyle={{ width: '30%' }}
                bordered
                column={1}>
                <Descriptions.Item label={'T??n t??? ch???c'}>
                  {entProfile?.businessName}
                </Descriptions.Item>
                <Descriptions.Item label={'S??? ??KKD/ GPTL'}>
                  {entProfile?.passport}
                </Descriptions.Item>
                <Descriptions.Item label={'T??n vi???t t???t'}>
                  {entProfile?.shortName}
                </Descriptions.Item>
                <Descriptions.Item label={'S??? ??i???n tho???i'}>
                  {entProfile?.phone}
                  {entProfile?.phone && entProfile?.mobile && ' - '}
                  {entProfile?.mobile}
                </Descriptions.Item>
                <Descriptions.Item label={'Ng??y c???p'}>
                  {entProfile?.passportDate}
                </Descriptions.Item>
                <Descriptions.Item label={'N??i c???p'}>
                  {entProfile?.passportPlace}
                </Descriptions.Item>
                <Descriptions.Item label={'M?? s??? thu???'}>
                  {entProfile?.taxCode}
                </Descriptions.Item>
                <Descriptions.Item label={'Email doanh nghi???p'}>
                  {entProfile?.email}
                </Descriptions.Item>
                <Descriptions.Item label={'?????a ch??? ??KKD'}>
                  {entProfile?.businessCenterAddress}
                </Descriptions.Item>
                <Descriptions.Item label={'?????a ch??? giao d???ch'}>
                  {entProfile?.tradingAddress}
                </Descriptions.Item>
              </Descriptions>
            </WhiteRoundedBox>
          </Col>
          <Col xxl={{ span: 7, order: 2 }}
               xl={{ span: 24, order: 1 }}
               lg={{ span: 24, order: 1 }}
               md={{ span: 24, order: 1 }}
               sm={{ span: 24, order: 1 }}
               xs={{ span: 24, order: 1 }}
          >
            <WhiteRoundedBox height={'100%'}>
              <UserInfoBox>
                <UserInfoBoxHeader>
                  <Avatar size={64} icon={entUserProfile?.avatar || <UserOutlined />} />
                  <ColorText color={'#fff'} fontWeight={600}>{entUserProfile?.fullName}</ColorText>
                </UserInfoBoxHeader>
                <Descriptions
                  labelStyle={{ width: '35%' }}
                  bordered
                  column={1}
                  size={'large'}>
                  <Descriptions.Item label={'T??n ????ng nh???p'}>{entUserProfile?.accountName}</Descriptions.Item>
                  <Descriptions.Item label={'H??? v?? t??n'}>{entUserProfile?.fullName}</Descriptions.Item>
                  <Descriptions.Item label={'S??? ??i???n tho???i'}>{entUserProfile?.mobile}</Descriptions.Item>
                  <Descriptions.Item label={'Email'}>{entUserProfile?.email}</Descriptions.Item>
                  <Descriptions.Item label={'Vai tr??'}>{renderRoleType(jwtDecode?.RoleType)}</Descriptions.Item>
                </Descriptions>
              </UserInfoBox>
            </WhiteRoundedBox>
          </Col>
          <Col xxl={{ span: 17, order: 3 }}
               xl={{ span: 24, order: 3 }}
               lg={{ span: 24, order: 3 }}
               md={{ span: 24, order: 3 }}
               sm={{ span: 24, order: 3 }}
               xs={{ span: 24, order: 3 }}
          >
            <WhiteRoundedBox>
              <ColorTitle>
                Th??ng tin t??i kho???n
              </ColorTitle>
              <Descriptions
                size={'small'}
                labelStyle={{ width: '20%' }}
                contentStyle={{ width: '30%' }}
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label={'S??? t??i kho???n'}>
                  {entProfile?.accountName}
                </Descriptions.Item>
                <Descriptions.Item label={'S??? d?? kh??? d???ng'}>
                  {entProfile?.balance ? numberUtils.thousandSeparator(entProfile?.balance) : 0} ??
                </Descriptions.Item>
                <Descriptions.Item label={'S??? d?? ????ng b??ng'}>
                  {entProfile?.freezeBalance ? numberUtils.thousandSeparator(entProfile?.freezeBalance) : 0} ??
                </Descriptions.Item>
                <Descriptions.Item label={'Tr???ng th??i t??i kho???n'}>
                  {stringUtils.renderEntStatus(entProfile?.status)}
                </Descriptions.Item>
              </Descriptions>
            </WhiteRoundedBox>
          </Col>
          <Col xxl={{ span: 7, order: 4 }}
               xl={{ span: 24, order: 4 }}
               lg={{ span: 24, order: 4 }}
               md={{ span: 24, order: 4 }}
               sm={{ span: 24, order: 4 }}
               xs={{ span: 24, order: 4 }}
          >
            {
              listLinkedBanks?.length > 0
                ?
                <WhiteRoundedBox margin={'0 0 16px 0'}>
                  <ColorTitle>Th??ng tin t??i kho???n</ColorTitle>
                  <LinkedCardCarousel listLinkedCard={listLinkedBanks} />
                  {
                    authenticationStore.checkRole(ROLES.INITLINK) &&
                    <RowCenterDiv>
                      <Button type={'default'} onClick={() => handleClickAddLink(PAGES.ADD_LINK.PATH)}>
                        Li??n k???t th??? m???i
                      </Button>
                    </RowCenterDiv>
                  }
                </WhiteRoundedBox>
                :
                authenticationStore.checkRole(ROLES.INITLINK) &&
                <WhiteRoundedBox>
                  <NotLinkedCardBox>
                    <ColorTitle>Li??n k???t th???</ColorTitle>
                    <img src={IMAGES.ICON_ADD_CARD} alt={''} />
                    <div style={{ marginBottom: 16 }}>
                      <ColorText color={'#B4B4B4'}>
                        B???n ch??a c?? th??? ng??n h??ng l??u s???n t???i ????y.
                        Thanh to??n nhanh h??n b???ng c??ch li??n k???t th??? ng??n h??ng v??o V?? PayMobi
                      </ColorText>
                    </div>
                    <Button
                      type={'primary'}
                      onClick={() => handleClickAddLink(PAGES.ADD_LINK.PATH)}
                    >Li??n k???t th??? m???i</Button>
                  </NotLinkedCardBox>
                </WhiteRoundedBox>
            }
          </Col>
        </Row>
      </IdentityInfoPageWrapper>
    </>
  )
}

IdentityInfoPage.propTypes = {}

export default inject(
  'commonStore',
  'authenticationStore',
  'profileStore',
  'propertyStore',
  'bankStore')(observer(IdentityInfoPage))