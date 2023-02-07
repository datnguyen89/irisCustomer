import styled from 'styled-components'
import { Scrollbars } from 'react-custom-scrollbars'

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

export const ScrollbarsCustom = styled(Scrollbars) `
  .view {
    display: flex;
  }
  //div:nth-child(2) {
  //  bottom: 0 !important;
  //}
`

export const ImageProviderArea = styled.img`
  border: ${props => `1px solid ${props.borderColor}`};
  margin: 10px 20px 10px 0;
  color: white;
  white-space: nowrap;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  height: 72px;
  width: auto;
  object-fit: cover;
  object-position: center;
  user-select: none;
`

export const ImgIconProvider = styled.div `
  margin-right: 15px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 50%;
`

export const ContentProvider = styled.div `
`
