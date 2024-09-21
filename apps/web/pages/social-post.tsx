import React, { useState } from "react";
import { createSocialPost } from "../services/api";
import Link from "next/link";
import { Upload, Modal, message, Button, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";

const { TextArea } = Input;

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function SocialPost() {
  const [text, setText] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleSubmit = async () => {
    if (!text || fileList.length === 0) {
      message.error("Please enter text and upload at least one image");
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

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
        Create Social Post
      </h1>
      <Link href="/">
        <Button type="primary" style={{ marginBottom: "20px" }}>
          Back to Home
        </Button>
      </Link>
      <div style={{ marginBottom: "20px" }}>
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </div>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false} // Prevent auto upload
      >
        {fileList.length >= 9 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
      <Button
        type="primary"
        onClick={handleSubmit}
        style={{ marginTop: "20px" }}
      >
        Create Post
      </Button>
    </div>
  );
}
