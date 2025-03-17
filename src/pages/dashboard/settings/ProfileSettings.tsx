import React from 'react';
import { PersonalDataForm } from './steps/personal/PersonalDataForm.tsx';
import { AddressForm } from './steps/address/AddressForm';
import { BankDataForm } from './steps/bank/BankDataForm.tsx';
import { profileService } from '../../../services/profileService';
import {PersonalDataDto} from "../../../types/personal-data-dto.ts";

export const ProfileSettings = React.memo(function ProfileSettings({ activeTab }: { activeTab: 'personal' | 'address' | 'bank' }) {
  const handlePersonalSubmit = async (data: Partial<PersonalDataDto>) => {
    return await profileService.updateProfile(data);
  };

  const handleAddressSubmit = async (data: {
    cep: string | undefined;
    street: string | undefined;
    number: string | undefined;
    neighborhood: string | undefined;
    city: string | undefined;
    state: string | undefined;
  }) => {
    return await profileService.updateAddress(data);
  };

  const handleBankSubmit = async (data: {
    bank: string | undefined;
    accountType: string | undefined;
    agency: string | undefined;
    account: string | undefined;
  }) => {
    return await profileService.updateBankInfo(data);
  };

  return (
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {activeTab === 'personal' && 'Dados Pessoais'}
              {activeTab === 'address' && 'Endereço'}
              {activeTab === 'bank' && 'Dados Bancários'}
            </h3>
          </div>

          {activeTab === 'personal' && (
              <PersonalDataForm
                  initialData={{
                    firstName: '',
                    lastName: '',
                    cpf: '',
                    phone: '',
                    birthDate: '',
                    email: '',
                  }}
                  onSubmit={handlePersonalSubmit}
              />
          )}

          {activeTab === 'address' && (
              <AddressForm
                  initialData={{
                    cep: '',
                    street: '',
                    number: '',
                    neighborhood: '',
                    city: '',
                    state: '',
                  }}
                  onSubmit={handleAddressSubmit}
              />
          )}

          {activeTab === 'bank' && (
              <BankDataForm
                  initialData={{
                    bank: '',
                    accountType: '',
                    agency: '',
                    account: '',
                  }}
                  onSubmit={handleBankSubmit}
              />
          )}
        </div>
      </div>
  );
});