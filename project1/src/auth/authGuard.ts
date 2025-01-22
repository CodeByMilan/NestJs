import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/custom/public.decorator';
import { Socket } from 'socket.io'

export interface AuthRequest extends Request {
  user?: {
    id: number;
    userName: string;
    email: string;
    role: string;
    password: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector, 
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true; 
    }
      // Check if the context is WebSocket
      if (context.getType() === 'ws') {
        const client: Socket = context.switchToWs().getClient();
        const token = this.extractTokenFromSocket(client);
  
        if (!token) {
          throw new UnauthorizedException('Token not provided in WebSocket');
        }
  
        try {
          const payload = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET,
          });
  
          if (!payload.role) {
            throw new UnauthorizedException('Invalid token: Role missing');
          }
  
          client.data.user = payload; 
          return true;
        } catch (error) {
          console.error('WebSocket token verification failed:', error.message);
          throw new UnauthorizedException('Invalid or expired token in WebSocket');
        }
      }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload.role) {
        throw new UnauthorizedException('Invalid token: Role missing');
      }

      request.user = payload;

      return true;
    } catch (error) {
      console.error('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
  private extractTokenFromSocket(client: Socket): string | undefined {
    // Token from WebSocket headers
    const authorization = client.handshake.headers.authorization;

    if (authorization) {
      const [type, token] = authorization.split(' ');
      return type === 'Bearer' ? token : undefined;
    }

    // Token from WebSocket query
    return client.handshake.query.token as string;
  }
 

 private extractTokenFromHeader(request: AuthRequest): string | undefined {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return undefined;
    }

    const [type, token] = authorization.split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}
