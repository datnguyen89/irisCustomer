import styled from 'styled-components'

export const AreaEnterpriseInfoWrapper = styled.div`
  background: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 18px;
  margin: 0 16px;
  padding: 20px 20px 5px;
`
export const AreaEnterpriseInfoLabel = styled.div`
  background: #F6F6F6;
  padding: 8px 10px;
`
export const EnterpriseInfoDetail = styled.div`
  display: flex;
  justify-content: space-between;
`

export const EnterpriseInfoDetailBox = styled.div`
  width: 47%;
`

export const SpanLabel = styled.span`
  color: #848788;
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

export const DetailLineInfoRight = styled.span`
  text-align: right;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 70%;
`

export const DetailLineInfoLeft = styled.span`
  text-align: left;

  span {
    color: #B4B4B4;
  }
`