import { BaseQueryParamsDto } from '../../common/dto/query-params-base.dto';
import { PartialType } from '@nestjs/swagger';

export class GetHolidaysQueryDto extends PartialType(BaseQueryParamsDto) {
  constructor(partial: Partial<GetHolidaysQueryDto>) {
    super();
    Object.assign(this, partial);
  }
}
