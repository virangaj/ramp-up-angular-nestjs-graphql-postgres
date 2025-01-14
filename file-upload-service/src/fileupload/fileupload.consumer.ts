import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { FILEUPLOAD_QUEUE } from '../constants/constant';
import { Job, Queue } from 'bull';
import { Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core';
import {
  CreateBulkStudentInput,
  StudentInput,
} from 'src/types/create-bulk-student.input';
@Processor(FILEUPLOAD_QUEUE)
export class FileUploadConsumer {
  private readonly client: ApolloClient<any>;
  constructor(
    @InjectQueue(FILEUPLOAD_QUEUE) private readonly fileUploadQueue: Queue,
  ) {
    this.fileUploadQueue.on('completed', (job) => {
      this.logger.log(`Job ${job.id} completed.`);
    });

    this.fileUploadQueue.on('failed', (job, err) => {
      this.logger.error(`Job ${job.id} failed: ${err.message}`);
    });
    this.client = new ApolloClient({
      uri: 'http://localhost:3001/graphql',
      cache: new InMemoryCache(),
    });
  }

  private readonly logger = new Logger(FileUploadConsumer.name, {
    timestamp: true,
  });
  @Process(FILEUPLOAD_QUEUE)
  async fileUpload(job: Job<any>) {
    try {
      this.logger.log(
        `Processing job: ${JSON.stringify(job.data)} (Attempt: ${
          job.attemptsMade
        } of ${job.opts.attempts})`,
      );
      //  naviagate to file in local file path adn open the file
      //  find the data from sheet
      const filePath: string = job.data.filePath as string;
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data: StudentInput[] = XLSX.utils.sheet_to_json(worksheet, {
        raw: true,
      });
      this.logger.log('Data file read from file path : ' + filePath);
      //  generate the graphql query
      const mutation = gql`
        mutation BulkCreateStudents(
          $bulkCreateStudents: CreateBulkStudentInput!
        ) {
          bulkCreateStudents(bulkCreateStudents: $bulkCreateStudents) {
            id
            name
            age
            email
            gender
            address
            mobileNo
            dob
          }
        }
      `;
      const students: StudentInput[] = data.map((student) => {
        const dob = new Date(student.dob);
        return {
          name: student.name,
          age: student.age,
          email: student.email,
          gender: student.gender,
          address: student.address,
          mobileNo: student.mobileNo,
          dob: dob,
        };
      });
      // update variables
      const variables = { bulkCreateStudents: { bulkCreateStudents: students } };

      // execute the graphql query
      const response = await this.client.mutate({
        mutation,
        variables,
      });
      this.logger.log('Graphql query executed');
      if (response.data !== undefined) {
        fs.unlinkSync(filePath);
        this.logger.log('File deleted successfully :' + filePath);
      }
      return response.data.bulkCreateStudents;
    } catch (error) {
      throw new Error(`Failed to execute mutation: ${error.message}`);
    }
  }
}
