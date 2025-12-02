import { 
  IsString, 
  IsEmail, 
  IsNotEmpty, 
  MinLength, 
  MaxLength, 
  IsOptional 
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom est requis' })
  @MinLength(2, { message: 'Le nom doit contenir au moins 2 caractères' })
  @MaxLength(50, { message: 'Le nom ne peut pas dépasser 50 caractères' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Le prénom est requis' })
  @MinLength(2, { message: 'Le prénom doit contenir au moins 2 caractères' })
  @MaxLength(50, { message: 'Le prénom ne peut pas dépasser 50 caractères' })
  lastName: string;

  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  password: string;

  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Le numéro de téléphone ne peut pas dépasser 20 caractères' })
  phoneNumber?: string;
}
