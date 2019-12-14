import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Models } from '../../helpers/Models';
import { UsersModule } from '../users/users.module';
import { MarriageReqService } from './services/marriage-req.service';
import { MarriageReqController } from './controllers/marriageReq.controller';
import { MarriageReqSchema } from './schemas/MarriageReq';
import { ReqPlanSchema } from './schemas/ReqPlan';
import { ReqPlansService } from './services/req-plans.service';
import { ReqPlansController } from './controllers/req-plans.controller';
import { UtilService } from '../../helpers/util.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Models.marriage_req, schema: MarriageReqSchema },
            { name: Models.req_plan, schema: ReqPlanSchema },
        ]),
        forwardRef(() => UsersModule)
    ],
    controllers: [MarriageReqController, ReqPlansController],
    providers: [MarriageReqService, ReqPlansService, UtilService],
    exports: []
})
export class MarriageReqModule { }
