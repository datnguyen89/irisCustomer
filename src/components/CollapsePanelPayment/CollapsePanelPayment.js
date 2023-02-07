import React, { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { CollapsePanelPaymentWrapper, ResultSuccessModal, SpaceIcon } from './CollapsePanelPaymentStyled'
import { Collapse, Descriptions, Divider, message, Modal, notification, Table } from 'antd'
import IconStatusLabel from '../IconStatusLabel'
import { ExpandContent } from '../../pages/TransactionManagePage/TransactionManagePageStyled'
import {
  ACTION_EXECUTION,
  CLOSE_TEXT,
  ERROR_COLOR, ERROR_TITLE,
  EXECUTION_ORDER_STATUS,
  FEE_TYPE,
  LONG_DATE,
  PAGES, PAYMENT_TYPE,
  PAYTYPE,
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
import { ColorText, ColorTitleNoBg, RowCenterDiv, RowFlexEndDiv } from '../CommonStyled/CommonStyled'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import ExecutionStatusTag from '../ExecutionStatusTag'
import moment from 'moment'
import { toJS } from 'mobx'
import TransferMultiProgressModule from '../TransferMultiProgressModule'

const { Panel } = Collapse

const CollapsePanelPayment = props => {
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
    profileStore,
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
  const [currPayload, setCurrPayload] = useState(null)
  // const [stateFee, setStateFee] = useState(0)
  const [rowsExpand, setRowExpand] = useState([])
  // endregion
  // region destructuring ======================
  const { userProfile, jwtDecode } = authenticationStore
  const { objPagination, objFilterOrder } = orderStore
  const { currUserName, entUserName } = profileStore

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
      render: record => JSON.parse(record.executionData)?.PaymentInfo?.ProductTypeName,
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
                iconHeight={16}
                iconWidth={16}
                icon={executionUtils.renderUserApprovedIcon(record.orderStatus)}
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
              iconHeight={16}
              iconWidth={16}
              icon={executionUtils.renderUserApprovedIcon(record.orderStatus)}
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
            authenticationStore.checkRole(ROLES.INITDEPOSIT) &&
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
            authenticationStore.checkRole(ROLES.REVIEWDEPOSIT) &&
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
            authenticationStore.checkRole(ROLES.APPROVEDEPOSIT) &&
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
        orderStore.confirmReviewPaymentExecution(payloadReview)
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
          Signature: extendData,
          SecureCode: e,
          ...currPayload,
        }
        orderStore.confirmPaymentExecution(payload)
          .then(res => {
            switch (res?.responseCode) {
              case RESPONSE_CODE.SUCCESS:
                setVisibleOtp(false)
                setHiddenResendOtp(false)
                setOtpExpiredTime(null)
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
                    <ResultSuccessModal>
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
                            {numberUtils.thousandSeparator(res?.paymentResultDetailModel?.grandAmount)}đ
                          </strong>
                        </Descriptions.Item>
                        <Descriptions.Item label={
                          'Mã giao dịch'
                        }>
                          {res?.paymentResultDetailModel?.transactionId}
                        </Descriptions.Item>
                        <Descriptions.Item label={'Thời gian'}>
                          {res?.paymentResultDetailModel?.createdTime ? dateUtils.convertToStrDate(res?.paymentResultDetailModel?.createdTime, LONG_DATE) : ''}
                        </Descriptions.Item>
                      </Descriptions>
                      {
                        res?.paymentResultDetailModel?.listCard?.length > 0 &&
                        <ColorTitleNoBg
                          color={'#222'}
                          textAlign={'center'}
                          marginTop={'16px'}
                          marginBottom={'16px'}>
                          Danh sách mã thẻ được gửi về email của {currUserName}
                        </ColorTitleNoBg>
                      }
                      {
                        res?.paymentResultDetailModel?.listCard?.length > 0 &&
                        <Collapse>
                          <Panel
                            key='1'
                            header='Danh sách thẻ'
                            extra={
                              <CopyOutlined
                                style={{ fontSize: 16 }}
                                onClick={(event) => {
                                  event.stopPropagation()
                                  let cardString = ''
                                  res?.paymentResultDetailModel?.listCard.map((item, index) => {
                                    cardString += `Mã thẻ: ${item?.cardCode} - Serial: ${item?.cardSerial} - Ngày hết hạn: ${item?.expire}${(index + 1) < res?.paymentResultDetailModel?.listCard?.length ? '\n' : ''}`
                                  })
                                  navigator.clipboard.writeText(cardString)
                                  message.success('Đã copy danh sách mã thẻ')
                                }} />
                            }
                          >
                            <Table
                              bordered={true}
                              dataSource={res?.paymentResultDetailModel?.listCard}
                              columns={columnsCard}
                              rowKey={record => record.cardCode}
                              pagination={false}
                            />
                          </Panel>
                        </Collapse>
                      }
                    </ResultSuccessModal>,
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
                            {numberUtils.thousandSeparator(res?.paymentResultDetailModel?.grandAmount)}đ
                          </strong>
                        </Descriptions.Item>
                        <Descriptions.Item label={
                          'Mã đối soát'
                        }>
                          {res?.paymentResultDetailModel?.paymentOrderID}
                        </Descriptions.Item>
                        <Descriptions.Item label={'Thời gian'}>
                          {res?.paymentResultDetailModel?.createdTime ? dateUtils.convertToStrDate(res?.paymentResultDetailModel?.createdTime, LONG_DATE) : ''}
                        </Descriptions.Item>
                      </Descriptions>
                    </>,
                })
                break
              case RESPONSE_CODE.PAYMENT_TRANSACTION_ERROR:
              case RESPONSE_CODE.SERVICE_OUT_OF_STOCK:
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
                            {numberUtils.thousandSeparator(res?.paymentResultDetailModel?.grandAmount)}đ
                          </strong>
                        </Descriptions.Item>
                        <Descriptions.Item label={
                          (res?.paymentResultDetailModel?.transactionId && res?.paymentResultDetailModel?.transactionId != 0)
                            ? 'Mã giao dịch'
                            : 'Mã đối soát'
                        }>
                          {(res?.paymentResultDetailModel?.transactionId && res?.paymentResultDetailModel?.transactionId != 0)
                            ? res?.paymentResultDetailModel?.transactionId
                            : res?.paymentResultDetailModel?.paymentOrderID}
                        </Descriptions.Item>
                        <Descriptions.Item label={'Thời gian'}>
                          {res?.paymentResultDetailModel?.createdTime ? dateUtils.convertToStrDate(res?.paymentResultDetailModel?.createdTime, LONG_DATE) : ''}
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
        setCurrPayload(payloadReview)
        orderStore.reviewPaymentExecution(payloadReview)
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
              case RESPONSE_CODE.EXECUTION_PAYMENT_INFO_CHANGED:
                Modal.info({
                  className: 'custom-notice',
                  width: 400,
                  title: 'Thông báo',
                  okText: 'Kiểm tra lại',
                  onOk: () => {
                    reLoadData(groupTypeID)
                  },
                  onCancel: () => {
                    reLoadData(groupTypeID)
                  },
                  content: <RowCenterDiv><strong>{res?.description}</strong></RowCenterDiv>,
                })
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
          UrlResult: 'http://localhost:3001/login',
        }
        setCurrPayload(payloadApprove)
        orderStore.approvePaymentExecution(payloadApprove)
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
                setHiddenResendOtp(res?.disableResendOtp)
                setOtpExpiredTime(res?.otpExpiredTime)
                break
              case RESPONSE_CODE.REQUIRE_OTP:
              case RESPONSE_CODE.REQUIRE_WALLET_PASSWORD:
                let newCurrPayload = { ...payloadApprove, TempOrderID: res?.tempOrderID }
                setCurrPayload(newCurrPayload)

                setDescription(res?.description)
                setExtendData(res?.extendData)
                setHiddenResendOtp(res?.disableResendOtp)
                setOtpExpiredTime(res?.otpExpiredTime)
                setVisibleOtp(true)
                break
              case RESPONSE_CODE.PAYMENT_TRANSACTION_ERROR:
                notification.error({
                  message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
                  description: res?.description,
                })
                break
              case RESPONSE_CODE.EXECUTION_PAYMENT_INFO_CHANGED:
                Modal.info({
                  className: 'custom-notice',
                  width: 400,
                  title: 'Thông báo',
                  okText: 'Kiểm tra lại',
                  onOk: () => {
                    reLoadData(groupTypeID)
                  },
                  onCancel: () => {
                    reLoadData(groupTypeID)
                  },
                  content: <RowCenterDiv><strong>{res?.description}</strong></RowCenterDiv>,
                })
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
  const handleClickEditExecution = (execution) => {
    Modal.confirm({
      className: 'custom-notice',
      width: 600,
      title: WARNING_TITLE,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        orderStore.setEditingExecution(execution)
        history.push(JSON.parse(execution?.executionData)?.PaymentInfo?.EditPathUrl)
      },
      onCancel: () => {
      },
      content:
        <>
          <RowCenterDiv margin={'16px 0'}>
            <WarningOutlined style={{ fontSize: 32, color: WARNING_COLOR }} />
            <ColorText fontSize={'1.6rem'} margin={'0 0 0 16px'} color={WARNING_COLOR}>
              Bạn có chắc chắn muốn sửa yêu cầu <br /> (Mã yêu cầu: {execution.executionID}) ?
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
        orderStore.deletePaymentOrder(payload)
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
    let payType = null

    let paymentType = JSON.parse(record?.executionData)?.PaymentInfo?.PaymentType

    switch (paymentType) {
      case PAYMENT_TYPE.WALLET:
        payType = PAYTYPE.PAYMENT_WALLET
        break
      case PAYMENT_TYPE.LINKED_BANK:
        payType = PAYTYPE.PAYMENT_LINKED_BANK
        break
      case PAYMENT_TYPE.NAPAS:
        break
      default:
        break
    }

    // let payload = {
    //   PayType: payType,
    //   Amount: JSON.parse(record?.executionData)?.PaymentInfo?.TotalAmount,
    //   FeeType: FEE_TYPE.PAYMENT,
    // }
    // paymentStore.getFee(payload)
    //   .then(res => {
    //     if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
    //       let feeTransaction = JSON.parse(res?.param)
    //       setStateFee(Number(feeTransaction?.transferFee))
    //     } else {
    //       setStateFee(0)
    //     }
    //   })
    //   .catch(() => {
    //     setStateFee(0)
    //   })
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
  const columnsCard = [
    {
      title: 'Mã thẻ',
      render: record => record?.cardCode,
    },
    {
      title: 'Serial',
      render: record => record?.cardSerial,
    },
    {
      title: 'Hạn sử dụng',
      render: record => record?.expire,
    },
  ]

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
            label={'Nguồn tiền'}
            span={1}>
            {JSON.parse(record?.executionData)?.PaymentInfo?.Fund || ''}
          </Descriptions.Item>
          {
            JSON.parse(record?.executionData)?.PaymentInfo?.Provider && JSON.parse(record?.executionData)?.PaymentInfo?.ProductCode?.includes('BILL') &&
            <Descriptions.Item
              label={'Nhà cung cấp'}
              span={1}>
              {JSON.parse(record?.executionData)?.PaymentInfo?.Provider || ''}
            </Descriptions.Item>
          }
          <Descriptions.Item
            label={'Dịch vụ'}
            span={1}>
            {JSON.parse(record?.executionData)?.PaymentInfo?.ProductTypeName || ''}
          </Descriptions.Item>
          {
            !JSON.parse(record?.executionData)?.PaymentInfo?.ProductCode?.includes('BILL') &&
            <Descriptions.Item
              label={'Sản phẩm'}
              span={1}>
              {JSON.parse(record?.executionData)?.PaymentInfo?.ProductName || ''}
            </Descriptions.Item>
          }
          {
            JSON.parse(record?.executionData)?.PaymentInfo?.ProductAccount &&
            <Descriptions.Item
              label={
                JSON.parse(record?.executionData)?.PaymentInfo?.ProductCode?.includes('BILL')
                  ? 'Mã khách hàng'
                  : 'Số điện thoại'
              }
              span={1}>
              {JSON.parse(record?.executionData)?.PaymentInfo?.ProductAccount}
            </Descriptions.Item>
          }
          {
            JSON.parse(record?.executionData)?.PaymentInfo?.CustomerName &&
            <Descriptions.Item
              label={'Tên khách hàng'}
              span={1}>
              {JSON.parse(record?.executionData)?.PaymentInfo?.CustomerName}
            </Descriptions.Item>
          }
          {
            JSON.parse(record?.executionData)?.PaymentInfo?.PeriodPayment && JSON.parse(record?.executionData)?.PaymentInfo?.ShowPeriod &&
            <Descriptions.Item
              label={'Kỳ thanh toán'}
              span={1}>
              {JSON.parse(record?.executionData)?.PaymentInfo?.PeriodPayment}
            </Descriptions.Item>
          }
          {
            JSON.parse(record?.executionData)?.PaymentInfo?.CustomerAddress &&
            <Descriptions.Item
              label={'Địa chỉ'}
              span={1}>
              {JSON.parse(record?.executionData)?.PaymentInfo?.CustomerAddress}
            </Descriptions.Item>
          }
          {
            JSON.parse(record?.executionData)?.PaymentInfo?.OriginalAmount &&
            <Descriptions.Item
              label={
                JSON.parse(record?.executionData)?.PaymentInfo?.ProductCode?.includes('CARD')
                  ? 'Mệnh giá'
                  : JSON.parse(record?.executionData)?.PaymentInfo?.ProductCode?.includes('BILL')
                    ? 'Số tiền'
                    : 'Cước thanh toán'
              }
              span={1}>
              {numberUtils.thousandSeparator(JSON.parse(record?.executionData)?.PaymentInfo?.OriginalAmount)}đ
            </Descriptions.Item>
          }
          <Descriptions.Item
            label={'Phí bán hàng'}
            span={1}>
            {JSON.parse(record?.executionData)?.PaymentInfo?.ProductFee > 0 ? `${numberUtils.thousandSeparator(JSON.parse(record?.executionData)?.PaymentInfo?.ProductFee)}đ` : 'Miễn phí'}
          </Descriptions.Item>
          {
            JSON.parse(record?.executionData)?.PaymentInfo?.Discount &&
            <Descriptions.Item
              label={'Chiết khấu'}
              span={1}>
              {JSON.parse(record?.executionData)?.PaymentInfo?.Discount}
            </Descriptions.Item>
          }
          {
            JSON.parse(record?.executionData)?.PaymentInfo?.TotalAmount &&
            <Descriptions.Item
              label={'Giá bán'}
              span={1}>
              {numberUtils.thousandSeparator(JSON.parse(record?.executionData)?.PaymentInfo?.TotalAmount)}đ
            </Descriptions.Item>
          }
          {
            JSON.parse(record?.executionData)?.PaymentInfo?.Quantity &&
            <Descriptions.Item
              label={'Số lượng'}
              span={1}>
              {JSON.parse(record?.executionData)?.PaymentInfo?.Quantity || ''}
            </Descriptions.Item>
          }
          {
            JSON.parse(record?.executionData)?.PaymentInfo?.Quantity &&
            <Descriptions.Item
              label={'Tổng tiền'}
              span={1}>
              {numberUtils.thousandSeparator(JSON.parse(record?.executionData)?.PaymentInfo?.TotalAmount * (JSON.parse(record?.executionData)?.PaymentInfo?.Quantity || 1))}đ
            </Descriptions.Item>
          }

          <Descriptions.Item
            label={'Phí giao dịch'}
            span={1}>
            {JSON.parse(record?.executionData)?.PaymentInfo?.TransferFee > 0 ? `${numberUtils.thousandSeparator(JSON.parse(record?.executionData)?.PaymentInfo?.TransferFee)}đ` : 'Miễn phí'}
          </Descriptions.Item>
          <Descriptions.Item
            label={'Thành tiền'}
            span={1}>
            {`${numberUtils.thousandSeparator(JSON.parse(record?.executionData)?.PaymentInfo?.TotalAmountToPaid)}đ` || ''}
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
  useEffect(() => {
    console.log(toJS(currUserName))
  }, [currUserName])
  // endregion

  return (
    <CollapsePanelPaymentWrapper>
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
            ? `Bạn có đồng ý xác nhận yêu cầu thanh toán ${'\n'} (Mã yêu cầu ${selectedExecution?.executionID})`
            : jwtDecode?.RoleType === ROLE_TYPE.APPROVE ?
              `Bạn có đồng ý phê duyệt yêu cầu thanh toán ${'\n'} (Mã yêu cầu ${selectedExecution?.executionID})`
              : ''
        }
        visible={visibleConfirm}
        onCancel={handleCancelConfirm}
        callbackConfirm={handleSubmitConfirm} />

      <OtpModal
        expiredCountTime={otpExpiredTime}
        hiddenResend={hiddenResendOtp}
        description={description}
        callbackOtp={handleSubmitOtp}
        visible={visibleOtp}
        onCancel={handleCancelOTP} />

    </CollapsePanelPaymentWrapper>
  )
}

CollapsePanelPayment.propTypes = {
  data: PropTypes.any,
  reLoadData: PropTypes.func,
  groupTypeID: PropTypes.number,
  filterOrderStatus: PropTypes.number,
}

export default inject('orderStore', 'authenticationStore', 'propertyStore', 'paymentStore', 'profileStore')(observer(CollapsePanelPayment))