import styled, { css } from 'styled-components'
import { Input, InputNumber, Tag } from 'antd'

export const AuthShadowBox = styled.div`
  background: #FFFFFF;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: ${props => props.width ? props.width : 'auto'};
  padding: 24px;

  a {
    color: ${props => props.color};
  }
`
export const PaginationLabel = styled.span`
  color: #767676;
  @media only screen and (max-width: 768px) {
    margin-bottom: 16px;
  }
`

export const RowFlexEndDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: ${props => props.margin || 0};
  padding: ${props => props.padding || 0};
  gap: 8px;
`
export const RowSpaceBetweenDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: ${props => props.flexWrap || 'wrap'};
  margin: ${props => props.margin || 0};
  padding: ${props => props.padding || 0};
  @media only screen and (max-width: 768px) {
    justify-content: center;
    flex-direction: column;
  }
`
export const RowCenterDiv = styled.div`
  display: flex;
  position: ${props => props.position ? props.position : 'static'};
  flex-direction: ${props => props.flexDirection ? props.flexDirection : 'row'};
  justify-content: center;
  align-items: center;
  margin: ${props => props.margin || 0};
  padding: ${props => props.padding || 0};
`
export const RowAlignCenterDiv = styled.div`
  gap: 8px;
  display: flex;
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'flex-start'};
  align-items: center;
  margin: ${props => props.margin || 0};
  padding: ${props => props.padding || 0};
`
export const ColorTitle = styled.h1`
  padding: 8px;
  color: ${props => props.color || '#848788'};
  background: ${props => props.background || '#F6F6F6'};
  margin-top: ${props => props.marginTop || 0} !important;
  margin-bottom: ${props => props.marginBottom || '16px'} !important;
  text-align: ${props => props.textAlign || 'left'};
  font-weight: ${props => props.fontWeight || '500'};
`
export const ColorTitleNoBg = styled.h1`
  color: ${props => props.color || '#979797'};
  margin-top: ${props => props.marginTop || 0} !important;
  margin-bottom: ${props => props.marginBottom || 0} !important;
  text-align: ${props => props.textAlign || 'left'};
  font-weight: ${props => props.fontWeight || '500'};
  font-size: ${props => props.fontSize || 'inherit'};
`
export const CommonTitle = styled.h1`
  color: ${props => props.color || '#333'};
  margin: ${props => props.margin || 0} !important;
  padding: ${props => props.padding || 0} !important;
  text-align: ${props => props.textAlign || 'left'};
  font-weight: ${props => props.fontWeight || '500'};
  font-size: ${props => props.fontSize || 'inherit'};
`
export const WhiteRoundedBox = styled.div`
  background: #fff;
  height: ${props => props.height || 'auto'};
  border-radius: ${props => props.borderRadius || '4px'};
  padding: ${props => props.padding || '16px'};
  margin: ${props => props.margin || '0'};
  border: ${props => props.border || 'none'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`
export const BorderRoundedBox = styled.div`
  background: #fff;
  height: ${props => props.height || 'auto'};
  border-radius: ${props => props.borderRadius || '4px'};
  padding: ${props => props.padding || '16px'};
  margin: ${props => props.margin || '0'};
  border: ${props => props.border || '1px solid #E0E0E0'};
`
export const ColorText = styled.span`
  color: ${props => props.color || '#333'};
  font-weight: ${props => props.fontWeight || 'normal'};
  padding: ${props => props.padding || '0'};
  margin: ${props => props.margin || '0'};
  font-size: ${props => props.fontSize || '1.4rem'};
  cursor: ${props => props.cursor || 'auto'};
  white-space: ${props => props.whiteSpace ? props.whiteSpace : 'pre-wrap'};
`
export const ColorStrikeText = styled.span`
  color: ${props => props.color || '#333'};
  font-weight: ${props => props.fontWeight || 'normal'};
  padding: ${props => props.padding || '0'};
  margin: ${props => props.margin || '0'};
  font-size: ${props => props.fontSize || '1.4rem'};
  cursor: ${props => props.cursor || 'auto'};
  text-decoration: line-through;
`
export const HeaderDropdownWrapper = styled.div`
  display: flex;
  flex-direction: ${props => props.flexDirection ? props.flexDirection : 'row'};
  background: #fff;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
  border-radius: 2px;
  padding: 8px;
  width: ${props => props.width || 'auto'};
  flex-wrap: wrap;
`
export const HeaderDropdownIconWrapper = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const HeaderDropdownItemText = styled.div`
  color: #333;
  margin-left: 8px;
  @media only screen and (max-width: 992px) {
    font-size: 12px;
  }
`
export const PaymentDropdownItemWrapper = styled.div`
  display: flex;
  flex-direction: ${props => props.flexDirection ? props.flexDirection : 'row'};
  flex-wrap: wrap;
`
export const HeaderDropdownItem = styled.div`
  display: flex;
  align-items: center;
  width: ${props => props.width || 'auto'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  padding: 8px 16px;
  cursor: pointer;

  &:hover {
    ${HeaderDropdownItemText} {
      color: ${props => props.color};
    }
  }
`
export const LastItemScroll = styled.div`
  min-width: 700px;
`
export const EllipsisText = styled.div`
  width: ${props => props.width || '150px'};
  text-align: ${props => props.textAlign || 'left'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const DropdownShowColumnWrapper = styled.div`
  background-color: #fff;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
`
export const TitleBackgroundGray = styled.div`
  padding: 8px;
  color: ${props => props.color || '#848788'};
  background: ${props => props.background || '#F6F6F6'};
  margin-top: ${props => props.marginTop || 0};
  margin-bottom: ${props => props.marginBottom || '16px'};
  text-align: ${props => props.textAlign || 'left'};
`
export const PaymentTag = styled.div`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 1.4rem;
  cursor: pointer;
  border: 1px solid #b4b4b4;
  margin-right: 8px;

  &:hover {
    border: 1px solid ${props => props.appTheme.solidColor};
    background: ${props => props.appTheme.solidLightColor};
  }

  ${(props) => {
    switch (props.active) {
      case true:
        return css`
          border: 1px solid ${props.appTheme.solidColor};
          background: ${props => props.appTheme.solidLightColor};
        `
      default:
        return css`
        `
    }
  }}
`
export const ProviderSearchInput = styled(Input.Search)`
  input {
    height: 56px;
    border-right: none !important;
    border-radius: 8px;

    &:hover, &:focus {
      border: 1px solid rgb(217, 217, 217) !important;
      border-color: rgb(217, 217, 217) !important;
      box-shadow: none !important;
      border-right: none !important;
    }
  }

  .ant-input-group-addon {
    background: #fff;
    border: 1px solid rgb(217, 217, 217) !important;
    border-left: none !important;
    padding-right: 8px !important;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  button {
    border: none !important;
    box-shadow: none !important;

    &:after {
      content: none !important;
    }
  }

  .anticon.anticon-search {
    font-size: 24px;
    color: #ccc;

    &:hover {
      color: #a5a5a5;
    }
  }
`
export const TextInputWrapper = styled.div`
  display: flex;
  margin: 16px 0;

  img {
    height: 56px;
    margin-left: 16px;
    cursor: pointer;
    user-select: none;
  }
`
export const TextInput = styled(Input)`
  padding: 0 8px;

  border-color: rgb(217, 217, 217) !important;
  box-shadow: none !important;

  input {
    height: 56px !important;
    border-radius: 4px;
    border: none !important;
    padding-left: 8px !important;

    &:hover, &:focus {
      border-color: rgb(217, 217, 217) !important;
      border: none;
      box-shadow: none !important;
    }
  }

  .ant-input-prefix {
    padding-right: 12px;
    margin-right: 8px;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      right: 0;
      width: 1px;
      height: 70%;
      background: #e1e1e1;
    }
  }
`
export const QuantityInput = styled(InputNumber)`
  width: 100%;
  margin: ${props => props.margin ? props.margin : '0'};

  input {
    height: 56px !important;
    border-radius: 4px;
  }
`
export const PaymentPeriodWrapper = styled.div`
  .ant-timeline-item-last > .ant-timeline-item-content {
    min-height: auto;
  }

  .ant-timeline-item.ant-timeline-item-last {
    padding-bottom: 0;
  }

  .ant-timeline-item {
    line-height: 25px;
  }

  .ant-timeline {
    margin-top: 16px;
  }
`
export const ScrollBarsWrapper = styled.div`
  overflow: hidden;
  margin-right: 16px;
`
export const PackItem = styled.div`
  position: relative;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: ${props => props.flexDirection ? props.flexDirection : 'row'};
  justify-content: ${props => props.justifyContent ? props.justifyContent : 'center'};
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  padding: ${props => props.padding ? props.padding : ''};
  height: 100%;

  &:hover {
    border: 1px solid ${props => props.appTheme.solidColor};
    background: ${props => props.appTheme.solidLightColor};
  }

  ${(props) => {
    switch (props.active) {
      case true:
        return css`
          border: 1px solid ${props.appTheme.solidColor};
          background: ${props => props.appTheme.solidLightColor};
        `
      default:
        return css`
        `
    }
  }}
`
export const PackInfoWrapperData = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  //padding: 16px 16px 8px 16px;
`
export const PackInfoData = styled.div`
  margin-left: 16px;
`
export const PackPriceWrapper = styled.div`
  width: 100%;
`
export const PackInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.alignItems ? props.alignItems : 'start'};
  cursor: pointer;
  padding: 16px;
  width: ${props => props.width ? props.width : '100%'};
`
export const PackSubInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  background: #EBF0FF;
  padding: 16px;
`
export const PrefixIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  img {
    height: 40px;
    width: 90px;
    object-fit: contain;
    object-position: center;
  }
`
export const ProviderItemWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border: 1px solid #cccccc;
  padding: 16px;
  height: 64px;
  margin-right: 16px;
  width: 144px;
  border-radius: 4px;
  user-select: none;
  cursor: ${props => props.cursor ? props.cursor : 'default'};

  ${(props) => {
    switch (props.active) {
      case true:
        return css`
          border: 1px solid ${props.appTheme.solidColor};
        `
      default:
        return css`
        `
    }
  }}
  &:hover {
    border: ${props => props.allowHover
            ? `1px solid ${props.appTheme.solidColor}`
            : props.active
                    ? `1px solid ${props.appTheme.solidColor}`
                    : `1px solid #cccccc`};
  }

  img {
    height: 56px;
    object-fit: contain;
    object-position: center;
  }
`

export const ProviderItem = styled.div`
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:hover {
    border: 1px solid ${props => props.appTheme.solidColor};
    background: ${props => props.appTheme.solidLightColor};
  }

  ${(props) => {
    switch (props.active) {
      case true:
        return css`
          border: 1px solid ${props.appTheme.solidColor};
          background: ${props.appTheme.solidLightColor};
        `
      default:
        return css`
        `
    }
  }}
`
export const ProviderIconWrapper = styled.div`
  padding: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    border-radius: 50%;
    border: 1px solid #fafafa;
    height: 40px;
    width: auto;
  }
`
export const ProviderInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  cursor: pointer;
`