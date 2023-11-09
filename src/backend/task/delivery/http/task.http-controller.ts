import {
    Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UploadedFiles,
} from '@nestjs/common';
import { runInTransaction } from 'typeorm-transactional';

import { TaskService } from '../../service/task.service';
import { TaskFileService } from '../../service/task-file.service';
import { TaskActionService } from '../../service/task-action.service';

@Controller('/tasks')
export class TaskHttpController {
  constructor(
    private taskService: TaskService,
    private taskActionService: TaskActionService,
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

  @Post('/:id/predict')
  async predict(@Param('id') id: string, @Body() body: any) {
    const task = await this.taskService.findOneById(id);
    // TODO: will check not found
    const taskAction = await this.taskActionService.predict(
      task.id,
      body['coordinates'],
    );
    return {
      actionId: taskAction.id,
    };
  }
}
