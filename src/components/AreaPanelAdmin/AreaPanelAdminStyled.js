import styled from 'styled-components'

export const AreaPanelAdminWrapper = styled.div`
  background: #FFFFFF;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin: 0 16px 30px;
  overflow: hidden;
`

export const AreaEnterpriseInfoAreaDetailLineInfoRight = styled.span`
  text-align: right;
`

export const DetailLineInfoLeft = styled.span`
  text-align: left;

  span {
    color: #B4B4B4;
  }
`
export const EnterpriseInfoDetailLine = styled.div`
  border-bottom: 1px solid #E0E0E0;
  margin: 12px;
  padding-bottom: 6px;
  clear: both;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`
export const AreaPanelAdminLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  background: url(${props => props.background}) center center no-repeat;
  background-size: cover;
  padding: 15px;
`
export const DivLabel = styled.div`
  color: white;
  font-weight: bold;
  font-size: 2rem;
`
export const AreaPanelAdminAvatar = styled.div``

export const AreaPanelAdminInfo = styled.div`
  padding: 5px;
`