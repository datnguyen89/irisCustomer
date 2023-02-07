import React from 'react'
import { inject, observer } from 'mobx-react'
import { LoadingExportItem, LoadingExportPopUpWrapper, LoadingExportText } from './LoadingExportPopUpStyled'
import { Col, Modal, Row } from 'antd'
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons'
import { RowCenterDiv } from '../CommonStyled/CommonStyled'

const LoadingExportPopUp = props => {
  // region props, hook, state =================
  const { reportStore, commonStore } = props

  // endregion
  // region destructuring ======================
  const { appTheme } = commonStore
  const {
    exportDetailLoading,
    exportSumLoading,
    exportStatementLoading,
    exportStatementPdfLoading,
    sourceCancelDetail,
    sourceCancelSum,
    sourceCancelStatement,
    sourceCancelStatementPdf,
  } = reportStore
  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleClickCancelExportDetail = () => {
    Modal.confirm({
      className: 'custom-notice',
      width: 600,
      title: 'Cảnh báo',
      okText: 'Hủy xuất báo cáo',
      cancelText: 'Tiếp tục',
      onOk: () => {
        sourceCancelDetail.cancel()
        reportStore.setExportDetailLoading(false)
      },
      onCancel: () => {

      },
      content:
        <RowCenterDiv>
          Bạn chắc chắn muốn hủy xuất báo cáo chi tiết?
        </RowCenterDiv>,
    })
  }
  const handleClickCancelExportSum = () => {
    Modal.confirm({
      className: 'custom-notice',
      width: 600,
      title: 'Cảnh báo',
      okText: 'Hủy xuất báo cáo',
      cancelText: 'Tiếp tục',
      onOk: () => {
        sourceCancelSum.cancel()
        reportStore.setExportSumLoading(false)
      },
      onCancel: () => {

      },
      content:
        <RowCenterDiv>
          Bạn chắc chắn muốn hủy xuất báo cáo tổng hợp?
        </RowCenterDiv>,
    })
  }
  const handleClickCancelExportStatement = () => {
    Modal.confirm({
      className: 'custom-notice',
      width: 600,
      title: 'Cảnh báo',
      okText: 'Hủy xuất báo cáo',
      cancelText: 'Tiếp tục',
      onOk: () => {
        sourceCancelStatement.cancel()
        reportStore.setExportStatementLoading(false)
      },
      onCancel: () => {

      },
      content:
        <RowCenterDiv>
          Bạn chắc chắn muốn hủy xuất báo cáo sao kê?
        </RowCenterDiv>,
    })
  }
  const handleClickCancelExportStatementPdf = () => {
    Modal.confirm({
      className: 'custom-notice',
      width: 600,
      title: 'Cảnh báo',
      okText: 'Hủy xuất báo cáo',
      cancelText: 'Tiếp tục',
      onOk: () => {
        sourceCancelStatementPdf.cancel()
        reportStore.setExportStatementPdfLoading(false)
      },
      onCancel: () => {

      },
      content:
        <RowCenterDiv>
          Bạn chắc chắn muốn hủy xuất file pdf sao kê?
        </RowCenterDiv>,
    })
  }

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================

  // endregion

  return (
    <LoadingExportPopUpWrapper>
      <Row gutter={[16, 16]}>
        {
          exportSumLoading &&
          <Col span={24}>
            <LoadingExportItem backgroundColor={appTheme.solidColor}>
              <LoadingOutlined style={{ color: '#fff' }} />
              <LoadingExportText color={'#fff'}>Đang xuất báo cáo tổng hợp</LoadingExportText>
              <CloseOutlined style={{ color: '#fff' }} onClick={handleClickCancelExportSum} />
            </LoadingExportItem>
          </Col>
        }

        {
          exportDetailLoading &&
          <Col span={24}>
            <LoadingExportItem backgroundColor={appTheme.solidColor}>
              <LoadingOutlined style={{ color: '#fff' }} />
              <LoadingExportText color={'#fff'}>Đang xuất báo cáo chi tiết</LoadingExportText>
              <CloseOutlined style={{ color: '#fff' }} onClick={handleClickCancelExportDetail} />
            </LoadingExportItem>
          </Col>
        }

        {
          exportStatementLoading &&
          <Col span={24}>
            <LoadingExportItem backgroundColor={appTheme.solidColor}>
              <LoadingOutlined style={{ color: '#fff' }} />
              <LoadingExportText color={'#fff'}>Đang xuất báo cáo sao kê</LoadingExportText>
              <CloseOutlined style={{ color: '#fff' }} onClick={handleClickCancelExportStatement} />
            </LoadingExportItem>
          </Col>
        }
        {
          exportStatementPdfLoading &&
          <Col span={24}>
            <LoadingExportItem backgroundColor={appTheme.solidColor}>
              <LoadingOutlined style={{ color: '#fff' }} />
              <LoadingExportText color={'#fff'}>Đang xuất file Pdf sao kê</LoadingExportText>
              <CloseOutlined style={{ color: '#fff' }} onClick={handleClickCancelExportStatementPdf} />
            </LoadingExportItem>
          </Col>
        }
      </Row>
    </LoadingExportPopUpWrapper>
  )
}

LoadingExportPopUp.propTypes = {}

export default inject('reportStore', 'commonStore')(observer(LoadingExportPopUp))