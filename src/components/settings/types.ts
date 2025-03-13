export interface SettingsFormData {
  name: string;
  email: string;
  cpf?: string;
  companyName?: string;
  cnpj?: string;
  cep?: string;
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  bank?: string;
  accountType?: string;
  agency?: string;
  account?: string;
  phone: string;
  bio: string;
  location: string;
  website: string;
  emailNotifications: {
    campaigns: boolean;
    messages: boolean;
    updates: boolean;
    marketing: boolean;
  };
  pushNotifications: {
    campaigns: boolean;
    messages: boolean;
    updates: boolean;
    marketing: boolean;
  };
}

export interface FormErrors {
  [key: string]: string;
}

export interface NotificationSettingsProps {
  formData: SettingsFormData;
  onNotificationChange: (type: 'email' | 'push', setting: string) => void;
}

export interface ProfileSettingsProps {
  formData: SettingsFormData;
  formErrors: FormErrors;
  activeTab: 'personal' | 'business' | 'address' | 'bank';
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  formSuccess: string | null;
}

export interface SecuritySettingsProps {
  onDeleteAccount: () => void;
}

export interface SettingsTabProps {
  id: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}