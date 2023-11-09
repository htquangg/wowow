import {
  Controller,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { TaskService } from '../../service/task.service';
import { TaskFacadeService } from '../../service/task.facade-service';
import { runInTransaction } from 'typeorm-transactional';
import { TaskFileService } from '../../service/task-file.service';

@Controller('/tasks')
export class TaskHttpController {
  constructor(
    private taskService: TaskService,
    private taskFileService: TaskFileService,
  ) {}

  @Post('/:id/files/upload')
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const task = await this.taskService.findOneById(id);
    if (!task) {
      return HttpStatus.NOT_FOUND;
    }

    files.map(async (file) => {
      const filename = file.originalname;
      const content = file.stream;

      return new Promise<void>((resolve) => {
        runInTransaction(async () => {
          const file = await this.taskService.uploadFile(filename, content);
          await this.taskFileService.uploadFile(task.id, file.filename, {
            path: file.path,
            baseUrl: file.baseUrl,
            completedUrl: file.completedUrl,
            mime: file.mime,
          });
          resolve();
        });
      });
    });

    return HttpStatus.OK;
  }
}
