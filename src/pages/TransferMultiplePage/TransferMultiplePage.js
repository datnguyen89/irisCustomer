import React, { useEffect, useRef, useState } from 'react'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  BREADCRUMB_DATA,
  ERROR_COLOR,
  ERROR_TITLE, PAGES,
  RESPONSE_CODE,
  SUCCESS_COLOR,
  SUCCESS_TITLE,
  VALIDATE_STATUS,
} from '../../utils/constant'
import { Helmet } from 'react-helmet/es/Helmet'
import { ColorText, EllipsisText, RowCenterDiv, WhiteRoundedBox } from '../../components/CommonStyled/CommonStyled'
import { inject, observer } from 'mobx-react'

import {
  DividerLeft,
  DividerRight,
  DividerWrapper,
  DownloadTemplateFile,
  DownloadTemplateText,
  StatusColumnWrapper,
  TextUploadFile,
  TitleUploadFile,
  TransferMultiplePageWrapper,
  UploadAreaWrapper,
  ValidateTemplateText,
  VerifyButton,
} from './TransferMultiplePageStyled'
import { TitleInfoService } from '../TransferWalletPage/TransferWalletPageStyled'
import { Button, Col, Divider, Form, Modal, notification, Row, Select, Table } from 'antd'
import AccountSelectBox from '../../components/AccountSelectBox/AccountSelectBox'
import ICONS from '../../icons'
import UploadModule from '../../components/UploadModule'
import numberUtils from '../../utils/numberUtils'
import ConfirmInfoModal from '../../components/ConfirmInfoModal'
import fileUtils from '../../utils/fileUtils'
import {
  BankLinkedSelectBoxWrapper, NoLinkedBank, NoLinkedBankText,
  NoLinkedBankWrapper,
} from '../../components/BankLinkedSelectBox/BankLinkedSelectBoxStyled'
import { Link } from 'react-router-dom'
import { WarningOutlined } from '@ant-design/icons'

const TransferMultiplePage = props => {
  // region props, hook, state =================
  const { commonStore, orderStore, propertyStore, accountWalletStore, profileStore, bankStore } = props

  const { listLinkedBanks } = bankStore

  const [formTransferMultiple] = Form.useForm()
  const [formFilter] = Form.useForm()
  const uploadRef = useRef()
  const [fileToUpload2, setFileToUpload2] = useState(null)
  const [fileToPreview2, setFileToPreview2] = useState(null)
  const [fileBase642, setFileBase642] = useState(null)
  const [formCollection, setFormCollection] = useState(null)
  const [validatedData, setValidatedData] = useState(false)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [arrConfirmInfo, setArrConfirmInfo] = useState([])
  const [dataResponse, setDataResponse] = useState(null)
  const [totalCountFiltered, setTotalCountFiltered] = useState(0)
  const [totalAmountFiltered, setTotalAmountFiltered] = useState(0)
  const [dataFiltered, setDataFiltered] = useState(null)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  // endregion
  // region destructuring ======================
  const { selectedAccountWallets } = accountWalletStore
  const { entProfile } = profileStore
  const { commonProperty, hostFileUpload } = propertyStore
  const { appTheme } = commonStore
  // endregion
  // region variable ===========================
  const columns = [
    {
      title: 'STT',
      width: 55,
      align: 'center',
      render: (item, row, index) => numberUtils.renderTableIndex(pageIndex, pageSize, index),
    },
    {
      title: 'Số TK nhận',
      render: record => record.relatedUser,
    },
    {
      title: 'Tên TK nhận',
      render: record => record.relatedFullName,
    },
    {
      title: 'Loại TK',
      render: record => record.transferAccountType,
    },
    {
      title: 'Số tiền',
      render: record => numberUtils.thousandSeparator(record.amount),
    },
    {
      title: 'Nội dung chuyển tiền',
      render: record => record.description,
    },
    {
      title: 'Trạng thái',
      render: record => renderStatusColumn(record.validateStatus, record.validateDescription),
    },
  ]

  // endregion
  // region function handle logic ==============
  const handleSubmitTransferMultiple = (e) => {
    notification.destroy()

    if (!fileToUpload2) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: 'Vui lòng upload file danh sách chuyển tiền',
      })
      return
    }
    if (!validatedData) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: 'Vui lòng ấn kiểm tra file',
      })
      return
    }

    const renderTransferMultiTypeName = (value) => {
      return commonProperty?.transferMultiType?.find(item => item.value === value)?.name || ''
    }

    let infos = [
      {
        name: 'Tài khoản ví',
        value: selectedAccountWallets?.accountName,
      },
      {
        name: 'Tên tài khoản ví',
        value: entProfile?.businessName,
      },
      {
        name: 'Tháng chi',
        value: `Tháng ${e?.paymentMonth}`,
      },
      {
        name: 'Hình thức',
        value: renderTransferMultiTypeName(e?.transferMultiType),
      },
      {
        name: 'File chuyển tiền',
        value: fileToUpload2?.name,
        color: appTheme.solidColor,
      },
    ]
    setFormCollection(e)
    setArrConfirmInfo(infos)
    setVisibleConfirm(true)
  }
  const handleConfirm = () => {
    let data = dataResponse?.param.map(item => {
      return {
        amount: Number(item.amount),
        description: item.description,
        fee: Number(item.fee),
        validateStatus: item.validateStatus,
        relatedUser: item.relatedUser,
        relatedFullName: item.relatedFullName,
        totalAmount: Number(item.totalAmount),
        transferAccountType: item.transferAccountType,
        transferType: item.transferType,
        validateDescription: item.validateDescription,
      }
    })
    let warningRecord = dataResponse?.param?.find(item => item?.validateStatus === VALIDATE_STATUS.WARNING)
    let payload = {
      transferMultiInfo: data,
      fileName: fileToUpload2?.name,
      fileUrl: dataResponse?.fileUrl,
      month: formCollection?.paymentMonth,
      transferMultiType: formCollection?.transferMultiType,
      accountNumber: selectedAccountWallets?.accountName,
      accountName: entProfile?.businessName,
    }
    if (warningRecord) {
      Modal.confirm({
        className: 'custom-notice',
        width: 600,
        title: 'Cảnh báo',
        okText: 'Tạo yêu cầu',
        cancelText: 'Hủy',
        onOk: () => {
          processCreateExecution(payload)
        },
        onCancel: () => {
        },
        content:
          <RowCenterDiv>
            Lưu ý File chuyển tiền có cảnh báo. Quý khách có muốn tiếp tục tạo yêu cầu
          </RowCenterDiv>,
      })
    } else {
      processCreateExecution(payload)
    }
  }
  const processCreateExecution = (payload) => {
    orderStore.createTransferMultipleExecution(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          notification.success({
            message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
            description: res?.description,
          })
          setVisibleConfirm(false)
          clearData()
          uploadRef.current.resetFile()
        }
      })
  }
  const handleRemoveFile = () => {
    setFileToUpload2(null)
    setFileToPreview2(null)
    setFileBase642(null)
    setValidatedData(false)
    setDataResponse(null)
    setDataFiltered(null)
    setPageIndex(1)
    setPageSize(10)
    formFilter.setFieldsValue({
      filterStatus: 99,
    })
  }
  const clearData = () => {
    setFileToUpload2(null)
    setFileToPreview2(null)
    setFileBase642(null)
    setValidatedData(false)
    setDataResponse(null)
    setDataFiltered(null)
    setPageIndex(1)
    setPageSize(10)
    formFilter.setFieldsValue({
      filterStatus: 99,
    })
    formTransferMultiple.resetFields()
    setFormCollection(null)
  }
  const handleChangeTransferMultiType = () => {
    setValidatedData(false)
  }
  const handleClickCheckFile = () => {
    notification.destroy()
    formTransferMultiple.validateFields(['transferMultiType', 'paymentMonth'])
      .then(() => {
        if (!fileToUpload2) {
          notification.error({
            message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
            description: 'Vui lòng upload file danh sách chuyển tiền',
          })
          return
        }
        let transType = formTransferMultiple.getFieldValue('transferMultiType')
        let paymentMonth = formTransferMultiple.getFieldValue('paymentMonth')
        let payload = {
          data: fileBase642,
          fileName: fileToUpload2?.name,
          transferMultiType: transType,
          month: paymentMonth,
        }
        orderStore.validateTransferMultiExecution(payload)
          .then(res => {
            if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
              setDataResponse(res)
              setDataFiltered(res?.param)
              let failData = res?.param?.find(item => item?.validateStatus === VALIDATE_STATUS.ERROR)
              console.log(failData)
              if (failData) {
                setValidatedData(false)
              } else {
                setValidatedData(true)
              }
              formFilter.setFieldsValue({
                filterStatus: 99,
              })
              setTotalAmountFiltered(res?.totalAmount)
              setTotalCountFiltered(res?.totalCount)
            }
          })
      })
  }
  const handleFilterStatus = (e) => {
    let dataFilter = null
    switch (e) {
      case 99:
        dataFilter = dataResponse?.param
        break
      case 0:
        dataFilter = dataResponse?.param?.filter(item => item?.validateStatus === VALIDATE_STATUS.SUCCESS)
        break
      case 1:
        dataFilter = dataResponse?.param?.filter(item => item?.validateStatus === VALIDATE_STATUS.WARNING)
        break
      case 2:
        dataFilter = dataResponse?.param?.filter(item => item?.validateStatus === VALIDATE_STATUS.ERROR)
        break
      default:
        break
    }
    let totalCount = dataFilter?.length || 0
    let totalAmount = dataFilter?.reduce((n, { amount }) => n + Number(amount), 0)
    setPageIndex(1)
    setDataFiltered(dataFilter)
    setTotalCountFiltered(totalCount)
    setTotalAmountFiltered(totalAmount)
  }
  const handleChangePagination = (pagination) => {
    if (pageSize !== pagination.pageSize) {
      setPageIndex(1)
      setPageSize(pagination.pageSize)
    } else {
      setPageIndex(pagination.current)
    }
  }
  // endregion
  // region function render ====================
  const renderStatusColumn = (validateStatus, validateDescription) => {
    let icon = ''
    let text = ''
    let height = 24
    switch (validateStatus) {
      case VALIDATE_STATUS.SUCCESS:
        icon = ICONS.TRANSFER_MULTI_VALID
        text = validateDescription
        break
      case VALIDATE_STATUS.WARNING:
        icon = ICONS.TRANSFER_MULTI_WARNING
        text = validateDescription
        height = 18
        break
      case VALIDATE_STATUS.ERROR:
        icon = ICONS.TRANSFER_MULTI_NOT_VALID
        text = validateDescription
        break
      default:
        break
    }

    return (
      <StatusColumnWrapper>
        <img src={icon} alt={''} />
        <span>{text}</span>
      </StatusColumnWrapper>
    )
  }
  // endregion
  // region side effect ========================

  // endregion

  useEffect(() => {
    return () => {
      clearData()
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>Chuyển tiền theo lô</title>
      </Helmet>
      <TransferMultiplePageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.TRANSFER_MULTIPLE} />
        <WhiteRoundedBox>
          <TitleInfoService>Thông tin chuyển tiền</TitleInfoService>
          <Form
            scrollToFirstError={true}
            size={'large'}
            onFinish={handleSubmitTransferMultiple}
            form={formTransferMultiple}>
            <Row justify={'center'}>
              <Col xxl={12} xl={12} lg={18} md={20} sm={24} xs={24}>
                <AccountSelectBox />
                <Form.Item
                  rules={[{ required: true, message: 'Vui lòng chọn hình thức' }]}
                  name={'transferMultiType'}>
                  <Select
                    placeholder={'Hình thức'}
                    onChange={handleChangeTransferMultiType}
                  >
                    {
                      commonProperty?.transferMultiType?.length > 0 && commonProperty?.transferMultiType?.map(item =>
                        <Select.Option value={item?.value} key={item?.value}>{item?.name}</Select.Option>,
                      )
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  rules={[{ required: true, message: 'Vui lòng chọn tháng chi' }]}
                  name={'paymentMonth'}>
                  <Select placeholder={'Tháng chi'}>
                    <Select.Option value={1}>Tháng 1</Select.Option>
                    <Select.Option value={2}>Tháng 2</Select.Option>
                    <Select.Option value={3}>Tháng 3</Select.Option>
                    <Select.Option value={4}>Tháng 4</Select.Option>
                    <Select.Option value={5}>Tháng 5</Select.Option>
                    <Select.Option value={6}>Tháng 6</Select.Option>
                    <Select.Option value={7}>Tháng 7</Select.Option>
                    <Select.Option value={8}>Tháng 8</Select.Option>
                    <Select.Option value={9}>Tháng 9</Select.Option>
                    <Select.Option value={10}>Tháng 10</Select.Option>
                    <Select.Option value={11}>Tháng 11</Select.Option>
                    <Select.Option value={12}>Tháng 12</Select.Option>
                  </Select>
                </Form.Item>
                <Row gutter={[16, 16]}>
                  <Col xxl={5} xl={5} lg={5} md={5} sm={5} xs={24}>
                    <a href={process.env.PUBLIC_URL + `/TemplateV2.xlsx`}>
                      <DownloadTemplateFile borderColor={appTheme.solidColor}>
                        <img src={ICONS.TRANSFER_MULTI_DOWNLOAD} alt={''} />
                        <DownloadTemplateText color={appTheme.solidColor}>
                          Tải file mẫu
                        </DownloadTemplateText>
                      </DownloadTemplateFile>
                    </a>
                  </Col>
                  <Col xxl={14} xl={14} lg={14} md={14} sm={14} xs={24}>

                    <UploadModule
                      ref={uploadRef}
                      uploadButton={
                        <UploadAreaWrapper borderColor={appTheme.solidColor}>
                          <img src={ICONS.TRANSFER_MULTI_UPLOAD} alt={''} />
                          <TitleUploadFile>
                            {
                              fileToUpload2
                                ? <EllipsisText textAlign={'center'}>{fileToUpload2?.name}</EllipsisText>
                                : `Upload File Danh Sách`
                            }
                          </TitleUploadFile>
                          <TextUploadFile color={appTheme.solidColor}>
                            <span style={{ marginRight: 4 }}>Chọn file</span>
                            hoặc kéo thả file vào đây
                          </TextUploadFile>
                        </UploadAreaWrapper>
                      }
                      onRemove={handleRemoveFile}
                      callbackFile={e => {
                        notification.destroy()
                        setFileToUpload2(e)
                      }}
                      callbackFileBase64={e => {
                        notification.destroy()
                        setFileBase642(e)
                      }}
                      callbackFileSrcPreview={e => {
                        notification.destroy()
                        setFileToPreview2(e)
                      }} />

                  </Col>
                  <Col xxl={5} xl={5} lg={5} md={5} sm={5} xs={24}>
                    <VerifyButton
                      onClick={handleClickCheckFile}
                      backGround={appTheme.solidColor}>
                      <img src={ICONS.TRANSFER_MULTI_VALIDATE} alt={''} />
                      <ValidateTemplateText>
                        Kiểm tra file
                      </ValidateTemplateText>
                    </VerifyButton>
                  </Col>
                </Row>

              </Col>
            </Row>
          </Form>
          {
            dataResponse
              ? <DividerWrapper>
                <DividerLeft color={appTheme.solidColor}>
                  <span className={'text'}>Số lượng</span>
                  <span className={'value'}>{numberUtils.thousandSeparator(totalCountFiltered) || 0}</span>
                  <span className={'text'}>Tổng tiền</span>
                  <span className={'value'}>{numberUtils.thousandSeparator(totalAmountFiltered)} VND</span>
                </DividerLeft>
                <DividerRight color={appTheme.solidColor}>
                  <Form form={formFilter}>
                    <Form.Item
                      name={'filterStatus'}
                      noStyle
                    >
                      <Select onChange={handleFilterStatus} style={{ width: 140 }}>
                        <Select.Option value={99}>Tất cả</Select.Option>
                        <Select.Option value={0}>Hợp lệ</Select.Option>
                        <Select.Option value={1}>Cảnh báo</Select.Option>
                        <Select.Option value={2}>Không hợp lệ</Select.Option>
                      </Select>
                    </Form.Item>
                  </Form>
                  <span
                    onClick={() => fileUtils.saveAsFileFromLink(fileToUpload2?.name, hostFileUpload + dataResponse?.fileUrl)}
                    className={'export-file'}>
                    Xuất file
                  </span>
                </DividerRight>
              </DividerWrapper>
              : <Divider />
          }

          <Table
            bordered={false}
            dataSource={dataFiltered}
            columns={columns}
            rowKey={(record, index) => index}
            onChange={handleChangePagination}
            scroll={{ x: 1200 }}
            pagination={{
              current: pageIndex,
              pageSize: pageSize,
              total: dataFiltered?.totalCount,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50, 100],
            }} />
          <RowCenterDiv margin={'16px 0 0 0'}>
            <Button
              onClick={() => formTransferMultiple.submit()}
              disabled={
                !validatedData
              }
              type={'primary'}>
              Tạo yêu cầu
            </Button>
          </RowCenterDiv>
          
        </WhiteRoundedBox>
        <ConfirmInfoModal
          onSuccess={handleConfirm}
          arrConfirmInfo={arrConfirmInfo}
          onClose={() => setVisibleConfirm(false)}
          title={'Xác nhận chuyển tiền theo lô'}
          visible={visibleConfirm} />
      </TransferMultiplePageWrapper>
    </>
  )
}

TransferMultiplePage.propTypes = {}

export default inject('providerStore',
  'accountWalletStore',
  'commonStore',
  'accountWalletStore',
  'profileStore',
  'propertyStore',
  'bankStore',
  'orderStore')(observer(TransferMultiplePage))