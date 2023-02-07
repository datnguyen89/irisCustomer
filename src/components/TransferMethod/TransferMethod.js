import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  BottomTransferMethod,
  TopTransferMethod, TopTransferMethodLeftArea, TopTransferMethodRightArea,
  TransferMethodWrapper, UploadCustom, WidgetItemTransferMethod,
} from './TransferMethodStyled'
import { message, notification } from 'antd'
import IMAGES from '../../images'
import { ColorText } from '../CommonStyled/CommonStyled'
import { ERROR_COLOR, ERROR_TITLE } from '../../utils/constant'

const TransferMethod = props => {
  const [fileUpload, uploadFile] = useState(null)
  const [nameFileUpload, setNameFileUpload] = useState('')

  const handleBeforeUpload = (file) => {
    // todo: validate format file
    if (!(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel')) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: 'File danh sách phải có định dạng Excel',
      })

    } else {
      uploadFile([file])
      setNameFileUpload(file.name)
    }
    return false
  }

  useEffect(() => {
    // console.log(fileUpload);
    // console.log(nameFileUpload);
    // todo: api for upload file
  }, [fileUpload])

  return (
    <TransferMethodWrapper>
      <WidgetItemTransferMethod>
        <TopTransferMethod>
          <TopTransferMethodLeftArea>
            <img src={IMAGES.LOGO_ACCOUNT_TRANSFER_MONEY}
                 height={52}
                 width={52}
                 alt='logo account transfer money' />
          </TopTransferMethodLeftArea>
          <TopTransferMethodRightArea>
            <h5>1234567890</h5>
            <h1>10.830.536.500 vnd</h1>
          </TopTransferMethodRightArea>
        </TopTransferMethod>
        <BottomTransferMethod>Từ tài khoản</BottomTransferMethod>
      </WidgetItemTransferMethod>
      <WidgetItemTransferMethod>
        <TopTransferMethod>
          <img src={IMAGES.LOGO_ICON_DOWNLOAD_FILE}
               alt='icon download file' />
        </TopTransferMethod>
        <BottomTransferMethod>Tải file mẫu</BottomTransferMethod>
      </WidgetItemTransferMethod>
      <WidgetItemTransferMethod>
        <TopTransferMethod>
          <UploadCustom beforeUpload={handleBeforeUpload}>
            <img src={IMAGES.LOGO_ICON_UPLOAD_FILE}
                 alt='icon upload file' />
            <span>
                *Quý khách chuyển tiền theo danh sách bằng cách upload thông tin giao dịch dưới dạng file Excel theo mẫu của MobiFone. Giới hạn tối đa 100 giao dịch/lần chuyển
              </span>
          </UploadCustom>
        </TopTransferMethod>
        <BottomTransferMethod
          className='bg-yellow'>{nameFileUpload === '' ? 'Upload file danh sách' : nameFileUpload}</BottomTransferMethod>
      </WidgetItemTransferMethod>
    </TransferMethodWrapper>
  )
}

TransferMethod.propTypes = {}

export default TransferMethod