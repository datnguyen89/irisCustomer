import React from 'react'
import { PhoneDataPageWrapper } from './PhoneDataPageStyled'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import { BREADCRUMB_DATA } from '../../utils/constant'
import {
  BorderRoundedBox,
  ColorText,
  ColorTitleNoBg,
  PackInfoWrapper,
  PackItem,
  PackSubInfoWrapper,
  ProviderItemWrapper,
  QuantityInput,
  RowCenterDiv,
  ScrollBarsWrapper,
  TitleBackgroundGray,
  WhiteRoundedBox,
} from '../../components/CommonStyled/CommonStyled'


import { inject, observer } from 'mobx-react'
import { Button, Col, Row } from 'antd'
import HorizontalScroll from 'react-horizontal-scrolling'
import { Scrollbars } from 'react-custom-scrollbars'
import PaymentMoneySource from '../../components/PaymentMoneySource/PaymentMoneySource'

const PhoneDataPage = props => {
  // region props, hook, state =================
  const { commonStore } = props
  const {appTheme} = commonStore
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
    <>
      <Helmet>
        <title>Nạp data điện thoại</title>
      </Helmet>
      <PhoneDataPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.PHONE_DATA} />
        <WhiteRoundedBox>
          <TitleBackgroundGray>
            Thông tin dịch vụ
          </TitleBackgroundGray>
          <Row justify={'center'}>
            <Col xxl={16} xl={18} lg={24} md={24} sm={24} xs={24}>
              <BorderRoundedBox>
                <ColorTitleNoBg marginBottom={'16px'}>
                  Chọn nhà cung cấp
                </ColorTitleNoBg>
                <HorizontalScroll>
                  <ProviderItemWrapper active={true} appTheme={appTheme}>
                    <img src={require('../../media/icons/payment/mobifone.png')} alt={''} />
                  </ProviderItemWrapper>
                  <ProviderItemWrapper appTheme={appTheme}>
                    <img src={require('../../media/icons/payment/g_mobile.png')} alt={''} />
                  </ProviderItemWrapper>
                  <ProviderItemWrapper appTheme={appTheme}>
                    <img src={require('../../media/icons/payment/indochina.png')} alt={''} />
                  </ProviderItemWrapper>
                  <ProviderItemWrapper appTheme={appTheme}>
                    <img src={require('../../media/icons/payment/vietnamobile.png')} alt={''} />
                  </ProviderItemWrapper>
                  <ProviderItemWrapper appTheme={appTheme}>
                    <img src={require('../../media/icons/payment/viettel.png')} alt={''} />
                  </ProviderItemWrapper>
                  <ProviderItemWrapper appTheme={appTheme}>
                    <img src={require('../../media/icons/payment/vinaphone.png')} alt={''} />
                  </ProviderItemWrapper>
                </HorizontalScroll>
              </BorderRoundedBox>
              <BorderRoundedBox margin={'16px 0 0 0'}>
                <ColorTitleNoBg marginBottom={'16px'}>
                  Chọn gói / mệnh giá
                </ColorTitleNoBg>
                <Scrollbars
                  autoHeight
                  autoHeightMin={0}
                  autoHeightMax={270}>
                  <ScrollBarsWrapper>
                    <Row gutter={[16, 16]}>
                      <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
                        <PackItem
                          active={true}
                          justifyContent={'space-between'}
                          appTheme={appTheme}>
                          <PackInfoWrapper>
                            <ColorText fontWeight={600} cursor={'pointer'}>10,000đ</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>9,500đ</ColorText>
                          </PackInfoWrapper>
                          <PackSubInfoWrapper>
                            <div>500MB</div>
                            <div>1 ngày</div>
                          </PackSubInfoWrapper>
                        </PackItem>
                      </Col>
                      <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
                        <PackItem
                          justifyContent={'space-between'}
                          appTheme={appTheme}>
                          <PackInfoWrapper>
                            <ColorText fontWeight={600} cursor={'pointer'}>10,000đ</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>9,500đ</ColorText>
                          </PackInfoWrapper>
                          <PackSubInfoWrapper>
                            <div>500MB</div>
                            <div>1 ngày</div>
                          </PackSubInfoWrapper>
                        </PackItem>
                      </Col>
                      <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
                        <PackItem
                          justifyContent={'space-between'}
                          appTheme={appTheme}>
                          <PackInfoWrapper>
                            <ColorText fontWeight={600} cursor={'pointer'}>10,000đ</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>9,500đ</ColorText>
                          </PackInfoWrapper>
                          <PackSubInfoWrapper>
                            <div>500MB</div>
                            <div>1 ngày</div>
                          </PackSubInfoWrapper>
                        </PackItem>
                      </Col>
                      <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
                        <PackItem
                          justifyContent={'space-between'}
                          appTheme={appTheme}>
                          <PackInfoWrapper>
                            <ColorText fontWeight={600} cursor={'pointer'}>10,000đ</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>9,500đ</ColorText>
                          </PackInfoWrapper>
                          <PackSubInfoWrapper>
                            <div>500MB</div>
                            <div>1 ngày</div>
                          </PackSubInfoWrapper>
                        </PackItem>
                      </Col>
                      <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
                        <PackItem
                          justifyContent={'space-between'}
                          appTheme={appTheme}>
                          <PackInfoWrapper>
                            <ColorText fontWeight={600} cursor={'pointer'}>10,000đ</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>9,500đ</ColorText>
                          </PackInfoWrapper>
                          <PackSubInfoWrapper>
                            <div>500MB</div>
                            <div>1 ngày</div>
                          </PackSubInfoWrapper>
                        </PackItem>
                      </Col>
                      <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
                        <PackItem
                          justifyContent={'space-between'}
                          appTheme={appTheme}>
                          <PackInfoWrapper>
                            <ColorText fontWeight={600} cursor={'pointer'}>10,000đ</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>9,500đ</ColorText>
                          </PackInfoWrapper>
                          <PackSubInfoWrapper>
                            <div>500MB</div>
                            <div>1 ngày</div>
                          </PackSubInfoWrapper>
                        </PackItem>
                      </Col>
                      <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
                        <PackItem
                          justifyContent={'space-between'}
                          appTheme={appTheme}>
                          <PackInfoWrapper>
                            <ColorText fontWeight={600} cursor={'pointer'}>10,000đ</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>9,500đ</ColorText>
                          </PackInfoWrapper>
                          <PackSubInfoWrapper>
                            <div>500MB</div>
                            <div>1 ngày</div>
                          </PackSubInfoWrapper>
                        </PackItem>
                      </Col>
                      <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
                        <PackItem
                          justifyContent={'space-between'}
                          appTheme={appTheme}>
                          <PackInfoWrapper>
                            <ColorText fontWeight={600} cursor={'pointer'}>10,000đ</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>9,500đ</ColorText>
                          </PackInfoWrapper>
                          <PackSubInfoWrapper>
                            <div>500MB</div>
                            <div>1 ngày</div>
                          </PackSubInfoWrapper>
                        </PackItem>
                      </Col>
                      <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
                        <PackItem
                          justifyContent={'space-between'}
                          appTheme={appTheme}>
                          <PackInfoWrapper>
                            <ColorText fontWeight={600} cursor={'pointer'}>10,000đ</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>9,500đ</ColorText>
                          </PackInfoWrapper>
                          <PackSubInfoWrapper>
                            <div>500MB</div>
                            <div>1 ngày</div>
                          </PackSubInfoWrapper>
                        </PackItem>
                      </Col>
                      <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
                        <PackItem
                          justifyContent={'space-between'}
                          appTheme={appTheme}>
                          <PackInfoWrapper>
                            <ColorText fontWeight={600} cursor={'pointer'}>10,000đ</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>9,500đ</ColorText>
                          </PackInfoWrapper>
                          <PackSubInfoWrapper>
                            <div>500MB</div>
                            <div>1 ngày</div>
                          </PackSubInfoWrapper>
                        </PackItem>
                      </Col>
                      <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
                        <PackItem
                          justifyContent={'space-between'}
                          appTheme={appTheme}>
                          <PackInfoWrapper>
                            <ColorText fontWeight={600} cursor={'pointer'}>10,000đ</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>9,500đ</ColorText>
                          </PackInfoWrapper>
                          <PackSubInfoWrapper>
                            <div>500MB</div>
                            <div>1 ngày</div>
                          </PackSubInfoWrapper>
                        </PackItem>
                      </Col>
                      <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
                        <PackItem
                          justifyContent={'space-between'}
                          appTheme={appTheme}>
                          <PackInfoWrapper>
                            <ColorText fontWeight={600} cursor={'pointer'}>10,000đ</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>9,500đ</ColorText>
                          </PackInfoWrapper>
                          <PackSubInfoWrapper>
                            <div>500MB</div>
                            <div>1 ngày</div>
                          </PackSubInfoWrapper>
                        </PackItem>
                      </Col>
                      <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24}>
                        <PackItem
                          justifyContent={'space-between'}
                          appTheme={appTheme}>
                          <PackInfoWrapper>
                            <ColorText fontWeight={600} cursor={'pointer'}>10,000đ</ColorText>
                            <ColorText cursor={'pointer'} color={'#B4B4B4'}>9,500đ</ColorText>
                          </PackInfoWrapper>
                          <PackSubInfoWrapper>
                            <div>500MB</div>
                            <div>1 ngày</div>
                          </PackSubInfoWrapper>
                        </PackItem>
                      </Col>
                    </Row>
                  </ScrollBarsWrapper>
                </Scrollbars>
              </BorderRoundedBox>

            </Col>
          </Row>
          <PaymentMoneySource />
          <RowCenterDiv margin={'16px 0 0 0'}>
            <Button
              type={'primary'}
              style={{padding: '0 40px'}}
            >
              Tạo yêu cầu
            </Button>
          </RowCenterDiv>
        </WhiteRoundedBox>
      </PhoneDataPageWrapper>
    </>

  )
}

PhoneDataPage.propTypes = {}

export default inject('commonStore')(observer(PhoneDataPage))