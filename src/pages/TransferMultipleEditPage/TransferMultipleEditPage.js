import React, { useEffect, useRef, useState } from 'react'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  BREADCRUMB_DATA,
  ERROR_COLOR,
  ERROR_TITLE, PAGES,
  RESPONSE_CODE,
  SUCCESS_COLOR,
  SUCCESS_TITLE, VALIDATE_STATUS,
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
  TransferMultipleEditPageWrapper,
  UploadAreaWrapper,
  ValidateTemplateText,
  VerifyButton,
} from './TransferMultipleEditPageStyled'
import { TitleInfoService } from '../TransferWalletPage/TransferWalletPageStyled'
import { Button, Col, Divider, Form, Modal, notification, Row, Select, Table } from 'antd'
import AccountSelectBox from '../../components/AccountSelectBox/AccountSelectBox'
import ICONS from '../../icons'
import UploadModule from '../../components/UploadModule'
import numberUtils from '../../utils/numberUtils'
import ConfirmInfoModal from '../../components/ConfirmInfoModal'
import { Link, useHistory } from 'react-router-dom'
import { toJS } from 'mobx'
import fileUtils from '../../utils/fileUtils'
import {
  BankLinkedSelectBoxWrapper, NoLinkedBank, NoLinkedBankText,
  NoLinkedBankWrapper,
} from '../../components/BankLinkedSelectBox/BankLinkedSelectBoxStyled'
import { WarningOutlined } from '@ant-design/icons'

const TransferMultipleEditPage = props => {
  // region props, hook, state =================
  const {
    commonStore,
    orderStore,
    propertyStore,
    accountWalletStore,
    profileStore,
    bankStore,
  } = props

  const { listLinkedBanks } = bankStore

  const [formTransferMultiple] = Form.useForm()
  const [formFilter] = Form.useForm()
  const uploadRef = useRef()
  const history = useHistory()
  const [fileToUpload2, setFileToUpload2] = useState(null)
  const [fileToPreview2, setFileToPreview2] = useState(null)
  const [fileBase642, setFileBase642] = useState(null)
  const [isUpdatedFile, setIsUpdatedFile] = useState(false)
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
  const { entProfile } = profileStore
  const { commonProperty, hostFileUpload } = propertyStore
  const { appTheme } = commonStore
  const { editingExecution } = orderStore
  const { selectedAccountWallets, accountWallets } = accountWalletStore
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
      title: 'S??? TK nh???n',
      render: record => record.relatedUser,
    },
    {
      title: 'T??n TK nh???n',
      render: record => record.relatedFullName,
    },
    {
      title: 'Lo???i TK',
      render: record => record.transferAccountType,
    },
    {
      title: 'S??? ti???n',
      render: record => numberUtils.thousandSeparator(record.amount),
    },
    {
      title: 'N???i dung chuy???n ti???n',
      render: record => record.description,
    },
    {
      title: 'Tr???ng th??i',
      render: record => renderStatusColumn(record.validateStatus, record.validateDescription),
    },
  ]

  // endregion
  // region function handle logic ==============
  const handleSubmitTransferMultiple = (e) => {
    notification.destroy()

    if (!fileToUpload2 && isUpdatedFile) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: 'Vui l??ng upload file danh s??ch chuy???n ti???n',
      })
      return
    }
    if (!validatedData) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: 'Vui l??ng ???n ki???m tra file',
      })
      return
    }

    const renderTransferMultiTypeName = (value) => {
      return commonProperty?.transferMultiType?.find(item => item.value === value)?.name || ''
    }

    let infos = [
      {
        name: 'T??i kho???n v??',
        value: selectedAccountWallets?.accountName,
      },
      {
        name: 'T??n t??i kho???n v??',
        value: entProfile?.businessName,
      },
      {
        name: 'Th??ng chi',
        value: `Th??ng ${e?.paymentMonth}`,
      },
      {
        name: 'H??nh th???c',
        value: renderTransferMultiTypeName(e?.transferMultiType),
      },
      {
        name: 'File chuy???n ti???n',
        value: fileToUpload2?.name?.length > 0 ? fileToUpload2?.name : JSON.parse(editingExecution?.executionData)?.TransferMultiInfo?.FileName,
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
      fileName: fileToUpload2?.name || JSON.parse(editingExecution?.executionData)?.TransferMultiInfo?.FileName,
      fileUrl: dataResponse?.fileUrl || JSON.parse(editingExecution?.executionData)?.TransferMultiInfo?.FileUrl,
      month: formCollection?.paymentMonth,
      transferMultiType: JSON.parse(editingExecution?.executionData)?.TransferMultiInfo?.TransferMultiType,
      executionID: Number(editingExecution?.executionID),
      accountNumber: selectedAccountWallets?.accountName,
      accountName: entProfile?.businessName,
    }
    if (warningRecord) {
      Modal.confirm({
        className: 'custom-notice',
        width: 600,
        title: 'C???nh b??o',
        okText: 'S???a y??u c???u',
        cancelText: 'H???y',
        onOk: () => {
          processUpdateExecution(payload)
        },
        onCancel: () => {
        },
        content:
          <RowCenterDiv>
            L??u ?? File chuy???n ti???n c?? c???nh b??o. Qu?? kh??ch c?? mu???n ti???p t???c t???o y??u c???u
          </RowCenterDiv>,
      })
    } else {
      processUpdateExecution(payload)
    }

  }
  const processUpdateExecution = (payload) => {
    orderStore.updateTransferMultiExecution(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          notification.success({
            message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
            description: res?.description,
          })
          setVisibleConfirm(false)
          clearData()
          uploadRef.current.resetFile()
          history.push(PAGES.TRANSACTION_MANAGE.PATH)
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
            description: 'Vui l??ng upload file danh s??ch chuy???n ti???n',
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
  // region function render ====================

  // endregion
  // region side effect ========================

  useEffect(() => {
    if (!editingExecution) {
      history.push(PAGES.TRANSACTION_MANAGE.PATH)
      return
    } else {
      formTransferMultiple.setFieldsValue({
        transferMultiType: JSON.parse(editingExecution?.executionData)?.TransferMultiInfo?.TransferMultiType,
        paymentMonth: JSON.parse(editingExecution?.executionData)?.TransferMultiInfo?.Month,
      })
      let payload = {
        executionID: editingExecution?.executionID,
      }
      console.log('=================', toJS(editingExecution))
      orderStore.getTransferMultiExecutionDetail(payload)
        .then(res => {
          if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
            setDataFiltered(res?.param)
            let dataRes = {
              param: res?.param,
            }
            setDataResponse(dataRes)
          }
          setTotalAmountFiltered(res?.totalAmount)
          setTotalCountFiltered(res?.totalCount)
          setValidatedData(true)
          formFilter.setFieldsValue({
            filterStatus: 99,
          })
        })
    }
  }, [editingExecution])
  useEffect(() => {
    return () => {
      clearData()
      orderStore.resetEditingExecution()
    }
  }, [])
  // endregion

  return (
    <>
      <Helmet>
        <title>Chuy???n ti???n theo l??</title>
      </Helmet>
      <TransferMultipleEditPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.TRANSFER_MULTIPLE} />
        <WhiteRoundedBox>
          <TitleInfoService>Th??ng tin chuy???n ti???n</TitleInfoService>
          <Form
            scrollToFirstError={true}
            size={'large'}
            onFinish={handleSubmitTransferMultiple}
            form={formTransferMultiple}>
            <Row justify={'center'}>
              <Col xxl={12} xl={12} lg={18} md={20} sm={24} xs={24}>
                <AccountSelectBox />
                <Form.Item
                  rules={[{ required: true, message: 'Vui l??ng ch???n h??nh th???c' }]}
                  name={'transferMultiType'}>
                  <Select
                    disabled
                    placeholder={'H??nh th???c'}>
                    {
                      commonProperty?.transferMultiType?.length > 0 && commonProperty?.transferMultiType?.map(item =>
                        <Select.Option value={item?.value} key={item?.value}>{item?.name}</Select.Option>,
                      )
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  rules={[{ required: true, message: 'Vui l??ng ch???n th??ng chi' }]}
                  name={'paymentMonth'}>
                  <Select placeholder={'Th??ng chi'}>
                    <Select.Option value={1}>Th??ng 1</Select.Option>
                    <Select.Option value={2}>Th??ng 2</Select.Option>
                    <Select.Option value={3}>Th??ng 3</Select.Option>
                    <Select.Option value={4}>Th??ng 4</Select.Option>
                    <Select.Option value={5}>Th??ng 5</Select.Option>
                    <Select.Option value={6}>Th??ng 6</Select.Option>
                    <Select.Option value={7}>Th??ng 7</Select.Option>
                    <Select.Option value={8}>Th??ng 8</Select.Option>
                    <Select.Option value={9}>Th??ng 9</Select.Option>
                    <Select.Option value={10}>Th??ng 10</Select.Option>
                    <Select.Option value={11}>Th??ng 11</Select.Option>
                    <Select.Option value={12}>Th??ng 12</Select.Option>
                  </Select>
                </Form.Item>
                <Row gutter={[16, 16]}>
                  <Col xxl={5} xl={5} lg={5} md={5} sm={5} xs={24}>
                    <a href={process.env.PUBLIC_URL + `/TemplateV2.xlsx`}>
                      <DownloadTemplateFile borderColor={appTheme.solidColor}>
                        <img src={ICONS.TRANSFER_MULTI_DOWNLOAD} alt={''} />
                        <DownloadTemplateText color={appTheme.solidColor}>
                          T???i file m???u
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
                                : `Upload File Danh S??ch`
                            }
                          </TitleUploadFile>
                          <TextUploadFile color={appTheme.solidColor}>
                            <span style={{ marginRight: 4 }}>Ch???n file</span>
                            ho???c k??o th??? file v??o ????y
                          </TextUploadFile>
                        </UploadAreaWrapper>
                      }
                      onRemove={handleRemoveFile}
                      callbackFile={e => {
                        notification.destroy()
                        setIsUpdatedFile(true)
                        setValidatedData(false)
                        setDataFiltered(null)
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
                        Ki???m tra file
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
                  <span className={'text'}>S??? l?????ng</span>
                  <span className={'value'}>{numberUtils.thousandSeparator(totalCountFiltered) || 0}</span>
                  <span className={'text'}>T???ng ti???n</span>
                  <span className={'value'}>{numberUtils.thousandSeparator(totalAmountFiltered)} VND</span>
                </DividerLeft>
                <DividerRight color={appTheme.solidColor}>
                  <Form form={formFilter}>
                    <Form.Item
                      name={'filterStatus'}
                      noStyle
                    >
                      <Select onChange={handleFilterStatus} style={{ width: 140 }}>
                        <Select.Option value={99}>T???t c???</Select.Option>
                        <Select.Option value={0}>H???p l???</Select.Option>
                        <Select.Option value={1}>C???nh b??o</Select.Option>
                        <Select.Option value={2}>Kh??ng h???p l???</Select.Option>
                      </Select>
                    </Form.Item>
                  </Form>
                  <a
                    onClick={() => fileUtils.saveAsFileFromLink('Template', hostFileUpload + dataResponse?.fileUrl)}
                    download={fileToUpload2?.name}
                    className={'export-file'}
                  >
                    Xu???t file
                  </a>
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
              total: dataResponse?.totalCount,
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
              S???a y??u c???u
            </Button>
          </RowCenterDiv>
        </WhiteRoundedBox>
        <ConfirmInfoModal
          onSuccess={handleConfirm}
          arrConfirmInfo={arrConfirmInfo}
          onClose={() => setVisibleConfirm(false)}
          title={'X??c nh???n chuy???n ti???n theo l??'}
          visible={visibleConfirm} />
      </TransferMultipleEditPageWrapper>
    </>
  )
}

TransferMultipleEditPage.propTypes = {}

export default inject('providerStore',
  'accountWalletStore',
  'commonStore',
  'accountWalletStore',
  'profileStore',
  'propertyStore',
  'bankStore',
  'orderStore')(observer(TransferMultipleEditPage))