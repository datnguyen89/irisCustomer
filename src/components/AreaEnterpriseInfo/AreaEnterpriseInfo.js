import React from 'react'
import PropTypes from 'prop-types'
import {
  EnterpriseInfoDetail,
  EnterpriseInfoDetailBox,
  EnterpriseInfoDetailLine,
  DetailLineInfoLeft,
  DetailLineInfoRight,
  AreaEnterpriseInfoLabel, AreaEnterpriseInfoWrapper,
  SpanLabel,
} from './AreaEnterpriseInfoStyled'
import { Tooltip } from 'antd'

const AreaEnterpriseInfo = props => {
  return (
    <AreaEnterpriseInfoWrapper>
      <AreaEnterpriseInfoLabel>
        <SpanLabel>Thông tin doanh nghiệp</SpanLabel>
      </AreaEnterpriseInfoLabel>
      <EnterpriseInfoDetail>
        <EnterpriseInfoDetailBox>
          <EnterpriseInfoDetailLine>
            <DetailLineInfoLeft>Tên tổ chức</DetailLineInfoLeft>
            <Tooltip mouseEnterDelay={0.3} title='Công Ty Cổ phần thương mại Sài Gòn'>
              <DetailLineInfoRight>Công Ty Cổ phần thương mại Sài Gòn Công Ty Cổ phần thương mại Sài
                Gòn</DetailLineInfoRight>
            </Tooltip>
          </EnterpriseInfoDetailLine>
          <EnterpriseInfoDetailLine>
            <DetailLineInfoLeft>Tên viết tắt</DetailLineInfoLeft>
            <Tooltip mouseEnterDelay={0.3} title='Solution Technologi Componel'>
              <DetailLineInfoRight>Solution Technologi Componel</DetailLineInfoRight>
            </Tooltip>
          </EnterpriseInfoDetailLine>
          <EnterpriseInfoDetailLine>
            <DetailLineInfoLeft>Địa chỉ ĐKKD</DetailLineInfoLeft>
            <Tooltip mouseEnterDelay={0.3} title='Số 123 , Đường Yên Hòa, Cầu Giấy, Hà Nội'>
              <DetailLineInfoRight>Số 123 , Đường Yên Hòa, Cầu Giấy, Hà Nội</DetailLineInfoRight>
            </Tooltip>
          </EnterpriseInfoDetailLine>
          <EnterpriseInfoDetailLine>
            <DetailLineInfoLeft>Địa chỉ giao dịch</DetailLineInfoLeft>
            <Tooltip mouseEnterDelay={0.3} title='Số 8 , Trần Duy Hưng, Cầu Giấy, Hà Nội'>
              <DetailLineInfoRight>Số 8 , Trần Duy Hưng, Cầu Giấy, Hà Nội</DetailLineInfoRight>
            </Tooltip>
          </EnterpriseInfoDetailLine>
          <EnterpriseInfoDetailLine>
            <DetailLineInfoLeft>Mã số thuế</DetailLineInfoLeft>
            <Tooltip mouseEnterDelay={0.3} title='123456789'>
              <DetailLineInfoRight>123456789</DetailLineInfoRight>
            </Tooltip>
          </EnterpriseInfoDetailLine>
        </EnterpriseInfoDetailBox>
        <EnterpriseInfoDetailBox>
          <EnterpriseInfoDetailLine>
            <DetailLineInfoLeft>Tên tổ chức</DetailLineInfoLeft>
            <Tooltip mouseEnterDelay={0.3} title='Công Ty Cổ phần thương mại Sài Gòn'>
              <DetailLineInfoRight>Công Ty Cổ phần thương mại Sài Gòn</DetailLineInfoRight>
            </Tooltip>
          </EnterpriseInfoDetailLine>
          <EnterpriseInfoDetailLine>
            <DetailLineInfoLeft>Tên viết tắt</DetailLineInfoLeft>
            <Tooltip mouseEnterDelay={0.3} title='Solution Technologi Componel'>
              <DetailLineInfoRight>Solution Technologi Componel</DetailLineInfoRight>
            </Tooltip>
          </EnterpriseInfoDetailLine>
          <EnterpriseInfoDetailLine>
            <DetailLineInfoLeft>Địa chỉ ĐKKD</DetailLineInfoLeft>
            <Tooltip mouseEnterDelay={0.3} title='Số 123 , Đường Yên Hòa, Cầu Giấy, Hà Nội'>
              <DetailLineInfoRight>Số 123 , Đường Yên Hòa, Cầu Giấy, Hà Nội</DetailLineInfoRight>
            </Tooltip>
          </EnterpriseInfoDetailLine>
          <EnterpriseInfoDetailLine>
            <DetailLineInfoLeft>Địa chỉ giao dịch</DetailLineInfoLeft>
            <Tooltip mouseEnterDelay={0.3} title='Số 8 , Trần Duy Hưng, Cầu Giấy, Hà Nội'>
              <DetailLineInfoRight>Số 8 , Trần Duy Hưng, Cầu Giấy, Hà Nội</DetailLineInfoRight>
            </Tooltip>
          </EnterpriseInfoDetailLine>
          <EnterpriseInfoDetailLine>
            <DetailLineInfoLeft>Mã số thuế</DetailLineInfoLeft>
            <Tooltip mouseEnterDelay={0.3} title='123456789'>
              <DetailLineInfoRight>123456789</DetailLineInfoRight>
            </Tooltip>
          </EnterpriseInfoDetailLine>
        </EnterpriseInfoDetailBox>
      </EnterpriseInfoDetail>
    </AreaEnterpriseInfoWrapper>
  )
}

AreaEnterpriseInfo.propTypes = {}

export default AreaEnterpriseInfo