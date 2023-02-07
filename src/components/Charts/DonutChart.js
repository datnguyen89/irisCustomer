import React from 'react'
import PropTypes from 'prop-types'
import { Pie } from '@ant-design/charts'
import numberUtils from '../../utils/numberUtils'

const DonutChart = props => {
  const data = [
    {
      type: 'Top Up',
      value: 27,
    },
    {
      type: 'SMS',
      value: 25,
    },
    {
      type: 'BrandName',
      value: 18,
    },
    {
      type: 'Data',
      value: 15,
    },
    {
      type: 'Call center',
      value: 10,
    },
    {
      type: 'Vas',
      value: 5,
    },
  ]
  const config = {
    data,
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    meta: {
      value: {
        formatter: e => {
          return `${e} %`
        },
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: 'Iris',
      },
    },
    legend: {
      // title: '',
      position: 'right',
    },
  }
  return (
    <div>
      <Pie {...config} />
    </div>
  )
}

DonutChart.propTypes = {}

export default DonutChart