/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { createSocialPost } from "../services/api";
import Link from "next/link";
import { Upload, Modal, message, Button, Input, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import { socialPostStyles } from "../styles/SocialPost.styles";

const { TextArea } = Input;

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const SocialPost: React.FC = () => {
  const [text, setText] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1));
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const handleSubmit = async () => {
    if (!text) {
      message.error("Please enter some text for your post");
      return;
    }

    const formData = new FormData();
    formData.append("content", text);
    fileList.forEach((file) => {
      formData.append("images", file.originFileObj as Blob);
    });

    try {
      await createSocialPost(formData);
      message.success("Post created successfully!");
      setText("");
      setFileList([]);
    } catch (error) {
      console.error("Error creating post:", error);
      message.error("Failed to create post");
    }
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const renderPreview = () => (
    <Card css={socialPostStyles.previewCard}>
      <h2 css={socialPostStyles.previewTitle}>Preview</h2>
      <p css={socialPostStyles.previewContent}>{text}</p>
      <div css={socialPostStyles.previewImages}>
        {fileList.map((file) => (
          <img
            key={file.uid}
            src={file.thumbUrl || file.url}
            alt={file.name}
            css={socialPostStyles.previewImage}
          />
        ))}
      </div>
    </Card>
  );

  const renderForm = () => (
    <>
      <TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        autoSize={{ minRows: 3, maxRows: 5 }}
        css={socialPostStyles.postTextarea}
      />
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false} // Prevent auto upload
        css={socialPostStyles.postUpload}
      >
        {fileList.length >= 9 ? null : uploadButton}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );

  return (
    <div css={socialPostStyles.container}>
      <h1 css={socialPostStyles.title}>Create Social Post</h1>
      <div css={socialPostStyles.postForm}>
        {isPreviewMode ? renderPreview() : renderForm()}
        <div css={socialPostStyles.buttonGroup}>
          <Button onClick={togglePreviewMode} css={socialPostStyles.button}>
            {isPreviewMode ? "Edit" : "Preview"}
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={isPreviewMode}
            css={socialPostStyles.button}
          >
            Create Post
          </Button>
        </div>
      </div>
      <Link href="/">
        <Button type="link" style={{ marginTop: "20px" }}>
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default SocialPost;
