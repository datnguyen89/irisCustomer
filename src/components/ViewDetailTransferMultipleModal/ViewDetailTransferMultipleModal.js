import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFileExcel, faPhoneVolume } from '@fortawesome/free-solid-svg-icons'
import { ViewDetailTransferMultipleModalWrapper } from './ViewDetailTransferMultipleModalStyled'
import { Modal, Space, Table } from 'antd'
import { EXECUTION_ORDER_STATUS, RESPONSE_CODE } from '../../utils/constant'
import { DividerLeft, DividerRight, DividerWrapper } from '../../pages/TransferMultiplePage/TransferMultiplePageStyled'
import numberUtils from '../../utils/numberUtils'
import fileUtils from '../../utils/fileUtils'
import ExecutionStatusTag from '../ExecutionStatusTag'

const ViewDetailTransferMultipleModal = props => {
  // region props, hook, state =================
  const {
    visible,
    onCancel,
    executionView,
    orderStore,
    commonStore,
    propertyStore,
    profileStore,
  } = props
  const [resData, setResData] = useState(null)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  // endregion
  // region destructuring ======================
  const { hostFileUpload } = propertyStore
  const { appTheme } = commonStore
  const { entUserFullName } = profileStore
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
      title: 'Loại TK',
      render: record => record.transferAccountType,
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
      title: 'Số tiền',
      render: record => numberUtils.thousandSeparator(record.amount),
    },
    {
      title: 'Nội dung chuyển tiền',
      render: record => record.description,
    },
    {
      title: 'Kết quả',
      align: 'center',
      render: record => (
        <ExecutionStatusTag
          executionStatus={record?.executionStatus}
          executionStatusDescription={record?.executionStatusDescription} />
      ),
    },
  ]

  // endregion
  // region function handle logic ==============
  const handleChangePagination = (pagination) => {
    if (pageSize !== pagination.pageSize) {
      setPageIndex(1)
      setPageSize(pagination.pageSize)
    } else {
      setPageIndex(pagination.current)
    }
  }
  const handleCancel = () => {
    setResData(null)
    setPageIndex(1)
    setPageSize(10)
    onCancel()
  }
  const handleExportFileResult = () => {
    let payload = { executionID: executionView.executionID }
    orderStore.getTransferMultiResult(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          fileUtils.saveAsFile(res?.fileName, res?.fileData)
        }
      })
  }
  const handleExportFilePdf = () => {
    let payload = {
      executionID: executionView.executionID,
      creator: entUserFullName,
    }
    orderStore.getTransferMultiPDF(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          fileUtils.printFromPdfBase64(res?.fileData)
        }
      })
  }

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    if (!visible) return
    if (!executionView) return
    let payload = {
      executionID: executionView?.executionID,
    }
    orderStore.getTransferMultiExecutionDetail(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          setResData(res)
        }
      })
  }, [visible, executionView])

  // endregion

  return (
    <ViewDetailTransferMultipleModalWrapper>
      <Modal
        className={'transfer-multiple-modal'}
        width={'80%'}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        title={'Chi tiết File chuyển tiền'}
      >
        <DividerWrapper>
          <DividerLeft color={appTheme.solidColor}>
            <span className={'text'}>Số lượng</span>
            <span className={'value'}>{resData?.totalCount || 0}</span>
            <span className={'text'}>Tổng tiền</span>
            <span className={'value'}>{numberUtils.thousandSeparator(resData?.totalAmount)} VND</span>
          </DividerLeft>
          <DividerRight color={appTheme.solidColor}>
            {
              executionView?.orderStatus === EXECUTION_ORDER_STATUS.APPROVED
                ?
                <Space size={'middle'}>
                  <FontAwesomeIcon
                    icon={faFileExcel}
                    style={{ cursor: 'pointer' }}
                    color={'#107C41'}
                    fontSize={18}
                    onClick={handleExportFileResult} />
                  <FontAwesomeIcon
                    icon={faFilePdf}
                    style={{ cursor: 'pointer' }}
                    color={'#B50B05'}
                    fontSize={18}
                    onClick={handleExportFilePdf} />
                </Space>
                :
                <FontAwesomeIcon
                  icon={faFileExcel}
                  onClick={() => fileUtils.saveAsFileFromLink(resData?.fileName, hostFileUpload + resData?.fileUrl)} />
            }

          </DividerRight>
        </DividerWrapper>
        <Table
          bordered={false}
          dataSource={resData?.param}
          columns={columns}
          rowKey={(record) => record?.executionItemID}
          onChange={handleChangePagination}
          scroll={{ x: 1200 }}
          pagination={{
            current: pageIndex,
            pageSize: pageSize,
            total: resData?.totalCount,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }} />
      </Modal>
    </ViewDetailTransferMultipleModalWrapper>
  )
}

ViewDetailTransferMultipleModal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  executionView: PropTypes.object,
}

export default inject('orderStore', 'commonStore', 'propertyStore', 'profileStore')(observer(ViewDetailTransferMultipleModal))