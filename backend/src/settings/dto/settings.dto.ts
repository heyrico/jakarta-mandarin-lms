export class CreateSettingDto {
  key: string;
  value: string;
  category: string;
  description?: string;
  isActive?: boolean;
}

export class UpdateSettingDto {
  value?: string;
  category?: string;
  description?: string;
  isActive?: boolean;
}

export class BulkUpdateSettingDto {
  key: string;
  value?: string;
  category?: string;
  description?: string;
  isActive?: boolean;
} 