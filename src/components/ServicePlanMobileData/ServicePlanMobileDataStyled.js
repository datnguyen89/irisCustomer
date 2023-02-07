import styled from 'styled-components'
import { Col, Row } from 'antd'

export const ProviderWrapper = styled.div`
  // background: #fff;
  // border-radius: ${props => props.borderRadius || '10px'};
  padding: ${props => props.padding || '16px 20px'};
  // margin: ${props => props.margin || '0'};
  // border: ${props => props.border || '1px solid #ccc'};
`
export const TitlePickProviders = styled.h5`
  color: #979797;
`

export const TagProvider = styled(Row) `
  display: flex;
  flex-flow: wrap;
  width: 100%;
`

export const TopupVouchersArea = styled(Col)`
  color: white;
  white-space: nowrap;
  cursor: pointer;
  padding: 5px 10px 5px 0;
  h4 {
    color: #333333;
    margin: 0;
    font-weight: bold;
    font-size: 1.8rem;
  }
  p {
    margin: 0;
    color: #B4B4B4;
    font-size: 1.4rem;
  }
`

export const TopupVoucherContent = styled.div `
  border: ${props => `1px solid ${props.borderColor}`};
  border-radius: 10px;
  padding: 0 0 0 20px;
  display: flex;
  justify-content: space-between;
  h4, h5, h6 {
    color: ${ props => props.color };
  }
`

export const TopupVoucherPrice = styled.div `
  padding: 13px 0;
`

export const DiscountText = styled.p `
  color: ${props => props.colorText} !important;
`

export const TopupVoucherData = styled.div `
  background: #EBF0FF;
  border-radius: 0 10px 10px 0;
  padding: 17px 10px 8px;
  h5, h6 {
    margin-bottom: 0;
  }
`
export const ImgIconProvider = styled.div `
  margin-right: 15px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 50%;
`

export const ContentProvider = styled.div `
`
