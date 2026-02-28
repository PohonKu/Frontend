import React from 'react';

interface Adoption {
  adoptionId: string;
  adoptedAt: string;
  nameOnTag: string;
  species: {
    id: string;
    name: string;
    latinName: string;
    imageUrl: string;
    carbonRate: number;
    category: string;
  };
  tree: {
    id: string;
    serialNumber: string;
    latitude: string | null;
    longitude: string | null;
    plantedAt: string | null;
    status: string;
    createdAt: string;
    latestUpdate: string | null;
  };
  order: {
    orderNumber: string;
    totalAmount: number;
    paymentStatus: string;
    purchasedAt: string;
  };
}

interface AdoptionListProps {
  adoptions: Adoption[];
  onAdoptionClick: (adoptionId: string) => void;
}

const getPaymentStatusColor = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    PAID: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    FAILED: 'bg-red-100 text-red-800',
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};

const getStatusBadgeColor = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    SOLD: 'bg-green-500 text-white',
    AVAILABLE: 'bg-blue-500 text-white',
    RESERVED: 'bg-orange-500 text-white',
    ABANDONED: 'bg-red-500 text-white',
  };
  return statusMap[status] || 'bg-gray-500 text-white';
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function AdoptionList({
  adoptions,
  onAdoptionClick,
}: AdoptionListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {adoptions.map((adoption) => (
        <div
          key={adoption.adoptionId}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onAdoptionClick(adoption.adoptionId)}
        >
          {/* Image */}
          <div className="relative h-48 bg-gray-200 overflow-hidden">
            <img
              src={adoption.species.imageUrl}
              alt={adoption.species.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://placehold.co/300x200?text=Pohon';
              }}
            />
            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeColor(adoption.tree.status)}`}>
                {adoption.tree.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Title */}
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900">{adoption.species.name}</h3>
              <p className="text-sm text-gray-500 italic">{adoption.species.latinName}</p>
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-gray-600">Tag:</span>
                <span className="font-medium">{adoption.nameOnTag}</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-gray-600">No. Seri:</span>
                <span className="font-medium text-xs">{adoption.tree.serialNumber}</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-gray-600">Kategori:</span>
                <span className="font-medium text-xs">{adoption.species.category}</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span className="text-gray-600">Karbon:</span>
                <span className="font-medium">{adoption.species.carbonRate} ton/th</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center font-semibold">
                <span className="text-gray-600">Harga:</span>
                <span className="text-lg text-gray-900">{formatCurrency(adoption.order.totalAmount)}</span>
              </div>
            </div>

            {/* Payment Status */}
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold px-2 py-1 rounded ${getPaymentStatusColor(adoption.order.paymentStatus)}`}>
                {adoption.order.paymentStatus}
              </span>
              <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-3 py-1 rounded transition-colors">
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
