import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind } from 'graphql';

@Scalar('DateTime', () => Date)
export class DateTimeScalar implements CustomScalar<any, Date> {

  desciption = 'Cusome date time scalar';
  parseValue(value: any): Date {
    return new Date(value);
  }
  serialize(value: Date): string {
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    return ''
  }
  parseLiteral(ast: any): Date {
    if(ast.kind===Kind.STRING) {
        return new Date(ast.value);
    }
    return null;
  }
}
