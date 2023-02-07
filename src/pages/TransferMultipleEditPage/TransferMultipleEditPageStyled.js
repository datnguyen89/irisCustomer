import styled from 'styled-components'
import apply from 'lodash-es/_apply'


export const TransferMultipleEditPageWrapper = styled.div`
  padding: 16px;
`
export const DownloadTemplateFile = styled.div`
  height: 160px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover {
    border: 1px solid ${props => props.borderColor};
  }
`
export const UploadAreaWrapper = styled.div`
  cursor: pointer;
  height: 160px;
  width: 100%;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    border: 1px solid ${props => props.borderColor};
  }
`

export const VerifyButton = styled.div`
  cursor: pointer;
  height: 160px;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  color: #fff;
  background-color: ${props => props.backGround};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
export const DownloadTemplateText = styled.div`
  margin-top: 8px;
  color: ${props => props.color};
  font-weight: 600;
`
export const ValidateTemplateText = styled.div`
  margin-top: 8px;
  color: #fff;
  font-weight: 600;
`
export const TitleUploadFile = styled.div`
  margin-top: 4px;
  color: #979797;
  font-weight: 600;
`
export const TextUploadFile = styled.div`
  margin-top: 4px;
  color: #979797;

  span {
    color: ${props => props.color};
  }
`
export const DividerWrapper = styled.div`
  background-color: #F6F6F6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  margin: 16px 0;
`
export const DividerLeft = styled.div`
  font-size: 1.6rem;
  .value {
    margin: 0 4px;
    color: ${props => props.color};
  }
  .text {
    color: #848788;
  }
`
export const DividerRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  .export-file {
    color: ${props => props.color};
    text-decoration: underline;
    cursor: pointer;
    font-size: 1.6rem;    
  }
`
export const StatusColumnWrapper = styled.div`
  display: flex;
  align-items: center;
  span {
    margin-left: 8px;
    margin-top: 2px;
  }
`
export const FileNameText = styled.span`
  cursor: pointer;
  color: ${props => props.color};
`