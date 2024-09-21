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

@Injectable()
export class JikePostStrategy implements SocialPostStrategy {
  private readonly logger = new Logger(JikePostStrategy.name);
  private readonly apiUrl: string;
  private readonly accessToken: string;
  private readonly client: ApolloClient<any>;

  constructor(private configService: ConfigService) {
    this.apiUrl = this.configService.get<string>("JIKE_API_URL");
    this.accessToken = this.configService.get<string>("JIKE_ACCESS_TOKEN");

    this.client = new ApolloClient({
      link: new HttpLink({
        uri: this.apiUrl,
        fetch,
        headers: {
          "x-jike-access-token": this.accessToken,
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
    // 这里需要实现图片上传逻辑
    // 返回上传后的图片 keys
    return [];
  }
}
