import styled from 'styled-components'
import { Scrollbars } from 'react-custom-scrollbars'

export const ScrollbarsCustom = styled(Scrollbars) `
  .view {
    display: flex;
  }
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