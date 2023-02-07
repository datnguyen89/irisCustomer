import React from 'react'
import PropTypes from 'prop-types'
import numberUtils from '../../utils/numberUtils'
import { Line } from '@ant-design/charts'

const LineChart = props => {
  const data = [
    {
      year: '1991',
      value: 3000000,
    },
    {
      year: '1992',
      value: 4000000,
    },
    {
      year: '1993',
      value: 3500000,
    },
    {
      year: '1994',
      value: 5000000,
    },
    {
      year: '1995',
      value: 4900000,
    },
    {
      year: '1996',
      value: 6000000,
    },
    {
      year: '1997',
      value: 7000000,
    },
    {
      year: '1998',
      value: 9000000,
    },
    {
      year: '1999',
      value: 13000000,
    },
  ]
  const config = {
    data,
    xField: 'year',
    yField: 'value',
    label: {},
    meta: {
      value: {
        alias: 'Doanh thu',
        formatter: e => {
          return numberUtils.thousandSeparator(e)
        },
      },
      year: {
        alias: 'Năm',
      },
    },
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      title: 'Tiêu đề (optinal)',
      fields: ['year', 'value'],
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  }
  return (
    <div>
      <Line {...config} />
    </div>
  )

}

LineChart.propTypes = {

}

export default LineChart