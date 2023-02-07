import React, { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'
import { message, Upload } from 'antd'
import { CloudUploadOutlined } from '@ant-design/icons'
import { UploadModuleWrapper } from './UploadModuleStyled'
import fileUtils from '../../utils/fileUtils'

const UploadModule = forwardRef((props, ref) => {
  // region props, hook, state =================
  const {
    callbackFile,
    callbackFileBase64,
    callbackFileSrcPreview,
    uploadButton,
    onRemove,
  } = props
  const [files, setFiles] = useState([])

  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  useImperativeHandle(ref, () => ({
    resetFile() {
      setFiles([])
    },
  }))
  const handleBeforeUpload = (file) => {
    if (file) {
      console.log('type', file.type)
      const acceptType = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ]
      let isAcceptType = acceptType.includes(file.type)
      if (!isAcceptType) {
        message.error('Vui lòng chọn file định dạng xlsx')
        return
      }
      if (file.size > 5242880) {
        message.error('Dung lượng file phải nhỏ hơn 5MB')
        return
      }
      setFiles([file])

      const objectUrl = URL.createObjectURL(file)
      callbackFile(file)
      callbackFileSrcPreview(objectUrl)
      fileUtils.getBase64(file, res => {
        callbackFileBase64(res)
      })
    }

    return false
  }
  const handleRemove = () => {
    setFiles([])
    onRemove()
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================

  // endregion

  return (
    <UploadModuleWrapper>
      <Upload
        onRemove={handleRemove}
        fileList={files}
        style={{ width: '100%', height: '100%' }}
        beforeUpload={handleBeforeUpload}
      >
        {uploadButton ? uploadButton : <CloudUploadOutlined />}
      </Upload>
    </UploadModuleWrapper>
  )
})

UploadModule.propTypes = {
  callbackFile: PropTypes.func.isRequired,
  callbackFileBase64: PropTypes.func.isRequired,
  callbackFileSrcPreview: PropTypes.func.isRequired,
  uploadButton: PropTypes.node,
  onRemove: PropTypes.func,
}

export default UploadModule