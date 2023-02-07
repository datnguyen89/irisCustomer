import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Input, Modal, Tabs } from 'antd'
import validator from '../../validator'
import { RowCenterDiv } from '../CommonStyled/CommonStyled'

const RequireFieldsModal = props => {

  const [form1] = Form.useForm()
  const [form2] = Form.useForm()
  const [form3] = Form.useForm()

  const {
    visible,
    requireField,
    requireFieldBankAccount,
    bankLinkType,
    onClose,
    onSuccess,
  } = props

  const [formRequireFieldsModal] = Form.useForm()

  const handleCancel = () => {
    onClose()
    formRequireFieldsModal.resetFields
  }
  const handleSubmit = (e) => {
    onSuccess(e)
    formRequireFieldsModal.resetFields
  }

  const renderContentDependBankLinkType = () => {
    switch (bankLinkType) {
      case 1:
        return (
          <Tabs defaultActiveKey='1'>
            {
              requireFieldBankAccount
              && requireFieldBankAccount?.length > 0 &&
              <Tabs.TabPane tab='Liên kết tài khoản' key='1'>
                <Form
                  form={form1}
                  labelAlign={'left'}
                  colon={false}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  onFinish={handleSubmit}
                >
                  {
                    requireFieldBankAccount?.map(item =>
                      <Form.Item
                        key={item}
                        rules={[
                          {
                            required: true,
                            message: item === 'BankAccount'
                              ? 'Vui lòng nhập số tài khoản'
                              : item === 'BankAccountName'
                                ? 'Vui lòng nhập tên chủ tài khoản'
                                : item === 'IssueDate'
                                  ? 'vui lòng nhập thời gian hiệu lực'
                                  : item === 'CustLegalID'
                                    ? 'Vui lòng nhập CMND/CCCD/Hộ chiếu'
                                    : ' ',
                          },
                          { validator: validator.validateTrim },
                        ]}
                        label={
                          item === 'BankAccount'
                            ? 'Số tài khoản'
                            : item === 'BankAccountName'
                              ? 'Chủ tài khoản'
                              : item === 'IssueDate'
                                ? 'Thời gian hiệu lực'
                                : item === 'CustLegalID'
                                  ? 'CMND/CCCD/Hộ chiếu'
                                  : ' '
                        }
                        name={item}
                      >
                        <Input maxLength={100} placeholder={'Nhập thông tin'} />
                      </Form.Item>,
                    )
                  }
                  <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                    <RowCenterDiv>
                      <Button type={'primary'} htmlType={'submit'}>Xác nhận</Button>
                    </RowCenterDiv>
                  </Form.Item>
                </Form>
              </Tabs.TabPane>
            }
            {
              requireField
              && requireField?.length > 0 &&
              <Tabs.TabPane tab='Liên kết thẻ' key='2'>
                <Form
                  form={form2}
                  labelAlign={'left'}
                  colon={false}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  onFinish={handleSubmit}
                >
                  {
                    requireField?.map(item =>
                      <Form.Item
                        key={item}
                        rules={[
                          {
                            required: true,
                            message: item === 'BankAccount'
                              ? 'Vui lòng nhập số tài khoản'
                              : item === 'BankAccountName'
                                ? 'Vui lòng nhập tên chủ tài khoản'
                                : item === 'IssueDate'
                                  ? 'vui lòng nhập thời gian hiệu lực'
                                  : item === 'CustLegalID'
                                    ? 'Vui lòng nhập CMND/CCCD/Hộ chiếu'
                                    : ' ',
                          },
                          { validator: validator.validateTrim },
                        ]}
                        label={
                          item === 'BankAccount'
                            ? 'Số tài khoản'
                            : item === 'BankAccountName'
                              ? 'Chủ tài khoản'
                              : item === 'IssueDate'
                                ? 'Thời gian hiệu lực'
                                : item === 'CustLegalID'
                                  ? 'CMND/CCCD/Hộ chiếu'
                                  : ' '
                        }
                        name={item}
                      >
                        <Input maxLength={100} placeholder={'Nhập thông tin'} />
                      </Form.Item>,
                    )
                  }
                  <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                    <RowCenterDiv>
                      <Button type={'primary'} htmlType={'submit'}>Xác nhận</Button>
                    </RowCenterDiv>
                  </Form.Item>
                </Form>
              </Tabs.TabPane>
            }
          </Tabs>
        )
      case 3:
        return (
          <Tabs defaultActiveKey='1'>
            <Tabs.TabPane tab='Liên kết tài khoản' key='1'>
              <Form
                form={form3}
                labelAlign={'left'}
                colon={false}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={handleSubmit}
              >
                {
                  requireFieldBankAccount
                  && requireFieldBankAccount?.length > 0
                  && requireFieldBankAccount?.map(item =>
                    <Form.Item
                      key={item}
                      rules={[
                        {
                          required: true,
                          message: item === 'BankAccount'
                            ? 'Vui lòng nhập số tài khoản'
                            : item === 'BankAccountName'
                              ? 'Vui lòng nhập tên chủ tài khoản'
                              : item === 'IssueDate'
                                ? 'vui lòng nhập thời gian hiệu lực'
                                : item === 'CustLegalID'
                                  ? 'Vui lòng nhập CMND/CCCD/Hộ chiếu'
                                  : ' ',
                        },
                        { validator: validator.validateTrim },
                      ]}
                      label={
                        item === 'BankAccount'
                          ? 'Số tài khoản'
                          : item === 'BankAccountName'
                            ? 'Chủ tài khoản'
                            : item === 'IssueDate'
                              ? 'Thời gian hiệu lực'
                              : item === 'CustLegalID'
                                ? 'CMND/CCCD/Hộ chiếu'
                                : ' '
                      }
                      name={item}
                    >
                      <Input maxLength={100} placeholder={'Nhập thông tin'} />
                    </Form.Item>,
                  )
                }
                <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                  <RowCenterDiv>
                    <Button type={'primary'} htmlType={'submit'}>Xác nhận</Button>
                  </RowCenterDiv>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        )
      default:
        return (
          <div>2</div>
        )
    }

  }

  return (
    <>
      <Modal
        width={600}
        title={'Nhập thông tin liên kết'}
        forceRender={true}
        visible={visible}
        footer={null}
        onCancel={handleCancel}
      >
        {
          renderContentDependBankLinkType()
        }
      </Modal>
    </>
  )
}

RequireFieldsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  bankLinkType: PropTypes.number,
  requireField: PropTypes.array,
  requireFieldBankAccount: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
}

export default RequireFieldsModal