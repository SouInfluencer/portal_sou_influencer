import { useState } from "react";
import { Building2 } from "lucide-react";

const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

interface EstadoSelectProps {
    formData: { state: string };
    handleFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EstadoSelect({ formData, handleFieldChange }: EstadoSelectProps) {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Filtra os estados conforme o usuário digita
    const estadosFiltrados = estados.filter((estado) =>
        estado.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                <Building2 className="inline mr-2 h-4 w-4" />
                Estado
            </label>

            {/* Input para digitação */}
            <input
                type="text"
                id="state"
                name="state"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />

            {/* Dropdown de estados filtrados */}
            {isOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
                    {estadosFiltrados.length > 0 ? (
                        estadosFiltrados.map((estado) => (
                            <li
                                key={estado}
                                className="cursor-pointer px-3 py-2 hover:bg-blue-100"
                                onClick={() => {
                                    handleFieldChange({ target: { name: "state", value: estado } } as React.ChangeEvent<HTMLInputElement>);
                                    setSearch(estado);
                                    setIsOpen(false);
                                }}
                            >
                                {estado}
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-gray-500">Nenhum estado encontrado</li>
                    )}
                </ul>
            )}
        </div>
    );
}
