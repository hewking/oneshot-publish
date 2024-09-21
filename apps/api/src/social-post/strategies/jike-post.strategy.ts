import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink,
} from "@apollo/client/core";
import fetch from "cross-fetch";
import { SocialPostStrategy } from "../interfaces/social-post-strategy.interface";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JikePostStrategy implements SocialPostStrategy {
  private readonly logger = new Logger(JikePostStrategy.name);
  private readonly client: ApolloClient<any>;
  private readonly jikeConfig: any;

  constructor(private configService: ConfigService) {
    this.jikeConfig = this.configService.get("jike");
    if (!this.jikeConfig) {
      throw new Error("Jike configuration is missing");
    }

    this.client = new ApolloClient({
      link: new HttpLink({
        uri: this.jikeConfig.apiUrl,
        fetch,
        headers: {
          "x-jike-access-token": this.jikeConfig.accessToken,
        },
      }),
      cache: new InMemoryCache(),
    });
  }

  async post(content: string, images?: Buffer[]): Promise<boolean> {
    this.logger.log(
      `Attempting to post to Jike. Content: ${content.substring(0, 50)}...`
    );

    try {
      const CREATE_MESSAGE = gql`
        mutation CreateMessage($message: CreateMessageInput!) {
          createMessage(input: $message) {
            success
            toast
            __typename
          }
        }
      `;

      const pictureKeys = images ? await this.uploadImages(images) : [];

      const response = await this.client.mutate({
        mutation: CREATE_MESSAGE,
        variables: {
          message: {
            content,
            syncToPersonalUpdate: true,
            pictureKeys,
          },
        },
      });

      if (response.data.createMessage.success) {
        this.logger.log("Successfully posted to Jike");
        return true;
      } else {
        this.logger.warn(
          `Failed to post to Jike. Message: ${response.data.createMessage.toast}`
        );
        return false;
      }
    } catch (error) {
      this.logger.error(`Error posting to Jike: ${error.message}`);
      return false;
    }
  }

  private async uploadImages(images: Buffer[]): Promise<string[]> {
    const pictureKeys: string[] = [];
    for (const image of images) {
      const uptoken = await this.getUptoken();
      const uploadUrl = await this.getUploadUrl(uptoken);
      const pictureKey = await this.uploadToQiniu(uploadUrl, uptoken, image);
      pictureKeys.push(pictureKey);
    }
    return pictureKeys;
  }

  private async getUptoken(): Promise<string> {
    try {
      const response = await fetch(
        "https://upload.ruguoapp.com/1.0/misc/qiniu_uptoken",
        {
          headers: {
            accept: "*/*",
            "x-jike-access-token": this.jikeConfig.accessToken,
          },
          method: "GET",
        }
      );
      const data = await response.json();
      return data.uptoken;
    } catch (error) {
      this.logger.error(`Error getting uptoken: ${error.message}`);
      throw error;
    }
  }

  private async getUploadUrl(uptoken: string): Promise<string> {
    // 这里应该实现获取上传URL的逻辑
    // 由于没有具体的API信息，这里返回一个假设的URL
    return "https://upload.qiniup.com/";
  }

  private async uploadToQiniu(
    uploadUrl: string,
    uptoken: string,
    image: Buffer
  ): Promise<string> {
    try {
      const fileName = `${uuidv4()}.jpg`;
      const formData = new FormData();
      formData.append("file", new Blob([image]), fileName);
      formData.append("token", uptoken);
      formData.append("fname", fileName);

      const response = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      this.logger.log(`Successfully uploaded image: ${fileName}`);
      return response.data.key;
    } catch (error) {
      this.logger.error(`Error uploading image to Qiniu: ${error.message}`);
      throw error;
    }
  }
}
