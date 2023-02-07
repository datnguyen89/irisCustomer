import styled from 'styled-components'
import { Button } from 'antd'

export const PackDataPageWrapper = styled.div`
  padding: 16px;
`
export const PackInfoIconWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`
export const PackInfoOverlay = styled.div`
  padding: 8px;
`
export const PackInfoImage = styled.div`
  display: flex;
  justify-content: center;
`
export const PackInfoTable = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`
export const PackInfoTableItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 38%;
  margin: 8px 0;
  border-right: 1px solid #ccc;

  &:first-child {
    width: 31%;
    align-items: flex-start;
  }

  &:last-child {
    width: 31%;
    border-right: none;
    align-items: flex-end;
  }
`
export const PackInfoNotice = styled.p`
  color: #333;
  margin-bottom: 0;
  font-size: 1.2rem;
`
export const PackInfoButton = styled(Button)`
  height: 56px !important;
  margin-top: 16px;
  border-radius: 4px;
`
export const PackDataText = styled.div`
  font-weight: ${props => props.fontWeight ? props.fontWeight : 'auto'};
  color: ${props => props.color ? props.color : '#222'};
  width: 210px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  @media screen and (max-width: 1720px) {
    font-size: 1.2rem;
  }
  @media screen and (max-width: 1600px) {
    font-size: 1.4rem;
  }
`