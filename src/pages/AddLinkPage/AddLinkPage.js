import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  BREADCRUMB_DATA,
  DEVICE_TYPE,
  PAGES,
  RESPONSE_CODE,
  ROLES,
  TEXT_403,
  WARNING_COLOR,
  WARNING_TITLE,
} from '../../utils/constant'
import { AddLinkPageWrapper, AreaCreateCommand, TitleInfoLink } from './AddLinkPageStyled'
import { Button, Col, notification, Row } from 'antd'
import { inject, observer } from 'mobx-react'
import { ColorText, WhiteRoundedBox } from '../../components/CommonStyled/CommonStyled'
import BankSelectBox from '../../components/BankSelectBox'
import AccountSelectBox from '../../components/AccountSelectBox'
import ConfirmInfoModal from '../../components/ConfirmInfoModal'
import SuccessModal from '../../components/SuccessModal'
import IMAGES from '../../images'
import { useHistory } from 'react-router-dom'

const AddLinkPage = props => {
  // region props, hook, state =================
  const {
    accountWalletStore,
    bankStore,
    profileStore,
    orderStore,
    authenticationStore,
  } = props
  const history = useHistory()
  const [visibleSuccess, setVisibleSuccess] = useState(false)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [arrConfirmInfo, setArrConfirmInfo] = useState([])
  const [disabledConfirmDeal, setDisabledConfirmDeal] = useState(true)

  // endregion
  // region destructuring ======================
  const { entProfile } = profileStore
  const { userProfile, roles } = authenticationStore
  const {
    selectedAccountWallets,
    accountWallets,
  } = accountWalletStore
  const { selectedBank } = bankStore
  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleClickCreateExecution = () => {
    let infos = [
      {
        name: 'Ngân hàng',
        value: selectedBank?.bankName,
      },
      {
        name: 'Tên doanh nghiệp',
        value: entProfile?.businessName,
      },
      {
        name: 'Tên người đại diện',
        value: entProfile?.representative?.fullName,
      },
      {
        name: 'Mã số thuế',
        value: entProfile?.taxCode,
      },
      {
        name: 'Số tài khoản ví',
        value: entProfile?.accountName,
      },
    ]
    setArrConfirmInfo(infos)
    setVisibleConfirm(true)
  }
  const handleConfirm = () => {
    setVisibleConfirm(false)
    let payload = {
      DepartmentID: userProfile?.departmentID,
      OrganizationID: userProfile?.organizationID,
      ExecutionData: {
        Reason: null,
        DeviceType: DEVICE_TYPE,
        LinkBankInfo: {
          BankAccountName: '',  // Tên tài khoản người đại diện bank
          BankAccount: '',    // Số tài khoản bank
          BankCode: selectedBank?.bankCode,
          BankID: selectedBank?.bankID,
          IssueDate: '',   // Ngày tạo hoặc hết hạn thẻ định dạng MMYY
          CusLegalID: '', // Số cmt/cccd
          AccountName: selectedAccountWallets?.accountName, // Số tài khoản ví (sđt)
        },
      },
    }
    orderStore.createLinkBankExecution(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          setVisibleSuccess(true)
          bankStore.setSelectedBank(null)
        }
      })
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    if (selectedAccountWallets && selectedBank) setDisabledConfirmDeal(false)
    else setDisabledConfirmDeal(true)
  }, [selectedAccountWallets, selectedBank])
  useEffect(() => {
    if (!roles) return
    if (authenticationStore.checkRole(ROLES.INITLINK)) return
    history.push(PAGES.HOME.PATH)
    notification.warning({
      message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
      description: TEXT_403,
    })
  }, [roles])
  useEffect(() => {
    return () => {
      accountWalletStore.resetSelectedAccountWallets()
      bankStore.setSelectedBank(null)
    }
  }, [])
  // endregion

  return (
    <>
      <Helmet>
        <title>Thêm liên kết</title>
      </Helmet>
      <AddLinkPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.ADD_LINK} />
        <WhiteRoundedBox>
          <Row justify={'center'}>
            <Col span={24}>
              <TitleInfoLink>Thông tin liên kết</TitleInfoLink>
            </Col>
            <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
              <AccountSelectBox />
            </Col>
          </Row>
          <Row justify={'center'}>
            <Col span={24}>
              <TitleInfoLink>Chọn ngân hàng liên kết</TitleInfoLink>
            </Col>
            <Col span={24}>
              <BankSelectBox />
            </Col>
          </Row>
          <AreaCreateCommand>
            <Button
              type={disabledConfirmDeal ? 'default' : 'primary'}
              onClick={handleClickCreateExecution}
              disabled={disabledConfirmDeal}>
              Tạo yêu cầu
            </Button>
          </AreaCreateCommand>

        </WhiteRoundedBox>
        <ConfirmInfoModal
          onSuccess={handleConfirm}
          arrConfirmInfo={arrConfirmInfo}
          onClose={() => setVisibleConfirm(false)}
          title={'Xác nhận liên kết'}
          visible={visibleConfirm} />
        <SuccessModal
          icon={IMAGES.SUCCESS_CREATE_TRANSACTION}
          title={'Thông báo'}
          description={'Bạn đã lập yêu cầu thành công'}
          visible={visibleSuccess}
          callbackSuccess={() => setVisibleSuccess(false)} />
      </AddLinkPageWrapper>
    </>
  )
}

AddLinkPage.propTypes = {}

export default inject(
  'authenticationStore',
  'commonStore',
  'accountWalletStore',
  'bankStore',
  'profileStore',
  'orderStore')(observer(AddLinkPage))