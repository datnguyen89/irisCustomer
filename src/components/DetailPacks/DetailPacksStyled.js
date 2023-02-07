import styled from 'styled-components'

export const AreaAccountInfoWrapper = styled.div`
  background: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 18px;

  margin: 30px 16px;
  padding: 20px 20px 5px;
`

export const AreaIdentityInfoAreaDetailBox = styled.div`
  width: 100%;
`

export const AreaAccountInfoAreaDetailLineInfo = styled.div`
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

export const AreaAccountInfoAreaDetailLineInfoRight = styled.span`
  text-align: right;
`

export const AreaAccountInfoAreaDetailLineInfoLeft = styled.span`
  text-align: left;

  span {
    color: #B4B4B4;
  }
`