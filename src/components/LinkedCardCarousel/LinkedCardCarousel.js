import React from 'react'
import PropTypes from 'prop-types'
import {
  BankLogoWrapper,
  LinkedCardBankName,
  LinkedCardCarouselWrapper,
  LinkedCardDate,
  LinkedCardNumber,
  LinkedCardWrapper,
} from './LinkedCardCarouselStyled'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const PreviousButton = (props) => {
  const { className, style, onClick } = props
  return (
    <div
      className={className}
      style={{ ...style }}
      onClick={onClick}
    />
  )
}
const NextButton = (props) => {
  const { className, style, onClick } = props
  return (
    <div
      style={{ ...style }}
      className={className}
      onClick={onClick}
    />
  )
}
const LinkedCardCarousel = props => {
  const { listLinkedCard } = props
  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    speed: 500,
    autoplaySpeed: 2000,
    prevArrow: <PreviousButton />,
    nextArrow: <NextButton />,
  }
  return (
    <LinkedCardCarouselWrapper>
      <Slider {...settings}>
        {
          listLinkedCard && listLinkedCard.map((item, index) =>
            <LinkedCardWrapper background={item?.cardColor} key={index}>
              <BankLogoWrapper>
                <img src={item?.logoMobileIcon} />
              </BankLogoWrapper>
              <LinkedCardBankName>
                {item?.bankName}
              </LinkedCardBankName>
              <LinkedCardNumber>
                <span>{item?.bankAccount?.slice(0, 4)}</span>
                <span>{item?.bankAccount?.slice(4, 8)}</span>
                <span>{item?.bankAccount?.slice(8, 12)}</span>
                <span>{item?.bankAccount?.slice(12, item?.bankAccount?.length)}</span>
              </LinkedCardNumber>
              <LinkedCardDate>
              </LinkedCardDate>
            </LinkedCardWrapper>,
          )
        }
      </Slider>
    </LinkedCardCarouselWrapper>
  )
}

LinkedCardCarousel.propTypes = {
  listLinkedCard: PropTypes.array,
}

export default LinkedCardCarousel