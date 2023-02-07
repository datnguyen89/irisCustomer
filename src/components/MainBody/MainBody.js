import React from 'react';
import PropTypes from 'prop-types';
import { MainBodyWrapper } from './MainBodyStyled';
import { DEVICE, SIDEBAR_WIDTH_COLLAPSE, SIDEBAR_WIDTH_EXPAND } from '../../utils/constant'
import { inject, observer } from 'mobx-react'

const MainBody = props => {
    // region props, hook, state =================
    const { children, commonStore } = props

    // endregion
    // region destructuring ======================
    const { isCollapse, device } = commonStore

    // endregion
    // region variable ===========================

    // endregion
    // region function handle logic ==============
    const renderContentMargin = () => {
        if (device === DEVICE.MOBILE) return 0;
        if (isCollapse) {
            return SIDEBAR_WIDTH_COLLAPSE
        } else {
            return SIDEBAR_WIDTH_EXPAND
        }
    }
    // endregion
    // region function render ====================

    // endregion
    // region side effect ========================

    // endregion

    return (
        <MainBodyWrapper marginLeft={renderContentMargin}>
            {children}
        </MainBodyWrapper>
    );
};

MainBody.propTypes = {

};
export default inject('commonStore')(observer(MainBody))
