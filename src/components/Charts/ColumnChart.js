import React from 'react'
import PropTypes from 'prop-types'
import { Column } from '@ant-design/charts'

const ColumnChart = props => {
  const data = [
    {
      service: 'Top Up',
      customer: 38,
    },
    {
      service: 'SMS',
      customer: 52,
    },
    {
      service: 'Wallet',
      customer: 61,
    },
    {
      service: 'Call Center',
      customer: 145,
    },
    {
      service: 'GTGT',
      customer: 48,
    },
    {
      service: 'BrandName',
      customer: 18,
    },
    {
      service: 'DataCenter',
      customer: 28,
    },
    {
      service: 'Other',
      customer: 38,
    },
  ];
  const config = {
    data,
    xField: 'service',
    yField: 'customer',
    height: 230,
    autoFit: true,
    minColumnWidth: 32,
    maxColumnWidth: 32,
    label: {
      position: 'middle',
      // 'top', 'bottom', 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      service: {
        alias: 'Dịch vụ',
      },
      customer: {
        alias: 'Khách hàng',
      },
    },
  };
  return (
    <div>
      <Column {...config} />
    </div>
  )
}

ColumnChart.propTypes = {
  
}

export default ColumnChart