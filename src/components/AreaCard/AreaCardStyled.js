import styled from 'styled-components'

export const AreaCardWrapper = styled.div`
  background: #FFFFFF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin: 0 16px 30px;
  overflow: hidden;
  padding: 20px 20px 30px;
`

export const AreaAddCard = styled.div`
  cursor: pointer;
  margin: 0 auto;
  width: 80%;
  border-radius: 5px;
  padding: 16px;
  border: 1px solid #4C68EF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4C68EF;

  span {
    margin-right: 10px;
  }
`

export const SpanAreaAccountInfoLabel = styled.span`
  color: #848788;
`

export const AreaPanelAdminCard = styled.div`
  .slick-slider .slick-dots {
    display: none !important;
  }

  .slick-slider {
    width: 100%;
    padding: 20px;
  }

  .slick-slider img {
    //width: 80%;
    margin: 0 auto;
  }

  .slick-arrow.slick-prev {
    display: block;
    position: absolute;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    margin-top: -10px;
    padding: 0;
  }

  .slick-arrow.slick-prev {
    left: 0;
    z-index: 10;
  }

  .slick-arrow.slick-next {
    right: 0px;
    z-index: 10;
  }

  .slick-arrow.slick-next:before {
    content: url(${props => props.arrowNext});
  }

  .slick-arrow.slick-prev:before {
    content: url(${props => props.arrowPrev});
  }
`

export const AreaEnterpriseInfoLabel = styled.div`
  background: #F6F6F6;
  padding: 8px 10px;
`