import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { ReportStatementPageWrapper } from './ReportStatementPageStyled'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  BREADCRUMB_DATA,
  ERROR_COLOR,
  ERROR_TITLE,
  PAGES,
  RESPONSE_CODE,
  ROLES,
  SHORT_DATE,
  STRING_DATE,
  TEXT_403,
  WARNING_COLOR,
  WARNING_TITLE,
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
  Menu,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Table,
} from 'antd'
import validator from '../../validator'
import {
  DownOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  LoadingOutlined,
  PrinterFilled,
  SearchOutlined,
} from '@ant-design/icons'
import PaginationRow from '../../components/PaginationRow'
import moment from 'moment'
import dateUtils from '../../utils/dateUtils'
import numberUtils from '../../utils/numberUtils'
import axios from 'axios'
import fileUtils from '../../utils/fileUtils'
import { useHistory } from 'react-router-dom'
import PrintStatementPdfModal from '../../components/PrintStatementPdfModal'

const { RangePicker } = DatePicker

const ReportStatementPage = props => {
  // region props, hook, state =================
  const {
    commonStore,
    reportStore,
    profileStore,
    authenticationStore,
  } = props

  const [formReportFilter] = Form.useForm()
  const history = useHistory()
  const [showColumn, setShowColumn] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])


  // endregion
  // region destructuring ======================
  const { entUserFullName, currUserName } = profileStore

  const { roles } = authenticationStore

  const { appTheme } = commonStore
  const {
    objFilterStatement,
    objExportStatement,
    exportStatementLoading,
    listBillingReportsStatement,
    totalCountStatement,
    debitBalanceOpen,
    debitBalance,
    availableBalanceOpen,
    availableBalance,
    listAccountsByMemberID,
    accountFullName,
  } = reportStore
  // endregion
  // region variable ===========================
  const dropdownShowColumn = [
    {
      id: 1,
      title: 'STT',
    },
    {
      id: 2,
      title: 'Mã giao dịch',
    },
    {
      id: 3,
      title: 'Ngày giao dịch',
    },
    {
      id: 4,
      title: 'Nội dung',
    },
    {
      id: 5,
      title: 'Từ/Đến',
    },
    {
      id: 6,
      title: 'Ghi nợ',
    },
    {
      id: 7,
      title: 'Ghi có',
    },
    {
      id: 8,
      title: 'Số dư',
    },
    {
      id: 9,
      title: 'Thao tác',
    },
  ]
  // endregion
  // region function handle logic ==============
  const onFinish = (e) => {
    if (!e.accountName?.trim()) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: 'Chọn số tài khoản muốn xem sao kê',
      })
      return
    }
    objFilterStatement.PageIndex = 1
    objFilterStatement.AccountName = e.accountName
    objFilterStatement.Fromdate = e.rangePicker[0].format(STRING_DATE)
    objFilterStatement.Todate = e.rangePicker[1].format(STRING_DATE)
    reportStore.getStatementReport()
  }

  const handleChangePagination = (pageIndex, pageSize) => {
    if (objFilterStatement.PageSize !== pageSize) {
      objFilterStatement.PageIndex = 1
      objFilterStatement.PageSize = pageSize
    } else {
      objFilterStatement.PageIndex = pageIndex
    }
    reportStore.getStatementReport()
  }
  // endregion
  // region function render ====================
  const onChangeShowColumn = (e) => {
    setShowColumn(e)
  }
  const overlayShowColumn = (
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
  const handleMenuClick = (e) => {
    if (!formReportFilter.getFieldValue('accountName')?.trim()) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: 'Vui lòng nhập mã khách hàng',
      })
      return
    }
    objFilterStatement.PageIndex = 1
    objFilterStatement.AccountName = formReportFilter.getFieldValue('accountName')
    objFilterStatement.Fromdate = formReportFilter.getFieldValue('rangePicker')[0].format(STRING_DATE)
    objFilterStatement.Todate = formReportFilter.getFieldValue('rangePicker')[1].format(STRING_DATE)

    objExportStatement.AccountName = formReportFilter.getFieldValue('accountName')
    objExportStatement.Fromdate = formReportFilter.getFieldValue('rangePicker')[0].format(STRING_DATE)
    objExportStatement.Todate = formReportFilter.getFieldValue('rangePicker')[1].format(STRING_DATE)
    objExportStatement.Creator = entUserFullName
    switch (e?.key) {
      case 'exportExcel':
        reportStore.setExportStatementLoading(true)
        // reload data
        reportStore.getStatementReport()
        // process export
        const CancelToken = axios.CancelToken
        const source = CancelToken.source()
        reportStore.getStatementReportExcel(source)
          .then(res => {
            if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
              fileUtils.saveAsFile('BCSK webDN', res?.reports)
              reportStore.setExportStatementLoading(false)
              Modal.destroyAll()
            }
          })
        break
      case 'exportPdf':
        reportStore.setExportStatementPdfLoading(true)
        // reload data
        reportStore.getStatementReport()
        // process export
        const CancelTokenPdf = axios.CancelToken
        const sourcePdf = CancelTokenPdf.source()
        reportStore.getStatementReportPdf(sourcePdf)
          .then(res => {
            if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
              fileUtils.saveAsFilePdf('BCSK webDN', res?.reports)
              reportStore.setExportStatementPdfLoading(false)
              Modal.destroyAll()
            }
          })
        break
      default:
        break
    }
  }
  const overlayGroupButton = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          label: ' Xuất file pdf',
          key: 'exportPdf',
          icon: <FilePdfOutlined />,
        },
        {
          type: 'divider',
        },
        {
          label: 'Xuất file excel',
          key: 'exportExcel',
          icon: exportStatementLoading ? <LoadingOutlined /> : <FileExcelOutlined />,
          disabled: exportStatementLoading,
        },
        // {
        //   type: 'divider',
        // },
        // {
        //   label: 'In báo cáo',
        //   key: '3',
        //   icon: <PrinterOutlined />,
        // },
      ]}
    />
  )
  const columns = [
    {
      id: 1,
      title: 'STT',
      width: 55,
      align: 'center',
      render: (record) => record?.STT > 0 ? record?.STT : '',
    },
    {
      id: 2,
      title: 'Mã giao dịch',
      render: record => record?.STT > 0 ? record?.TransactionID : '',
    },
    {
      id: 3,
      title: 'Ngày giao dịch',
      render: record => record?.STT > 0 ? dateUtils.convertToStrDate(record?.TransTime) : '',
    },
    {
      id: 4,
      title: 'Nội dung',
      render: record => record?.STT > 0 ? record?.Description : <strong>Tổng cộng</strong>,
    },
    {
      id: 5,
      title: 'Từ/Đến',
      render: record => record?.RelatedAccount,
    },
    {
      id: 6,
      width: 120,
      align: 'right',
      title: <RowCenterDiv>Ghi nợ</RowCenterDiv>,
      render: record => record?.STT > 0
        ? numberUtils.thousandSeparator(record?.ExpenseAmount)
        : <strong>{numberUtils.thousandSeparator(record?.ExpenseAmount)}</strong>,
    },
    {
      id: 7,
      width: 120,
      align: 'right',
      title: <RowCenterDiv>Ghi có</RowCenterDiv>,
      render: record => record?.STT > 0
        ? numberUtils.thousandSeparator(record?.InComeAmount)
        : <strong>{numberUtils.thousandSeparator(record?.InComeAmount)}</strong>,
    },
    {
      id: 8,
      width: 150,
      align: 'right',
      title: <RowCenterDiv>Số dư</RowCenterDiv>,
      render: record => record?.STT > 0
        ? numberUtils.thousandSeparator(record?.CloseBalance)
        : '',
    },
    {
      id: 9,
      width: 90,
      align: 'center',
      title: 'Thao tác',
      render: record => record?.STT > 0 &&
        <Space size={16}>
          {/*<Tooltip title={''}>*/}
          {/*  <FileFilled*/}
          {/*    style={{*/}
          {/*      color: appTheme.solidColor,*/}
          {/*      cursor: 'pointer',*/}
          {/*    }}*/}
          {/*  />*/}
          {/*</Tooltip>*/}
          <PrintStatementPdfModal
            button={
              <PrinterFilled
                style={{
                  color: appTheme.solidColor,
                  cursor: 'pointer',
                }}
              />
            }
            record={{ ...record, userFullName: entUserFullName, accountFullName }}
          />
        </Space>,
    },
  ].filter(item => showColumn.includes(item.id))

  // endregion
  // region side effect ========================
  useEffect(() => {
    formReportFilter.setFieldsValue({
      rangePicker: [moment().startOf('month'), moment()],
    })
  }, [])
  useEffect(() => {
    if (!currUserName) return
    let payload = {
      MemberID: currUserName,
      Keyword: '',
    }
    reportStore.loadAccountsByMemberID(payload)
  }, [currUserName])

  useEffect(() => {
    if (!roles) return
    if (authenticationStore.checkRole(ROLES.STATEMENTREPORT)) return
    history.push(PAGES.HOME.PATH)
    notification.warning({
      message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
      description: TEXT_403,
    })
  }, [roles])

  useEffect(() => {
    return () => {
      formReportFilter.resetFields()
      reportStore.resetBillingReportsStatement()
    }
  }, [])
  // endregion
  return (
    <>
      <Helmet>
        <title>Báo cáo sao kê</title>
      </Helmet>
      <ReportStatementPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.REPORT_STATEMENT} />
        <WhiteRoundedBox>
          <Form
            form={formReportFilter}
            colon={false}
            onFinish={onFinish}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign={'left'}
          >
            <Row justify={'center'} gutter={[32, 16]}>
              <Col xxl={8} xl={10} lg={10} md={24} sm={24} xs={24}>
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
              <Col xxl={8} xl={10} lg={10} md={24} sm={24} xs={24}>
                <Form.Item
                  label={'Tài khoản'}
                  name={'accountName'}
                >
                  <Select
                    label={'Tài khoản'}
                    name={'accountName'}
                    showSearch
                    optionFilterProp={'name'}
                    placeholder={'Tài khoản'}>
                    {
                      listAccountsByMemberID && listAccountsByMemberID?.length > 0 && listAccountsByMemberID.map((item, index) =>
                        <Select.Option
                          key={index}
                          value={item.AccountName}
                          name={item.AccountName}>
                          {item.AccountName}
                        </Select.Option>,
                      )
                    }
                  </Select>
                </Form.Item>

              </Col>
              <Col xxl={2} xl={4} lg={4} md={24} sm={24} xs={24}>
                <Button type={'primary'} htmlType={'submit'} block>
                  <SearchOutlined />
                  Tra cứu
                </Button>
              </Col>
            </Row>
          </Form>

          <Divider />

          <RowSpaceBetweenDiv margin={'16px 0'}>
            <Dropdown
              overlay={overlayShowColumn}
              trigger={['click']}>
              <Button>
                <EyeOutlined /> Ẩn hiện cột
              </Button>
            </Dropdown>
            {
              debitBalanceOpen !== null &&
              <ColorText
                fontWeight={600}
              >
                {`Số dư đầu kỳ (Khả dụng/Tổng số dư): ${numberUtils.thousandSeparator(availableBalanceOpen)}/${numberUtils.thousandSeparator(debitBalanceOpen)} (VND)`}
              </ColorText>
            }
            <Dropdown
              overlayClassName={'overlay-export-statement'}
              overlay={overlayGroupButton}
              placement='bottomRight'>
              <Button style={{ minWidth: 130 }}>
                <Space>
                  Xuất dữ liệu
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </RowSpaceBetweenDiv>
          <Table
            scroll={{ x: 1200 }}
            bordered={true}
            dataSource={listBillingReportsStatement}
            columns={columns}
            rowKey={record => record?.STT || 0}
            pagination={false} />
          {
            debitBalance !== null &&
            <RowCenterDiv>
              <ColorText
                padding={'16px 0 0 0'}
                fontWeight={600}
              >
                {`Số dư cuối kỳ (Khả dụng/Tổng số dư): ${numberUtils.thousandSeparator(availableBalance)}/${numberUtils.thousandSeparator(debitBalance)} (VND)`}
              </ColorText>
            </RowCenterDiv>
          }

          <PaginationRow
            onChangePagination={handleChangePagination}
            currentListLength={listBillingReportsStatement?.length - 1}
            totalCount={totalCountStatement - 1}
            pageIndex={objFilterStatement.PageIndex}
            pageSize={objFilterStatement.PageSize}
            pageSizeOptions={[50, 100, 150, 200]}
          />

          {/*<PrintAllStatementPdf*/}
          {/*  report={pdfReport}*/}
          {/*  button={*/}
          {/*    <Button*/}
          {/*      ref={exportPdfRef}*/}
          {/*      style={{ display: 'none' }}>*/}
          {/*      Export*/}
          {/*    </Button>*/}
          {/*  } />*/}
        </WhiteRoundedBox>
      </ReportStatementPageWrapper>

    </>
  )
}

ReportStatementPage.propTypes = {}

export default inject('reportStore', 'commonStore', 'profileStore', 'authenticationStore')(observer(ReportStatementPage))
