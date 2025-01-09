import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";


@Processor('audio') 
export class AudioQueueProcessor  extends WorkerHost{
  
 process(job: Job, token?: string): Promise<any> {
  console.log("hello")
  return this.handleAudioJob(job);
  }
  async handleAudioJob(job: Job) {
    console.log('Hi');
  }
}
