import React from 'react';
import { Star, MessageSquare } from 'lucide-react';

interface ReviewsProps {
  profile: any; // TODO: Add proper type
}

export function Reviews({ profile }: ReviewsProps) {
  const reviews = [
    {
      id: 1,
      author: {
        name: "Ana Silva",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        company: "TechCorp"
      },
      rating: 5,
      comment: "Excelente trabalho! O João entregou um conteúdo excepcional, com ótima qualidade técnica e engajamento da audiência.",
      date: "2024-03-15"
    },
    {
      id: 2,
      author: {
        name: "Pedro Santos",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        company: "GadgetPro"
      },
      rating: 5,
      comment: "Profissionalismo impecável. Cumpriu todos os prazos e entregou um conteúdo que superou nossas expectativas.",
      date: "2024-03-10"
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Rating Summary */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-50">
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">{profile.metrics.rating}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(profile.metrics.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Baseado em {profile.metrics.completedCampaigns} avaliações de campanhas
            </p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <img
                src={review.author.avatar}
                alt={review.author.name}
                className="h-12 w-12 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div>
                    <h4 className="text-base sm:text-lg font-medium text-gray-900">{review.author.name}</h4>
                    <p className="text-sm text-gray-500">{review.author.company}</p>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">{review.comment}</p>
                <div className="mt-3 sm:mt-4 flex items-center text-sm text-gray-500">
                  <time dateTime={review.date}>
                    {new Date(review.date).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhuma avaliação ainda
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            As avaliações aparecerão aqui após a conclusão de campanhas.
          </p>
        </div>
      )}
    </div>
  );
}