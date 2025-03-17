import React from 'react';
import { Ban } from 'lucide-react';
import MaskedInput from 'react-input-mask';

interface BankDataFormProps {
    initialData: {
        bank: string;
        accountType: string;
        agency: string;
        account: string;
    };
    onSubmit: (data: { bank: string; accountType: string; agency: string; account: string; }) => Promise<boolean>;
}

export const BankDataForm: React.FC<BankDataFormProps> = ({ initialData, onSubmit }) => {
    const [formData, setFormData] = React.useState(initialData);
    const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});
    const [loading, setLoading] = React.useState(false);

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const success = await onSubmit(formData);
        if (success) {
            alert('Dados bancários salvos com sucesso!');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label htmlFor="bank" className="block text-sm font-medium text-gray-700">
                        <Ban className="inline mr-2 h-4 w-4" />
                        Banco
                    </label>
                    <select
                        id="bank"
                        name="bank"
                        value={formData.bank}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Selecione o banco...</option>
                        <option value="001">Banco do Brasil</option>
                        <option value="341">Itaú</option>
                        <option value="033">Santander</option>
                        <option value="104">Caixa Econômica Federal</option>
                        <option value="237">Bradesco</option>
                        <option value="077">Inter</option>
                        <option value="260">Nubank</option>
                        <option value="336">C6 Bank</option>
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
                        <Ban className="inline mr-2 h-4 w-4" />
                        Tipo de Conta
                    </label>
                    <select
                        id="accountType"
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="">Selecione o tipo de conta...</option>
                        <option value="corrente">Conta Corrente</option>
                        <option value="poupanca">Conta Poupança</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="agency" className="block text-sm font-medium text-gray-700">
                        <Ban className="inline mr-2 h-4 w-4" />
                        Agência
                    </label>
                    <MaskedInput
                        mask="9999"
                        id="agency"
                        name="agency"
                        value={formData.agency}
                        onChange={handleFieldChange}
                        placeholder="0000"
                    />
                    {fieldErrors.agency && (
                        <p className="mt-2 text-sm text-red-600">{fieldErrors.agency}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                        <Ban className="inline mr-2 h-4 w-4" />
                        Conta
                    </label>
                    <MaskedInput
                        mask="99999999-9"
                        id="account"
                        name="account"
                        value={formData.account}
                        onChange={handleFieldChange}
                        placeholder="00000000-0"
                    />
                    {fieldErrors.account && (
                        <p className="mt-2 text-sm text-red-600">{fieldErrors.account}</p>
                    )}
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