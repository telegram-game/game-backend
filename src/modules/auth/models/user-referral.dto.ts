import { IsNumber } from 'class-validator';
import { PagingResponse } from 'src/models/paging.model';

export class GetReferralPagingRequest {
  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;
}

export class GetReferralPagingData {
  userId: string;
  firstName: string;
  lastName: string;
}

export class GetReferralPagingResponse extends PagingResponse<GetReferralPagingData> {
}
