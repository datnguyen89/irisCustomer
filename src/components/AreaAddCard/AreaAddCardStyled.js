import styled from 'styled-components'

export const AreaAddCardWrapper = styled.div`
  background: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin: 0 16px 30px;
  overflow: hidden;
  padding: 20px 55px 30px;

  div div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  div {
    color: #B4B4B4;
    text-align: center;
  }
`

export const ButtonAddNewCard = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  span {
    background: #4C68EF;
    padding: 11px 35px;
    border-radius: 8px;
    color: white;
    font-weight: bold;
  }
`