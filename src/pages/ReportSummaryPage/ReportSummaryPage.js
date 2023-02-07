import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { ReportSummaryPageWrapper } from './ReportSummaryPageStyled'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  BREADCRUMB_DATA, COLUMN_NAME,
  PAGES,
  RESPONSE_CODE,
  ROLES,
  SHORT_DATE,
  STRING_DATE, TABLE_NAME, TEXT_403,
  WARNING_COLOR, WARNING_TITLE,
} from '../../utils/constant'
import {
  ColorText,
  DropdownShowColumnWrapper,
  RowCenterDiv,
  RowSpaceBetweenDiv,
  WhiteRoundedBox,
} from '../../components/CommonStyled/CommonStyled'
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Modal,
  notification,
  Row,
  Select,
  Table,
} from 'antd'
import PaginationRow from '../../components/PaginationRow'
import { DownloadOutlined, EyeOutlined, LoadingOutlined, SearchOutlined } from '@ant-design/icons'
import numberUtils from '../../utils/numberUtils'
import fileUtils from '../../utils/fileUtils'
import moment from 'moment'
import axios from 'axios'
import validator from '../../validator'
import { useHistory } from 'react-router-dom'

const _ = require('lodash')


const { RangePicker } = DatePicker

const ReportSummaryPage = props => {
  // region props, hook, state =================
  const { commonStore, reportStore, profileStore, authenticationStore } = props
  const [formReportFilter] = Form.useForm()
  const [showColumn, setShowColumn] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
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
      title: 'Tên điểm kinh doanh',
    },
    {
      id: 4,
      title: 'Số ví thanh toán',
    },
    {
      id: 5,
      title: 'Loại giao dịch',
    },
    {
      id: 6,
      title: 'Thành công',
    },
    {
      id: 7,
      title: 'Đang xử lý',
    },
    {
      id: 8,
      title: 'Hoàn trả',
    },
    {
      id: 9,
      title: 'Phí',
    },
    {
      id: 10,
      title: 'Chiết khấu',
    },
  ]

  const history = useHistory()
  // endregion
  // region destructuring ======================
  const { appTheme } = commonStore
  const { entProfile } = profileStore
  const { roles } = authenticationStore
  const {
    objFilterSum,
    objExportSum,
    listBillingReportsSum,
    totalCountSum,
    listAccountNameForReportSum,
    listPayTypeForReportSum,
    listDepartmentsByUserSum,
    exportSumLoading,
    listTransTypeForReportSum,
  } = reportStore
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
      render: record => record?.STT > 0 ? record.TranType : '',
    },
    {
      id: 3,
      title: 'Tên điểm kinh doanh',
      render: record => record?.STT > 0 ? record.DepartmentName : '',
    },
    {
      id: 4,
      title: 'Số ví thanh toán',
      render: record => record.AccountName,
    },
    {
      id: 5,
      title: 'Loại giao dịch',
      render: record => record.PayType > 0 ? record.PayTypeName : <strong>Tổng cộng</strong>,
    },
    {
      id: 6,
      align: 'center',
      title:
        <Row>
          <Col span={24}>Thành công</Col>
          <Divider style={{ margin: '16px 0' }} />
          <Col span={12}>Số GD</Col>
          <Col span={12} style={{ borderLeft: '1px solid rgba(0, 0, 0, 0.06)' }}>Số tiền</Col>
        </Row>,
      render: record =>
        <Row>
          <Col
            className={record?.PayType > 0 ? '' : 'text-bold'}
            span={12}>
            {record?.SLGDTC}
          </Col>
          <Col
            className={record?.PayType > 0 ? '' : 'text-bold'}
            span={12}
            style={{ borderLeft: '1px solid rgba(0, 0, 0, 0.06)' }}>
            {numberUtils.thousandSeparator(record?.STGDTC)}
          </Col>
        </Row>,
    },
    {
      id: 7,
      align: 'center',
      title:
        <Row>
          <Col span={24}>Đang xử lý</Col>
          <Divider style={{ margin: '16px 0' }} />
          <Col span={12}>Số GD</Col>
          <Col span={12} style={{ borderLeft: '1px solid rgba(0, 0, 0, 0.06)' }}>Số tiền</Col>
        </Row>,
      render: record =>
        <Row>
          <Col
            className={record?.PayType > 0 ? '' : 'text-bold'}
            span={12}>
            {record?.SLGDXL}
          </Col>
          <Col
            className={record?.PayType > 0 ? '' : 'text-bold'}
            span={12}
            style={{ borderLeft: '1px solid rgba(0, 0, 0, 0.06)' }}>
            {numberUtils.thousandSeparator(record?.STGDXL)}
          </Col>
        </Row>,
    },
    {
      id: 8,
      align: 'center',
      title:
        <Row>
          <Col span={24}>Hoàn trả</Col>
          <Divider style={{ margin: '16px 0' }} />
          <Col span={12}>Số GD</Col>
          <Col span={12} style={{ borderLeft: '1px solid rgba(0, 0, 0, 0.06)' }}>Số tiền</Col>
        </Row>,
      render: record =>
        <Row>
          <Col
            className={record?.PayType > 0 ? '' : 'text-bold'}
            span={12}>
            {record?.SLGDHT}
          </Col>
          <Col
            className={record?.PayType > 0 ? '' : 'text-bold'}
            span={12}
            style={{ borderLeft: '1px solid rgba(0, 0, 0, 0.06)' }}>
            {numberUtils.thousandSeparator(record?.STGDHT)}
          </Col>
        </Row>,
    },
    {
      id: 9,
      align: 'right',
      title: <RowCenterDiv>Phí</RowCenterDiv>,
      render: record =>
        <span className={record?.PayType > 0 ? '' : 'text-bold'}>
          {numberUtils.thousandSeparator(record?.STPhi)}
        </span>,
    },
    {
      id: 10,
      align: 'right',
      title: <RowCenterDiv>Chiết khấu</RowCenterDiv>,
      render: record =>
        <span className={record?.PayType > 0 ? '' : 'text-bold'}>
          {numberUtils.thousandSeparator(record?.STChietKhau)}
        </span>,
    },
  ].filter(item => showColumn.includes(item.id))

  // endregion
  // region function handle logic ==============
  const onFinish = (e) => {
    objFilterSum.PageIndex = 1
    objFilterSum.AccountID = e.accountName
    objFilterSum.PayType = e.payType
    objFilterSum.CreatedOrg = e.createdOrg
    objFilterSum.TranType = e.transType
    objFilterSum.Fromdate = e.rangePicker[0].format(STRING_DATE)
    objFilterSum.Todate = e.rangePicker[1].format(STRING_DATE)

    reportStore.getCustomerBillingReportsSum()
  }
  const handleChangePagination = (pageIndex, pageSize) => {
    if (objFilterSum.PageSize !== pageSize) {
      objFilterSum.PageIndex = 1
      objFilterSum.PageSize = pageSize
    } else {
      objFilterSum.PageIndex = pageIndex
    }
    reportStore.getCustomerBillingReportsSum()
  }
  const onChangeShowColumn = (e) => {
    console.log(e)
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
  const handleClickExport = () => {
    reportStore.setExportSumLoading(true)
    // reload data
    objFilterSum.PageIndex = 1
    objFilterSum.AccountID = formReportFilter.getFieldValue('accountName')
    objFilterSum.CreatedOrg = formReportFilter.getFieldValue('createdOrg')
    objFilterSum.PayType = formReportFilter.getFieldValue('payType')
    objFilterSum.TranType = formReportFilter.getFieldValue('transType')
    objFilterSum.Fromdate = formReportFilter.getFieldValue('rangePicker')[0].format(STRING_DATE)
    objFilterSum.Todate = formReportFilter.getFieldValue('rangePicker')[1].format(STRING_DATE)
    reportStore.getCustomerBillingReportsSum()

    // process export
    objExportSum.AccountID = formReportFilter.getFieldValue('accountName')
    objExportSum.CreatedOrg = formReportFilter.getFieldValue('createdOrg')
    objExportSum.PayType = formReportFilter.getFieldValue('payType')
    objExportSum.TranType = formReportFilter.getFieldValue('transType')
    objExportSum.Fromdate = formReportFilter.getFieldValue('rangePicker')[0].format(STRING_DATE)
    objExportSum.Todate = formReportFilter.getFieldValue('rangePicker')[1].format(STRING_DATE)

    const CancelToken = axios.CancelToken
    const source = CancelToken.source()

    reportStore.exportCustomerBillingReportsSum(source)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          fileUtils.saveAsFile('BCTH webDN', res?.report)
          reportStore.setExportSumLoading(false)
          Modal.destroyAll()
        }
      })
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    Promise.all([
      reportStore.getInfoAccountNameForReportSum({ UserType: 2 }),
      reportStore.getPayTypeForReportSum({ TableName: 'PAYTYPEGROUP_DN_BCTH' }),
      reportStore.loadDepartmentsByUserSum(),
      reportStore.getListTransTypeForReportSum({
        TableName: TABLE_NAME.REPORT_DN,
        ColumnName: COLUMN_NAME.TRANS_TYPE,
      }),
    ])
      .then(([resAccounts, ressysVar, resDept, resTransType]) => {
        objFilterSum.PayType = ressysVar?.sysVar[0]?.columnName
        objFilterSum.AccountID = resAccounts?.infoAccountName[0]?.accountID
        objFilterSum.CreatedOrg = resDept?.deptItems[0]?.DepartmentID
        objFilterSum.TranType = resTransType?.sysvar[0]?.Value

        formReportFilter.setFieldsValue({
          accountName: resAccounts?.infoAccountName[0]?.accountID,
          payType: ressysVar?.sysVar[0]?.columnName,
          createdOrg: resDept?.deptItems[0]?.DepartmentID,
          transType: resTransType?.sysvar[0]?.Value,
        })
      })
      .then(() => {
        reportStore.getCustomerBillingReportsSum()
      })
  }, [])
  useEffect(() => {
    formReportFilter.setFieldsValue({
      rangePicker: [moment().startOf('month'), moment()],
    })
    objExportSum.CompanyName = entProfile?.businessName
  }, [])
  useEffect(() => {
    if (!roles) return
    if (authenticationStore.checkRole(ROLES.SUMREPORT)) return
    history.push(PAGES.HOME.PATH)
    notification.warning({
      message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
      description: TEXT_403,
    })
  }, [roles])
  useEffect(() => {
    return () => {
      reportStore.resetBillingReportsSum()
    }
  }, [])
  // endregion

  return (
    <>
      <Helmet>
        <title>Báo cáo tổng hợp</title>
      </Helmet>
      <ReportSummaryPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.REPORT_SUMMARY} />
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
              <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
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
              <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label={'Số ví thanh toán'}
                  name={'accountName'}
                >
                  <Select
                    showSearch
                    optionFilterProp={'name'}
                    placeholder={'Số ví thanh toán'}>
                    {
                      listAccountNameForReportSum && listAccountNameForReportSum?.length > 0 && listAccountNameForReportSum.map((item, index) =>
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
              <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label={'Loại giao dịch'}
                  name={'payType'}
                >
                  <Select
                    showSearch
                    optionFilterProp={'name'}
                    placeholder={'Loại giao dịch'}>
                    {
                      listPayTypeForReportSum && listPayTypeForReportSum?.length > 0 && listPayTypeForReportSum.map((item, index) =>
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
              <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label={'Điểm kinh doanh'}
                  name={'createdOrg'}
                >
                  <Select
                    allowClear
                    showSearch
                    optionFilterProp={'name'}
                    placeholder={'Điểm kinh doanh'}>
                    {
                      listDepartmentsByUserSum && listDepartmentsByUserSum?.length > 0 && listDepartmentsByUserSum.map((item, index) =>
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
              <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
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
                      listTransTypeForReportSum && listTransTypeForReportSum?.length > 0 && listTransTypeForReportSum.map((item, index) =>
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
              <Col xxl={8} xl={12} lg={12} md={12} sm={24} xs={24} style={{ textAlign: 'right' }}>
                <Button type={'primary'} htmlType={'submit'}>
                  <SearchOutlined />
                  Tra cứu
                </Button>
              </Col>
            </Row>
          </Form>
          <Divider />
          {/*<Row gutter={[16, 16]}>*/}
          {/*  <Col xxl={16} xl={16} lg={24} md={24} sm={24} xs={24}>*/}
          {/*    <ColorTitle margin={'0 0 24px 0'}>Lượng tiền giao dịch theo ngày</ColorTitle>*/}
          {/*    <MultipleLineChart />*/}
          {/*  </Col>*/}
          {/*  <Col xxl={8} xl={8} lg={24} md={24} sm={24} xs={24}>*/}
          {/*    <ColorTitle margin={'0 0 24px 0'}>Lượng tiền giao dịch theo dịch vụ</ColorTitle>*/}
          {/*    <DonutChart />*/}
          {/*  </Col>*/}
          {/*</Row>*/}
          {/*<Divider />*/}
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
              disabled={exportSumLoading}
              onClick={handleClickExport}>
              {
                exportSumLoading
                  ? <LoadingOutlined />
                  : <DownloadOutlined />
              }
              Xuất dữ liệu
            </Button>
          </RowSpaceBetweenDiv>
          <Table
            scroll={{ x: 1200 }}
            bordered={true}
            dataSource={listBillingReportsSum || []}
            columns={columns}
            rowKey={record => record.STT}
            pagination={false} />
          <PaginationRow
            onChangePagination={handleChangePagination}
            currentListLength={listBillingReportsSum?.length - 1}
            totalCount={totalCountSum - 1}
            pageIndex={objFilterSum.PageIndex}
            pageSize={objFilterSum.PageSize}
            pageSizeOptions={[50, 100, 150, 200]}
          />
        </WhiteRoundedBox>
      </ReportSummaryPageWrapper>
    </>
  )
}

ReportSummaryPage.propTypes = {}

export default inject('commonStore', 'reportStore', 'profileStore', 'authenticationStore')(observer(ReportSummaryPage))