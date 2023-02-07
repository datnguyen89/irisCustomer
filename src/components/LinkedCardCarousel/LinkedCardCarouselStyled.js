import styled from 'styled-components'
import IMAGES from '../../images'

export const LinkedCardCarouselWrapper = styled.div`
  margin: 0 auto;

  .slick-arrow.slick-prev {
    &:before {
      color: #ccc;
    }
  }

  .slick-arrow.slick-next {
    &:before {
      color: #ccc;
    }
  }

  @media only screen and (min-width: 1600px) {
    width: 360px !important;
  }
  @media only screen and (max-width: 1600px) {
    width: 350px !important;
  }
  @media only screen and (max-width: 375px) {
    width: 320px !important;
  }
`
export const LinkedCardWrapper = styled.div`
  background-image: url(${IMAGES.GUIDE_IMG});
  background-size: cover;
  background-repeat: no-repeat;
  background-color: ${props => props.background};
  padding: 16px;
  border-radius: 4px;
  height: 200px;
  margin: 0 auto;
  @media only screen and (max-width: 1600px) {
    height: 190px;
  }
`
export const LinkedCardNumber = styled.div`
  color: #fff;
  text-align: left;
  letter-spacing: 2px;

  span {
    margin-right: 12px;
  }
`
export const LinkedCardBankName = styled.div`
  color: #fff;
  margin-bottom: 8px;
  margin-top: 48px;
`
export const LinkedCardDate = styled.div`
  color: #fff;
  text-align: right;
`
export const BankLogoWrapper = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  margin-bottom: 16px;

  img {
    height: 40px;
    object-fit: cover;
    object-position: center;
    border-radius: 8px;
  }
`