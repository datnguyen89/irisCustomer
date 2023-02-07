import styled from 'styled-components'
import { Upload } from 'antd'


export const TransferMethodWrapper = styled.div`
  display: flex;
  margin: 8px;
  align-items: stretch;
`

export const WidgetItemTransferMethod = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin: 8px;
  width: 33%;
  overflow: hidden;

`
export const TopTransferMethod = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  padding: 10px 30px;
  background: #ffffff;

  img {
    object-fit: cover;
    height: 52px;
    width: 52px;
  }

  span {
    text-align: justify;
    font-style: italic;
    color: rgba(132, 135, 136, 0.78);;
  }
  .ant-upload-list {
    display: none;
  }
`
export const BottomTransferMethod = styled.div`
  background: #4C68EF;
  padding: 20px;
  color: white;
  font-weight: normal;
  font-size: 2rem;

  &.bg-yellow {
    background: #FFA50C;
  }
`

export const TopTransferMethodLeftArea = styled.div`
  margin-right: 20px;
  display: flex;
  align-items: flex-start;
`

export const TopTransferMethodRightArea = styled.div`
  margin-bottom: -10px;

  h5 {
    color: #848788;
    margin-bottom: 0;
    margin-bottom: -5px;
    margin-top: 10px;
  }

  h1 {
    font-size: 3rem;
  }
`

export const UploadCustom = styled(Upload)`
  cursor: pointer;
  .ant-upload {
    display: flex;
    margin-left: 0;
  }
  span {
    margin-left: 30px;
  }
`