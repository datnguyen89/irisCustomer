import React from 'react'
import { ProviderIconWrapper, ProviderInfoWrapper, ProviderItem, WaterBillPageWrapper } from './WaterBillPageStyled'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import { BREADCRUMB_DATA } from '../../utils/constant'
import {
  BorderRoundedBox, ColorText, TextInput, TextInputWrapper, PaymentPeriodWrapper, PaymentTag,
  ProviderSearchInput, RowCenterDiv, ScrollBarsWrapper,
  TitleBackgroundGray,
  WhiteRoundedBox,
} from '../../components/CommonStyled/CommonStyled'
import { inject, observer } from 'mobx-react'
import { Button, Col, Descriptions, Divider, Row, Segmented, Tag, Timeline } from 'antd'
import HorizontalScroll from 'react-horizontal-scrolling'
import { Scrollbars } from 'react-custom-scrollbars'
import ICONS from '../../icons'
import PaymentMoneySource from '../../components/PaymentMoneySource'

const WaterBillPage = props => {
  // region props, hook, state =================
  const { commonStore } = props
  const { appTheme } = commonStore
  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const onSearchProvider = (e) => {
    console.log(e)
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================

  // endregion

  return (
    <>
      <Helmet>
        <title>Hóa đơn tiền nước</title>
      </Helmet>
      <WaterBillPageWrapper>
        <MainBreadCrumb breadcrumbData={[]} />
        <WhiteRoundedBox>
          <TitleBackgroundGray>
            Thông tin thanh toán
          </TitleBackgroundGray>
          <Row justify={'center'}>
            <Col xxl={16} xl={18} lg={24} md={24} sm={24} xs={24}>
              <BorderRoundedBox>
                <ProviderSearchInput
                  placeholder='Tìm kiếm nhà cung cấp'
                  onSearch={onSearchProvider}
                  style={{ marginBottom: 16 }}
                />

                <HorizontalScroll className={'provider-water'}>
                  <PaymentTag appTheme={appTheme} active={true}>Tất cả</PaymentTag>
                  <PaymentTag appTheme={appTheme} active={false}>Cấp nước miền Trung</PaymentTag>
                  <PaymentTag appTheme={appTheme} active={false}>Cấp nước miền Nam</PaymentTag>
                  <PaymentTag appTheme={appTheme} active={false}>Cấp nước miền Nam</PaymentTag>
                  <PaymentTag appTheme={appTheme} active={false}>Cấp nước miền Nam</PaymentTag>
                  <PaymentTag appTheme={appTheme} active={false}>Cấp nước miền Nam</PaymentTag>
                  <PaymentTag appTheme={appTheme} active={false}>Cấp nước miền Nam</PaymentTag>
                  <PaymentTag appTheme={appTheme} active={false}>Cấp nước miền Nam</PaymentTag>
                  <PaymentTag appTheme={appTheme} active={false}>Cấp nước miền Nam</PaymentTag>
                  <PaymentTag appTheme={appTheme} active={false}>Cấp nước miền Nam</PaymentTag>
                </HorizontalScroll>
                <Scrollbars
                  autoHeight
                  autoHeightMin={0}
                  autoHeightMax={250}>
                  <ScrollBarsWrapper>
                    <Row gutter={[16, 16]}>
                      <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
                        <ProviderItem active={true} appTheme={appTheme}>
                          <ProviderIconWrapper>
                            <img src={ICONS.SAMPLE_PROVIDER} align={''} />
                          </ProviderIconWrapper>
                          <ProviderInfoWrapper>
                            <ColorText cursor={'pointer'}>Cấp nước Hà Nội</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>Công ty cổ phần Nước Sạch Hà Nội</ColorText>
                          </ProviderInfoWrapper>
                        </ProviderItem>
                      </Col>
                      <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
                        <ProviderItem appTheme={appTheme}>
                          <ProviderIconWrapper>
                            <img src={ICONS.SAMPLE_PROVIDER} align={''} />
                          </ProviderIconWrapper>
                          <ProviderInfoWrapper>
                            <ColorText cursor={'pointer'}>Cấp nước Hà Nội</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>Công ty cổ phần Nước Sạch Hà Nội</ColorText>
                          </ProviderInfoWrapper>
                        </ProviderItem>
                      </Col>
                      <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
                        <ProviderItem appTheme={appTheme}>
                          <ProviderIconWrapper>
                            <img src={ICONS.SAMPLE_PROVIDER} align={''} />
                          </ProviderIconWrapper>
                          <ProviderInfoWrapper>
                            <ColorText cursor={'pointer'}>Cấp nước Hà Nội</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>Công ty cổ phần Nước Sạch Hà Nội</ColorText>
                          </ProviderInfoWrapper>
                        </ProviderItem>
                      </Col>
                      <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
                        <ProviderItem appTheme={appTheme}>
                          <ProviderIconWrapper>
                            <img src={ICONS.SAMPLE_PROVIDER} align={''} />
                          </ProviderIconWrapper>
                          <ProviderInfoWrapper>
                            <ColorText cursor={'pointer'}>Cấp nước Hà Nội</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>Công ty cổ phần Nước Sạch Hà Nội</ColorText>
                          </ProviderInfoWrapper>
                        </ProviderItem>
                      </Col>
                      <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
                        <ProviderItem appTheme={appTheme}>
                          <ProviderIconWrapper>
                            <img src={ICONS.SAMPLE_PROVIDER} align={''} />
                          </ProviderIconWrapper>
                          <ProviderInfoWrapper>
                            <ColorText cursor={'pointer'}>Cấp nước Hà Nội</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>Công ty cổ phần Nước Sạch Hà Nội</ColorText>
                          </ProviderInfoWrapper>
                        </ProviderItem>
                      </Col>
                      <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
                        <ProviderItem appTheme={appTheme}>
                          <ProviderIconWrapper>
                            <img src={ICONS.SAMPLE_PROVIDER} align={''} />
                          </ProviderIconWrapper>
                          <ProviderInfoWrapper>
                            <ColorText cursor={'pointer'}>Cấp nước Hà Nội</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>Công ty cổ phần Nước Sạch Hà Nội</ColorText>
                          </ProviderInfoWrapper>
                        </ProviderItem>
                      </Col>
                      <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
                        <ProviderItem appTheme={appTheme}>
                          <ProviderIconWrapper>
                            <img src={ICONS.SAMPLE_PROVIDER} align={''} />
                          </ProviderIconWrapper>
                          <ProviderInfoWrapper>
                            <ColorText cursor={'pointer'}>Cấp nước Hà Nội</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>Công ty cổ phần Nước Sạch Hà Nội</ColorText>
                          </ProviderInfoWrapper>
                        </ProviderItem>
                      </Col>
                      <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
                        <ProviderItem appTheme={appTheme}>
                          <ProviderIconWrapper>
                            <img src={ICONS.SAMPLE_PROVIDER} align={''} />
                          </ProviderIconWrapper>
                          <ProviderInfoWrapper>
                            <ColorText cursor={'pointer'}>Cấp nước Hà Nội</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>Công ty cổ phần Nước Sạch Hà Nội</ColorText>
                          </ProviderInfoWrapper>
                        </ProviderItem>
                      </Col>
                    </Row>
                  </ScrollBarsWrapper>
                </Scrollbars>
                <TextInputWrapper>
                  <TextInput placeholder={'Nhập mã khách hàng'} />
                  <img src={ICONS.CUSTOMER_SEARCH} alt={''} />
                </TextInputWrapper>

                <Descriptions bordered column={1}>
                  <Descriptions.Item label={'Tên khách hàng'} labelStyle={{ width: '30%' }}>
                    Nguyễn Văn A
                  </Descriptions.Item>
                  <Descriptions.Item label={'Địa chỉ'} labelStyle={{ width: '30%' }}>
                    27 Thái Thịnh, Ngã Tư Sở, Đống Đa, Hà Nội
                  </Descriptions.Item>
                  <Descriptions.Item label={'Kỳ thanh toán'} labelStyle={{ width: '30%' }}>
                    <PaymentPeriodWrapper>
                      <Timeline>
                        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                        <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                        <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                        <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                      </Timeline>
                    </PaymentPeriodWrapper>
                  </Descriptions.Item>
                  <Descriptions.Item label={'Số tiền'} labelStyle={{ width: '30%' }}>
                    1,500,000đ
                  </Descriptions.Item>
                </Descriptions>
              </BorderRoundedBox>
            </Col>
          </Row>
          <PaymentMoneySource />
          <RowCenterDiv margin={'16px 0 0 0'}>
            <Button
              type={'primary'}
              style={{ padding: '0 40px' }}
            >
              Tạo yêu cầu
            </Button>
          </RowCenterDiv>
        </WhiteRoundedBox>
      </WaterBillPageWrapper>

    </>
  )
}

WaterBillPage.propTypes = {}

export default inject('commonStore')(observer(WaterBillPage))