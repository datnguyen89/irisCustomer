import styled from 'styled-components'
import { Col, Row } from 'antd'

export const ProviderWrapper = styled.div`
  // background: #fff;
  // border-radius: ${props => props.borderRadius || '8px'};
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
  padding: 10px 89px 10px 20px;
  h4 {
    color: ${ props => props.color };
  }
`

export const DiscountText = styled.p `
  color: ${props => props.colorText} !important;
`

export const ImgIconProvider = styled.div `
  margin-right: 15px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 50%;
`

export const ContentProvider = styled.div `
`
