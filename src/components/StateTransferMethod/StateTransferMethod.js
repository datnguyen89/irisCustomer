import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  AreaButton,
  ImageCustom,
  ResultTable, SpanStatus, SpanValue,
  StateInformation,
  StateInformationExport,
  StateInformationText, StateTransferMethodContent,
  StateTransferMethodWrapper,
} from './StateTransferMethodStyled'
import { Button, Pagination, Space, Table } from 'antd'
import { PaginationLabel, RowSpaceBetweenDiv } from '../CommonStyled/CommonStyled'
import { AreaContractData } from '../Contract/ContractStyled'
import { ButtonConfirm, FilterTransferMethodWrapper } from '../FilterTransferMethod/FilterTransferMethodStyled'
import ConfirmModal from '../ConfirmModal'
import OtpModal from '../OtpModal'
import SuccessModal from '../SuccessModal'
import IMAGES from '../../images'

const StateTransferMethod = props => {

  const dataContract = [
    {
      id: '1',
      key: '1',
      receivednumbercard: '970420*******1234',
      owneracc: 'NGUYEN VAN A',
      countmoney: '18.000.000đ',
      contentpaymoney: 'Thanh toán lương T9/2021',
      fee: '0đ',
      error: 'Sai tài khoản',
      status: 1,
    },
    {
      id: '2',
      key: '2',
      receivednumbercard: '970420*******1234',
      owneracc: 'NGUYEN VAN A',
      countmoney: '18.000.000đ',
      contentpaymoney: 'Thanh toán lương T9/2021',
      fee: '0đ',
      error: 'Sai tài khoản',
      status: 0,
    },
    {
      id: '3',
      key: '3',
      receivednumbercard: '970420*******1234',
      owneracc: 'NGUYEN VAN A',
      countmoney: '18.000.000đ',
      contentpaymoney: 'Thanh toán lương T9/2021',
      fee: '0đ',
      error: 'Sai tài khoản',
      status: 0,
    },
    {
      id: '4',
      key: '4',
      receivednumbercard: '970420*******1234',
      owneracc: 'NGUYEN VAN A',
      countmoney: '18.000.000đ',
      contentpaymoney: 'Thanh toán lương T9/2021',
      fee: '0đ',
      error: 'Sai tài khoản',
      status: 0,
    },
    {
      id: '5',
      key: '5',
      receivednumbercard: '970420*******1234',
      owneracc: 'NGUYEN VAN A',
      countmoney: '18.000.000đ',
      contentpaymoney: 'Thanh toán lương T9/2021',
      fee: '0đ',
      error: 'Sai tài khoản',
      status: 1,
    },
  ]
  const columns = [
    {
      title: 'STT',
      render: (text, row, index) => (
        <span>{(index+1)}</span>
      )
    },
    {
      title: 'SỐ TK NHẬN',
      dataIndex: 'receivednumbercard',
      key: 'receivednumbercard',
    },
    {
      title: 'TÊN TÀI KHOẢN NHẬN',
      dataIndex: 'owneracc',
      key: 'owneracc',
    },
    {
      title: 'SỐ TIỀN',
      dataIndex: 'countmoney',
      key: 'countmoney',
    },
    {
      title: 'NỘI DUNG CHUYỂN TIỀN',
      dataIndex: 'contentpaymoney',
      key: 'contentpaymoney',
    },
    {
      title: 'PHÍ GIAO DỊCH',
      dataIndex: 'fee',
      key: 'fee',
    },
    {
      title: 'LỖI',
      render: (text, row, index) => (
        <div>
          {
            (row.status) ?
                <span><ImageCustom src={IMAGES.SUCCESSFUL_ICON_TRANSFER} width="20px" height="20px"/> <SpanStatus>{row.error}</SpanStatus></span>:
              <span><ImageCustom src={IMAGES.ERROR_ICON_TRANSFER} /> <SpanStatus>{row.error}</SpanStatus></span>
          }
        </div>
      ),
    },
  ]
  const { Column } = Table


  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [visibleOTP, setVisibleOTP] = useState(false)
  const [visibleSuccess, setVisibleSuccess] = useState(false)
  const handleCancel = () => {
    setVisibleConfirm(false)
  }
  const handleCancelTrue = () => {
    console.log('bỏ liên kết thành công')
    setVisibleConfirm(false)
    setVisibleOTP(true)
  }
  const confirm = () => {
    setVisibleConfirm(true)
  }
  const handleCallbackOTP = (otp) => {
    console.log(otp)
    setVisibleOTP(false)
    setVisibleSuccess(true)
  }

  return (
    <StateTransferMethodWrapper>
      <StateTransferMethodContent>
        <StateInformation>
          <StateInformationText>
            <span>Số lượng: </span><SpanValue>50</SpanValue><span>Tổng tiền: </span><SpanValue>5.000.000.000
            VND</SpanValue>
          </StateInformationText>
          <StateInformationExport>
            <span>Xuất file</span>
          </StateInformationExport>
        </StateInformation>
        <ResultTable
          dataSource={dataContract}
          columns={columns}
          pagination={false}
          bordered={false}>
        </ResultTable>
        <RowSpaceBetweenDiv margin={'16px 0'}>
          <PaginationLabel>
            Hiển thị 5 trên tổng số 50 bản ghi
          </PaginationLabel>
          <Pagination total={50} />
        </RowSpaceBetweenDiv>
      </StateTransferMethodContent>
      <AreaButton>
        <Button type="default">Quay lại</Button>
        <Button type="primary" onClick={confirm}>Tạo yêu cầu</Button>
      </AreaButton>
      <ConfirmModal
        visible={visibleConfirm}
        onCancel={handleCancel}
        callbackConfirm={handleCancelTrue}
        description={'Quý khách có chắc chắn muốn lưu yêu cầu vừa tạo ?'} />
      <OtpModal
        visible={visibleOTP}
        callbackOtp={handleCallbackOTP}
        onCancel={() => setVisibleOTP((false))}
        phoneNumber={'123456789'} />
      <SuccessModal
        visible={visibleSuccess}
        callbackSuccess={() => setVisibleSuccess(false)}
        description={'Bạn đã lập yêu cầu thành công'} />
    </StateTransferMethodWrapper>
  )
}

StateTransferMethod.propTypes = {}

export default StateTransferMethod