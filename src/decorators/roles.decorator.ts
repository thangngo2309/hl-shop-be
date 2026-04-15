import { Reflector } from '@nestjs/core';
import { UserRole } from '../enum/users.enum';

export const Roles = Reflector.createDecorator<UserRole[]>();