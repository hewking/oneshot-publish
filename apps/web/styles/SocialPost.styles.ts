import { css } from '@emotion/react';

export const socialPostStyles = {
  container: css`
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
    min-height: 100vh;

    @media (max-width: 768px) {
      padding: 20px 10px;
    }
  `,
  title: css`
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 30px;
    color: #333;
    text-align: center;

    @media (max-width: 768px) {
      font-size: 24px;
      margin-bottom: 20px;
    }
  `,
  postForm: css`
    display: flex;
    flex-direction: column;
    gap: 25px;
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      gap: 20px;
      padding: 20px;
    }
  `,
  postTextarea: css`
    width: 100%;
    min-height: 120px;
    font-size: 16px;
    border-radius: 4px;
    resize: vertical;
  `,
  postUpload: css`
    width: 100%;
    .ant-upload-list-picture-card {
      display: flex;
      flex-wrap: wrap;
    }
    .ant-upload-list-picture-card .ant-upload-list-item,
    .ant-upload.ant-upload-select-picture-card {
      width: 104px;  // 原来是 104px，现在是原来的三分之二
      height: 104px; // 原来是 104px，现在是原来的三分之二
      margin: 0 8px 8px 0;
    }
    .ant-upload.ant-upload-select-picture-card {
      background-color: #fafafa;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      cursor: pointer;
      transition: border-color 0.3s;

      &:hover {
        border-color: #1890ff;
      }

      .ant-upload {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
    }
    .anticon {
      font-size: 24px;
      color: #999;
    }
    .ant-upload-text {
      margin-top: 8px;
      font-size: 12px;
      color: #666;
    }
  `,
  buttonGroup: css`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  `,
  button: css`
    min-width: 120px;
  `,
  previewCard: css`
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  `,
  previewTitle: css`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
  `,
  previewContent: css`
    font-size: 16px;
    color: #666;
    margin-bottom: 15px;
    white-space: pre-wrap;
  `,
  previewImages: css`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  `,
  previewImage: css`
    width: 69px;  // 调整为与上传项目相同的大小
    height: 69px; // 调整为与上传项目相同的大小
    object-fit: cover;
    border-radius: 4px;
  `,
};