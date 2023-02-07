import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import {
  BankItemWrapper,
  BankSelectBoxTitle,
  BankSelectBoxWrapper,
  ConfirmModalDescription,
  ConfirmModalTitle,
} from './BankSelectBoxStyled'
import { Button, Col, Modal, Row } from 'antd'
import IMAGES from '../../images'
import { BANKSERVICETYPE, RESPONSE_CODE } from '../../utils/constant'
import NoticeBankModal from '../NoticeBankModal'

const BankSelectBox = props => {
  // region props, hook, state =================
  const { bankStore, commonStore, authenticationStore, orderStore } = props
  const [visibleSuggest, setVisibleSuggest] = useState(false)
  const [suggestBank, setSuggestBank] = useState(null)

  // endregion
  // region destructuring ======================
  const { listBanks, listBankLinkable, selectedBank, listLinkedBanks } = bankStore
  const { appTheme, pageName } = commonStore
  const { accessToken, tokenKey } = authenticationStore

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleClickSelect = e => {
    bankStore.setSelectedBank(null)
    orderStore.checkLinkBank({ bankCode: e.bankCode })
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          // Nếu bankLinkType === 1 || bankLinkType === 3 : cho phép chọn để tạo yêu cầu
          if (res?.param?.bankLinkType === 1 || res?.param?.bankLinkType === 3) {
            bankStore.setSelectedBank(e)
          } else {
            setSuggestBank(e)
            setVisibleSuggest(true)
          }
        }
      })
  }
  const handleCloseSuggest = () => {
    setVisibleSuggest(false)
    setSuggestBank(null)
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    if (!tokenKey || !accessToken) return
    bankStore.getLinkBanks({ bankServiceType: BANKSERVICETYPE.ALL })
  }, [accessToken, tokenKey])
  useEffect(() => {
    let payload = {
      // BankType: 1,
      // BankStatus: 1,
      BankServiceType: 1,
    }
    bankStore.getBanks(payload)
  }, [listLinkedBanks])
  // endregion

  return (
    <>
      {
        listBanks && listBanks?.length > 0
          ?
          <BankSelectBoxWrapper>
            <Row justify={'center'} gutter={[16, 16]}>
              <Col xxl={6} xl={6} lg={24} md={24} sm={24} xs={24}>
                <BankSelectBoxTitle>Ngân hàng liên kết trực tiếp</BankSelectBoxTitle>
                <Row gutter={[8, 8]}>
                  {
                    listBankLinkable && listBankLinkable?.length > 0 && listBankLinkable.map(item =>
                      <Col xxl={24} xl={24} lg={12} md={12} sm={12} xs={12} key={item?.bankID}>
                        <BankItemWrapper

                          onClick={() => handleClickSelect(item)}
                          selected={item?.bankID === selectedBank?.bankID}
                          color={appTheme.solidColor}>
                          <img src={item?.logo} alt={item?.bankName} />
                        </BankItemWrapper>
                      </Col>,
                    )
                  }
                </Row>
              </Col>
              <Col xxl={18} xl={18} lg={24} md={24} sm={24} xs={24}>
                <BankSelectBoxTitle>Ngân hàng nội địa</BankSelectBoxTitle>
                <Row gutter={[8, 8]}>
                  {
                    listBanks && listBanks?.length > 0 && listBanks.map(item =>
                      <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} key={item?.bankID}>
                        <BankItemWrapper
                          onClick={() => handleClickSelect(item)}
                          selected={item?.bankID === selectedBank?.bankID}
                          color={appTheme.solidColor}>
                          <img src={item?.logo} alt={item?.bankName} />
                        </BankItemWrapper>
                      </Col>,
                    )
                  }
                </Row>
              </Col>
            </Row>
          </BankSelectBoxWrapper>
          :
          <Row justify={'center'} gutter={[16, 16]}>
            <Col span={12}>
              <BankSelectBoxWrapper>
                <BankSelectBoxTitle>Ngân hàng liên kết trực tiếp</BankSelectBoxTitle>
                <Row gutter={[8, 8]}>
                  {
                    listBankLinkable && listBankLinkable?.length > 0 && listBankLinkable.map(item =>
                      <Col span={6} key={item?.bankID}>
                        <BankItemWrapper
                          onClick={() => handleClickSelect(item)}
                          selected={item?.bankID === selectedBank?.bankID}
                          color={appTheme.solidColor}>
                          <img src={item?.logo} alt={item?.bankName} />
                        </BankItemWrapper>
                      </Col>,
                    )
                  }
                </Row>
              </BankSelectBoxWrapper>
            </Col>
          </Row>
      }
      <NoticeBankModal
        visible={visibleSuggest}
        description={`Nhằm mở rộng liên kết Ví doanh nghiệp với số tài khoản/số thẻ với ngân hàng ${suggestBank?.bankName}, Quý khách vui lòng thực hiện liên kết trên các kênh giao dịch của Ngân hàng hoặc liên hệ Ngân hàng để được hỗ trợ.`}
        onClose={handleCloseSuggest} />
      {/*<Modal*/}
      {/*  width={600}*/}
      {/*  visible={visibleSuggest}*/}
      {/*  footer={null}*/}
      {/*  onCancel={handleCloseSuggest}*/}
      {/*  title={'Thông báo'}>*/}
      {/*  <Row justify={'space-around'} align={'middle'}>*/}
      {/*    <Col span={24} style={{ textAlign: 'center' }}>*/}
      {/*      <img src={IMAGES.LINK_SUGGEST} alt={''} height={180} />*/}
      {/*    </Col>*/}
      {/*    <Col span={24}>*/}
      {/*      <ConfirmModalDescription>*/}
      {/*        {`Nhằm mở rộng liên kết Ví doanh nghiệp với số tài khoản/số thẻ với ngân hàng ${suggestBank?.bankName}, Quý khách vui lòng thực hiện liên kết trên các kênh giao dịch của Ngân hàng hoặc liên hệ Ngân hàng để được hỗ trợ.`}*/}
      {/*      </ConfirmModalDescription>*/}
      {/*    </Col>*/}
      {/*    <Col span={11}>*/}
      {/*      <Button*/}
      {/*        onClick={handleCloseSuggest}*/}
      {/*        block*/}
      {/*        type={'primary'}>*/}
      {/*        Đóng*/}
      {/*      </Button>*/}
      {/*    </Col>*/}
      {/*  </Row>*/}
      {/*</Modal>*/}
    </>
  )
}

BankSelectBox.propTypes = {}

export default inject('bankStore', 'commonStore', 'authenticationStore', 'orderStore')(observer(BankSelectBox))