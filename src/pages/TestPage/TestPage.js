import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import { TestPageWrapper } from './TestPageStyled'
import { Helmet } from 'react-helmet/es/Helmet'
import { useBeforeunload } from 'react-beforeunload'
import { useHistory } from 'react-router-dom'
import { Button, Col, Descriptions, Divider, Form, Input, Modal, notification, Progress, Row, Tabs } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import {
  ColorText,
  ColorTitleNoBg,
  RowCenterDiv,
  RowFlexEndDiv,
  RowSpaceBetweenDiv,
} from '../../components/CommonStyled/CommonStyled'
import {
  CLOSE_TEXT,
  ERROR_COLOR,
  ERROR_TITLE,
  INFO_COLOR,
  INFO_TITLE, LONG_DATE,
  PAGES, RESULT_TRANSACTION_TITLE,
  SUCCESS_COLOR,
  SUCCESS_TITLE,
  WARNING_COLOR,
  WARNING_TITLE,
} from '../../utils/constant'
import fileUtils from '../../utils/fileUtils'

import numberUtils from '../../utils/numberUtils'
import Divide from 'lodash-es/divide'
import CustomProgress from '../../components/CustomProgress'
import TransferMultiProgressModule from '../../components/TransferMultiProgressModule'
import {
  AmountInFigures,
  BodyPrintPage, DividerDotted, DividerSolid, DottedDiv,
  HeaderPrintPage, NoticeColumn, NoticeRow, OrderStatusDataInfo,
  PrintPageWrapper, PrintViewWrapper, ReportPrintStatementTable,
} from '../../components/PrintExecutionPdfModal/PrintExecutionPdfModalStyled'
import IMAGES from '../../images'
import dateUtils from '../../utils/dateUtils'
import MergeTable from "../../components/MergeTable";

const { TabPane } = Tabs

const TestPage = props => {
  // region props, hook, state =================
  const [tabActive, setTabActive] = useState('a')
  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================

  // endregion
  const { commonStore, testStore, authenticationStore } = props

  const { roles } = authenticationStore

  const history = useHistory()

  const [needPrompt, setNeedPrompt] = useState(false)

  // useEffect(() => {
  //   window.addEventListener('beforeunload', alertUser)
  //   window.addEventListener('unload', handleTabClosing)
  //   return () => {
  //     window.removeEventListener('beforeunload', alertUser)
  //     window.removeEventListener('unload', handleTabClosing)
  //   }
  // })
  //
  // const handleTabClosing = () => {
  // }
  //
  // const alertUser = (event) => {
  //   event.preventDefault()
  //   event.returnValue = ''
  // }

  useBeforeunload((event) => {
    if (needPrompt) {
      event.preventDefault()
    }
  })
  const handleModal = () => {
    Modal.confirm({
      className: 'custom-notice',
      width: 600,
      title: 'Kết quả giao dịch',
      okText: 'Giao dịch khác',
      cancelText: 'Về trang chủ',
      onOk: () => {
        console.log('OK')
      },
      onCancel: () => {
        history.push(PAGES.HOME.PATH)
      },
      content:
        <>
          <RowCenterDiv margin={'16px 0'}>
            <CheckCircleOutlined style={{ fontSize: 32, color: SUCCESS_COLOR }} />
            <ColorText fontSize={'1.6rem'} margin={'0 0 0 16px'} color={SUCCESS_COLOR}>
              Giao dịch thành côngGiao dịch thành côngGiao dịch thành côngGiao dịch thành công
            </ColorText>
          </RowCenterDiv>

          <Descriptions
            bordered
            column={1}
            labelStyle={{ width: '50%' }}
            contentStyle={{ width: '50%' }}
            size={'small'}>
            <Descriptions.Item label={'Số tiền'}><strong>100.000đ</strong></Descriptions.Item>
            <Descriptions.Item label={'Mã giao dịch'}>123</Descriptions.Item>
            <Descriptions.Item label={'Thời gian'}>25/03/2022 15:15</Descriptions.Item>
          </Descriptions>
        </>,
    })

    setTimeout(killModal, 2000)
  }

  const killModal = () => {
    Modal.destroyAll()
  }
  const killNoti = () => {
    notification.destroy()
  }

  const handleMessageError = () => {
    notification.error({
      message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
      description: 'Có lỗi xảy ra vui lòng liên hệ admin',
    })

    setTimeout(killNoti, 1000)
  }
  const handleMessageInfo = () => {
    notification.info({
      message: <ColorText fontSize={'20px'} color={INFO_COLOR}>{INFO_TITLE}</ColorText>,
      description: 'Có lỗi xảy ra vui lòng liên hệ admin',
    })
  }
  const handleMessageSuccess = () => {
    notification.success({
      message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
      description: 'Success',
    })
  }

  const handleMessageWarning = () => {
    notification.warning({
      message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
      description: 'Có lỗi xảy ra vui lòng liên hệ admin',
    })
  }
  const handleMessageBug = () => {
    testStore.testRq()
  }

  const exportFile = () => {
    const data = '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'
    fileUtils.saveAsFile('test', data)
  }

  const showTransferMulti = () => {
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
              Ghi nhận yêu cầu chuyển tiền theo lô thành công
            </ColorText>
          </RowCenterDiv>
          <Descriptions
            bordered
            column={1}
            labelStyle={{ width: '50%' }}
            contentStyle={{ width: '50%' }}
            size={'small'}>
            <Descriptions.Item label={'Tổng số tiền'}>
              <RowFlexEndDiv>
                <strong>
                  100.000đ
                </strong>
              </RowFlexEndDiv>
            </Descriptions.Item>
            <Descriptions.Item label={'Số yêu cầu chuyển'}>
              <RowFlexEndDiv>
                100
              </RowFlexEndDiv>
            </Descriptions.Item>
          </Descriptions>
          <TransferMultiProgressModule
            totalCount={200}
            totalAmount={200000}
            waitingCount={180}
            waitingAmount={200000}
            unknownCount={20}
            unknownAmount={0}
            successCount={0}
            successAmount={0}
            errorCount={0}
            errorAmount={0}
          />


        </>,
    })
  }
  const logout = () => {
    authenticationStore.logout()
      .finally(() => {
        history.push({
          pathname: PAGES.LOGIN.PATH,
          state: { from: window.location.pathname },
        })
      })
  }
  const onChangeTabs = (e) => {
    console.log(e)
    setTabActive(e)
  }

  const onFinishFormTabs = (e) => {
    console.log(e)
  }
  const onFinishFailedFormTabs = (e) => {
    console.log(e.errorFields[0]?.name[0])
    const errorField = e.errorFields[0]?.name[0]
    const tabError = errorField.split('_')[0]
    if (tabError) {
      setTabActive(tabError)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`a\nb`)
  }

  return (
    <>
      <Helmet>
        <title>Test</title>
      </Helmet>
      <TestPageWrapper>
        <div>a{`\u2264`}b</div>
        <Button onClick={handleCopy}>Copy</Button>
        <p>Prompt {needPrompt ? 'yes' : 'no'}</p>
        <br />
        <br />
        <br />
        <MergeTable />
        <br />
        <br />
        <br />
        <div>{numberUtils.thousandSeparator(122222.035444)}</div>
        <div>{(122222.035444).toLocaleString('vi')}</div>
        <Button onClick={() => setNeedPrompt(!needPrompt)}>Need Prompt</Button>
        <Button onClick={handleModal}>Modal</Button>
        <Button onClick={handleMessageError}>ERROR</Button>
        <Button onClick={handleMessageWarning}>WARNING</Button>
        <Button onClick={handleMessageSuccess}>SUCCESS</Button>
        <Button onClick={handleMessageInfo}>INFO</Button>

        <Button onClick={() => notification.destroy()}>Kill noti</Button>
        <Button onClick={() => Modal.destroyAll()}>Kill modal</Button>
        <Button onClick={handleMessageBug}>Bug</Button>
        <Button onClick={exportFile}>Export</Button>
        <Button>Update Ability</Button>
        <Button onClick={showTransferMulti}>Transfer Multi</Button>
        <Button onClick={logout}>Logout</Button>

        <br />
        <br />

        <Form
          onFinishFailed={onFinishFailedFormTabs}
          onFinish={onFinishFormTabs}
        >
          <Tabs activeKey={tabActive} onChange={onChangeTabs}>
            <TabPane tab='Tab 1' key='a'>
              <Form.Item
                rules={[
                  { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                ]}
                name={'a_userName'}
                label={'Tên đăng nhập'}>
                <Input />
              </Form.Item>
            </TabPane>
            <TabPane tab='Tab 2' key='b'>
              <Form.Item
                name={'b_email'}
                label={'Email'}>
                <Input />
              </Form.Item>
            </TabPane>
            <TabPane tab='Tab 3' key='c'>
              <Form.Item
                name={'c_phoneNumber'}
                label={'Điện thoại'}>
                <Input />
              </Form.Item>
              <Button htmlType={'submit'}>OK</Button>
            </TabPane>
          </Tabs>
        </Form>

        <PrintViewWrapper>
          <PrintPageWrapper>
            <HeaderPrintPage>
              <img src={IMAGES.REPORT_STATEMENT_MOBI_LOGO} alt={''} height={32} />
              <ColorTitleNoBg textAlign={'center'} color={'#333'}>LỆNH CHI<br />PAYMENT ORDER</ColorTitleNoBg>
              <ColorText className={'datePrint'}>
                <span style={{ marginRight: 40 }}>Số/No.: xxxx </span>
                <span>Ngày/Date: 19-JUL-22</span>
              </ColorText>
            </HeaderPrintPage>
            <BodyPrintPage>
              <RowCenterDiv margin={'16px 16px 0 16px'}>
                <div style={{ minWidth: 165 }}>Tên đơn vị chuyển/Payer:</div>
                <DottedDiv>
                  xxx
                </DottedDiv>
              </RowCenterDiv>
              <RowCenterDiv margin={'0 16px 16px 16px'}>
                <div style={{ minWidth: 165 }}>Tài khoản nợ/Debit A/C:</div>
                <DottedDiv>
                  xxx
                </DottedDiv>
              </RowCenterDiv>
              <DividerSolid />
              <RowSpaceBetweenDiv margin={'16px'}>
                <div>
                  <div>Số tiền bằng chữ/Amount in words:</div>
                  <strong>{numberUtils.currencyToText(206775906)}</strong>
                </div>
                <AmountInFigures>
                  <div>Số tiền bằng số/Amount in figures:</div>
                  <strong>{numberUtils.thousandSeparator(206775906)} VND</strong>
                </AmountInFigures>
              </RowSpaceBetweenDiv>
              <DividerSolid />
              <RowCenterDiv margin={'16px 16px 0 16px'}>
                <div style={{ minWidth: 165 }}>Tên đơn vị nhận/Payer:</div>
                <DottedDiv>
                  xxx
                </DottedDiv>
              </RowCenterDiv>
              <RowCenterDiv margin={'0 16px 0 16px'}>
                <div style={{ minWidth: 165 }}>Tài khoản có/Debit A/C:</div>
                <DottedDiv>
                  xxx
                </DottedDiv>
              </RowCenterDiv>
              <RowCenterDiv margin={'0 16px 16px 16px'}>
                <div style={{ minWidth: 165 }}>Nội dung/Remarks:</div>
                <DottedDiv>

                </DottedDiv>
              </RowCenterDiv>
              <DividerSolid />
              <RowFlexEndDiv margin={'16px'}>
                <div style={{ minWidth: 400 }}>
                  Ngày hạch toán/Accounting date:
                </div>
              </RowFlexEndDiv>
              <RowSpaceBetweenDiv margin={'16px'}>
                <OrderStatusDataInfo>
                  Người tạo lệnh
                  <br />
                  <br />
                  Lê Thị Ly
                </OrderStatusDataInfo>
                <OrderStatusDataInfo>
                  Người kiểm soát
                  <br />
                  <br />
                  Lê Thị Ly
                </OrderStatusDataInfo>
                <OrderStatusDataInfo>
                  Người kiểm duyệt
                  <br />
                  <br />
                  Lê Thị Ly
                </OrderStatusDataInfo>
              </RowSpaceBetweenDiv>
            </BodyPrintPage>
          </PrintPageWrapper>
        </PrintViewWrapper>



      </TestPageWrapper>

    </>

  )
}

TestPage.propTypes = {}

export default inject('commonStore', 'testStore', 'authenticationStore')(observer(TestPage))