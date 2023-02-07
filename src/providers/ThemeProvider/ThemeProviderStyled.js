import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`

  /** System styling */
  html {
    --antd-wave-shadow-color: ${props => props.theme.solidColor} !important;
  }

  ::selection {
    background: ${props => props.theme.solidColor} !important;
  }
  /** Collapse*/
  .ant-collapse-borderless > .ant-collapse-item:last-child {
    border-bottom: 1px solid #ccc;
  }
  
  /** Icon */
  .anticon-color {
    color: ${props => props.theme.solidColor} !important;
  }

  /** Table */
  .ant-table {
    .current-day {
      background-color: ${props => props.theme.solidLightColor} !important;
    }
  }

  .ant-table-cell {
    @media only screen and (max-width: 768px) {
      padding: 8px !important;
    }
  }

  /** Tabs */
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: ${props => props.theme.solidColor} !important;
  }

  .ant-tabs-tab:hover {
    color: ${props => props.theme.solidColor} !important;
  }

  .ant-tabs-ink-bar {
    background: ${props => props.theme.solidColor} !important;
  }

  /** Button */
  .ant-btn {
    &:hover, &:focus {
      &:not(.ant-btn-background-ghost, [disabled], .ant-btn-dangerous) {
        border-color: ${props => props.theme.solidColor} !important;
        color: ${props => props.theme.solidColor} !important;
      }

    }
  }


  .ant-btn-primary {
    &:not(.ant-btn-background-ghost, [disabled]) {
      background: ${props => props.theme.solidColor} !important;
      border-color: ${props => props.theme.solidColor} !important;
      color: white !important;
      &:hover, &:focus {
        color: white !important;
        box-shadow: ${props => props.theme.shadowColor} !important;
      }
    }

    &.ant-btn-background-ghost {
      background-color: #fff !important;
      color: ${props => props.theme.solidColor} !important;
      border-color: ${props => props.theme.solidColor} !important;
    }
  }

  .ant-btn-dangerous {
    color: rgb(244, 67, 54) !important;
    border-color: rgb(244, 67, 54) !important;

    &:hover, &:focus {
      color: rgb(244, 67, 54) !important;
      border-color: rgb(244, 67, 54) !important;
      box-shadow: 0 2px 10px rgba(254, 81, 150, 0.5) !important;
    }

    &.ant-btn-primary {
      background: linear-gradient(108.84deg, #F77062 0%, #FE5196 100%) !important;
      color: white !important;
      border-color: rgb(244, 67, 54) !important;

      &:hover {
        box-shadow: 0 2px 10px rgba(254, 81, 150, 0.5) !important;
        border-color: rgb(244, 67, 54) !important;
      }
    }
  }

  /** Typography */
  a.ant-typography, .ant-typography a {
    color: ${props => props.theme.solidColor} !important;
  }

  /** List */
  .ant-list-item-meta-title {
    a:hover {
      color: ${props => props.theme.solidColor} !important;
    }
  }

  /** Popover */
  .ant-popover-buttons {
    .ant-btn-dangerous {
      background: linear-gradient(108.84deg, #F77062 0%, #FE5196 100%) !important;
      color: white !important;
      border-color: rgb(244, 67, 54) !important;

      &:hover {
        box-shadow: 0 2px 10px rgba(254, 81, 150, 0.5) !important;
        border-color: rgb(244, 67, 54) !important;
      }
    }
  }

  /** Input */
  .ant-input-affix-wrapper {
    &:hover {
      border-color: ${props => props.theme.solidColor};
    }

    &:focus, &.ant-input-affix-wrapper-focused {
      border-color: ${props => props.theme.solidColor} ;
      box-shadow: ${props => props.theme.lightShadowColor} ;
      outline: none !important;
    }
  }

  textarea.ant-input {
    &:hover {
      border-color: ${props => props.theme.solidColor} !important;
    }

    &:focus {
      border-color: ${props => props.theme.solidColor} !important;
      box-shadow: ${props => props.theme.lightShadowColor} !important;
    }
  }

  //form
  .ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after, .custom-required::after {
    display: inline-block;
    margin-left: 4px;
    color: #ff4d4f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }

  .ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
    display: none !important;
  }

  .ant-form-inline .ant-form-item {
    @media only screen and (max-width: 1024px) {
      margin: 8px !important;
    }
  }

  .ant-form {
    .ant-input {
      &:hover {
        border-color: ${props => props.theme.solidColor};
      }

      &:focus, &.ant-input-focused {
        outline: none !important;
        border-color: ${props => props.theme.solidColor};
        box-shadow: ${props => props.theme.lightShadowColor};
      }
    }
  }

  .ant-form-item-has-success {
    &.ant-form-item-has-feedback {
      .ant-form-item-children-icon {
        color: ${props => props.theme.solidColor} !important;
      }
    }
  }


  /** Select */
  .ant-select {
    .ant-select-selector {
      align-items: center;
    }

    &:not(.ant-select-disabled) {
      &:hover {
        .ant-select-selector {
          border-color: ${props => props.theme.solidColor} !important;
        }
      }
    }

    &:focus, &.ant-select-focused {
      .ant-select-selector {
        border-color: ${props => props.theme.solidColor} !important;
        outline: none !important;
        box-shadow: ${props => props.theme.lightShadowColor} !important;
      }
    }
  }

  .ant-select-dropdown {
    .ant-select-item-option-selected {
      &:not(.ant-select-item-option-disabled) {
        background-color: ${props => props.theme.solidLightColor} !important;
      }
    }
  }

  /** Checkbox */
  .ant-checkbox-wrapper {
    &:hover {
      .ant-checkbox-inner {
        border-color: ${props => props.theme.solidColor} !important;
      }
    }

    .ant-checkbox-checked {
      &:after {
        border-color: ${props => props.theme.solidColor} !important;
      }

      .ant-checkbox-inner {
        background-color: ${props => props.theme.solidColor} !important;
        border-color: ${props => props.theme.solidColor} !important;
      }
    }
  }

  /** Switch */
  .ant-switch-checked {
    background: ${props => props.theme.gradientColor} !important;
  }

  /** Dropdown */
  .ant-dropdown-menu-item, .ant-dropdown-menu-submenu-title {
    > a {
      color: ${props => props.theme.solidColor} !important;
    }
  }

  .ant-dropdown-link {
    &.ant-dropdown-trigger {
      color: ${props => props.theme.solidColor} !important;
    }
  }

  /** Calendar */
  .ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper:first-child,
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover,
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    border-color: ${props => props.theme.solidColor} !important;
    color: ${props => props.theme.solidColor} !important;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover::before,
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before {
    background-color: ${props => props.theme.solidColor} !important;
  }

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within {
    box-shadow: ${props => props.theme.lightShadowColor} !important;
  }

  .ant-radio-button-wrapper {
    &:hover {
      color: ${props => props.theme.solidColor} !important;
    }

    &:focus {
      box-shadow: ${props => props.theme.lightShadowColor} !important;
      outline: none;
    }
  }

  .ant-picker-cell-in-view {
    &.ant-picker-cell-selected,
    &.ant-picker-cell-range-start,
    &.ant-picker-cell-range-end {
      .ant-picker-cell-inner {
        &:not(.ant-picker-cell-today) {
          background: ${props => props.theme.solidColor} !important;
          color: white !important;
        }

        &:before {
            //border: 1px solid ${props => props.theme.solidColor} !important;
        }
      }
    }

    &.ant-picker-cell-today {
      .ant-picker-cell-inner {
        &:before {
          border: 1px solid ${props => props.theme.solidColor} !important;
        }
      }
    }
  }

  .calendar-item {
    &.has-event {
      border-bottom-color: ${props => props.theme.solidColor} !important;
    }
  }

  /** Datepicker */
  .ant-picker-content {
    thead {
      tr {
        th {
          text-align: center;
        }
      }
    }
  }

  .ant-picker:hover, .ant-picker-focused {
    border-color: ${props => props.theme.solidColor} !important;
  }

  .ant-picker-cell-in-view.ant-picker-cell-in-range::before,
  .ant-picker-cell-in-view.ant-picker-cell-range-start:not(.ant-picker-cell-range-start-single)::before, .ant-picker-cell-in-view.ant-picker-cell-range-end:not(.ant-picker-cell-range-end-single)::before {
    background: ${props => props.theme.solidLightColor} !important;
  }

  .ant-picker-focused {
    box-shadow: ${props => props.theme.lightShadowColor} !important;
  }

  .ant-picker-today-btn {
    color: ${props => props.theme.solidColor} !important;

    &:hover {
      color: ${props => props.theme.solidColor} !important;
    }
  }

  .ant-picker-now-btn {
    color: ${props => props.theme.solidColor} !important;
  }

  .ant-picker-range .ant-picker-active-bar {
    background: ${props => props.theme.solidColor} !important;
  }

  .ant-picker-week-panel-row-selected td, .ant-picker-week-panel-row-selected:hover td {
    background: ${props => props.theme.solidLightColor} !important;
  }

  .ant-picker-week-panel-row-selected td .ant-picker-cell-inner, .ant-picker-week-panel-row-selected:hover td .ant-picker-cell-inner {
    color: rgba(0, 0, 0, .65) !important;
  }

  .ant-picker-week-panel-row-selected td.ant-picker-cell-week, .ant-picker-week-panel-row-selected:hover td.ant-picker-cell-week {
    color: rgba(0, 0, 0, .25) !important;
  }

  .ant-picker-time-panel-column > li.ant-picker-time-panel-cell-selected .ant-picker-time-panel-cell-inner {
    background: ${props => props.theme.solidLightColor} !important;
  }

  /** Pagination */
  .ant-pagination-prev, .ant-pagination-next {
    &:focus, &:hover {
      .ant-pagination-item-link {
        &:not([disabled]) {
          color: ${props => props.theme.solidColor} !important;
        }
      }
    }
  }

  .ant-pagination-item-link {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }

  .ant-pagination-item {
    transition: all ease .3s;

    a {
      transition: all ease .3s;
    }

    &:focus, &:hover {
      color: ${props => props.theme.solidColor} !important;
      border-color: ${props => props.theme.solidColor} !important;
      transition: all ease .3s;

      a {
        color: ${props => props.theme.solidColor} !important;
        transition: all ease .3s;
      }
    }

    &-active {
      border-color: ${props => props.theme.solidColor} !important;

      a {
        color: ${props => props.theme.solidColor} !important;
      }
    }
  }

  .ant-pagination-jump-prev .ant-pagination-item-container .ant-pagination-item-link-icon,
  .ant-pagination-jump-next .ant-pagination-item-container .ant-pagination-item-link-icon {
    color: ${props => props.theme.solidColor} !important;
  }

  /** Timeline */
  .ant-timeline-item-head-blue {
    color: ${props => props.theme.solidColor} !important;
    border-color: ${props => props.theme.solidColor} !important;
  }

  /** Steps */
  // .ant-steps-item-process {
  //   .ant-steps-item-icon {
  //     background: ${props => props.theme.solidColor} !important;
  //     border-color: ${props => props.theme.solidColor} !important;
  //   }
  // }
  // .ant-steps .ant-steps-item:not(.ant-steps-item-active):not(.ant-steps-item-process) > .ant-steps-item-container[role='button']:hover .ant-steps-item-icon {
  //   border-color: ${props => props.theme.solidColor} !important;
  // }
  // .ant-steps-item-finish .ant-steps-item-icon {
  //   border-color: ${props => props.theme.solidColor} !important;
  //   > .ant-steps-icon {
  //     color: ${props => props.theme.solidColor} !important;
  //   }
  // } 
  // .ant-steps .ant-steps-item:not(.ant-steps-item-active) > .ant-steps-item-container[role='button']:hover .ant-steps-item-title, .ant-steps .ant-steps-item:not(.ant-steps-item-active) > .ant-steps-item-container[role='button']:hover .ant-steps-item-subtitle, .ant-steps .ant-steps-item:not(.ant-steps-item-active) > .ant-steps-item-container[role='button']:hover .ant-steps-item-description {
  //   color: ${props => props.theme.solidColor} !important;
  // }
  // .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-content > .ant-steps-item-title::after {
  //   background-color: ${props => props.theme.solidColor} !important;
  // }

  /** Menu */
  .ant-menu {
    &:not(.ant-menu-horizontal) {
      .ant-menu-item-selected {
        background-color: ${props => props.theme.solidLightColor} !important;
      }
    }
  }

  .ant-menu-inline-collapsed {
    width: 70px;

    .ant-menu-item {
      padding-left: 24px !important;
    }
  }

  .ant-menu-item-selected {
    color: ${props => props.theme.solidColor} !important;
  }

  .ant-menu-item:hover,
  .ant-menu-item-active,
  .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
  .ant-menu-submenu-active,
  .ant-menu-submenu-title:hover {
    color: ${props => props.theme.solidColor} !important;
  }

  .ant-menu-submenu-vertical > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::after,
  .ant-menu-submenu-vertical-left > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::after,
  .ant-menu-submenu-vertical-right > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::after,
  .ant-menu-submenu-inline > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::after,
  .ant-menu-submenu-vertical > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::before,
  .ant-menu-submenu-vertical-left > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::before,
  .ant-menu-submenu-vertical-right > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::before,
  .ant-menu-submenu-inline > .ant-menu-submenu-title:hover .ant-menu-submenu-arrow::before {
    background: ${props => props.theme.solidColor} !important;
    transition: all ease .3s;
  }

  .ant-menu-item {
    a:hover {
      color: ${props => props.theme.solidColor} !important;
    }
  }

  .ant-menu-vertical, .ant-menu-vertical-left, .ant-menu-vertical-right, .ant-menu-inline {
    .ant-menu-item::after {
      border-right: 3px solid ${props => props.theme.solidColor} !important;
    }
  }

  //drawer
  .ant-drawer-body {
    padding: 0 !important;
  }

  //Slick carousel
  .slick-slider.slick-initialized {
    padding-bottom: 16px;
  }

  .slick-prev:before, .slick-next:before {
    color: #ccc;
  }

  .slick-arrow.slick-next {
    z-index: 1;
    right: 0;
  }

  .slick-arrow.slick-prev {
    z-index: 1;
    left: 0;
  }

  .slick-list {
    margin: 0 32px;
  }

  .slick-dots {
    bottom: 0;
  }

  // Modal confirm
  .ant-modal-confirm-btns {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`
