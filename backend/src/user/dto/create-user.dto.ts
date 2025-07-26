   export class CreateUserDto {
     email: string;
     name: string;
     password: string;
     role?: string;
     // Additional fields for real data
     phone?: string;
     address?: string;
     birthDate?: Date;
     gender?: string;
     parentName?: string;
     parentPhone?: string;
     school?: string;
     grade?: string;
     isActive?: boolean;
   }