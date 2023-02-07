import React from 'react'
import PropTypes from 'prop-types'
import { Bar } from '@ant-design/charts'

const BarChart = props => {
  const data = [
    {
      type: 'BrandName',
      sales: 38,
    },
    {
      type: 'Top Up',
      sales: 52,
    },
    {
      type: 'Wallet',
      sales: 61,
    },
    {
      type: 'SMS',
      sales: 145,
    },
    {
      type: 'Call center',
      sales: 48,
    },
    {
      type: 'AI',
      sales: 38,
    },
    {
      type: 'Data Center',
      sales: 38,
    },
    {
      type: 'Other',
      sales: 38,
    },
  ]
  const config = {
    data,
    xField: 'sales',
    yField: 'type',
    seriesField: 'type',
    color: ({ type }) => {
      return type === 'SMS' ? '#FAAD14' : '#5B8FF9'
    },
    legend: false,
    meta: {
      type: {
        alias: 'Dịch vụ',
      },
      sales: {
        alias: 'Khách hàng',
      },
    },
  }
  return (
    <div>
      <Bar {...config} />
    </div>
  )
}

BarChart.propTypes = {}

export default BarChart