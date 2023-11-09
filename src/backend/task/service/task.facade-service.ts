import { Injectable } from '@nestjs/common';
import { AwsS3Service } from 'src/backend/services/aws/service/s3.service';
import { Readable } from 'stream';

@Injectable()
export class TaskFacadeService {
  constructor(private awsS3Service: AwsS3Service) {}

  public async uploadFile(
    filename: string,
    content: string | Uint8Array | Buffer | Readable | ReadableStream | Blob,
  ) {
    return await this.awsS3Service.putItemInBucket(filename, content);
  }
}
