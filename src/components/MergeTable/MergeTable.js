import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd'

const MergeTable = React.memo(props => {
  const names = new Set()
  const [paginationInfo, setPaginationInfo] = useState({
    current: 1,
    pageSize: 10,
  })

  const [data, setData] = useState([])

  useEffect(() => {
    // kinda hacky, cause render 2 times, names has all value, ann table shows incorectly
    names.clear()
  })
  const sharedOnCell = (_, index) => {
    if (_.name === 'John Brown7') {
      return {
        colSpan: 0,
      }
    }
    return {}
  }
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      rowSpan: 1,
      onCell: (_, index) => {
        console.log(_)
        return {
          colSpan: _.name === 'John Brown7' ? 2 : 1,
        }
      },
      render: (value, row, index) => {
        const trueIndex = index + paginationInfo.pageSize * (paginationInfo.current - 1)
        const obj = { children: value, props: {} }
        if (index >= 1 && value === data[trueIndex - 1].name) {
          obj.props.rowSpan = 0
        } else {
          for (let i = 0; trueIndex + i !== data.length && value === data[trueIndex + i].name; i += 1) {
            obj.props.rowSpan = i + 1
          }
        }
        return obj
      },
    },
    {
      title: 'Home phone',
      dataIndex: 'tel',
      onCell: sharedOnCell,
    },
  ]

  console.log(columns)


  useEffect(() => {
    let dataEx = []
    for (let i = 0; i < 100; i++) {
      dataEx.push(
        {
          key: i,
          name: i % 3 == 0 || i % 4 == 0 ? 'John Brown' : 'John Brown' + i,
          age: 32,
          tel: '0571-2209890' + i,
          phone: 18889898989,
          address: 'New York No. 1 Lake Park',
        },
      )
    }
    setData(dataEx)
  }, [])

  const handleChange = pagination => {
    setPaginationInfo(pagination)
  }

  return <Table onChange={handleChange} columns={columns} dataSource={data} bordered />
})

MergeTable.propTypes = {}

export default MergeTable
