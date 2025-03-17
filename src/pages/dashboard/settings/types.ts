/**
 * Common form data interface for settings
 */
export interface SettingsFormData {
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  birthDate: string;
  phone: string;
  bio: string;
  location: string;
  website: string;
  // Address fields
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  // Bank fields
  bank: string;
  accountType: 'checking' | 'savings';
  agency: string;
  account: string;
  // Notification preferences
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

/**
 * Form errors interface
 */
export interface FormErrors {
  [key: string]: string;
}

/**
 * Props for notification settings
 */
export interface NotificationSettingsProps {
  formData: SettingsFormData;
  onNotificationChange: (type: 'email' | 'push', setting: string) => void;
}

/**
 * Props for profile settings
 */
export interface ProfileSettingsProps {
  formData: SettingsFormData;
  formErrors: FormErrors;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  formSuccess: string | null;
  activeTab?: 'personal' | 'address' | 'bank';
}

/**
 * Props for security settings
 */
export interface SecuritySettingsProps {
  onDeleteAccount: () => void;
}

/**
 * Props for settings tab
 */
export interface SettingsTabProps {
  id: string;
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}