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
      title: 'M?? y??u c???u',
      render: record => record.executionID,
    },
    {
      title: 'Y??u c???u',
      responsive: ['xxl', 'xl'],
      render: record => record.executionTypeName,
    },
    {
      title: 'Tr???ng th??i y??u c???u',
      responsive: ['xxl', 'xl'],
      render: record => (
        <IconStatusLabel
          icon={executionUtils.renderCollapseExecutionStatusIcon(record.orderStatus)}
          label={propertyStore.renderTransactionStatusLabel(record.orderStatus)} />
      ),
    },
    {
      title: 'Ng?????i t???o',
      responsive: ['xxl', 'xl', 'md'],
      render: record => JSON.parse(record.executionData)?.FullNameInitUser,
    },
    {
      title: 'Ng?????i duy???t',
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
      title: 'Ng??y t???o',
      responsive: ['xxl', 'xl'],
      render: record => dateUtils.convertToStrDate(record.createdTime, LONG_DATE),
    },
    {
      title: 'H??nh ?????ng',
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
  // x??? l?? khi click h???y form require do BE tr??? v??? (link bank)
  const handleCancelRequire = () => {
    setVisibleRequireModal(false)
    setBankLinkType(null)
    setRequireFieldArr(null)
    setRequireFieldBankAccountArr(null)
  }
  // x??? l?? khi submit form require do BE tr??? v??? (link bank)
  const handleSubmitRequire = (e) => {
    console.log(e)
    let payload = {
      ApproveStatus: approveStatus, // true: duy???t - false: t??? ch???i
      Reason: '', // L?? do duy???t - t??? ch???i
      ExecutionID: Number(selectedExecution?.executionID), // M?? y??u c???u,
      BankAccountName: e?.BankAccountName || '', // T??n t??i kho???n ng?????i ?????i di???n bank
      BankAccount: e?.BankAccount || '', // S??? t??i kho???n bank
      BankCode: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.BankCode || '',
      BankID: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.BankID || '',
      IssueDate: e?.IssueDate || '', // Ng??y t???o ho???c h???t h???n th??? ?????nh d???ng MMYY
      CustLegalID: e?.CustLegalID || '', // S??? cmt/cccd
      AccountName: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.AccountName || '', // S??? t??i kho???n v?? (s??t)
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
  // x??? l?? khi click n??t approve
  const handleClickConfirmApprove = (execution, status) => {
    setApproveStatus(status)
    setSelectedExecution(execution)
    setVisibleConfirm(true)
  }
  // x??? l?? khi click n??t review
  const handleClickConfirmReview = (execution, status) => {
    setApproveStatus(status)
    setSelectedExecution(execution)
    setVisibleConfirm(true)
  }
  // X??? l?? khi ???n x??c nh???n
  const handleSubmitConfirm = (e) => {
    setVisibleConfirm(false)
    switch (jwtDecode?.RoleType) {
      case ROLE_TYPE.INIT:
        // TODO
        break
      case ROLE_TYPE.REVIEW:
        let payload = {
          ReviewStatus: approveStatus, // true: duy???t - false: t??? ch???i
          Reason: e?.reason || '', // L?? do duy???t - t??? ch???i
          ExecutionID: Number(selectedExecution?.executionID), // M?? y??u c???u
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
          ApproveStatus: approveStatus, // true: duy???t - false: t??? ch???i
          Reason: e?.reason || '', // L?? do duy???t - t??? ch???i
          ExecutionID: Number(selectedExecution?.executionID), // M?? y??u c???u,
          BankAccountName: '', // T??n t??i kho???n ng?????i ?????i di???n bank
          BankAccount: '', // S??? t??i kho???n bank
          BankCode: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.BankCode || '',
          BankID: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.BankID || '',
          IssueDate: '', // Ng??y t???o ho???c h???t h???n th??? ?????nh d???ng MMYY
          CustLegalID: '', // S??? cmt/cccd
          AccountName: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.AccountName || '', // S??? t??i kho???n v?? (s??t)
        }
        if (approveStatus) {
          // X??? l?? khi ph?? duy???t
          let params = {
            bankCode: JSON.parse(selectedExecution?.executionData)?.LinkBankInfo?.BankCode,
          }
          orderStore.checkLinkBank(params)
            .then(res => {
              if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
                // N???u bankLinkType === 1 || bankLinkType === 3: M??? form ??i???n th??ng tin tr??? v??? t??? server
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
          // X??? l?? khi t??? ch???i
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
  // X??? l?? khi ???n h???y x??c nh???n
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
        {/*    label={'Ng??n h??ng'}*/}
        {/*    span={2}>*/}
        {/*    {JSON.parse(record?.executionData)?.LinkBankInfo?.BankCode || ''}*/}
        {/*  </Descriptions.Item>*/}
        {/*  <Descriptions.Item*/}
        {/*    label={'S??? t??i kho???n'}*/}
        {/*    span={1}>*/}
        {/*    {JSON.parse(record?.executionData)?.LinkBankInfo?.AccountName || ''}*/}
        {/*  </Descriptions.Item>*/}
        {/*  <Descriptions.Item*/}
        {/*    label={'Lo???i li??n k???t'}*/}
        {/*    span={1}>*/}
        {/*    {'Th??? '}TODO*/}
        {/*  </Descriptions.Item>*/}
        {/*  <Descriptions.Item*/}
        {/*    label={'Ng?????i ki???m tra'}*/}
        {/*    span={1}>*/}
        {/*    {JSON.parse(record?.executionData)?.FullNameReviewUser || ''}*/}
        {/*  </Descriptions.Item>*/}
        {/*  <Descriptions.Item*/}
        {/*    label={'Ng??y duy???t ki???m tra'}*/}
        {/*    span={1}>*/}
        {/*    {dateUtils.convertToStrDate(JSON.parse(record?.executionData)?.ReviewedTime, 'DD/MM/YYYY HH:mm')}*/}
        {/*  </Descriptions.Item>*/}
        {/*  <Descriptions.Item*/}
        {/*    label={'Ng?????i duy???t'}*/}
        {/*    span={1}>*/}
        {/*    {JSON.parse(record?.executionData)?.FullNameApproveUser || ''}*/}
        {/*  </Descriptions.Item>*/}
        {/*  <Descriptions.Item*/}
        {/*    label={'Ng??y duy???t'}*/}
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
            ? 'B???n c?? ?????ng ?? x??c nh???n y??u c???u li??n k???t'
            : jwtDecode?.RoleType === ROLE_TYPE.APPROVE ?
              'B???n c?? ?????ng ?? ph?? duy???t y??u c???u li??n k???t'
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