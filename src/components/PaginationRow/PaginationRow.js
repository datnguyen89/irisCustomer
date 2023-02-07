import React from 'react'
import PropTypes from 'prop-types'
import { PaginationLabel, RowSpaceBetweenDiv } from '../CommonStyled/CommonStyled'
import { Pagination } from 'antd'

const PaginationRow = props => {
  // region props, hook, state =================
  const {
    currentListLength,
    totalCount,
    pageIndex,
    pageSize,
    onChangePagination,
    pageSizeOptions,
  } = props

  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleChangePagination = (pageIndex, pageSize) => {
    onChangePagination(pageIndex, pageSize)
  }

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================

  // endregion
  return (
    <RowSpaceBetweenDiv margin={'16px 0'}>
      {
        currentListLength ?
          <PaginationLabel>
            {
              `Hiển thị từ
               ${pageSize * (pageIndex - 1) + 1}
               đến 
               ${pageSize * (pageIndex - 1) + currentListLength}
               trên tổng số 
               ${totalCount} 
               bản ghi`
            }
          </PaginationLabel>
          :
          <div />
      }
      {
        totalCount > 0 ?
          <Pagination
            current={pageIndex}
            pageSize={pageSize}
            total={totalCount}
            showSizeChanger
            pageSizeOptions={pageSizeOptions || [10, 20, 50, 100]}
            onChange={handleChangePagination} />
          :
          <div />
      }
    </RowSpaceBetweenDiv>
  )
}

PaginationRow.propTypes = {
  currentListLength: PropTypes.number,
  onChangePagination: PropTypes.func,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  totalCount: PropTypes.number,
  pageSizeOptions: PropTypes.array,
}

export default PaginationRow