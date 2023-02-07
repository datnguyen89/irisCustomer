import React from 'react'
import PropTypes from 'prop-types'
import { ImageProviderArea, ImgWrapper, ScrollbarsCustom } from './ScrollbarCustomProvidersStyled'

const ScrollbarCustomProviders = props => {
  const { selectedProvider, handlerSetSelectProvider, data } = props

  return (
    <ScrollbarsCustom
      style={{ width: '100%', height: 105 }}
      renderView={props => <div {...props} className='view' />}>
      {
        data.map(item =>
          <ImageProviderArea onClick={() => handlerSetSelectProvider(item)} key={item.id}>
            <ImgWrapper borderColor={item.id === selectedProvider?.id ? '#0465B0' : '#E0E0E0'}>
              <img src={item.imageUrl} alt={item.name} />
            </ImgWrapper>
          </ImageProviderArea>,
        )
      }
    </ScrollbarsCustom>
  )
}

ScrollbarCustomProviders.propTypes = {}

export default ScrollbarCustomProviders