export interface SocialPostStrategy {
  post(content: string, images?: Buffer[]): Promise<boolean>;
}