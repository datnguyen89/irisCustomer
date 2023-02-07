import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import {
  BANKSERVICETYPE,
  BREADCRUMB_DATA,
  DEVICE_TYPE,
  LONG_DATE,
  PAGES,
  RESPONSE_CODE,
  ROLES,
  TEXT_403,
  WARNING_COLOR,
  WARNING_TITLE,
} from '../../utils/constant'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import { Helmet } from 'react-helmet/es/Helmet'
import { AreaContractData, ContractWrapper, LinkBankPageWrapper, SpanCancelButton } from './LinkBankPageStyled'
import { ColorText, ColorTitle, RowFlexEndDiv, WhiteRoundedBox } from '../../components/CommonStyled/CommonStyled'
import { Button, notification, Space, Table } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ConfirmInfoModal from '../../components/ConfirmInfoModal'
import SuccessModal from '../../components/SuccessModal'
import IMAGES from '../../images'
import { useHistory } from 'react-router-dom'
import dateUtils from '../../utils/dateUtils'
import NoticeBankModal from '../../components/NoticeBankModal'

const LinkBankPage = props => {
  // region props, hook, state =================
  const { bankStore, orderStore, authenticationStore } = props
  const history = useHistory()
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [arrConfirmInfo, setArrConfirmInfo] = useState([])
  const [selectedLinkedBank, setSelectedLinkedBank] = useState(null)
  const [visibleSuccess, setVisibleSuccess] = useState(false)

  const [visibleSuggest, setVisibleSuggest] = useState(false)
  const [suggestBank, setSuggestBank] = useState(null)
  // endregion
  // region destructuring ======================
  const { userProfile, roles } = authenticationStore
  const { listLinkedBanks } = bankStore
  const { accessToken, tokenKey } = authenticationStore

  // endregion
  // region variable ===========================
  const columns = [
    {
      title: 'STT',
      width: 55,
      align: 'center',
      render: (item, row, index) => index + 1,
    },
    {
      title: 'SỐ TK VÍ',
      render: record => record.accountName,
    },
    {
      title: 'NGÂN HÀNG',
      render: record => record.bankName,
    },
    {
      title: 'SỐ TK/SỐ THẺ',
      render: record => record.bankAccount,
    },
    {
      title: 'LOẠI LIÊN KẾT',
      render: record => record?.bankAccount?.slice(0, 4) === '9704' ? 'Số thẻ' : 'Số tài khoản',
    },
    {
      title: 'NGÀY CẬP NHẬT',
      render: record => dateUtils.convertToStrDate(record.createdTime, LONG_DATE),
    },
    {
      title: 'HÀNH ĐỘNG',
      hidden: !authenticationStore.checkRole(ROLES.INITUNLINK),
      key: 'action',
      render: (item, row, index) => (
        <Space size='middle'>
          <SpanCancelButton onClick={() => cancelContract(item)}>
            <img src={IMAGES.CANCEL} style={{ marginRight: 8 }} />
            Hủy liên kết
          </SpanCancelButton>
        </Space>
      ),
    },
  ].filter(item => !item.hidden)

  // endregion
  // region function handle logic ==============
  const handleCloseSuggest = () => {
    setVisibleSuggest(false)
    setSuggestBank(null)
  }
  const cancelContract = (bank) => {
    orderStore.checkLinkBank({ bankCode: bank.bankCode })
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          // Nếu bankLinkType === 1 || bankLinkType === 3 : cho phép chọn để tạo yêu cầu
          if (res?.param?.bankLinkType === 1 || res?.param?.bankLinkType === 3) {
            setSelectedLinkedBank(bank)
            let infos = [
              {
                name: 'Ngân hàng',
                value: bank?.bankName,
              },
              {
                name: 'Số tài khoản/số thẻ',
                value: bank?.bankAccount,
              },
              {
                name: 'Loại liên kết',
                value: bank?.bankAccount?.slice(0, 4) === '9704' ? 'Thẻ' : 'Tài khoản',
              },
              {
                name: 'Số tài khoản ví',
                value: bank?.accountName,
              },
            ]
            setArrConfirmInfo(infos)
            setVisibleConfirm(true)
          } else {
            setSuggestBank(bank)
            setVisibleSuggest(true)
          }
        }
      })

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
          BankAccountID: selectedLinkedBank?.bankAccountID,
          BankAccountName: selectedLinkedBank?.bankAccountName,  // Tên tài khoản người đại diện bank
          BankAccount: selectedLinkedBank?.bankAccount,    // Số tài khoản bank
          BankCode: selectedLinkedBank?.bankCode,
          BankID: selectedLinkedBank?.bankID,
          IssueDate: '',   // Ngày tạo hoặc hết hạn thẻ định dạng MMYY
          CusLegalID: '', // Số cmt/cccd
          AccountName: selectedLinkedBank?.accountName, // Số tài khoản ví (sđt)
        },
      },
    }
    orderStore.createUnlinkBankExecution(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          setVisibleSuccess(true)
        }

      })
  }
  const handleClickLinkBank = () => {
    history.push(PAGES.ADD_LINK.PATH)
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
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
    if (!tokenKey || !accessToken) return
    bankStore.getLinkBanks({ bankServiceType: BANKSERVICETYPE.ALL })
  }, [accessToken, tokenKey])
  // endregion

  return (
    <>
      <Helmet>
        <title>Liên kết</title>
      </Helmet>
      <LinkBankPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.LINK_BANK} />
        <WhiteRoundedBox>
          <ContractWrapper>
            <ColorTitle>Danh sách tài khoản/Thẻ ngân hàng liên kết</ColorTitle>
            <RowFlexEndDiv margin={'0 0 16px 0'}>
              {
                authenticationStore.checkRole(ROLES.INITLINK)
                &&
                <Button onClick={handleClickLinkBank}>
                  <PlusOutlined />
                  Thêm thẻ mới
                </Button>
              }

            </RowFlexEndDiv>
            <AreaContractData>
              <Table
                dataSource={listLinkedBanks || []}
                columns={columns}
                pagination={false}
                bordered={true}
                scroll={{ x: 1200 }}
                rowKey={record => record.bankAccountID} />
            </AreaContractData>
            <ConfirmInfoModal
              onSuccess={handleConfirm}
              arrConfirmInfo={arrConfirmInfo}
              onClose={() => setVisibleConfirm(false)}
              title={'Xác nhận Hủy liên kết'}
              visible={visibleConfirm} />
            <SuccessModal
              icon={IMAGES.LINK_ERROR}
              visible={visibleSuccess}
              callbackSuccess={() => setVisibleSuccess(false)}
              description={'Bạn đã lập yêu cầu Hủy liên kết thành công'} />
          </ContractWrapper>
        </WhiteRoundedBox>

        <NoticeBankModal
          visible={visibleSuggest}
          description={`Quý khách vui lòng thực hiện hủy liên kết trên các kênh giao dịch của Ngân hàng ${suggestBank?.bankName} hoặc liên hệ Ngân hàng để được hỗ trợ.`}
          onClose={handleCloseSuggest} />
      </LinkBankPageWrapper>
    </>
  )
}

LinkBankPage.propTypes = {}

export default inject(
  'orderStore',
  'bankStore',
  'authenticationStore',
)(observer(LinkBankPage))