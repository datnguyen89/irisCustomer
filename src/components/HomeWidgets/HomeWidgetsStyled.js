import styled from 'styled-components'

export const HomeWidgetsWrapper = styled.div`
  margin: 0 16px;
`
export const WidgetItemBox = styled.div`
  background: #fff;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    img {
      transition: all 0.7s;
      transform: scale(1.2);
    }
  }
`
export const WidgetItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background: ${props => props.background || '#fff'};
`
export const WidgetItemCount = styled.div`
  color: ${props => props.color || '#333'};
  font-size: 2rem;
  font-weight: 700;
`
export const WidgetItemBottom = styled.div`
  background: ${props => props.background || '#fff'};
  color: #fff;
  padding: 8px 16px;
  font-size: 1.5rem;
  font-weight: 700;
`