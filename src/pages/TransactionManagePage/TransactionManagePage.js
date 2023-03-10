import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import {
  GroupBoxCountWrapper,
  GroupCount,
  TransactionManagePageWrapper,
  TransactionManagerBody,
} from './TransactionManagePageStyled'
import { Helmet } from 'react-helmet/es/Helmet'
import {
  BREADCRUMB_DATA,
  CLOSE_TEXT,
  ERROR_COLOR,
  EXECUTION_ORDER_STATUS,
  GROUP_EXECUTION_TYPE_ID,
  PAGES,
  RESULT_TRANSACTION_TITLE,
  SHORT_DATE,
  SUCCESS_COLOR,
  WARNING_COLOR,
} from '../../utils/constant'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import { Button, Col, Collapse, DatePicker, Form, Input, Modal, Row, Select, Space } from 'antd'
import { CaretRightOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons'
import CollapsePanelLinkBank from '../../components/CollapsePanelLinkBank'
import dateUtils from '../../utils/dateUtils'
import executionUtils from '../../utils/executionUtils'
import CollapsePanelDeposit from '../../components/CollapsePanelDeposit'
import CollapsePanelDefault from '../../components/CollapsePanelDefault'
import CollapsePanelWithdraw from '../../components/CollapsePanelWithdraw'
import CollapsePanelTransferSingle from '../../components/CollapsePanelTransferSingle'
import CollapsePanelDepositMm from '../../components/CollapsePanelDepositMm'
import CollapsePanelWithdrawMm from '../../components/CollapsePanelWithdrawMm'
import { ColorText, RowCenterDiv } from '../../components/CommonStyled/CommonStyled'
import IMAGES from '../../images'
import { useHistory, useLocation } from 'react-router-dom'
import CollapsePanelTransferMultiple from '../../components/CollapsePanelTransferMultiple'
import moment from 'moment'
import validator from '../../validator'
import CollapsePanelPayment from '../../components/CollapsePanelPayment'

const { RangePicker } = DatePicker
const { Panel } = Collapse


const TransactionManagePage = props => {
  // region props, hook, state =================
  const {
    orderStore,
    authenticationStore,
    propertyStore,
    commonStore,
    bankStore,
  } = props
  const history = useHistory()
  const location = useLocation()
  const [formFilter] = Form.useForm()
  const [listGroupTypeID, setListGroupTypeID] = useState([])
  const [filterOrderStatus, setFilterOrderStatus] = useState(null)

  // endregion
  // region destructuring ======================

  useEffect(() => {
    console.log('groupTypeID', location?.state?.groupTypeID)
  }, [location])

  const { appTheme } = commonStore
  const { dataCallback } = bankStore
  const { userProfile } = authenticationStore
  const { listExecutionTypeGrouped, objListData, objFilterOrder, objPagination } = orderStore
  const { dropdownExecutionStatus } = propertyStore
  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  // X??? l?? m??? collapse
  const disabledDateFuture = (current) => {
    return current && current > moment()
  }
  const handleChangeCollapse = (e) => {

    let lastGroupTypeID = e[e.length - 1]
    if (listGroupTypeID.includes(lastGroupTypeID)) {
      // N???u collapse panel ??ang m??? th?? ch??? ????ng l???i kh??ng load data
      setListGroupTypeID(e)
      return
    }
    // N???u click v??o collapse nh??m c?? NumberOfExecution === 0 th?? kh??ng load data v?? kh??ng m??? collapse
    let groupPanel = listExecutionTypeGrouped.find(e => e?.GroupTypeID === Number(lastGroupTypeID))
    if (groupPanel?.NumberOfExecution === 0) {
      return
    }
    if (lastGroupTypeID) {
      orderStore.getListExecutionTypeGrouped(userProfile)
        .then(() => {
          orderStore.getOrders(Number(lastGroupTypeID), userProfile)
            .then(res => {
              setListGroupTypeID(e)
            })
        })
    } else {
      setListGroupTypeID(e)
    }

  }
  const renderCollapsePanel = (groupTypeID) => {
    switch (Number(groupTypeID)) {
      case GROUP_EXECUTION_TYPE_ID.LINK_UNLINK:
        return <CollapsePanelLinkBank
          filterOrderStatus={filterOrderStatus}
          reLoadData={() => handleReloadData(groupTypeID)}
          groupTypeID={Number(groupTypeID)}
          data={objListData[groupTypeID]} />
      case GROUP_EXECUTION_TYPE_ID.DEPOSIT:
        return <CollapsePanelDeposit
          filterOrderStatus={filterOrderStatus}
          reLoadData={() => handleReloadData(groupTypeID)}
          groupTypeID={Number(groupTypeID)}
          data={objListData[groupTypeID]} />
      case GROUP_EXECUTION_TYPE_ID.WITHDRAW:
        return <CollapsePanelWithdraw
          filterOrderStatus={filterOrderStatus}
          reLoadData={() => handleReloadData(groupTypeID)}
          groupTypeID={Number(groupTypeID)}
          data={objListData[groupTypeID]} />
      case GROUP_EXECUTION_TYPE_ID.TRANSFER_WALLET:
        return <CollapsePanelTransferSingle
          filterOrderStatus={filterOrderStatus}
          reLoadData={() => handleReloadData(groupTypeID)}
          groupTypeID={Number(groupTypeID)}
          data={objListData[groupTypeID]} />
      case GROUP_EXECUTION_TYPE_ID.DEPOSIT_MM:
        return <CollapsePanelDepositMm
          filterOrderStatus={filterOrderStatus}
          reLoadData={() => handleReloadData(groupTypeID)}
          groupTypeID={Number(groupTypeID)}
          data={objListData[groupTypeID]} />
      case GROUP_EXECUTION_TYPE_ID.WITHDRAW_MM:
        return <CollapsePanelWithdrawMm
          filterOrderStatus={filterOrderStatus}
          reLoadData={() => handleReloadData(groupTypeID)}
          groupTypeID={Number(groupTypeID)}
          data={objListData[groupTypeID]} />
      case GROUP_EXECUTION_TYPE_ID.TRANSFER_MULTIPLE:
        return <CollapsePanelTransferMultiple
          filterOrderStatus={filterOrderStatus}
          reLoadData={() => handleReloadData(groupTypeID)}
          groupTypeID={Number(groupTypeID)}
          data={objListData[groupTypeID]} />
      case GROUP_EXECUTION_TYPE_ID.PAYMENT:
        return <CollapsePanelPayment
          filterOrderStatus={filterOrderStatus}
          reLoadData={() => handleReloadData(groupTypeID)}
          groupTypeID={Number(groupTypeID)}
          data={objListData[groupTypeID]} />
      default:
        return <CollapsePanelDefault
          filterOrderStatus={filterOrderStatus}
          reLoadData={() => handleReloadData(groupTypeID)}
          groupTypeID={Number(groupTypeID)}
          data={objListData[groupTypeID]} />
    }
  }
  const handleReloadData = (groupTypeID) => {
    objPagination[groupTypeID].PageIndex = 1
    orderStore.getListExecutionTypeGrouped(userProfile)
      .then(res => {
        if (res?.param?.length > 0) {
          // L???y danh s??ch y??u c???u ??ang thao t??c
          orderStore.getOrders(groupTypeID, userProfile)
            .then(res => {
              if (res?.param?.length > 0) {
                // M??? collapse ??ang thao t??c
                setListGroupTypeID([groupTypeID])
              } else {
                setListGroupTypeID([])
              }
            })
        }
      })
  }
  const loadExecutionTypeGrouped = () => {
    orderStore.getListExecutionTypeGrouped(userProfile)
      .then(res => {
        if (res?.param?.length > 0) {
          // N???u c?? groupTypeID l?? thanh to??n truy???n t??? home, ki???m tra xem c?? nh??m thanh to??n kh??ng
          let groupPayment = res?.param?.find(e => e.GroupTypeID === location?.state?.groupTypeID)
          if (groupPayment) {
            // Ki???m tra xem nh??m thanh to??n c?? y??u c???u n??o kh??ng, n???u c?? th?? l???y danh s??ch y??u c???u v?? m??? collapse
            if (groupPayment?.NumberOfExecution > 0) {
              // L???y danh s??ch y??u c???u
              orderStore.getOrders(location?.state?.groupTypeID, userProfile)
                .then(res => {
                  // M??? collapse
                  setListGroupTypeID([location?.state?.groupTypeID])
                  // X??a location?.state?.groupTypeID ????? F5 l???i m??? nh??m ?????u ti??n c?? data
                  history.replace({ pathname: PAGES.TRANSACTION_MANAGE.PATH, state: null })
                })
            } else {
              // N???u nh??m thanh to??n kh??ng c?? y??u c???u n??o th?? m??? nh??m ?????u ti??n c?? data
              // T??m nh??m ?????u ti??n c?? data
              let firstGroupHasData = res?.param?.find(e => e.NumberOfExecution > 0)
              if (firstGroupHasData) {
                // L???y danh s??ch y??u c???u theo nh??m ?????u ti??n c?? data
                orderStore.getOrders(firstGroupHasData?.GroupTypeID, userProfile)
                  .then(res => {
                    // M??? collapse nh??m ?????u ti??n c?? data
                    setListGroupTypeID([firstGroupHasData?.GroupTypeID])
                  })
              } else {
                setListGroupTypeID([])
              }
            }
          } else {
            // Kh??ng c?? groupTypeID thanh to??n th?? t??m nh??m ?????u ti??n c?? data, l???y danh s??ch y??u c???u v?? m??? collapse
            // T??m nh??m ?????u ti??n c?? data
            let firstGroupHasData = res?.param?.find(e => e.NumberOfExecution > 0)
            if (firstGroupHasData) {
              // L???y danh s??ch y??u c???u theo nh??m ?????u ti??n c?? data
              orderStore.getOrders(firstGroupHasData?.GroupTypeID, userProfile)
                .then(res => {
                  // M??? collapse nh??m ?????u ti??n c?? data
                  setListGroupTypeID([firstGroupHasData?.GroupTypeID])
                })
            } else {
              setListGroupTypeID([])
            }
          }
        }
      })
  }
  const handleFilterOrders = (e) => {
    console.log(e)
    setFilterOrderStatus(e.orderStatus)
    objFilterOrder.Status = e.orderStatus
    objFilterOrder.CreatedFrom = e.dateRange ? dateUtils.convertToMillisecondsStartOfDay(e.dateRange[0]) : 0
    objFilterOrder.CreatedTo = e.dateRange ? dateUtils.convertToMillisecondsEndOfDay(e.dateRange[1]) : 0
    objFilterOrder.Keyword = e.keyword || ''
    orderStore.resetObjPagination()
    loadExecutionTypeGrouped()
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    formFilter.setFieldsValue({
      orderStatus: null,
      dateRange: [moment().add(-30, 'days'), moment()],
    })
  }, [])
  useEffect(() => {
    if (!userProfile) return
    // L???y danh s??ch nh??m collapse
    loadExecutionTypeGrouped()
  }, [userProfile])

  useEffect(() => {
    return () => {
      orderStore.resetObjFilterOrder()
    }
  }, [])

  useEffect(() => {
    if (!dataCallback) return
    Modal.info({
      className: 'custom-notice',
      width: 600,
      title: RESULT_TRANSACTION_TITLE,
      okText: CLOSE_TEXT,
      onOk: () => {
        bankStore.setDataCallback(null)
      },
      onCancel: () => {
        history.push(PAGES.HOME.PATH)
      },
      content:
        <>
          <RowCenterDiv margin={'16px 0'}>
            {
              dataCallback?.Result === 'SUCCESS'
                ? <CheckCircleOutlined style={{ fontSize: 32, color: SUCCESS_COLOR }} />
                : dataCallback?.Result === 'IN_PROGRESS'
                  ? <WarningOutlined style={{ fontSize: 32, color: WARNING_COLOR }} />
                  : dataCallback?.Result === 'FAILURE'
                    ? <CloseCircleOutlined style={{ fontSize: 32, color: ERROR_COLOR }} />
                    : <div />
            }

            <ColorText fontSize={'1.6rem'} margin={'0 0 0 16px'} color={
              dataCallback?.Result === 'SUCCESS'
                ? SUCCESS_COLOR
                : dataCallback?.Result === 'IN_PROGRESS'
                  ? WARNING_COLOR
                  : dataCallback?.Result === 'FAILURE'
                    ? ERROR_COLOR
                    : ''
            }>
              {
                dataCallback?.Description && dataCallback?.Description
              }
            </ColorText>
          </RowCenterDiv>
          <RowCenterDiv margin={'40px 0 0 0'}>
            {
              <img src={
                dataCallback?.Result === 'SUCCESS'
                  ? IMAGES.LINK_SUCCESS
                  : dataCallback?.Result === 'IN_PROGRESS'
                    ? IMAGES.LINK_ERROR
                    : dataCallback?.Result === 'FAILURE'
                      ? IMAGES.LINK_ERROR
                      : IMAGES.LINK_ERROR
              } alt={dataCallback?.Result} />
            }
          </RowCenterDiv>
        </>,
    })
  }, [dataCallback])
  // endregion

  return (
    <>
      <Helmet>
        <title>Qu???n l?? y??u c???u</title>
      </Helmet>
      <TransactionManagePageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.TRANSACTION_MANAGE} />
        <TransactionManagerBody>
          <Form
            onFinish={handleFilterOrders}
            layout='inline'
            form={formFilter}
            colon={false}>
            <Row justify={'center'} style={{ width: '100%' }}>
              <Col xxl={8} xl={8} lg={8} md={12} sm={12} xs={24}>
                <Form.Item name={'orderStatus'} label={'Tr???ng th??i'}>
                  <Select allowClear placeholder={'Ch??a duy???t'}>
                    {
                      dropdownExecutionStatus && dropdownExecutionStatus.map(item =>
                        <Select.Option key={item.value} value={item.value}>{item.title}</Select.Option>,
                      )
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col xxl={10} xl={10} lg={8} md={12} sm={12} xs={24}>
                <Form.Item
                  rules={[
                    { validator: validator.validateRangePickerTransaction },
                  ]}
                  name={'dateRange'}
                  label={'Th???i gian'}>
                  <RangePicker
                    allowClear={false}
                    placeholder={['T??? ng??y', '?????n ng??y']}
                    disabledDate={disabledDateFuture}
                    format={SHORT_DATE} inputReadOnly
                    style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              {/*<Col xxl={8} xl={6} lg={6} md={12} sm={12} xs={24}>*/}
              {/*  <Form.Item name={'keyword'} label={'T??? kh??a'}>*/}
              {/*    <Input placeholder={'T??? kh??a t??m ki???m'} />*/}
              {/*  </Form.Item>*/}
              {/*</Col>*/}
              <Col xxl={2} xl={3} lg={4} md={24} sm={24} xs={24}>
                <Button block type={'primary'} htmlType={'submit'}>T??m ki???m</Button>
              </Col>
            </Row>
          </Form>
          <Collapse
            onChange={handleChangeCollapse}
            bordered={false}
            activeKey={listGroupTypeID}
            expandIcon={
              ({ isActive }) => <CaretRightOutlined style={{ marginTop: 8 }} rotate={isActive ? 90 : 0} />
            }
            className='site-collapse-custom-collapse'
          >
            {
              listExecutionTypeGrouped && listExecutionTypeGrouped?.length > 0 && listExecutionTypeGrouped.map(item =>
                <Panel
                  header={
                    <Space align={'center'}>
                      <span>{item.GroupTypeName}</span>
                      <GroupBoxCountWrapper>
                        <img src={executionUtils.renderExecutionStatusIcon(objFilterOrder.Status)} alt={''} width={24}
                             height={24} />
                        <GroupCount
                          // color={appTheme.solidColor}
                        >
                          {item.NumberOfExecution}
                        </GroupCount>
                      </GroupBoxCountWrapper>

                    </Space>
                  }
                  key={item.GroupTypeID}
                  className='site-collapse-custom-panel'>
                  {
                    renderCollapsePanel(item.GroupTypeID)
                  }
                </Panel>,
              )
            }
          </Collapse>
        </TransactionManagerBody>
      </TransactionManagePageWrapper>
    </>
  )
}

TransactionManagePage.propTypes = {}

export default inject(
  'commonStore',
  'bankStore',
  'orderStore',
  'authenticationStore',
  'propertyStore')(observer(TransactionManagePage))