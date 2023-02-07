import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { SuggestAmountMoneyArea } from './SuggestAmountMoneyStyled'
import numberUtils from '../../utils/numberUtils'
import { Col, Row } from 'antd'
import { SUGGEST_AMOUNT } from '../../utils/constant'


const SuggestAmountMoney = props => {
  // region props, hook, state =================
  const {
    amountMoney,
    selectedAmountMoney,
    selectedSuggestAmountMoneyCallback,
  } = props
  const [listSuggestPrices, setListSuggestPrices] = useState([])

  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleSelectedSuggestAmountMoney = (value) => {
    console.log(value)
    selectedSuggestAmountMoneyCallback(value)
  }
  const generateRandomSuggestPrice = (amount) => {
    if (!amount || isNaN(amount)) {
      return SUGGEST_AMOUNT
    }
    if (amount <= 1000) {
      return [
        amount * 1000,
        amount * 10000,
        amount * 100000,
        amount * 1000000,
      ]
    }
    if (amount <= 10000) {
      return [
        amount * 100,
        amount * 1000,
        amount * 10000,
        amount * 100000,
      ]
    }
    if (amount <= 100000) {
      return [
        amount * 10,
        amount * 100,
        amount * 1000,
        amount * 10000,
      ]
    }
    if (amount <= 1000000) {
      return [
        amount,
        amount * 10,
        amount * 100,
        amount * 1000,
      ]
    }
    if (amount <= 10000000) {
      let firstNum = Math.floor(amount / 10)
      return [
        firstNum,
        amount,
        amount * 10,
        amount * 100,
      ]
    }
    if (amount <= 100000000) {
      let firstNum = Math.floor(amount / 100)
      let secondNum = Math.floor(amount / 10)
      return [
        firstNum,
        secondNum,
        amount,
        amount * 10,
      ]
    }
    if (amount <= 1000000000) {
      let firstNum = Math.floor(amount / 1000)
      let secondNum = Math.floor(amount / 100)
      let thirdNum = Math.floor(amount / 10)
      return [
        firstNum,
        secondNum,
        thirdNum,
        amount,
      ]
    }
  }

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    console.log(amountMoney)
    if (amountMoney > 1000000000) return
    let lst = generateRandomSuggestPrice(amountMoney)
    setListSuggestPrices(lst)
  }, [amountMoney])

  // endregion

  return (
    <Row gutter={[16, 16]}>
      {
        listSuggestPrices.map((item, index) =>
          <Col xxl={6} xl={6} lg={12} md={12} sm={12} xs={12} key={index}>
            <SuggestAmountMoneyArea
              selected={selectedAmountMoney === item}
              onClick={() => handleSelectedSuggestAmountMoney(item)}>
              {numberUtils.thousandSeparator(item)}<span>đ</span>
            </SuggestAmountMoneyArea>
          </Col>,
        )
      }
    </Row>
  )
}

SuggestAmountMoney.propTypes = {
  selectedSuggestAmountMoneyCallback: PropTypes.func,
  amountMoney: PropTypes.number,
  selectedAmountMoney: PropTypes.number,
}

export default SuggestAmountMoney