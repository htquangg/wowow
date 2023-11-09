import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  _Object,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';

@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('aws.s3.credential.key'),
        secretAccessKey: this.configService.get<string>(
          'aws.s3.credential.secret',
        ),
      },
      region: this.configService.get<string>('aws.s3.region'),
    });

    this.bucket = this.configService.get<string>('aws.s3.bucket');
    this.baseUrl = this.configService.get<string>('aws.s3.baseUrl');
  }

  async putItemInBucket(
    filename: string,
    content: string | Uint8Array | Buffer | Readable | ReadableStream | Blob,
    options?: {
      path: string;
      acl: ObjectCannedACL;
    },
  ): Promise<{
    path: string;
    pathWithFilename: string;
    filename: string;
    completedUrl: string;
    baseUrl: string;
    mime: string;
  }> {
    let path: string = options?.path;
    const acl: ObjectCannedACL = options?.acl
      ? (options.acl as ObjectCannedACL)
      : ObjectCannedACL.public_read;

    if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

    const mime: string = filename
      .substring(filename.lastIndexOf('.') + 1, filename.length)
      .toUpperCase();
    const key: string = path ? `${path}/${filename}` : filename;
    const command: PutObjectCommand = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: content,
      ACL: acl,
    });

    await this.s3Client.send<PutObjectCommandInput, PutObjectCommandOutput>(
      command,
    );

    return {
      path,
      pathWithFilename: key,
      filename: filename,
      completedUrl: `${this.baseUrl}/${key}`,
      baseUrl: this.baseUrl,
      mime,
    };
  }
}
