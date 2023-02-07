import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { CollapsePanelTransferMultipleWrapper, SpaceIcon } from './CollapsePanelTransferMultipleStyled'
import { Descriptions, Modal, notification, Table } from 'antd'
import IconStatusLabel from '../IconStatusLabel'
import { ExpandContent } from '../../pages/TransactionManagePage/TransactionManagePageStyled'
import {
  ACTION_EXECUTION,
  CLOSE_TEXT,
  ERROR_COLOR,
  EXECUTION_ORDER_STATUS, EXECUTION_STATUS,
  LONG_DATE,
  PAGES,
  RESPONSE_CODE,
  RESULT_TRANSACTION_TITLE,
  ROLE_TYPE,
  ROLES,
  SUCCESS_COLOR,
  SUCCESS_TITLE,
  WARNING_COLOR,
  WARNING_TITLE,
} from '../../utils/constant'
import PaginationRow from '../PaginationRow'
import numberUtils from '../../utils/numberUtils'
import dateUtils from '../../utils/dateUtils'
import ConfirmExecutionModal from '../ConfirmExecutionModal'
import executionUtils from '../../utils/executionUtils'
import OtpModal from '../OtpModal'
import { ColorText, RowCenterDiv, RowFlexEndDiv } from '../CommonStyled/CommonStyled'
import { useHistory } from 'react-router-dom'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  PrinterOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { FileNameText } from '../../pages/TransferMultipleEditPage/TransferMultipleEditPageStyled'
import ViewDetailTransferMultipleModal from '../ViewDetailTransferMultipleModal'
import TransferMultiProgressModule from '../TransferMultiProgressModule'
import TransferMultiResultModal from '../TransferMultiResultModal'
import PrintExecutionPdfModal from '../PrintExecutionPdfModal'

const CollapsePanelTransferMultiple = props => {
  // region props, hook, state
  const {
    data,
    reLoadData,
    groupTypeID,
    orderStore,
    authenticationStore,
    propertyStore,
    paymentStore,
    commonStore,
    socketStore,
    filterOrderStatus,
  } = props
  const history = useHistory()
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [executionStatus, setExecutionStatus] = useState(false)
  const [selectedExecution, setSelectedExecution] = useState(null)
  const [executionView, setExecutionView] = useState(null)
  const [visibleViewModal, setVisibleViewModal] = useState(null)
  const [visibleOtp, setVisibleOtp] = useState(false)
  const [otpExpiredTime, setOtpExpiredTime] = useState(null)
  const [visibleResultModal, setVisibleResultModal] = useState(false)
  const [hiddenResendOtp, setHiddenResendOtp] = useState(false)
  const [extendData, setExtendData] = useState(null)
  const [description, setDescription] = useState('')
  const [rowsExpand, setRowExpand] = useState([])
  // endregion
  // region destructuring
  const { appTheme } = commonStore
  const { userProfile, jwtDecode } = authenticationStore
  const { objPagination, objFilterOrder } = orderStore
  const { commonProperty } = propertyStore

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
      render: record => ( // Tùy vào role render ra các nút tương ứng
        <SpaceIcon>
          {
            authenticationStore.checkRole(ROLES.INITTRANSFERMULTI) &&
            record?.orderStatus === EXECUTION_ORDER_STATUS.WAIT_APPROVAL &&
            objFilterOrder.Status !== EXECUTION_ORDER_STATUS.IN_PROGRESS &&
            <>
              <img
                onClick={() => handleClickEditExecution(record)}
                className={'action-icon'}
                src={executionUtils.renderActionButton(ROLE_TYPE.INIT, ACTION_EXECUTION.INIT_EDIT)}
                alt={''} />
              <img
                onClick={() => handleClickDeleteExecution(record)}
                className={'action-icon'}
                src={executionUtils.renderActionButton(ROLE_TYPE.INIT, ACTION_EXECUTION.INIT_DELETE)}
                alt={''} />
            </>
          }
          {
            authenticationStore.checkRole(ROLES.REVIEWTRANSFERMULTI) &&
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
            authenticationStore.checkRole(ROLES.APPROVETRANSFERMULTI) &&
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
      render: record => (
        <ColorText
          onClick={() => handleClickViewDetail(record)}
          cursor={'pointer'}
          color={appTheme.solidColor}>
          Xem chi tiết
        </ColorText>
      ),
    },
    {
      title: 'Thao tác',
      hidden: filterOrderStatus !== EXECUTION_ORDER_STATUS.APPROVED,
      align: 'center',
      render: record => (
        Number(JSON.parse(record?.executionData)?.TransferMultiInfo?.TotalSuccessfulAmount) > 0 &&
        <PrintExecutionPdfModal
          record={record}
          button={
            <PrinterOutlined style={{
              color: appTheme.solidColor,
              fontSize: 16,
              cursor: 'pointer',
            }} />
          } />
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
        orderStore.confirmReviewTransferMultiExecution(payloadReview)
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
              // case RESPONSE_CODE.MAX_OTP_FAILED:
              // case RESPONSE_CODE.BANK_OTP_INVALID:
              //   setVisibleOtp(false)
              //   setHiddenResendOtp(false)
              //   setOtpExpiredTime(null)
              //   reLoadData(groupTypeID)
              //   break
              case RESPONSE_CODE.WALLET_OTP_INVALID:
                break
              default:
                setVisibleOtp(false)
                setHiddenResendOtp(false)
                setOtpExpiredTime(null)
                reLoadData(groupTypeID)
                setRowExpand([])
                break
            }
          })
        break
      case ROLE_TYPE.APPROVE:
        let payload = {
          ExtendData: extendData,
          SecureCode: e,
          ExecutionID: Number(selectedExecution?.executionID),
        }
        orderStore.confirmTransferMultiExecution(payload)
          .then(res => {
            switch (res?.responseCode) {
              case RESPONSE_CODE.SUCCESS:
                setVisibleOtp(false)
                setHiddenResendOtp(false)
                setOtpExpiredTime(null)
                reLoadData(groupTypeID)
                setRowExpand([])
                setVisibleResultModal(true)

                break
              case RESPONSE_CODE.PAYMENT_ORDER_QUESTIONABLE:
              case RESPONSE_CODE.PAYMENT_TRANSACTION_PENDING:
              case RESPONSE_CODE.PAYMENT_TRANSACTION_UNKNOW:
                setVisibleOtp(false)
                setHiddenResendOtp(false)
                reLoadData(groupTypeID)
                setRowExpand([])
                Modal.info({
                  className: 'custom-notice',
                  width: 600,
                  title: RESULT_TRANSACTION_TITLE,
                  okText: CLOSE_TEXT,
                  onOk: () => {
                  },
                  onCancel: () => {
                  },
                  content:
                    <>
                      <RowCenterDiv margin={'16px 0'}>
                        <InfoCircleOutlined style={{ fontSize: 32, color: WARNING_COLOR }} />
                        <ColorText fontSize={'1.6rem'} margin={'0 0 0 16px'} color={WARNING_COLOR}>
                          {res?.description}
                        </ColorText>
                      </RowCenterDiv>
                      <Descriptions
                        bordered
                        column={1}
                        labelStyle={{ width: '35%' }}
                        contentStyle={{ width: '65%' }}
                        size={'small'}>
                        <Descriptions.Item label={'Tổng số tiền'}>
                          <strong>
                            {numberUtils.thousandSeparator(res?.param?.totalAmount)}đ
                          </strong>
                        </Descriptions.Item>
                        <Descriptions.Item label={'Số yêu cầu chuyển'}>
                          {Number(res?.param?.totalCount)}
                        </Descriptions.Item>
                      </Descriptions>
                    </>,
                })

                break
              case RESPONSE_CODE.PAYMENT_TRANSACTION_ERROR:
                setVisibleOtp(false)
                setHiddenResendOtp(false)
                reLoadData(groupTypeID)
                setRowExpand([])
                Modal.info({
                  className: 'custom-notice',
                  width: 600,
                  title: RESULT_TRANSACTION_TITLE,
                  okText: CLOSE_TEXT,
                  onOk: () => {
                  },
                  onCancel: () => {
                  },
                  content:
                    <>
                      <RowCenterDiv margin={'16px 0'}>
                        <CloseCircleOutlined style={{ fontSize: 32, color: ERROR_COLOR }} />
                        <ColorText fontSize={'1.6rem'} margin={'0 0 0 16px'} color={ERROR_COLOR}>
                          {res?.description}
                        </ColorText>
                      </RowCenterDiv>

                      <Descriptions
                        bordered
                        column={1}
                        labelStyle={{ width: '35%' }}
                        contentStyle={{ width: '65%' }}
                        size={'small'}>
                        <Descriptions.Item label={'Tổng số tiền'}>
                          <strong>
                            {numberUtils.thousandSeparator(res?.param?.totalAmount)}đ
                          </strong>
                        </Descriptions.Item>
                        <Descriptions.Item label={'Số yêu cầu chuyển'}>
                          {Number(res?.param?.totalCount)}
                        </Descriptions.Item>
                      </Descriptions>
                    </>,
                })
                break
              // case RESPONSE_CODE.MAX_OTP_FAILED:
              // case RESPONSE_CODE.BANK_OTP_INVALID:
              //   setVisibleOtp(false)
              //   setHiddenResendOtp(false)
              //   setOtpExpiredTime(null)
              //   reLoadData(groupTypeID)
              //   break
              case RESPONSE_CODE.WALLET_OTP_INVALID:
                break
              default:
                setVisibleOtp(false)
                setHiddenResendOtp(false)
                setOtpExpiredTime(null)
                reLoadData(groupTypeID)
                setRowExpand([])
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
    setExecutionView(null)
    socketStore.resetViewingExecution()
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
  // click nút duyệt
  const handleClickConfirmApprove = (execution, status) => {
    setRowExpand([...rowsExpand, execution?.executionID])
    setExecutionStatus(status)
    setSelectedExecution(execution)
    setVisibleConfirm(true)
  }
  // click nút kiểm soát
  const handleClickConfirmReview = (execution, status) => {
    setRowExpand([...rowsExpand, execution?.executionID])
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
        const payloadReview = {
          ReviewStatus: executionStatus, // true: duyệt - false: từ chối
          Reason: e?.reason || '', // Lý do duyệt - từ chối
          ExecutionID: Number(selectedExecution?.executionID), // Mã yêu cầu
          UpdateTime: Number(selectedExecution?.updateTime),
        }
        orderStore.reviewTransferMultipleExecution(payloadReview)
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
                setHiddenResendOtp(res?.disableResendOtp)
                setOtpExpiredTime(res?.otpExpiredTime)
                setVisibleOtp(true)
                break
              default:
                break
            }
          })
        break
      case  ROLE_TYPE.APPROVE:
        let dataViewing = {
          'executionID': Number(selectedExecution?.executionID),
          'totalAmount': Number(JSON.parse(selectedExecution?.executionData)?.TransferMultiInfo?.TotalAmountWithoutFee),
          'totalCount': Number(JSON.parse(selectedExecution?.executionData)?.TransferMultiInfo?.TotalCount),
          'totalWaitAmount': Number(JSON.parse(selectedExecution?.executionData)?.TransferMultiInfo?.TotalAmountWithoutFee),
          'totalWaitCount': Number(JSON.parse(selectedExecution?.executionData)?.TransferMultiInfo?.TotalCount),
          'totalSuccessAmount': 0,
          'totalSuccessCount': 0,
          'totalFailedAmount': 0,
          'totalFailedCount': 0,
          'totalPendingAmount': 0,
          'totalPendingCount': 0,
        }
        socketStore.setDataViewingExecution(dataViewing)
        socketStore.setViewingExecutionID(Number(selectedExecution?.executionID))

        const payloadApprove = {
          ApproveStatus: executionStatus, // true: duyệt - false: từ chối
          Reason: e?.reason || '', // Lý do duyệt - từ chối
          ExecutionID: Number(selectedExecution?.executionID), // Mã yêu cầu
          UpdateTime: Number(selectedExecution?.updateTime),
        }
        orderStore.approveTransferMultipleExecution(payloadApprove)
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
              case RESPONSE_CODE.REQUIRE_CONFIRM_BANK:
                setDescription(res?.description)
                setExtendData(res?.extendData)
                setVisibleOtp(true)
                setHiddenResendOtp(true)
                break
              case RESPONSE_CODE.REQUIRE_OTP:
              case RESPONSE_CODE.REQUIRE_WALLET_PASSWORD:
                setDescription(res?.description)
                setExtendData(res?.extendData)
                setHiddenResendOtp(res?.disableResendOtp)
                setOtpExpiredTime(res?.otpExpiredTime)
                setVisibleOtp(true)
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
  // xử lý khi cancel form xác nhận
  const handleCancelConfirm = (e) => {
    setExecutionStatus(false)
    setSelectedExecution(null)
    setVisibleConfirm(false)
  }
  const handleClickEditExecution = (e) => {
    Modal.confirm({
      className: 'custom-notice',
      width: 600,
      title: WARNING_TITLE,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        orderStore.setEditingExecution(e)
        history.push(PAGES.TRANSFER_MULTIPLE_EDIT.PATH)
      },
      onCancel: () => {
      },
      content:
        <>
          <RowCenterDiv margin={'16px 0'}>
            <WarningOutlined style={{ fontSize: 32, color: WARNING_COLOR }} />
            <ColorText fontSize={'1.6rem'} margin={'0 0 0 16px'} color={WARNING_COLOR}>
              Bạn có chắc chắn muốn sửa yêu cầu <br /> (Mã yêu cầu: {e.executionID}) ?
            </ColorText>
          </RowCenterDiv>
        </>,
    })

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
          executionID: Number(e.executionID),
        }
        orderStore.deleteTransferMultipleExecution(payload)
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
  // xử lý khi click expand 1 dòng trên bảng
  const handleClickExpand = (status, record) => {
    console.log(status, record)
  }
  // Xử lý xem detail
  const handleClickViewDetail = (record) => {
    setVisibleViewModal(true)
    setExecutionView(record)
  }
  // Xử lý đóng modal xem detail
  const handleCloseViewModal = () => {
    setVisibleViewModal(false)
    setExecutionView(null)
    socketStore.resetViewingExecution()
  }
  const renderTransferMultiTypeName = (value) => {
    return commonProperty?.transferMultiType?.find(item => item.value === value)?.name || ''
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
  const renderExpandRow = (record) => {
    if (!record) return
    return (
      <ExpandContent>
        <Descriptions
          labelStyle={{ width: '25%' }}
          contentStyle={{ width: '75%' }}
          bordered
          column={1}
          size={'small'}>
          <Descriptions.Item
            label={'Tổng giao dịch'}
            span={1}>
            {
              JSON.parse(record?.executionData)?.TransferMultiInfo?.TotalCount >= 0
                ? numberUtils.thousandSeparator(JSON.parse(record?.executionData)?.TransferMultiInfo?.TotalCount)
                : ''
            }
          </Descriptions.Item>
          <Descriptions.Item
            label={'Tổng tiền'}
            span={1}>
            {
              JSON.parse(record?.executionData)?.TransferMultiInfo?.TotalAmountWithoutFee >= 0
                ? numberUtils.thousandSeparator(JSON.parse(record?.executionData)?.TransferMultiInfo?.TotalAmountWithoutFee)
                : ''
            }
          </Descriptions.Item>
          {
            JSON.parse(record?.executionData)?.TransferMultiInfo?.TotalSuccessfulTrans !== null &&
            <Descriptions.Item
              label={'Tổng giao dịch thành công'}
              span={1}>
              {numberUtils.thousandSeparator(JSON.parse(record?.executionData)?.TransferMultiInfo?.TotalSuccessfulTrans)}
            </Descriptions.Item>
          }
          {
            JSON.parse(record?.executionData)?.TransferMultiInfo?.TotalSuccessfulAmount !== null &&
            <Descriptions.Item
              label={'Tổng số tiền GD thành công'}
              span={1}>
              {numberUtils.thousandSeparator(JSON.parse(record?.executionData)?.TransferMultiInfo?.TotalSuccessfulAmount)}
            </Descriptions.Item>
          }
          <Descriptions.Item
            label={'Tháng chi'}
            span={1}>
            {
              JSON.parse(record?.executionData)?.TransferMultiInfo?.Month > 0
                ? `Tháng ${JSON.parse(record?.executionData)?.TransferMultiInfo?.Month}`
                : ''
            }
          </Descriptions.Item>
          <Descriptions.Item
            label={'Hình thức'}
            span={1}>
            {
              JSON.parse(record?.executionData)?.TransferMultiInfo?.TransferMultiType >= 0
                ? renderTransferMultiTypeName(JSON.parse(record?.executionData)?.TransferMultiInfo?.TransferMultiType)
                : ''
            }
          </Descriptions.Item>
          <Descriptions.Item
            label={'File chuyển tiền'}
            span={1}>
            <FileNameText
              onClick={() => handleClickViewDetail(record)}
              color={appTheme.solidColor}>
              {JSON.parse(record?.executionData)?.TransferMultiInfo?.FileName || ''}
            </FileNameText>
          </Descriptions.Item>
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
          {
            record?.createdTime !== record?.updateTime &&
            <Descriptions.Item
              label={'Ngày cập nhật'}
              span={1}>
              {dateUtils.convertToStrDate(record?.updateTime, LONG_DATE)}
            </Descriptions.Item>
          }
        </Descriptions>
      </ExpandContent>
    )
  }

  // endregion
  // region side effect

  // endregion

  return (
    <CollapsePanelTransferMultipleWrapper>
      <div id='napasRoot' />
      <Table
        bordered={false}
        expandable={{
          expandedRowRender: record => renderExpandRow(record),
          onExpand: (status, record) => handleClickExpand(status, record),
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
            ? `Bạn có đồng ý xác nhận yêu cầu chuyển tiền theo lô ${'\n'} (Mã yêu cầu ${selectedExecution?.executionID})`
            : jwtDecode?.RoleType === ROLE_TYPE.APPROVE ?
              `Bạn có đồng ý phê duyệt yêu cầu chuyển tiền theo lô ${'\n'} (Mã yêu cầu ${selectedExecution?.executionID})`
              : ''
        }
        visible={visibleConfirm}
        onCancel={handleCancelConfirm}
        callbackConfirm={handleSubmitConfirm} />
      <OtpModal
        hiddenResend={hiddenResendOtp}
        description={description}
        expiredCountTime={otpExpiredTime}
        callbackOtp={handleSubmitOtp}
        visible={visibleOtp}
        onCancel={handleCancelOTP} />

      <ViewDetailTransferMultipleModal
        executionView={executionView}
        visible={visibleViewModal}
        onCancel={handleCloseViewModal} />

      <TransferMultiResultModal
        visible={visibleResultModal}
        onClose={() => setVisibleResultModal(false)} />

    </CollapsePanelTransferMultipleWrapper>
  )
}

CollapsePanelTransferMultiple.propTypes = {
  data: PropTypes.any,
  reLoadData: PropTypes.func,
  groupTypeID: PropTypes.number,
  filterOrderStatus: PropTypes.number,
}

export default inject(
  'orderStore',
  'authenticationStore',
  'commonStore',
  'socketStore',
  'propertyStore',
  'paymentStore')(observer(CollapsePanelTransferMultiple))