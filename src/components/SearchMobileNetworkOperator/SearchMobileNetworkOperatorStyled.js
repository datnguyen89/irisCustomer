import styled from 'styled-components'
import { Input } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'

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

export const SearchInputPhoneNumber = styled(Input) `
    border-radius: 10px;
    height: 55px;
    line-height: 40px;
`

export const TagProvider = styled.div `
    display: flex;
    overflow: hidden;
    overflow-x: auto;
`
export const ImgWrapper = styled.div`
    display: flex;
    justify-content: center;
    height: 60px;
    border-radius: 10px;
    padding: 8px 16px;
    margin: 16px 16px 0 0;
    width: 100%;
    border: ${props => `1px solid ${props.borderColor}`};
    img {
        width: 200px;
        object-fit: contain;
    }
`
export const ScrollbarsCustom = styled(Scrollbars) `
  .view {
    display: flex;
  }
`
export const ImageProviderArea = styled.div`
    display: flex;
    justify-content: center;
    flex-grow: 0;     /* do not grow   - initial value: 0 */
    flex-shrink: 0;   /* do not shrink - initial value: 1 */
    flex-basis: 150px; /* width/height  - initial value: auto */
    color: white;
    cursor: pointer;
    &:last-child {
        ${ImgWrapper} {
            margin-right: 1px;
        }
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
