import styled from 'styled-components'

export const HomeWidgetsWrapper = styled.div`
  margin: 0 16px;
`
export const WidgetItemBox = styled.div`
  background: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
  }
`
export const WidgetItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
`
export const WidgetItemCount = styled.div`
  color: ${props => props.color || '#333'};
  font-size: 3.6rem;
  font-weight: 700;
`
export const WidgetItemBottom = styled.div`
  background: ${props => props.background || '#fff'};
  color: #fff;
  padding: 16px;
  font-size: 2rem;
  font-weight: 700;
`