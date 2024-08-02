import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
//import { AxiosService } from '@nestjs/axios';

@Injectable()
export class PtSevice {
    constructor() { }

    //@Cron('0 0 * * *') // 24hours
    //@Cron('*/10 * * * * *') // 10 seconds
    /*  handleCron() {
         console.log('Disparo de lembretes para ao final da sprint');
         
     } */
}
