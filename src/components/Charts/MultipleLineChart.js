import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Line } from '@ant-design/charts'
import LineChart from './LineChart'
import numberUtils from '../../utils/numberUtils'

const MultipleLineChart = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    let data = [
      {
        'name': 'China',
        'time': '2000',
        'amount': 121134686960524,
      },
      {
        'name': 'China',
        'time': '2001',
        'amount': 13393957188653,
      },
      {
        'name': 'China',
        'time': '2002',
        'amount': 147055001508155,
      },
      {
        'name': 'China',
        'time': '2003',
        'amount': 166028796566268,
      },
      {
        'name': 'China',
        'time': '2004',
        'amount': 195534700496327,
      },
      {
        'name': 'China',
        'time': '2005',
        'amount': 228596589236054,
      },
      {
        'name': 'China',
        'time': '2006',
        'amount': 275213177335516,
      },
      {
        'name': 'China',
        'time': '2007',
        'amount': 355034242523825,
      },
      {
        'name': 'China',
        'time': '2008',
        'amount': 459430684876308,
      },
      {
        'name': 'China',
        'time': '2009',
        'amount': 510170243288345,
      },
      {
        'name': 'China',
        'time': '2010',
        'amount': 608716452742124,
      },
      {
        'name': 'China',
        'time': '2011',
        'amount': 755150042559777,
      },
      {
        'name': 'China',
        'time': '2012',
        'amount': 853223072414176,
      },
      {
        'name': 'China',
        'time': '2013',
        'amount': 957040575873979,
      },
      {
        'name': 'China',
        'time': '2014',
        'amount': 104385291532376,
      },
      {
        'name': 'China',
        'time': '2015',
        'amount': 110155423524689,
      },
      {
        'name': 'China',
        'time': '2016',
        'amount': 111379456693506,
      },
      {
        'name': 'China',
        'time': '2017',
        'amount': 121434914481861,
      },
      {
        'name': 'China',
        'time': '2018',
        'amount': 136081518646379,
      },
      {
        'name': 'United States',
        'time': '2000',
        'amount': 10252345464000,
      },
      {
        'name': 'United States',
        'time': '2001',
        'amount': 10581821399000,
      },
      {
        'name': 'United States',
        'time': '2002',
        'amount': 10936419054000,
      },
      {
        'name': 'United States',
        'time': '2003',
        'amount': 11458243878000,
      },
      {
        'name': 'United States',
        'time': '2004',
        'amount': 12213729147000,
      },
      {
        'name': 'United States',
        'time': '2005',
        'amount': 13036640229000,
      },
      {
        'name': 'United States',
        'time': '2006',
        'amount': 13814611414000,
      },
      {
        'name': 'United States',
        'time': '2007',
        'amount': 14451858650000,
      },
      {
        'name': 'United States',
        'time': '2008',
        'amount': 14712844084000,
      },
      {
        'name': 'United States',
        'time': '2009',
        'amount': 14448933025000,
      },
      {
        'name': 'United States',
        'time': '2010',
        'amount': 14992052727000,
      },
      {
        'name': 'United States',
        'time': '2011',
        'amount': 15542581104000,
      },
      {
        'name': 'United States',
        'time': '2012',
        'amount': 16197007349000,
      },
      {
        'name': 'United States',
        'time': '2013',
        'amount': 16784849190000,
      },
      {
        'name': 'United States',
        'time': '2014',
        'amount': 17521746534000,
      },
      {
        'name': 'United States',
        'time': '2015',
        'amount': 18219297584000,
      },
      {
        'name': 'United States',
        'time': '2016',
        'amount': 18707188235000,
      },
      {
        'name': 'United States',
        'time': '2017',
        'amount': 19485393853000,
      },
      {
        'name': 'United States',
        'time': '2018',
        'amount': 205443434569365,
      },
      {
        'name': 'United Kingdom',
        'time': '2000',
        'amount': 165781661370858,
      },
      {
        'name': 'United Kingdom',
        'time': '2001',
        'amount': 164024614941701,
      },
      {
        'name': 'United Kingdom',
        'time': '2002',
        'amount': 178447392086331,
      },
      {
        'name': 'United Kingdom',
        'time': '2003',
        'amount': 20530187755102,
      },
      {
        'name': 'United Kingdom',
        'time': '2004',
        'amount': 241693152691322,
      },
      {
        'name': 'United Kingdom',
        'time': '2005',
        'amount': 2538680000000,
      },
      {
        'name': 'United Kingdom',
        'time': '2006',
        'amount': 27137497700092,
      },
      {
        'name': 'United Kingdom',
        'time': '2007',
        'amount': 310088235294118,
      },
      {
        'name': 'United Kingdom',
        'time': '2008',
        'amount': 292266727941176,
      },
      {
        'name': 'United Kingdom',
        'time': '2009',
        'amount': 241090979903412,
      },
      {
        'name': 'United Kingdom',
        'time': '2010',
        'amount': 247524432136111,
      },
      {
        'name': 'United Kingdom',
        'time': '2011',
        'amount': 265931005464623,
      },
      {
        'name': 'United Kingdom',
        'time': '2012',
        'amount': 270488767838672,
      },
      {
        'name': 'United Kingdom',
        'time': '2013',
        'amount': 278602287270681,
      },
      {
        'name': 'United Kingdom',
        'time': '2014',
        'amount': 306380324020801,
      },
      {
        'name': 'United Kingdom',
        'time': '2015',
        'amount': 292859100200251,
      },
      {
        'name': 'United Kingdom',
        'time': '2016',
        'amount': 269428320961329,
      },
      {
        'name': 'United Kingdom',
        'time': '2017',
        'amount': 266622917995801,
      },
      {
        'name': 'United Kingdom',
        'time': '2018',
        'amount': 285529673152196,
      },
      {
        'name': 'Russian',
        'time': '2000',
        'amount': 25971014219694,
      },
      {
        'name': 'Russian',
        'time': '2001',
        'amount': 3066020706205,
      },
      {
        'name': 'Russian',
        'time': '2002',
        'amount': 34547049441786,
      },
      {
        'name': 'Russian',
        'time': '2003',
        'amount': 43034777073179,
      },
      {
        'name': 'Russian',
        'time': '2004',
        'amount': 5910166907428,
      },
      {
        'name': 'Russian',
        'time': '2005',
        'amount': 76401710799239,
      },
      {
        'name': 'Russian',
        'time': '2006',
        'amount': 9899305422787,
      },
      {
        'name': 'Russian',
        'time': '2007',
        'amount': 129970576482362,
      },
      {
        'name': 'Russian',
        'time': '2008',
        'amount': 166084638762478,
      },
      {
        'name': 'Russian',
        'time': '2009',
        'amount': 122264428220186,
      },
      {
        'name': 'Russian',
        'time': '2010',
        'amount': 152491746844201,
      },
      {
        'name': 'Russian',
        'time': '2011',
        'amount': 205166173205978,
      },
      {
        'name': 'Russian',
        'time': '2012',
        'amount': 221025697694538,
      },
      {
        'name': 'Russian',
        'time': '2013',
        'amount': 229712803905821,
      },
      {
        'name': 'Russian',
        'time': '2014',
        'amount': 205998415843846,
      },
      {
        'name': 'Russian',
        'time': '2015',
        'amount': 136359436957782,
      },
      {
        'name': 'Russian',
        'time': '2016',
        'amount': 128272388113401,
      },
      {
        'name': 'Russian',
        'time': '2017',
        'amount': 157862406058826,
      },
      {
        'name': 'Russian',
        'time': '2018',
        'amount': 165755464714987,
      },
      {
        'name': 'Japan',
        'time': '2000',
        'amount': 488751966074486,
      },
      {
        'name': 'Japan',
        'time': '2001',
        'amount': 430354425984272,
      },
      {
        'name': 'Japan',
        'time': '2002',
        'amount': 411511627906977,
      },
      {
        'name': 'Japan',
        'time': '2003',
        'amount': 444565807122186,
      },
      {
        'name': 'Japan',
        'time': '2004',
        'amount': 481514885436211,
      },
      {
        'name': 'Japan',
        'time': '2005',
        'amount': 475541063091214,
      },
      {
        'name': 'Japan',
        'time': '2006',
        'amount': 45303772249704,
      },
      {
        'name': 'Japan',
        'time': '2007',
        'amount': 451526451443057,
      },
      {
        'name': 'Japan',
        'time': '2008',
        'amount': 503790846511448,
      },
      {
        'name': 'Japan',
        'time': '2009',
        'amount': 52313826745937,
      },
      {
        'name': 'Japan',
        'time': '2010',
        'amount': 570009811474441,
      },
      {
        'name': 'Japan',
        'time': '2011',
        'amount': 615745959482372,
      },
      {
        'name': 'Japan',
        'time': '2012',
        'amount': 620321312133412,
      },
      {
        'name': 'Japan',
        'time': '2013',
        'amount': 515571705627083,
      },
      {
        'name': 'Japan',
        'time': '2014',
        'amount': 485041353603784,
      },
      {
        'name': 'Japan',
        'time': '2015',
        'amount': 438947562258897,
      },
      {
        'name': 'Japan',
        'time': '2016',
        'amount': 492666708736751,
      },
      {
        'name': 'Japan',
        'time': '2017',
        'amount': 485995055853897,
      },
      {
        'name': 'Japan',
        'time': '2018',
        'amount': 497132307977187,
      },
    ]
    setData(data)
  }, [])


  const config = {
    data,
    xField: 'time',
    yField: 'amount',
    seriesField: 'name',
    meta: {
      amount: {
        formatter: e => {
          return `${numberUtils.thousandSeparator(e)} đ`
        },
      },
    },
    yAxis: {
      label: {
        formatter: (e) => `${numberUtils.thousandSeparator(e)} đ`,
      },
    },
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 3000,
      },
    },
  }

  return <Line {...config} />
}

MultipleLineChart.propTypes = {}

export default MultipleLineChart
