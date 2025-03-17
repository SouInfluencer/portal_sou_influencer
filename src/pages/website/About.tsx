import React from 'react';
import { Info, Users, Star, Globe2, Award, CheckCircle } from 'lucide-react';

export function About() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Sobre Nós</h1>
        <p className="mt-1 text-sm text-gray-500">
          Conheça mais sobre a plataforma Sou Influencer
        </p>

        <div className="mt-8 space-y-8">
          {/* Mission Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Nossa Missão</h2>
              <p className="text-gray-600 leading-relaxed">
                Conectar marcas e criadores de conteúdo de forma transparente e eficiente, 
                democratizando o acesso ao marketing de influência e criando oportunidades 
                para influenciadores de todos os tamanhos.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/80">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="text-sm text-gray-500">Desde 2023</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">15K+</p>
              <p className="text-sm text-gray-500">Influenciadores ativos</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/80">
              <div className="flex items-center justify-between mb-4">
                <Globe2 className="h-6 w-6 text-blue-600" />
                <span className="text-sm text-gray-500">Em todo Brasil</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">45K+</p>
              <p className="text-sm text-gray-500">Campanhas realizadas</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/80">
              <div className="flex items-center justify-between mb-4">
                <Star className="h-6 w-6 text-blue-600" />
                <span className="text-sm text-gray-500">Avaliação média</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">4.9</p>
              <p className="text-sm text-gray-500">De satisfação</p>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-6">Nossos Valores</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Transparência</h3>
                    <p className="mt-2 text-gray-600">
                      Processos claros e comunicação aberta em todas as etapas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                      <Shield className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Segurança</h3>
                    <p className="mt-2 text-gray-600">
                      Proteção de dados e pagamentos garantidos para todos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                      <Award className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Qualidade</h3>
                    <p className="mt-2 text-gray-600">
                      Compromisso com a excelência em todas as interações.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Comunidade</h3>
                    <p className="mt-2 text-gray-600">
                      Foco no crescimento e sucesso de nossos usuários.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-medium text-gray-900 mb-6">Nossa Equipe</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Ana Silva',
                    role: 'CEO & Fundadora',
                    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                  },
                  {
                    name: 'Pedro Santos',
                    role: 'CTO',
                    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                  },
                  {
                    name: 'Julia Costa',
                    role: 'Head de Marketing',
                    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                  }
                ].map((member) => (
                  <div key={member.name} className="flex items-center space-x-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-16 w-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}