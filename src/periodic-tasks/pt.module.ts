import { Module } from '@nestjs/common';
import { PtSevice } from './pt.service';


@Module({
    imports: [],
    providers: [PtSevice],
})
export class PtModule { }
