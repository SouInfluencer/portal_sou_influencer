import React from 'react';
import { User, Phone, Calendar, AtSign } from 'lucide-react';
import MaskedInput from 'react-input-mask';

interface PersonalDataFormProps {
    initialData: {
        firstName: string;
        lastName: string;
        cpf: string;
        phone: string;
        birthDate: string;
        email: string;
    };
    onSubmit: (data: PersonalDataFormProps['initialData']) => Promise<boolean>;
}

export const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = React.useState(initialData);
    const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
    const [loading, setLoading] = React.useState(false);

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            case 'cpf':
                if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)) {
                    error = 'CPF inválido';
                }
                break;
            case 'phone':
                if (!/^\(\d{2}\) \d\.\d{4}-\d{4}$/.test(value)) {
                    error = 'Telefone inválido';
                }
                break;
        }
        setFieldErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const isValid = Object.keys(formData).every(key => validateField(key, formData[key as keyof typeof formData]));
        if (isValid) {
            const success = await onSubmit(formData);
            if (success) {
                alert('Dados pessoais salvos com sucesso!');
            }
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        <User className="inline mr-2 h-4 w-4" />
                        Nome
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleFieldChange}
                        className={`mt-1 block w-full border ${
                            fieldErrors.firstName ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {fieldErrors.firstName && (
                        <p className="mt-2 text-sm text-red-600">{fieldErrors.firstName}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        <User className="inline mr-2 h-4 w-4" />
                        Sobrenome
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleFieldChange}
                        className={`mt-1 block w-full border ${
                            fieldErrors.lastName ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    />
                    {fieldErrors.lastName && (
                        <p className="mt-2 text-sm text-red-600">{fieldErrors.lastName}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                        <User className="inline mr-2 h-4 w-4" />
                        CPF
                    </label>
                    <MaskedInput
                        mask="999.999.999-99"
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        className={`mt-1 block w-full border ${
                            fieldErrors.cpf ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="000.000.000-00"
                    />
                    {fieldErrors.cpf && (
                        <p className="mt-2 text-sm text-red-600">{fieldErrors.cpf}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        <Phone className="inline mr-2 h-4 w-4" />
                        Telefone
                    </label>
                    <MaskedInput
                        mask="(99) 9.9999-9999"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFieldChange}
                        onBlur={handleFieldBlur}
                        className={`mt-1 block w-full border ${
                            fieldErrors.phone ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                        placeholder="(00) 0.0000-0000"
                    />
                    {fieldErrors.phone && (
                        <p className="mt-2 text-sm text-red-600">{fieldErrors.phone}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                        <Calendar className="inline mr-2 h-4 w-4" />
                        Data de Nascimento
                    </label>
                    <input
                        type="date"
                        name="birthDate"
                        id="birthDate"
                        value={formData.birthDate}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        <AtSign className="inline mr-2 h-4 w-4" />
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
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