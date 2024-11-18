import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { PermissionType } from '../../models/permission.type';
import { ActiveUserData } from '../../models/active-user.interface';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../../iam.constants';
import { PERMISSIONS_KEY } from '../../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextPermission = this.reflector.getAllAndOverride<
      PermissionType[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    console.log(contextPermission)

    if (!contextPermission) {
      return true;
    }

    const user: ActiveUserData = context.switchToHttp().getRequest<Request>()[
      REQUEST_USER_KEY
    ];

    return contextPermission.every((permission) =>
      user.permissions?.includes(permission),
    );
  }
}
