import { createParamDecorator } from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';

export const JwtAuthUser = createParamDecorator((data, req) => {
  const userPayload = req.switchToHttp().getRequest().user;

  const user = new User();
  user.id = userPayload.uid;
  user.name = userPayload.name;
  user.elo = userPayload.elo;
  user.matchCount = userPayload.matchCount;
  user.rank = userPayload.rank;

  return user;
});
