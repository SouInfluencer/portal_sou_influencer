import React from 'react';
import { MapPin, Home, Building2 } from 'lucide-react';
import MaskedInput from 'react-input-mask';
import {profileService} from "../../../../../services/profileService.ts";

interface AddressFormProps {
    initialData: {
        cep: string;
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
    };
    onSubmit: (data: {
        cep: string;
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
    }) => Promise<boolean>;
}

export const AddressForm: React.FC<AddressFormProps> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = React.useState(initialData);
    const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
    const [isFetchingCep, setIsFetchingCep] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
            case 'cep':
                if (!/^\d{5}-\d{3}$/.test(value)) {
                    error = 'CEP inválido';
                }
                break;
        }
        setFieldErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            setIsFetchingCep(true);
            try {
                const addressData = await profileService.searchCEP(cep);
                if (addressData) {
                    setFormData(prev => ({
                        ...prev,
                        street: addressData.logradouro || '',
                        neighborhood: addressData.bairro || '',
                        city: addressData.localidade || '',
                        state: addressData.uf || '',
                    }));
                } else {
                    alert('CEP não encontrado');
                }
            } catch {
                alert('Erro ao buscar CEP');
            } finally {
                setIsFetchingCep(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const isValid = (Object.keys(formData) as (keyof typeof formData)[]).every(key => validateField(key, formData[key]));
        if (isValid) {
            const success = await onSubmit(formData);
            if (success) {
                alert('Endereço salvo com sucesso!');
            }
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                        <MapPin className="inline mr-2 h-4 w-4" />
                        CEP
                    </label>
                    <MaskedInput
                        type="text"
                        mask="99999-999"
                        id="cep"
                        name="cep"
                        value={formData.cep}
                        onChange={handleFieldChange}
                        onBlur={(e) => {
                            handleFieldBlur(e);
                            handleCepBlur(e).then(() => {});
                        }}
                        className={`mt-1 block w-full border ${
                            fieldErrors.cep ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:border-gray-400`}
                        placeholder="00000-000"
                        disabled={false}
                    />
                    {isFetchingCep && (
                        <div className="mt-2 text-sm text-blue-600">
                            Buscando endereço...
                        </div>
                    )}
                    {fieldErrors.cep && (
                        <p className="mt-2 text-sm text-red-600">{fieldErrors.cep}</p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                        <Home className="inline mr-2 h-4 w-4" />
                        Rua
                    </label>
                    <input
                        type="text"
                        name="street"
                        id="street"
                        value={formData.street}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                        <Home className="inline mr-2 h-4 w-4" />
                        Número
                    </label>
                    <input
                        type="text"
                        name="number"
                        id="number"
                        value={formData.number}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
                        <Home className="inline mr-2 h-4 w-4" />
                        Bairro
                    </label>
                    <input
                        type="text"
                        name="neighborhood"
                        id="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        <Building2 className="inline mr-2 h-4 w-4" />
                        Cidade
                    </label>
                    <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        <Building2 className="inline mr-2 h-4 w-4" />
                        Estado
                    </label>
                    <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Selecione...</option>
                        {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {loading ? 'Salvando...' : 'Salvar'}
                </button>
            </div>
        </form>
    );
};