import React, { useEffect, useState } from 'react'
import {
  AccountBalance,
  AreaInfoDigitalWallet, CardNumberWallet,
  ContentInfoDigitalWallet,
  DigitalWalletWrapper, ImgLogoDigitalWallet,
  LabelDigitalWallet,
} from './DigitalWalletStyled'

const DigitalWallet = props => {
  const {selectedItem, setClickFunds} = props;

  const handleClickFunds = (value) => {
    setClickFunds(value);
  }

  return (
    <DigitalWalletWrapper>
      <LabelDigitalWallet>Ví điện tử</LabelDigitalWallet>
       <AreaInfoDigitalWallet onClick={() => handleClickFunds({ id: -1, accountNumber: '09123456789' })} borderColor={ selectedItem?.id === -1 ? '#0465B0' : '#E0E0E0' }>
         <ImgLogoDigitalWallet src={require('../../media/images/logo-mobipay.png')} alt={'logo-mobipay'} />
         <ContentInfoDigitalWallet colorText={selectedItem?.id === -1 ? '#0465B0' : '#333333'}>
           <CardNumberWallet>09123456789</CardNumberWallet>
           <AccountBalance>800.000.000<span>đ</span></AccountBalance>
         </ContentInfoDigitalWallet>
       </AreaInfoDigitalWallet>
    </DigitalWalletWrapper>
  )
}

DigitalWallet.propTypes = {}

export default DigitalWallet