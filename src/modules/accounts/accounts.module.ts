import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Models } from '../../helpers/Models';
import { UsersModule } from '../users/users.module';
import { MarriageReqService } from './marriage-req.service';
import { MarriageReqController } from './marriageReq.controller';
import { MarriageReqSchema } from './schemas/MarriageReq';
import { ReqPlanSchema } from './schemas/ReqPlan';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Models.marriage_req, schema: MarriageReqSchema },
            { name: Models.req_plan, schema: ReqPlanSchema },
        ]),
        forwardRef(() => UsersModule)
    ],
    controllers: [MarriageReqController],
    providers: [MarriageReqService],
    exports: []
})
export class AccountsModule { }
