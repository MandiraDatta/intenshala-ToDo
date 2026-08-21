import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts the current user's workspace membership from the request.
 * The WorkspaceMemberGuard must run before this decorator is used.
 * Usage: @CurrentWorkspaceMember() member, @CurrentWorkspaceMember('role') role
 */
export const CurrentWorkspaceMember = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const member = request.workspaceMember;
    if (!member) return null;
    return data ? member[data] : member;
  },
);
