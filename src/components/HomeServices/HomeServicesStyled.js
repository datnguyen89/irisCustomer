import styled from 'styled-components'

export const HomeServicesWrapper = styled.div`
  margin: 16px;

  .ant-badge.ant-badge-status {
    width: 100%;
    height: 100%;
  }
`
export const SaleBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  background: ${props => props.backgroundColor ? props.backgroundColor : 'red'};
  color: #fff;
  border-radius: 50%;
  transition-duration: 0.3s;
  text-align: center;
  line-height: 1;
`
export const ServiceBox = styled.div`
  cursor: pointer;
  height: 100%;
  width: 100%;
  position: relative;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ccc;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;

  &:hover {
    border: 1px solid ${props => props.appTheme.solidColor};

    ${SaleBadge} {
      width: 44px;
      height: 44px;
      font-size: 1.4rem;
    }
  }
`

export const ServiceName = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
  color: #626262;
`
export const ServiceDescription = styled.div`
  color: #979797;
  font-size: 1.4rem;
  text-align: center;
`
