import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { CollapsePanelDepositMmWrapper, SpaceIcon } from './CollapsePanelDepositMmStyled'
import { Descriptions, Modal, notification, Table } from 'antd'
import IconStatusLabel from '../IconStatusLabel'
import { ExpandContent } from '../../pages/TransactionManagePage/TransactionManagePageStyled'
import {
  ACTION_EXECUTION,
  CLOSE_TEXT,
  ERROR_COLOR,
  EXECUTION_ORDER_STATUS,
  FEE_TYPE,
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
import { ColorText, RowCenterDiv } from '../CommonStyled/CommonStyled'
import { useHistory } from 'react-router-dom'
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'
import ExecutionStatusTag from '../ExecutionStatusTag'

const CollapsePanelDepositMm = props => {
  // region props, hook, state =================
  const {
    data,
    reLoadData,
    groupTypeID,
    orderStore,
    authenticationStore,
    propertyStore,
    paymentStore,
    filterOrderStatus,
  } = props
  const history = useHistory()
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [executionStatus, setExecutionStatus] = useState(false)
  const [selectedExecution, setSelectedExecution] = useState(null)
  const [visibleOtp, setVisibleOtp] = useState(false)
  const [hiddenResendOtp, setHiddenResendOtp] = useState(false)
  const [otpExpiredTime, setOtpExpiredTime] = useState(null)
  const [extendData, setExtendData] = useState(null)
  const [description, setDescription] = useState('')
  const [stateFee, setStateFee] = useState(0)
  const [rowsExpand, setRowExpand] = useState([])
  // endregion
  // region destructuring ======================
  const { userProfile, jwtDecode } = authenticationStore
  const { objPagination, objFilterOrder } = orderStore
  // endregion
  // region variable ===========================
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
      render: record => ( // Tùy vào role type render ra các nút tương ứng
        <SpaceIcon>
          {
            authenticationStore.checkRole(ROLES.INITDEPOSITMM) &&
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
            authenticationStore.checkRole(ROLES.REVIEWDEPOSITMM) &&
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
            authenticationStore.checkRole(ROLES.APPROVEDEPOSITMM) &&
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
  // region function handle logic ==============
  const handleSubmitOtp = (e) => {
    switch (jwtDecode?.RoleType) {
      case ROLE_TYPE.REVIEW:
        let payloadReview = {
          extendData: extendData,
          secureCode: e,
          executionID: selectedExecution?.executionID,
        }
        orderStore.confirmReviewDepositMMExecution(payloadReview)
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
        orderStore.confirmDepositMMExecution(payload)
          .then(res => {
            switch (res?.responseCode) {
              case RESPONSE_CODE.SUCCESS:
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
                        <CheckCircleOutlined style={{ fontSize: 32, color: SUCCESS_COLOR }} />
                        <ColorText fontSize={'1.6rem'} margin={'0 0 0 16px'} color={SUCCESS_COLOR}>
                          {res?.description}
                        </ColorText>
                      </RowCenterDiv>

                      <Descriptions
                        bordered
                        column={1}
                        labelStyle={{ width: '35%' }}
                        contentStyle={{ width: '65%' }}
                        size={'small'}>
                        <Descriptions.Item label={'Số tiền'}>
                          <strong>
                            {numberUtils.thousandSeparator(res?.param?.amount)}đ
                          </strong>
                        </Descriptions.Item>
                        <Descriptions.Item label={
                          'Mã giao dịch'
                        }>
                          {res?.param?.transactionID}
                        </Descriptions.Item>
                        <Descriptions.Item label={'Thời gian'}>
                          {res?.param?.createdTime ? dateUtils.convertToStrDate(res?.param?.createdTime, LONG_DATE) : ''}
                        </Descriptions.Item>
                      </Descriptions>
                    </>,
                })
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
                        <Descriptions.Item label={'Số tiền'}>
                          <strong>
                            {numberUtils.thousandSeparator(res?.param?.amount)}đ
                          </strong>
                        </Descriptions.Item>
                        <Descriptions.Item label={
                          'Mã đối soát'
                        }>
                          {res?.param?.orderID}
                        </Descriptions.Item>
                        <Descriptions.Item label={'Thời gian'}>
                          {res?.param?.createdTime ? dateUtils.convertToStrDate(res?.param?.createdTime, LONG_DATE) : ''}
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
                        <Descriptions.Item label={'Số tiền'}>
                          <strong>
                            {numberUtils.thousandSeparator(res?.param?.amount)}đ
                          </strong>
                        </Descriptions.Item>
                        <Descriptions.Item label={
                          (res?.param?.transactionID && res?.param?.transactionID != 0)
                            ? 'Mã giao dịch'
                            : 'Mã đối soát'
                        }>
                          {(res?.param?.transactionID && res?.param?.transactionID != 0) ? res?.param?.transactionID : res?.param?.orderID}
                        </Descriptions.Item>
                        <Descriptions.Item label={'Thời gian'}>
                          {res?.param?.createdTime ? dateUtils.convertToStrDate(res?.param?.createdTime, LONG_DATE) : ''}
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
    getFee(execution)
    if (!rowsExpand.includes(execution?.executionID)) {
      setRowExpand([...rowsExpand, execution?.executionID])
    }
    setExecutionStatus(status)
    setSelectedExecution(execution)
    setVisibleConfirm(true)
  }
  // click nút kiểm soát
  const handleClickConfirmReview = (execution, status) => {
    getFee(execution)
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
        const payloadReview = {
          ReviewStatus: executionStatus, // true: duyệt - false: từ chối
          Reason: e?.reason || '', // Lý do duyệt - từ chối
          ExecutionID: Number(selectedExecution?.executionID), // Mã yêu cầu
          UpdateTime: Number(selectedExecution?.updateTime),
        }
        orderStore.reviewDepositMMExecution(payloadReview)
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
        const payloadApprove = {
          ApproveStatus: executionStatus, // true: duyệt - false: từ chối
          Reason: e?.reason || '', // Lý do duyệt - từ chối
          ExecutionID: Number(selectedExecution?.executionID), // Mã yêu cầu
          UpdateTime: Number(selectedExecution?.updateTime),
        }
        orderStore.approveDepositMMExecution(payloadApprove)
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
        history.push(PAGES.DEPOSIT_MM_EDIT.PATH)
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
          ExecutionID: Number(e.executionID),
        }
        orderStore.deleteDepositMMExecution(payload)
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
    if (status) {
      getFee(record)
    }
  }
  const getFee = (record) => {
    let payload = {
      Amount: JSON.parse(record?.executionData)?.TransferInfo?.Amount,
      FeeType: FEE_TYPE.TRANSFER,
      TransferType: JSON.parse(record?.executionData)?.TransferInfo?.TransferType, // case nếu ví đến ví 0,  nếu ví đến MM khác tài khoản 4
    }
    paymentStore.getFee(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          let feeTransaction = JSON.parse(res?.param)
          setStateFee(Number(feeTransaction?.transferFee))
        } else {
          setStateFee(0)
        }
      })
      .catch(() => {
        setStateFee(0)
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
  // region function render ====================
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
            label={'Số tài khoản chuyển'}
            span={1}>
            {JSON.parse(record?.executionData)?.TransferInfo?.AccountName || ''}
          </Descriptions.Item>
          <Descriptions.Item
            label={'Tên tài khoản chuyển'}
            span={1}>
            {JSON.parse(record?.executionData)?.TransferInfo?.AccountFullName || ''}
          </Descriptions.Item>
          <Descriptions.Item
            label={'Số tài khoản nhận'}
            span={1}>
            {JSON.parse(record?.executionData)?.TransferInfo?.RelatedUser || ''}
          </Descriptions.Item>
          <Descriptions.Item
            label={'Tên tài khoản nhận'}
            span={1}>
            {JSON.parse(record?.executionData)?.TransferInfo?.RelatedFullName || ''}
          </Descriptions.Item>
          <Descriptions.Item
            label={'Số tiền'}
            span={1}>
            {`${numberUtils.thousandSeparator(JSON.parse(record?.executionData)?.TransferInfo?.Amount)} đ` || ''}
          </Descriptions.Item>
          <Descriptions.Item
            label={'Nội dung'}
            span={1}>
            {JSON.parse(record?.executionData)?.TransferInfo?.Description}
          </Descriptions.Item>
          <Descriptions.Item
            label={'Phí giao dịch'}
            span={1}>
            {stateFee > 0 ? `${numberUtils.thousandSeparator(stateFee)} đ` : 'Miễn phí'}
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
  // region side effect ========================

  // endregion

  return (
    <CollapsePanelDepositMmWrapper>
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
            ? `Bạn có đồng ý xác nhận yêu cầu nạp tiền TK tiền di động ${'\n'} (Mã yêu cầu ${selectedExecution?.executionID})`
            : jwtDecode?.RoleType === ROLE_TYPE.APPROVE ?
              `Bạn có đồng ý phê duyệt yêu cầu nạp tiền TK tiền di động ${'\n'} (Mã yêu cầu ${selectedExecution?.executionID})`
              : ''
        }
        visible={visibleConfirm}
        onCancel={handleCancelConfirm}
        callbackConfirm={handleSubmitConfirm} />
      <OtpModal
        hiddenResend={hiddenResendOtp}
        description={description}
        callbackOtp={handleSubmitOtp}
        expiredCountTime={otpExpiredTime}
        visible={visibleOtp}
        onCancel={handleCancelOTP} />

    </CollapsePanelDepositMmWrapper>
  )
}

CollapsePanelDepositMm.propTypes = {
  data: PropTypes.any,
  reLoadData: PropTypes.func,
  groupTypeID: PropTypes.number,
  filterOrderStatus: PropTypes.number,
}

export default inject(
  'orderStore',
  'authenticationStore',
  'propertyStore',
  'paymentStore')(observer(CollapsePanelDepositMm))