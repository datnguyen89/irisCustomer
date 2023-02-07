import React, { Fragment, useCallback, useEffect, useState } from 'react'
import postscribe from 'postscribe'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { CollapsePanelLinkBankWrapper, SpaceIcon } from './CollapsePanelLinkBankStyled'
import { Descriptions, message, Modal, notification, Table } from 'antd'
import IconStatusLabel from '../IconStatusLabel'
import { ExpandContent } from '../../pages/TransactionManagePage/TransactionManagePageStyled'
import {
  ACTION_EXECUTION, CLOSE_TEXT,
  ERROR_COLOR, ERROR_TITLE, EXECUTION_ORDER_STATUS,
  EXECUTION_TYPE_ID,
  GROUP_EXECUTION_TYPE_ID, LONG_DATE, RESPONSE_CODE, RESULT_TRANSACTION_TITLE,
  ROLE_TYPE, ROLES, SUCCESS_COLOR, SUCCESS_TITLE, WARNING_COLOR, WARNING_TITLE,
} from '../../utils/constant'
import ICONS from '../../icons'
import PaginationRow from '../PaginationRow'
import numberUtils from '../../utils/numberUtils'
import dateUtils from '../../utils/dateUtils'
import { toJS } from 'mobx'
import ConfirmExecutionModal from '../ConfirmExecutionModal'
import RequireFieldsModal from './RequireFieldsModal'
import executionUtils from '../../utils/executionUtils'
import { ColorText, RowCenterDiv } from '../CommonStyled/CommonStyled'
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons'
import ExecutionStatusTag from '../ExecutionStatusTag'
import OtpModal from '../OtpModal/OtpModal'

const CollapsePanelLinkBank = props => {
  // region props, hook, state
  const {
    data,
    reLoadData,
    groupTypeID,
    orderStore,
    authenticationStore,
    propertyStore,
    filterOrderStatus,
  } = props

  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [executionStatus, setExecutionStatus] = useState(false)
  const [selectedExecution, setSelectedExecution] = useState(null)
  const [visibleRequireModal, setVisibleRequireModal] = useState(false)
  const [bankLinkType, setBankLinkType] = useState(null)
  const [requireFieldArr, setRequireFieldArr] = useState(null)
  const [requireFieldBankAccountArr, setRequireFieldBankAccountArr] = useState(null)
  const [rowsExpand, setRowExpand] = useState([])
  // OTP
  const [visibleOtp, setVisibleOtp] = useState(false)
  const [hiddenResendOtp, setHiddenResendOtp] = useState(false)
  const [otpExpiredTime, setOtpExpiredTime] = useState(null)
  const [extendData, setExtendData] = useState(null)
  const [description, setDescription] = useState('')
  // endregion
  // region destructuring
  const { userProfile, jwtDecode } = authenticationStore
  const { objPagination, objFilterOrder } = orderStore

  // endregion
  // region variable
  const columns = [
    {
      title: 'STT',
      width: 55,
      align: 'center',
      render: (item, row, index) => numberUtils.renderTableIndex(objPagination[groupTypeID]?.PageIndex, objPagination[groupTypeID]?.PageSize, index),
    },
    {
      title: 'Mã yêu cầu',
      render: record => record.executionID,
    },
    {
      title: 'Yêu cầu',
      responsive: ['xxl', 'xl'],
      render: record => record.executionTypeName,
    },
    {
      title: 'Trạng thái yêu cầu',
      responsive: ['xxl', 'xl'],
      render: record => (
        <IconStatusLabel
          icon={executionUtils.renderCollapseExecutionStatusIcon(record.orderStatus)}
          label={propertyStore.renderTransactionStatusLabel(record.orderStatus)} />
      ),
    },
    {
      title: 'Người tạo',
      responsive: ['xxl', 'xl', 'md'],
      render: record => JSON.parse(record.orderStatusData)?.length > 0
        ? JSON.parse(record.orderStatusData)?.find(item => item.RoleType === ROLE_TYPE.INIT)?.FullName
        : '',
    },
    {
      title: 'Người duyệt',
      responsive: ['xxl', 'xl', 'md'],
      render: record => (
        <>
          {
            JSON.parse(record.orderStatusData)?.find(item => item.RoleType === ROLE_TYPE.REVIEW) &&
            <>
              <IconStatusLabel
                iconHeight={20}
                iconWidth={20}
                icon={
                  executionUtils.renderUserApprovedIcon(JSON.parse(record.orderStatusData)?.find(item => item.RoleType === ROLE_TYPE.REVIEW)?.OrderStatus)
                }
                label={
                  JSON.parse(record.orderStatusData)?.length > 0
                    ? JSON.parse(record.orderStatusData)?.find(item => item.RoleType === ROLE_TYPE.REVIEW)?.FullName
                    : ''
                } />
              <br />
            </>
          }
          {
            JSON.parse(record.orderStatusData)?.find(item => item.RoleType === ROLE_TYPE.APPROVE) &&
            <>
              <IconStatusLabel
                iconHeight={20}
                iconWidth={20}
                icon={
                  executionUtils.renderUserApprovedIcon(JSON.parse(record.orderStatusData)?.find(item => item.RoleType === ROLE_TYPE.APPROVE)?.OrderStatus)
                }
                label={
                  JSON.parse(record.orderStatusData)?.length > 0
                    ? JSON.parse(record.orderStatusData)?.find(item => item.RoleType === ROLE_TYPE.APPROVE)?.FullName
                    : ''
                } />
            </>

          }
        </>
      ),
    },
    {
      title: 'Ngày tạo',
      responsive: ['xxl', 'xl'],
      render: record => dateUtils.convertToStrDate(record.createdTime, LONG_DATE),
    },
    {
      title: 'Hành động',
      hidden: filterOrderStatus === EXECUTION_ORDER_STATUS.APPROVED,
      align: 'center',
      render: record => ( // Tùy vào role type render ra các nút tương ứng
        <SpaceIcon>
          {
            authenticationStore.checkMultipleRole([ROLES.INITLINK, ROLES.INITUNLINK]) &&
            record?.orderStatus === EXECUTION_ORDER_STATUS.WAIT_APPROVAL &&
            objFilterOrder.Status !== EXECUTION_ORDER_STATUS.IN_PROGRESS &&
            <>
              {/*<img*/}
              {/*  className={'action-icon'}*/}
              {/*  src={executionUtils.renderActionButton(ROLE_TYPE.INIT, ACTION_EXECUTION.INIT_EDIT)}*/}
              {/*  alt={''} />*/}
              <img
                onClick={() => handleClickDeleteExecution(record)}
                className={'action-icon'}
                src={executionUtils.renderActionButton(ROLE_TYPE.INIT, ACTION_EXECUTION.INIT_DELETE)}
                alt={''} />
            </>
          }
          {
            authenticationStore.checkMultipleRole([ROLES.REVIEWLINK, ROLES.REVIEWUNLINK]) &&
            record?.orderStatus === EXECUTION_ORDER_STATUS.WAIT_APPROVAL &&
            objFilterOrder.Status !== EXECUTION_ORDER_STATUS.IN_PROGRESS &&
            <>
              <img
                onClick={() => handleClickConfirmReview(record, true)}
                className={'action-icon'}
                src={executionUtils.renderActionButton(ROLE_TYPE.REVIEW, ACTION_EXECUTION.REVIEW)}
                alt={''} />
              <img
                onClick={() => handleClickConfirmReview(record, false)}
                className={'action-icon'}
                src={executionUtils.renderActionButton(ROLE_TYPE.REVIEW, ACTION_EXECUTION.REJECT)}
                alt={''} />
            </>
          }
          {
            authenticationStore.checkMultipleRole([ROLES.APPROVELINK, ROLES.APPROVEUNLINK]) &&
            (
              record?.orderStatus === EXECUTION_ORDER_STATUS.WAIT_APPROVAL ||
              record?.orderStatus === EXECUTION_ORDER_STATUS.REVIEWED
            ) &&
            objFilterOrder.Status !== EXECUTION_ORDER_STATUS.IN_PROGRESS &&
            <>
              <img
                onClick={() => handleClickConfirmApprove(record, true)}
                className={'action-icon'}
                src={executionUtils.renderActionButton(ROLE_TYPE.APPROVE, ACTION_EXECUTION.APPROVE)}
                alt={''} />
              <img
                onClick={() => handleClickConfirmApprove(record, false)}
                className={'action-icon'}
                src={executionUtils.renderActionButton(ROLE_TYPE.APPROVE, ACTION_EXECUTION.REJECT)}
                alt={''} />
            </>
          }
        </SpaceIcon>
      ),
    },
    {
      title: 'Kết quả',
      hidden: filterOrderStatus !== EXECUTION_ORDER_STATUS.APPROVED,
      align: 'center',
      render: record => ( // Tùy vào role type render ra các nút tương ứng
        <ExecutionStatusTag
          executionStatus={record?.executionStatus}
          executionStatusDescription={record?.executionStatusDescription} />
      ),
    },
  ].filter(item => !item?.hidden)

  // endregion
  // region function handle logic
  const handleSubmitOtp = (e) => {
    switch (jwtDecode?.RoleType) {
      case ROLE_TYPE.REVIEW:
        let payloadReview = {
          extendData: extendData,
          secureCode: e,
          executionID: selectedExecution?.executionID,
        }
        switch (selectedExecution?.executionType) {
          case EXECUTION_TYPE_ID.LINK:
            orderStore.confirmReviewLinkBankExecution(payloadReview)
              .then(res => {
                switch (res?.responseCode) {
                  case RESPONSE_CODE.SUCCESS:
                    setVisibleOtp(false)
                    setHiddenResendOtp(false)
                    setOtpExpiredTime(null)
                    reLoadData(groupTypeID)
                    setRowExpand([])
                    notification.success({
                      message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
                      description: res?.description,
                    })
                    break
                  case RESPONSE_CODE.MAX_OTP_FAILED:
                  case RESPONSE_CODE.BANK_OTP_INVALID:
                    setVisibleOtp(false)
                    setHiddenResendOtp(false)
                    reLoadData(groupTypeID)
                    setRowExpand([])
                    break
                  default:
                    break
                }
              })
            break
          case EXECUTION_TYPE_ID.UNLINK:
            orderStore.confirmReviewUnlinkBankExecution(payloadReview)
              .then(res => {
                switch (res?.responseCode) {
                  case RESPONSE_CODE.SUCCESS:
                    setVisibleOtp(false)
                    setHiddenResendOtp(false)
                    setOtpExpiredTime(null)
                    reLoadData(groupTypeID)
                    setRowExpand([])
                    notification.success({
                      message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
                      description: res?.description,
                    })
                    break
                  case RESPONSE_CODE.MAX_OTP_FAILED:
                  case RESPONSE_CODE.BANK_OTP_INVALID:
                    setVisibleOtp(false)
                    setHiddenResendOtp(false)
                    setOtpExpiredTime(null)
                    reLoadData(groupTypeID)
                    setRowExpand([])
                    break
                  default:
                    break
                }
              })
            break
          default:
            break
        }
        break
      case ROLE_TYPE.APPROVE:
        let payload = {
          ExtendData: extendData,
          SecureCode: e,
          ExecutionID: selectedExecution?.executionID,
        }
        orderStore.confirmUnlinkBankExecution(payload)
          .then(res => {
            switch (res?.responseCode) {
              case RESPONSE_CODE.SUCCESS:
                setVisibleOtp(false)
                setHiddenResendOtp(false)
                setOtpExpiredTime(null)
                reLoadData(groupTypeID)
                setRowExpand([])
                notification.success({
                  message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
                  description: res?.description,
                })
                break
              case RESPONSE_CODE.MAX_OTP_FAILED:
              case RESPONSE_CODE.BANK_OTP_INVALID:
                setVisibleOtp(false)
                setHiddenResendOtp(false)
                setOtpExpiredTime(null)
                reLoadData(groupTypeID)
                setRowExpand([])
                break
              default:

                break
            }
          })
        break
      default:
        break
    }


  }
  const handleCancelOTP = () => {
    setVisibleOtp(false)
    setHiddenResendOtp(false)
    let payload = {
      executionID: selectedExecution?.executionID,
    }
    orderStore.revertOrderStatusExecution(payload)
      .then(res => {
        setSelectedExecution(null)
        reLoadData(groupTypeID)
        setRowExpand([])
      })
  }
  // cancel form require BE trả về
  const handleCancelRequire = () => {
    setVisibleRequireModal(false)
    setBankLinkType(null)
    setRequireFieldArr(null)
    setRequireFieldBankAccountArr(null)
  }
  // submit form require BE trả về
  const handleSubmitRequire = (e) => {
    console.log(e)
    let payload = {
      ApproveStatus: executionStatus, // true: duyệt - false: từ chối
      Reason: '', // Lý do duyệt - từ chối
      ExecutionID: Number(selectedExecution?.executionID), // Mã yêu cầu,
      BankAccountName: e?.BankAccountName || '', // Tên tài khoản người đại diện bank
      BankAccount: e?.BankAccount || '', // Số tài khoản bank
      BankCode: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.BankCode || '',
      BankID: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.BankID || '',
      IssueDate: e?.IssueDate || '', // Ngày tạo hoặc hết hạn thẻ định dạng MMYY
      CustLegalID: e?.CustLegalID || '', // Số cmt/cccd
      AccountName: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.AccountName || '', // Số tài khoản ví (sđt)
    }
    orderStore.approveLinkBankExecution(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          console.log(res.param)
          setVisibleRequireModal(false)
          postscribe('#napasRoot', `${res.param}`)
          const el = document.getElementById('napasRoot').getElementsByTagName('form')
          if (el?.length > 0) {
            el[0].submit()
          }
        }
      })
  }
  // click nút duyệt
  const handleClickConfirmApprove = (execution, status) => {
    if (!rowsExpand.includes(execution?.executionID)) {
      setRowExpand([...rowsExpand, execution?.executionID])
    }
    setExecutionStatus(status)
    setSelectedExecution(execution)
    setVisibleConfirm(true)
  }
  // click nút kiểm soát
  const handleClickConfirmReview = (execution, status) => {
    if (!rowsExpand.includes(execution?.executionID)) {
      setRowExpand([...rowsExpand, execution?.executionID])
    }
    setExecutionStatus(status)
    setSelectedExecution(execution)
    setVisibleConfirm(true)
  }
  // xử lý khi submit form xác nhận
  const handleSubmitConfirm = (e) => {
    setVisibleConfirm(false)
    switch (jwtDecode?.RoleType) {
      case ROLE_TYPE.INIT:
        // TODO
        break
      case ROLE_TYPE.REVIEW:
        let payload = {
          ReviewStatus: executionStatus, // true: duyệt - false: từ chối
          Reason: e?.reason || '', // Lý do duyệt - từ chối
          ExecutionID: Number(selectedExecution?.executionID), // Mã yêu cầu
          UpdateTime: Number(selectedExecution?.updateTime),
        }
        switch (selectedExecution?.executionType) {
          case EXECUTION_TYPE_ID.LINK:
            orderStore.reviewLinkBankExecution(payload)
              .then(res => {
                switch (res?.responseCode) {
                  case RESPONSE_CODE.SUCCESS:
                    notification.success({
                      message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
                      description: res?.description,
                    })
                    reLoadData(groupTypeID)
                    setRowExpand([])
                    break
                  case RESPONSE_CODE.REQUIRE_OTP:
                    setDescription(res?.description)
                    setExtendData(res?.extendData)
                    setVisibleOtp(true)
                    setHiddenResendOtp(res?.disableResendOtp)
                    setOtpExpiredTime(res?.otpExpiredTime)
                    break
                  default:
                    break
                }
              })
            break
          case EXECUTION_TYPE_ID.UNLINK:
            orderStore.reviewUnLinkBankExecution(payload)
              .then(res => {
                switch (res?.responseCode) {
                  case RESPONSE_CODE.SUCCESS:
                    notification.success({
                      message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
                      description: res?.description,
                    })
                    reLoadData(groupTypeID)
                    setRowExpand([])
                    break
                  case RESPONSE_CODE.REQUIRE_OTP:
                    setDescription(res?.description)
                    setExtendData(res?.extendData)
                    setVisibleOtp(true)
                    setHiddenResendOtp(res?.disableResendOtp)
                    setOtpExpiredTime(res?.otpExpiredTime)
                    break
                  default:
                    break
                }
              })
            break
          default:
            break
        }
        break
      case  ROLE_TYPE.APPROVE:
        let payloadApprove = {
          ApproveStatus: executionStatus, // true: duyệt - false: từ chối
          Reason: e?.reason || '', // Lý do duyệt - từ chối
          ExecutionID: Number(selectedExecution?.executionID), // Mã yêu cầu,
          BankAccountName: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.BankAccountName || '', // Tên tài khoản người đại diện bank
          BankAccount: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.BankAccount || '', // Số tài khoản bank
          BankCode: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.BankCode || '',
          BankID: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.BankID || '',
          IssueDate: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.IssueDate || '', // Ngày tạo hoặc hết hạn thẻ định dạng MMYY
          CustLegalID: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.CustLegalID || '', // Số cmt/cccd
          AccountName: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.AccountName || '', // Số tài khoản ví (sđt)
          UpdateTime: Number(selectedExecution?.updateTime),
        }
        switch (selectedExecution?.executionType) {
          case EXECUTION_TYPE_ID.LINK:

            if (executionStatus) {
              // Xử lý khi phê duyệt
              let params = {
                bankCode: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.BankCode,
              }
              orderStore.checkLinkBank(params)
                .then(res => {
                  if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
                    // Nếu bankLinkType === 1 || bankLinkType === 3: Mở form điền thông tin trả về từ server
                    if (res?.param?.bankLinkType === 1 || res?.param?.bankLinkType === 3) {
                      setBankLinkType(res?.param?.bankLinkType)
                      setRequireFieldArr(res?.param?.requireField)
                      setRequireFieldBankAccountArr(res?.param?.requireFieldBankAccount)
                      setVisibleRequireModal(true)
                    } else {

                    }
                  }
                })
            } else {
              // Xử lý khi từ chối
              orderStore.approveLinkBankExecution(payloadApprove)
                .then(res => {
                  if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
                    notification.success({
                      message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
                      description: res?.description,
                    })
                    reLoadData(groupTypeID)
                    setRowExpand([])
                  }
                })
            }
            break
          case EXECUTION_TYPE_ID.UNLINK:
            orderStore.approveUnLinkBankExecution(payloadApprove)
              .then(res => {
                if (res?.responseCode === RESPONSE_CODE.REQUIRE_OTP) {
                  console.log('======================================',res)
                  setHiddenResendOtp(res?.disableResendOtp)
                  setOtpExpiredTime(res?.otpExpiredTime)
                  setDescription(res?.description)
                  setExtendData(res?.extendData)
                  setVisibleOtp(true)
                }
              })
            break
          default:
            break
        }
        break
      default:
        break
    }
  }
  // xử lý khi cancel form xác nhận
  const handleCancelConfirm = (e) => {
    setExecutionStatus(false)
    setSelectedExecution(null)
    setVisibleConfirm(false)
  }
  const handleClickDeleteExecution = (e) => {
    Modal.confirm({
      className: 'custom-notice',
      width: 600,
      title: WARNING_TITLE,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        let payload = {
          ExecutionID: Number(e.executionID),
        }
        switch (e?.executionType) {
          case EXECUTION_TYPE_ID.LINK:
            orderStore.deleteLinkBankExecution(payload)
              .then(res => {
                if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
                  notification.success({
                    message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
                    description: res?.description,
                  })
                  reLoadData(groupTypeID)
                  setRowExpand([])
                }
              })
            break
          case EXECUTION_TYPE_ID.UNLINK:
            orderStore.deleteUnlinkBankExecution(payload)
              .then(res => {
                if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
                  notification.success({
                    message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
                    description: res?.description,
                  })
                  reLoadData(groupTypeID)
                  setRowExpand([])
                }
              })
            break
          default:
            break
        }

      },
      onCancel: () => {
      },
      content:
        <>
          <RowCenterDiv margin={'16px 0'}>
            <WarningOutlined style={{ fontSize: 32, color: WARNING_COLOR }} />
            <ColorText fontSize={'1.6rem'} margin={'0 0 0 16px'} color={WARNING_COLOR}>
              Bạn có chắc chắn muốn xóa yêu cầu (Mã yêu cầu: {e.executionID}) ?
            </ColorText>
          </RowCenterDiv>
        </>,
    })
  }
  // xử lý khi thay đổi phân trang
  const handleChangePagination = (pageIndex, pageSize) => {
    if (objPagination[groupTypeID].PageSize !== pageSize) {
      objPagination[groupTypeID].PageIndex = 1
      objPagination[groupTypeID].PageSize = pageSize
    } else {
      objPagination[groupTypeID].PageIndex = pageIndex
    }
    orderStore.getOrders(groupTypeID, userProfile)
  }
  // endregion
  // region function render
  // xử lý khi click expand 1 dòng trên bảng
  const renderExpandRow = (record) => {
    return (
      <ExpandContent>
        <Descriptions
          labelStyle={{ width: '25%' }}
          contentStyle={{ width: '75%' }}
          bordered
          column={1}
          size={'small'}>
          <Descriptions.Item
            label={'Ngân hàng'}
            span={1}>
            {JSON.parse(record?.executionData)?.LinkBankInfo?.BankCode || ''}
          </Descriptions.Item>
          {
            JSON.parse(record?.executionData)?.LinkBankInfo?.BankAccount &&
            <Descriptions.Item
              label={'Số tài khoản ngân hàng'}
              span={1}>
              {JSON.parse(record?.executionData)?.LinkBankInfo?.BankAccount || ''}
            </Descriptions.Item>
          }

          <Descriptions.Item
            label={'Số tài khoản ví'}
            span={1}>
            {JSON.parse(record?.executionData)?.LinkBankInfo?.AccountName || ''}
          </Descriptions.Item>
          {
            JSON.parse(record?.executionData)?.LinkBankInfo?.BankAccount &&
            <Descriptions.Item
              label={'Loại liên kết'}
              span={1}>
              {
                JSON.parse(record?.executionData)?.LinkBankInfo?.BankAccount
                  ? JSON.parse(record?.executionData)?.LinkBankInfo?.BankAccount?.slice(0, 4) === '9704' ? 'Số thẻ' : 'Số tài khoản'
                  : ''
              }
            </Descriptions.Item>
          }
          {
            JSON.parse(record?.orderStatusData) && JSON.parse(record?.orderStatusData)?.length > 0 && JSON.parse(record?.orderStatusData).map((item, index) =>
              <Fragment key={index}>
                <Descriptions.Item
                  label={
                    item.RoleType === ROLE_TYPE.INIT
                      ? 'Người tạo'
                      : item.RoleType === ROLE_TYPE.REVIEW
                        ? 'Người kiểm tra' : item.RoleType === ROLE_TYPE.APPROVE
                          ? 'Người duyệt' : ''
                  }
                  span={1}>
                  {item.FullName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    item.RoleType === ROLE_TYPE.INIT
                      ? 'Ngày tạo'
                      : item.RoleType === ROLE_TYPE.REVIEW
                        ? 'Ngày duyệt kiểm tra' : item.RoleType === ROLE_TYPE.APPROVE
                          ? 'Ngày duyệt' : ''
                  }
                  span={1}>
                  {dateUtils.convertToStrDate(item.StatusTime, LONG_DATE)}
                </Descriptions.Item>
              </Fragment>,
            )
          }

        </Descriptions>
      </ExpandContent>

    )
  }
  // endregion
  // region side effect

  // endregion

  return (
    <CollapsePanelLinkBankWrapper>
      <div id='napasRoot' />
      <Table
        bordered={false}
        expandable={{
          expandedRowRender: record => renderExpandRow(record),
          onExpandedRowsChange: (expandedKeys) => setRowExpand(expandedKeys),
          expandedRowKeys: rowsExpand,
        }}
        dataSource={data}
        columns={columns}
        rowKey={record => record.executionID}
        pagination={false} />
      <PaginationRow
        onChangePagination={handleChangePagination}
        currentListLength={data?.length}
        totalCount={objPagination[groupTypeID]?.TotalCount}
        pageIndex={objPagination[groupTypeID]?.PageIndex}
        pageSize={objPagination[groupTypeID]?.PageSize}
      />
      <ConfirmExecutionModal
        executionStatus={executionStatus}
        description={
          jwtDecode?.RoleType === ROLE_TYPE.REVIEW
            ? `Bạn có đồng ý xác nhận yêu cầu ${selectedExecution?.executionType === EXECUTION_TYPE_ID?.LINK ? 'liên kết' : 'hủy liên kết'} ${'\n'} (Mã yêu cầu ${selectedExecution?.executionID})`
            : jwtDecode?.RoleType === ROLE_TYPE.APPROVE
              ? `Bạn có đồng ý phê duyệt yêu cầu ${selectedExecution?.executionType === EXECUTION_TYPE_ID?.LINK ? 'liên kết' : 'hủy liên kết'} ${'\n'} (Mã yêu cầu ${selectedExecution?.executionID})`
              : ''
        }
        visible={visibleConfirm}
        onCancel={handleCancelConfirm}
        callbackConfirm={handleSubmitConfirm} />
      <RequireFieldsModal
        visible={visibleRequireModal}
        bankLinkType={bankLinkType}
        requireField={requireFieldArr}
        requireFieldBankAccount={requireFieldBankAccountArr}
        onClose={handleCancelRequire}
        onSuccess={handleSubmitRequire} />
      <OtpModal
        expiredCountTime={otpExpiredTime}
        hiddenResend={hiddenResendOtp}
        description={description}
        callbackOtp={handleSubmitOtp}
        visible={visibleOtp}
        onCancel={handleCancelOTP} />
    </CollapsePanelLinkBankWrapper>
  )
}

CollapsePanelLinkBank.propTypes = {
  data: PropTypes.any,
  reLoadData: PropTypes.func,
  groupTypeID: PropTypes.number,
  filterOrderStatus: PropTypes.number,
}

export default inject('orderStore', 'authenticationStore', 'propertyStore')(observer(CollapsePanelLinkBank))