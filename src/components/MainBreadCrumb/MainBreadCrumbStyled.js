import styled from 'styled-components'

export const MainBreadCrumbWrapper = styled.div`
  margin-bottom: 16px;
  border-left: solid 4px #FFA50C;
  padding-left: 8px;
  .ant-breadcrumb {
    ol li:before {
      content: none;
    }
  }
`