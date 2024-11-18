import { Role } from '../../users/enums/role.enum';
import { PermissionType } from './permission.type';

export interface ActiveUserData {
  permissions: PermissionType[];
  sub: number;
  email: string;
  role: Role;
}
