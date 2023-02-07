import styled from 'styled-components'
import { SIDEBAR_WIDTH_COLLAPSE, SIDEBAR_WIDTH_EXPAND } from '../../utils/constant'
import IMAGES from '../../images'

export const MainSideBarContentWrapper = styled.div`
  position: fixed;
  height: 100vh;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 16px;
  padding-top: 56px;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  border-right: 1px solid #ccc;

  &.sidebar-collapse {
    width: ${SIDEBAR_WIDTH_COLLAPSE + 'px'};
  }

  &.sidebar-expand {
    width: ${SIDEBAR_WIDTH_EXPAND + 'px'};
  }

  &.sidebar-show {
    display: flex;
  }

  &.sidebar-hidden {
    display: none;
  }

  .expand-sidebar-icon {
    margin: 16px 0;
    cursor: pointer;
    color: #4C68EF;

    &.icon-show {
      display: inline-block;
    }

    &.icon-hidden {
      display: none;
    }
  }
`
export const EnterpriseInfoArea = styled.div`
  background: url(${IMAGES.BANK_BG}) center center no-repeat;
  background-size: cover;
  min-height: 120px;
  width: 100%;
  justify-content: center;
  align-items: center;
  position: relative;

  .bank-name-sidebar {
    margin: 0 8px;
    text-align: center;
    color: ${props => props.color};
    font-weight: 700;
    font-size: 1.4rem;
    width: 50%;
  }

  .collapse-sidebar-icon {
    color: ${props => props.color};
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;

    &.icon-show {
      display: block;
    }

    &.icon-hidden {
      display: none;
    }
  }

  &.sidebar-show {
    display: flex;
  }

  &.sidebar-hidden {
    display: none;
  }
`
export const BankAvatarWrapper = styled.div`
  height: 60px;
  width: 60px;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;

  img {
    object-fit: contain;
    object-position: center;
  }
`
export const MenuSidebarArea = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-grow: 1;
`
export const MenuSidebarItem = styled.li`
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px;
  margin: 12px 12px 0 12px;

  &:hover, &.active {
    background: #ffffff;
    color: ${props => props.color};

    svg path {
      fill: ${props => props.color} !important;
    }
  }

  .menu-sidebar-label {
    margin-left: 12px;
    padding-top: 2px;
  }
`
export const SocialIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: ${props => props.flexDirection};

  a {
    margin: 8px;
    height: 32px;
    width: 32px;
  }
`