import React, { useState } from 'react'
import postscribe from 'postscribe'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { CollapsePanelLinkBankWrapper, SpaceIcon } from './CollapsePanelDefaultStyled'
import { notification, Table } from 'antd'
import IconStatusLabel from '../IconStatusLabel'
import { ExpandContent } from '../../pages/TransactionManagePage/TransactionManagePageStyled'
import { LONG_DATE, RESPONSE_CODE, ROLE_TYPE, SUCCESS_COLOR, SUCCESS_TITLE } from '../../utils/constant'
import PaginationRow from '../PaginationRow'
import numberUtils from '../../utils/numberUtils'
import dateUtils from '../../utils/dateUtils'
import executionUtils from '../../utils/executionUtils'
import ConfirmExecutionModal from '../ConfirmExecutionModal'
import LinkBankRequireFieldsModal from './LinkBankRequireFieldsModal'
import { ColorText } from '../CommonStyled/CommonStyled'
import { useHistory } from 'react-router-dom'

const CollapsePanelDefault = props => {
  // region props, hook, state =================
  const {
    data,
    reLoadData,
    groupTypeID,
    orderStore,
    authenticationStore,
    propertyStore,
  } = props
  const history = useHistory()
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [approveStatus, setApproveStatus] = useState(false)
  const [selectedExecution, setSelectedExecution] = useState(null)
  const [visibleRequireModal, setVisibleRequireModal] = useState(false)
  const [bankLinkType, setBankLinkType] = useState(null)
  const [requireFieldArr, setRequireFieldArr] = useState(null)
  const [requireFieldBankAccountArr, setRequireFieldBankAccountArr] = useState(null)
  // endregion
  // region destructuring ======================
  const { userProfile, jwtDecode } = authenticationStore
  const { objPagination } = orderStore
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
      render: record => JSON.parse(record.executionData)?.FullNameInitUser,
    },
    {
      title: 'Người duyệt',
      responsive: ['xxl', 'xl', 'md'],
      render: record => (
        <>
          {
            JSON.parse(record.executionData)?.FullNameReviewUser &&
            <>
              <IconStatusLabel
                iconHeight={16}
                iconWidth={16}
                icon={executionUtils.renderUserApprovedIcon(record.orderStatus)}
                label={JSON.parse(record.executionData)?.FullNameReviewUser} />
              <br />
            </>
          }
          {
            JSON.parse(record.executionData)?.FullNameApproveUser &&
            <IconStatusLabel
              iconHeight={16}
              iconWidth={16}
              icon={executionUtils.renderUserApprovedIcon(record.orderStatus)}
              label={JSON.parse(record.executionData)?.FullNameApproveUser} />
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
      align: 'center',
      render: record => (
        <SpaceIcon>
          {/*{*/}
          {/*  jwtDecode?.RoleType === ROLE_TYPE.INIT &&*/}
          {/*  <>*/}
          {/*    <img className={'action-icon'} src={ICONS.EDIT_BLUE} alt={''} />*/}
          {/*    <img className={'action-icon'} src={ICONS.TRASH_RED} alt={''} />*/}
          {/*  </>*/}
          {/*}*/}
          {/*{*/}
          {/*  jwtDecode?.RoleType === ROLE_TYPE.REVIEW &&*/}
          {/*  <>*/}
          {/*    <img*/}
          {/*      onClick={() => handleClickConfirmReview(record, true)}*/}
          {/*      className={'action-icon'}*/}
          {/*      src={ICONS.APPROVING_ICON} alt={''} />*/}
          {/*    <img*/}
          {/*      onClick={() => handleClickConfirmReview(record, false)}*/}
          {/*      className={'action-icon'}*/}
          {/*      src={ICONS.REJECTING_ICON} alt={''} />*/}
          {/*  </>*/}
          {/*}*/}
          {/*{*/}
          {/*  jwtDecode?.RoleType === ROLE_TYPE.APPROVE &&*/}
          {/*  <>*/}
          {/*    <img*/}
          {/*      onClick={() => handleClickConfirmApprove(record, true)}*/}
          {/*      className={'action-icon'}*/}
          {/*      src={ICONS.APPROVING_ICON} alt={''} />*/}
          {/*    <img*/}
          {/*      onClick={() => handleClickConfirmApprove(record, false)}*/}
          {/*      className={'action-icon'}*/}
          {/*      src={ICONS.REJECTING_ICON} alt={''} />*/}
          {/*  </>*/}
          {/*}*/}
        </SpaceIcon>
      ),
    },
  ]

  // endregion
  // region function handle logic ==============
  // xử lý khi click hủy form require do BE trả về (link bank)
  const handleCancelRequire = () => {
    setVisibleRequireModal(false)
    setBankLinkType(null)
    setRequireFieldArr(null)
    setRequireFieldBankAccountArr(null)
  }
  // xử lý khi submit form require do BE trả về (link bank)
  const handleSubmitRequire = (e) => {
    console.log(e)
    let payload = {
      ApproveStatus: approveStatus, // true: duyệt - false: từ chối
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
          postscribe('#napasRoot', `${res.param}`)
          const el = document.getElementById('napasRoot').getElementsByTagName('form')
          if (el?.length > 0) {
            el[0].submit()
          }
        }
      })
  }
  // xử lý khi click nút approve
  const handleClickConfirmApprove = (execution, status) => {
    setApproveStatus(status)
    setSelectedExecution(execution)
    setVisibleConfirm(true)
  }
  // xử lý khi click nút review
  const handleClickConfirmReview = (execution, status) => {
    setApproveStatus(status)
    setSelectedExecution(execution)
    setVisibleConfirm(true)
  }
  // Xử lý khi ấn xác nhận
  const handleSubmitConfirm = (e) => {
    setVisibleConfirm(false)
    switch (jwtDecode?.RoleType) {
      case ROLE_TYPE.INIT:
        // TODO
        break
      case ROLE_TYPE.REVIEW:
        let payload = {
          ReviewStatus: approveStatus, // true: duyệt - false: từ chối
          Reason: e?.reason || '', // Lý do duyệt - từ chối
          ExecutionID: Number(selectedExecution?.executionID), // Mã yêu cầu
        }
        orderStore.reviewLinkBankExecution(payload)
          .then(res => {
            if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
              notification.success({
                message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
                description: res?.description,
              })
              reLoadData()
            }
          })
        break
      case  ROLE_TYPE.APPROVE:
        let payloadApprove = {
          ApproveStatus: approveStatus, // true: duyệt - false: từ chối
          Reason: e?.reason || '', // Lý do duyệt - từ chối
          ExecutionID: Number(selectedExecution?.executionID), // Mã yêu cầu,
          BankAccountName: '', // Tên tài khoản người đại diện bank
          BankAccount: '', // Số tài khoản bank
          BankCode: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.BankCode || '',
          BankID: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.BankID || '',
          IssueDate: '', // Ngày tạo hoặc hết hạn thẻ định dạng MMYY
          CustLegalID: '', // Số cmt/cccd
          AccountName: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.AccountName || '', // Số tài khoản ví (sđt)
        }
        if (approveStatus) {
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
                reLoadData()
              }
            })
        }
        break
      default:
        break
    }
  }
  // Xử lý khi ấn hủy xác nhận
  const handleCancelConfirm = (e) => {
    setApproveStatus(false)
    setSelectedExecution(null)
    setVisibleConfirm(false)
  }
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
    return (
      <ExpandContent>
        {/*<Descriptions*/}
        {/*  labelStyle={{ width: '25%' }}*/}
        {/*  contentStyle={{ width: '25%' }}*/}
        {/*  bordered*/}
        {/*  column={2}*/}
        {/*  size={'small'}>*/}
        {/*  <Descriptions.Item*/}
        {/*    label={'Ngân hàng'}*/}
        {/*    span={2}>*/}
        {/*    {JSON.parse(record?.executionData)?.LinkBankInfo?.BankCode || ''}*/}
        {/*  </Descriptions.Item>*/}
        {/*  <Descriptions.Item*/}
        {/*    label={'Số tài khoản'}*/}
        {/*    span={1}>*/}
        {/*    {JSON.parse(record?.executionData)?.LinkBankInfo?.AccountName || ''}*/}
        {/*  </Descriptions.Item>*/}
        {/*  <Descriptions.Item*/}
        {/*    label={'Loại liên kết'}*/}
        {/*    span={1}>*/}
        {/*    {'Thẻ '}TODO*/}
        {/*  </Descriptions.Item>*/}
        {/*  <Descriptions.Item*/}
        {/*    label={'Người kiểm tra'}*/}
        {/*    span={1}>*/}
        {/*    {JSON.parse(record?.executionData)?.FullNameReviewUser || ''}*/}
        {/*  </Descriptions.Item>*/}
        {/*  <Descriptions.Item*/}
        {/*    label={'Ngày duyệt kiểm tra'}*/}
        {/*    span={1}>*/}
        {/*    {dateUtils.convertToStrDate(JSON.parse(record?.executionData)?.ReviewedTime, 'DD/MM/YYYY HH:mm')}*/}
        {/*  </Descriptions.Item>*/}
        {/*  <Descriptions.Item*/}
        {/*    label={'Người duyệt'}*/}
        {/*    span={1}>*/}
        {/*    {JSON.parse(record?.executionData)?.FullNameApproveUser || ''}*/}
        {/*  </Descriptions.Item>*/}
        {/*  <Descriptions.Item*/}
        {/*    label={'Ngày duyệt'}*/}
        {/*    span={1}>*/}
        {/*    {dateUtils.convertToStrDate(JSON.parse(record?.executionData)?.ApprovedTime, 'DD/MM/YYYY HH:mm')}*/}
        {/*  </Descriptions.Item>*/}
        {/*</Descriptions>*/}
      </ExpandContent>

    )
  }

  // endregion
  // region side effect ========================

  // endregion

  return (
    <CollapsePanelLinkBankWrapper>
      <div id='napasRoot' />
      <Table
        bordered={false}
        expandable={{
          expandedRowRender: record => renderExpandRow(record),
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
        approveStatus={approveStatus}
        description={
          jwtDecode?.RoleType === ROLE_TYPE.REVIEW
            ? 'Bạn có đồng ý xác nhận yêu cầu liên kết'
            : jwtDecode?.RoleType === ROLE_TYPE.APPROVE ?
              'Bạn có đồng ý phê duyệt yêu cầu liên kết'
              : ''
        }
        visible={visibleConfirm}
        onCancel={handleCancelConfirm}
        callbackConfirm={handleSubmitConfirm} />
      <LinkBankRequireFieldsModal
        visible={visibleRequireModal}
        bankLinkType={bankLinkType}
        requireField={requireFieldArr}
        requireFieldBankAccount={requireFieldBankAccountArr}
        onClose={handleCancelRequire}
        onSuccess={handleSubmitRequire} />
    </CollapsePanelLinkBankWrapper>
  )
}

CollapsePanelDefault.propTypes = {
  data: PropTypes.any,
  reLoadData: PropTypes.func,
  groupTypeID: PropTypes.number,
}

export default inject('orderStore', 'authenticationStore', 'propertyStore')(observer(CollapsePanelDefault))