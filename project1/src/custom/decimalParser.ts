import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsPositive, IsOptional } from 'class-validator';

export const CustomDecimalParser = (): PropertyDecorator => {
  return applyDecorators(
    
    // Transform decorator to parse the value
    Transform(({ value }) => {
      if (typeof value === 'string') {
        const decimalValue = parseFloat(value);
        return isNaN(decimalValue) ? null : decimalValue;
      } else if (typeof value === 'number') {
        return value;
      }
      return null; 
    }),
    
 
    IsPositive(),   
    IsOptional()    
  );
};
