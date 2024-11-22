import { UserGameProfileDailyCheckins } from "@prisma/client";
import { IsString } from "class-validator";

export class GetCheckinRequest {
    @IsString()
    gameProfileId: string;
}

export class ClaimCheckinRequest {
    @IsString()
    gameProfileId: string;
}

export class CheckinDataReponse {
    currentStack: number;
    data: UserGameProfileDailyCheckins[];
}