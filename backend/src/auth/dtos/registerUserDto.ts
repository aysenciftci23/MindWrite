import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'İsim zorunludur.' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Soyisim zorunludur.' })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  password: string;


  @IsString()
  @IsOptional()
  role?: string;
}