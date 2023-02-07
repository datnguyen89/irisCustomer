import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { ReportDetailPageWrapper } from './ReportDetailPageStyled'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  BREADCRUMB_DATA, ORDER_STATUS_CODE, PAGES,
  RESPONSE_CODE, ROLE_TYPE, ROLES,
  SHORT_DATE,
  STRING_DATE,
  SUCCESS_COLOR,
  SUCCESS_TITLE, TEXT_403, WARNING_COLOR, WARNING_TITLE, TABLE_NAME, COLUMN_NAME,
} from '../../utils/constant'
import {
  ColorText,
  DropdownShowColumnWrapper,
  RowFlexEndDiv,
  RowSpaceBetweenDiv,
  WhiteRoundedBox,
} from '../../components/CommonStyled/CommonStyled'
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Dropdown,
  Form,
  Modal, notification,
  Row,
  Select,
  Table, Tag,
} from 'antd'
import PaginationRow from '../../components/PaginationRow'
import numberUtils from '../../utils/numberUtils'
import dateUtils from '../../utils/dateUtils'
import { ExpandContent } from '../TransactionManagePage/TransactionManagePageStyled'
import { DownloadOutlined, EyeOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons'
import moment from 'moment'
import DebounceSelect from '../../components/DebounceSelect/DebounceSelect'
import fileUtils from '../../utils/fileUtils'
import axios from 'axios'
import validator from '../../validator'
import { useHistory } from 'react-router-dom'

const { RangePicker } = DatePicker

const ReportDetailPage = props => {
  // region props, hook, state =================
  const {
    commonStore,
    reportStore,
    profileStore,
    paymentStore,
    authenticationStore,
  } = props
  const [formReportFilter] = Form.useForm()
  const [showColumn, setShowColumn] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  const dropdownShowColumn = [
    {
      id: 1,
      title: 'STT',
    },
    {
      id: 2,
      title: 'Hình thức',
    },
    {
      id: 3,
      title: 'Mã yêu cầu',
    },
    {
      id: 4,
      title: 'Mã giao dịch',
    },
    {
      id: 5,
      title: 'Số ví',
    },
    {
      id: 6,
      title: 'Điểm kinh doanh',
    },
    {
      id: 7,
      title: 'Loại giao dịch',
    },
    {
      id: 8,
      title: 'Số lượng',
    },
    {
      id: 9,
      title: 'Số tiền',
    },
    {
      id: 10,
      title: 'Đối tượng',
    },
    {
      id: 11,
      title: 'Trạng thái',
    },
    {
      id: 12,
      title: 'Thời gian',
    },
  ]
  const [rowsExpand, setRowExpand] = useState([])
  // Debounce Select File
  const [value, setValue] = useState([])
  const [initOption, setInitOption] = useState([])
  // endregion
  // region destructuring ======================
  const { appTheme, device } = commonStore
  const { entProfile } = profileStore
  const { userProfile, jwtDecode, roles } = authenticationStore
  const {
    objFilterDetail,
    exportDetailLoading,
    objExportDetail,
    totalCountDetail,
    listBillingReportsDetail,
    listPayTypeForReportDetail,
    listOrderStatusCodeForReportDetail,
    listAccountNameForReportDetail,
    listExecutionFiles,
    listDepartmentsByUserDetail,
    listTransTypeForReportDetail,
  } = reportStore
  const history = useHistory()
  // endregion
  // region variable ===========================
  const columns = [
    {
      id: 1,
      title: 'STT',
      width: 55,
      align: 'center',
      render: (item, row, index) => item?.STT > 0 ? item?.STT : '',
    },
    {
      id: 2,
      title: 'Hình thức',
      render: record => record?.TransactionID > 0 ? record?.TranType : '',
    },
    {
      id: 3,
      title: 'Mã yêu cầu',
      render: record => record?.TransactionID > 0 ? record?.ExecutionID : '',
    },
    {
      id: 4,
      title: 'Mã giao dịch',
      render: record => record?.TransactionID > 0 ? record?.TransactionID : '',
    },
    {
      id: 5,
      title: 'Số ví',
      render: record =>
        <span className={record?.PayType > 0 ? '' : 'text-bold'}>
          {record?.AccountName}
        </span>,
    },
    {
      id: 6,
      title: 'Điểm kinh doanh',
      render: record => record?.STT > 0 ? record?.DepartmentName : '',
    },
    {
      id: 7,
      title: 'Loại giao dịch',
      render: record =>
        <span className={record?.PayType > 0 ? '' : 'text-bold'}>
          {record?.PayTypeName}
        </span>,
    },
    {
      id: 8,
      align: 'center',
      title: 'Số lượng',
      render: record =>
        <span className={record?.PayType > 0 ? '' : 'text-bold'}>
          {numberUtils.thousandSeparator(record?.SLGD)}
        </span>,
    },
    {
      id: 9,
      align: 'center',
      title: 'Số tiền',
      render: record =>
        <span className={record?.PayType > 0 ? '' : 'text-bold'}>
          {numberUtils.thousandSeparator(record?.PaymentAmount)}
        </span>,
    },
    {
      id: 10,
      title: 'Đối tượng',
      render: record => record?.STT > 0
      && record?.RelatedAccount
        ? record?.RelatedAccount
        : `${record?.BankCode || ''}${record?.BankCode && record?.BankName ? '-' : ''}${record?.BankName || ''}`,
    },
    {
      id: 11,
      title: 'Trạng thái',
      align: 'center',
      render: record => record?.STT > 0 ?
        <Tag color={renderColorStatusCode(record?.OrderStatusCode)}>{record.TrangThai}</Tag> : '',
    },
    {
      id: 12,
      title: 'Thời gian',
      render: record => record?.STT > 0 ? dateUtils.convertToStrDate(record?.TransactionTime) : '',
    },
  ].filter(item => showColumn.includes(item.id))

  // endregion
  // region function handle logic ==============
  async function fetchUserList(k) {
    return reportStore.loadBatchExecutionFilesByAccountID({ Keyword: k })
      .then((res) =>
        res?.batchExecutionFiles?.length > 0 ? res?.batchExecutionFiles.map((item) => ({
          label: item.fileName,
          value: item.executionID,
          key: item.executionID,
        })) : null,
      )
  }

  const onFinish = (e) => {
    objFilterDetail.PageIndex = 1
    objFilterDetail.AccountID = e.accountName
    objFilterDetail.PayType = e.payType
    objFilterDetail.CreatedOrg = e.createdOrg
    objFilterDetail.OrderStatusCode = e.orderStatusCode
    objFilterDetail.ExecutionID = e.executionID?.value || 0
    objFilterDetail.Fromdate = e.rangePicker[0].format(STRING_DATE)
    objFilterDetail.Todate = e.rangePicker[1].format(STRING_DATE)
    objFilterDetail.TranType = e.transType
    setRowExpand([])
    reportStore.getCustomerBillingReportsDetail()
  }
  const onChangeShowColumn = (e) => {
    setShowColumn(e)
  }
  const menu = (
    <DropdownShowColumnWrapper>
      <Checkbox.Group
        value={showColumn}
        style={{ width: '100%' }}
        onChange={onChangeShowColumn}>
        <Row gutter={[8, 8]}>
          {
            dropdownShowColumn.map(item =>
              <Col key={item.id} span={24}>
                <Checkbox value={item.id}>{item.title}</Checkbox>
              </Col>,
            )
          }
        </Row>
      </Checkbox.Group>
    </DropdownShowColumnWrapper>
  )
  const handleChangePagination = (pageIndex, pageSize) => {
    if (objFilterDetail.PageSize !== pageSize) {
      objFilterDetail.PageIndex = 1
      objFilterDetail.PageSize = pageSize
    } else {
      objFilterDetail.PageIndex = pageIndex
    }
    reportStore.getCustomerBillingReportsDetail()
  }
  const handleClickExpand = (status, record) => {
    console.log(status, record)
    if (status) {
      console.log(record)
    }
  }
  const handleClickExport = () => {
    reportStore.setExportDetailLoading(true)
    setRowExpand([])
    // reload data
    objFilterDetail.PageIndex = 1
    objFilterDetail.AccountID = formReportFilter.getFieldValue('accountName')
    objFilterDetail.PayType = formReportFilter.getFieldValue('payType')
    objFilterDetail.CreatedOrg = formReportFilter.getFieldValue('createdOrg')
    objFilterDetail.OrderStatusCode = formReportFilter.getFieldValue('orderStatusCode')
    objFilterDetail.TranType = formReportFilter.getFieldValue('transType')
    objFilterDetail.Fromdate = formReportFilter.getFieldValue('rangePicker')[0].format(STRING_DATE)
    objFilterDetail.Todate = formReportFilter.getFieldValue('rangePicker')[1].format(STRING_DATE)
    reportStore.getCustomerBillingReportsDetail()

    // process export
    objExportDetail.AccountID = formReportFilter.getFieldValue('accountName')
    objExportDetail.PayType = formReportFilter.getFieldValue('payType')
    objExportDetail.CreatedOrg = formReportFilter.getFieldValue('createdOrg')
    objExportDetail.OrderStatusCode = formReportFilter.getFieldValue('orderStatusCode')
    objExportDetail.TranType = formReportFilter.getFieldValue('transType')
    objExportDetail.Fromdate = formReportFilter.getFieldValue('rangePicker')[0].format(STRING_DATE)
    objExportDetail.Todate = formReportFilter.getFieldValue('rangePicker')[1].format(STRING_DATE)

    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    reportStore.exportCustomerBillingReportsDetail(source)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          fileUtils.saveAsFile('BCCT webDN', res?.report)
          reportStore.setExportDetailLoading(false)
          Modal.destroyAll()
        }
      })
  }
  const handleSendEmailToApprover = (record) => {
    paymentStore.getCardDetail({ SaleOrderID: record?.SaleOrderID })
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          notification.success({
            message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
            description: `Đã gửi danh sách mã thẻ tới email của ${record?.ApproveUser}`,
          })
        }
      })
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
          {
            record?.Fee > 0 &&
            <Descriptions.Item
              label={'Phí'}
              span={1}>
              {numberUtils.thousandSeparator(record?.Fee)}
            </Descriptions.Item>
          }
          {
            record?.SaleDiscount > 0 &&
            <Descriptions.Item
              label={'Chiết khấu'}
              span={1}>
              {numberUtils.thousandSeparator(record?.SaleDiscount)}
            </Descriptions.Item>
          }
          <Descriptions.Item
            label={'Mô tả'}
            span={1}>
            {record?.Description || '-'}
          </Descriptions.Item>
          <Descriptions.Item
            label={'Kênh GD'}
            span={1}>
            {record?.DeviceType || '-'}
          </Descriptions.Item>
          {
            (record?.ProductCode?.includes('CARD')
              && jwtDecode?.RoleType === ROLE_TYPE.APPROVE
              && record?.OrderStatusCode === ORDER_STATUS_CODE.SUCCESS) &&
            <Descriptions.Item
              label={'Thông tin thẻ'}
              span={1}>
              <ColorText
                color={appTheme.solidColor}
                cursor={'pointer'}
                onClick={() => handleSendEmailToApprover(record)}
              >
                Gửi mã thẻ vào email người duyệt
              </ColorText>
            </Descriptions.Item>
          }
          <Descriptions.Item
            label={'Người tạo'}
            span={1}>
            {record?.InitUser || '-'}
          </Descriptions.Item>
          <Descriptions.Item
            label={'Người duyệt'}
            span={1}>
            {record?.ApproveUser || '-'}
          </Descriptions.Item>
        </Descriptions>
      </ExpandContent>
    )
  }
  const renderColorStatusCode = (statusCode) => {
    switch (statusCode) {
      case ORDER_STATUS_CODE.SUCCESS:
        return 'green'
      case ORDER_STATUS_CODE.WAIT_PAY:
      case ORDER_STATUS_CODE.UNKNOWN:
        return 'orange'
      case ORDER_STATUS_CODE.FAILURE_REFUND:
        return 'red'
      default:
        return
    }
  }
  // endregion
  // region side effect ========================
  useEffect(() => {
    Promise.all([
      reportStore.getInfoAccountNameForReportDetail({ UserType: 2 }),
      reportStore.getPayTypeForReportDetail({ TableName: TABLE_NAME.PAYTYPEGROUP_DN_BCTH }),
      reportStore.getOrderStatusCodeForReportDetail({ TableName: TABLE_NAME.PAYTYPEGROUP_DN_ORDER_STATUS_CODE }),
      reportStore.loadDepartmentsByUserDetail(),
      reportStore.getListTransTypeForReportDetail({
        TableName: TABLE_NAME.REPORT_DN,
        ColumnName: COLUMN_NAME.TRANS_TYPE,
      }),
    ])
      .then(([
               resAccounts,
               resPayType,
               resStatusCode,
               resDept,
               resTransType,
             ]) => {
        objFilterDetail.PayType = resPayType?.sysVar[0]?.columnName
        objFilterDetail.OrderStatusCode = resStatusCode?.sysVar[0]?.columnName
        objFilterDetail.AccountID = resAccounts?.infoAccountName[0]?.accountID
        objFilterDetail.CreatedOrg = resDept?.deptItems[0]?.DepartmentID
        objFilterDetail.TranType = resTransType?.sysvar[0]?.Value

        formReportFilter.setFieldsValue({
          accountName: resAccounts?.infoAccountName[0]?.accountID,
          payType: resPayType?.sysVar[0]?.columnName,
          orderStatusCode: resStatusCode?.sysVar[0]?.columnName,
          createdOrg: resDept?.deptItems[0]?.DepartmentID,
          transType: resTransType?.sysvar[0]?.Value,
        })
      })
      .then(() => {
        reportStore.getCustomerBillingReportsDetail()
      })

  }, [])
  useEffect(() => {
    formReportFilter.setFieldsValue({
      rangePicker: [moment().startOf('month'), moment()],
    })
    objExportDetail.CompanyName = entProfile?.businessName
  }, [])
  useEffect(() => {
    if (!roles) return
    if (authenticationStore.checkRole(ROLES.DETAILREPORT)) return
    history.push(PAGES.HOME.PATH)
    notification.warning({
      message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
      description: TEXT_403,
    })
  }, [roles])
  useEffect(() => {
    return () => {
      reportStore.resetBillingReportsDetail()
    }
  }, [])
  // endregion

  return (
    <>
      <Helmet>
        <title>Báo cáo chi tiết</title>
      </Helmet>
      <ReportDetailPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.REPORT_DETAIL} />
        <WhiteRoundedBox>
          <Form
            form={formReportFilter}
            colon={false}
            onFinish={onFinish}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign={'left'}
          >
            <Row justify={'space-between'} gutter={[32, 16]}>
              <Col xxl={8} xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  rules={[
                    { validator: validator.validateRangePickerExport },
                  ]}
                  label={'Thời gian'}
                  name={'rangePicker'}
                >
                  <RangePicker
                    placeholder={['Từ ngày', 'Đến ngày']}
                    allowClear={false}
                    format={SHORT_DATE}
                    style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  label={'Số ví thanh toán'}
                  name={'accountName'}
                >
                  <Select
                    showSearch
                    optionFilterProp={'name'}
                    placeholder={'Số ví thanh toán'}>
                    {
                      listAccountNameForReportDetail && listAccountNameForReportDetail?.length > 0 && listAccountNameForReportDetail.map((item, index) =>
                        <Select.Option
                          key={index}
                          value={item.accountID}
                          name={item.accountName}>
                          {item.accountName}
                        </Select.Option>,
                      )
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  label={'Trạng thái'}
                  name={'orderStatusCode'}
                >
                  <Select
                    showSearch
                    optionFilterProp={'name'}
                    placeholder={'Trạng thái'}>
                    {
                      listOrderStatusCodeForReportDetail && listOrderStatusCodeForReportDetail?.length > 0 && listOrderStatusCodeForReportDetail.map((item, index) =>
                        <Select.Option
                          key={index}
                          value={item?.columnName}
                          name={item?.description}>
                          {item?.description}
                        </Select.Option>,
                      )
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  label={'Loại giao dịch'}
                  name={'payType'}
                >
                  <Select
                    showSearch
                    optionFilterProp={'name'}
                    placeholder={'Loại giao dịch'}>
                    {
                      listPayTypeForReportDetail && listPayTypeForReportDetail?.length > 0 && listPayTypeForReportDetail.map((item, index) =>
                        <Select.Option
                          key={index}
                          value={item?.columnName}
                          name={item?.description}>
                          {item?.description}
                        </Select.Option>,
                      )
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  label={'Tên file'}
                  name={'executionID'}
                >
                  <DebounceSelect
                    showSearch={true}
                    value={value}
                    placeholder='Tìm kiếm theo tên file'
                    initOption={initOption}
                    fetchOptions={fetchUserList}
                    onChange={(newValue) => {
                      setValue(newValue)
                    }}
                    style={{
                      width: '100%',
                    }}
                  />

                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  label={'Điểm kinh doanh'}
                  name={'createdOrg'}
                >
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp={'name'}
                    placeholder={'Điểm kinh doanh'}>
                    {
                      listDepartmentsByUserDetail && listDepartmentsByUserDetail?.length > 0 && listDepartmentsByUserDetail.map((item, index) =>
                        <Select.Option
                          key={index}
                          value={item?.DepartmentID}
                          name={item?.DepartmentName}>
                          {item?.DepartmentName}
                        </Select.Option>,
                      )
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={24} sm={24} xs={24}>
                <Form.Item
                  label={'Hình thức'}
                  name={'transType'}
                >
                  <Select
                    showSearch
                    allowClear
                    optionFilterProp={'name'}
                    placeholder={'Hình thức'}>
                    {
                      listTransTypeForReportDetail && listTransTypeForReportDetail?.length > 0 && listTransTypeForReportDetail.map((item, index) =>
                        <Select.Option
                          key={index}
                          value={item?.Value}
                          name={item?.Description}>
                          {item?.Description}
                        </Select.Option>,
                      )
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col xxl={8} xl={12} lg={12} md={24} sm={24} xs={24}>
                <RowFlexEndDiv>
                  <Button type={'primary'} htmlType={'submit'}>
                    <SearchOutlined />
                    Tra cứu
                  </Button>
                </RowFlexEndDiv>
              </Col>
            </Row>
          </Form>

          <Divider />

          <RowSpaceBetweenDiv margin={'16px 0'}>
            <Dropdown
              // visible={visibleShowColumnDropdown}
              overlay={menu}
              trigger={['click']}>
              <Button>
                <EyeOutlined /> Ẩn hiện cột
              </Button>
            </Dropdown>
            <Button
              disabled={exportDetailLoading}
              onClick={handleClickExport}>
              {
                exportDetailLoading
                  ? <LoadingOutlined />
                  : <DownloadOutlined />
              }
              Xuất dữ liệu
            </Button>
          </RowSpaceBetweenDiv>

          <Table
            scroll={{ x: 1200 }}
            expandable={{
              expandedRowRender: record => renderExpandRow(record),
              onExpand: (status, record) => handleClickExpand(status, record),
              rowExpandable: record => record.STT > 0,
              onExpandedRowsChange: (expandedKeys) => setRowExpand(expandedKeys),
              expandedRowKeys: rowsExpand,
            }}
            bordered={true}
            dataSource={listBillingReportsDetail}
            columns={columns}
            rowKey={record => record.STT}
            pagination={false} />
          <PaginationRow
            onChangePagination={handleChangePagination}
            currentListLength={listBillingReportsDetail?.length - 1}
            totalCount={totalCountDetail - 1}
            pageIndex={objFilterDetail.PageIndex}
            pageSize={objFilterDetail.PageSize}
            pageSizeOptions={[50, 100, 150, 200]}
          />
        </WhiteRoundedBox>
      </ReportDetailPageWrapper>
    </>
  )
}

ReportDetailPage.propTypes = {}

export default inject('commonStore', 'reportStore', 'profileStore', 'paymentStore', 'authenticationStore')(observer(ReportDetailPage))