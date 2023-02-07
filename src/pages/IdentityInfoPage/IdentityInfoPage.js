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
        <title>Thông tin định danh</title>
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
                Thông tin doanh nghiệp
              </ColorTitle>
              <Descriptions
                size={'small'}
                labelStyle={{ width: '20%' }}
                contentStyle={{ width: '30%' }}
                bordered
                column={1}>
                <Descriptions.Item label={'Tên tổ chức'}>
                  {entProfile?.businessName}
                </Descriptions.Item>
                <Descriptions.Item label={'Số ĐKKD/ GPTL'}>
                  {entProfile?.passport}
                </Descriptions.Item>
                <Descriptions.Item label={'Tên viết tắt'}>
                  {entProfile?.shortName}
                </Descriptions.Item>
                <Descriptions.Item label={'Số điện thoại'}>
                  {entProfile?.phone}
                  {entProfile?.phone && entProfile?.mobile && ' - '}
                  {entProfile?.mobile}
                </Descriptions.Item>
                <Descriptions.Item label={'Ngày cấp'}>
                  {entProfile?.passportDate}
                </Descriptions.Item>
                <Descriptions.Item label={'Nơi cấp'}>
                  {entProfile?.passportPlace}
                </Descriptions.Item>
                <Descriptions.Item label={'Mã số thuế'}>
                  {entProfile?.taxCode}
                </Descriptions.Item>
                <Descriptions.Item label={'Email doanh nghiệp'}>
                  {entProfile?.email}
                </Descriptions.Item>
                <Descriptions.Item label={'Địa chỉ ĐKKD'}>
                  {entProfile?.businessCenterAddress}
                </Descriptions.Item>
                <Descriptions.Item label={'Địa chỉ giao dịch'}>
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
                  <Descriptions.Item label={'Tên đăng nhập'}>{entUserProfile?.accountName}</Descriptions.Item>
                  <Descriptions.Item label={'Họ và tên'}>{entUserProfile?.fullName}</Descriptions.Item>
                  <Descriptions.Item label={'Số điện thoại'}>{entUserProfile?.mobile}</Descriptions.Item>
                  <Descriptions.Item label={'Email'}>{entUserProfile?.email}</Descriptions.Item>
                  <Descriptions.Item label={'Vai trò'}>{renderRoleType(jwtDecode?.RoleType)}</Descriptions.Item>
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
                Thông tin tài khoản
              </ColorTitle>
              <Descriptions
                size={'small'}
                labelStyle={{ width: '20%' }}
                contentStyle={{ width: '30%' }}
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label={'Số tài khoản'}>
                  {entProfile?.accountName}
                </Descriptions.Item>
                <Descriptions.Item label={'Số dư khả dụng'}>
                  {entProfile?.balance ? numberUtils.thousandSeparator(entProfile?.balance) : 0} đ
                </Descriptions.Item>
                <Descriptions.Item label={'Số dư đóng băng'}>
                  {entProfile?.freezeBalance ? numberUtils.thousandSeparator(entProfile?.freezeBalance) : 0} đ
                </Descriptions.Item>
                <Descriptions.Item label={'Trạng thái tài khoản'}>
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
                  <ColorTitle>Thông tin tài khoản</ColorTitle>
                  <LinkedCardCarousel listLinkedCard={listLinkedBanks} />
                  {
                    authenticationStore.checkRole(ROLES.INITLINK) &&
                    <RowCenterDiv>
                      <Button type={'default'} onClick={() => handleClickAddLink(PAGES.ADD_LINK.PATH)}>
                        Liên kết thẻ mới
                      </Button>
                    </RowCenterDiv>
                  }
                </WhiteRoundedBox>
                :
                authenticationStore.checkRole(ROLES.INITLINK) &&
                <WhiteRoundedBox>
                  <NotLinkedCardBox>
                    <ColorTitle>Liên kết thẻ</ColorTitle>
                    <img src={IMAGES.ICON_ADD_CARD} alt={''} />
                    <div style={{ marginBottom: 16 }}>
                      <ColorText color={'#B4B4B4'}>
                        Bạn chưa có thẻ ngân hàng lưu sẵn tại đây.
                        Thanh toán nhanh hơn bằng cách liên kết thẻ ngân hàng vào Ví PayMobi
                      </ColorText>
                    </div>
                    <Button
                      type={'primary'}
                      onClick={() => handleClickAddLink(PAGES.ADD_LINK.PATH)}
                    >Liên kết thẻ mới</Button>
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