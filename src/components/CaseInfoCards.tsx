import React from 'react';
import { Case } from '../types';
import { User, MapPin, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';

interface CaseInfoCardsProps {
  caseData: Case;
}

export const CaseInfoCards: React.FC<CaseInfoCardsProps> = ({ caseData }) => {
  return (
    <div className="space-y-6">
      {/* Customer Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-tight">Customer Profile</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Full Name</p>
            <p className="text-sm font-semibold text-gray-700">{caseData.customer.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">CNIC</p>
              <p className="text-sm font-semibold text-gray-700">{caseData.customer.cnic}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Phone</p>
              <p className="text-sm font-semibold text-gray-700">{caseData.customer.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Property Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-tight">Property Details</h3>
        </div>
        <div className="grid grid-cols-2 gap-y-4 gap-x-2">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Block</p>
            <p className="text-sm font-semibold text-gray-700">{caseData.property.block}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Phase</p>
            <p className="text-sm font-semibold text-gray-700">{caseData.property.phase}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Plot No</p>
            <p className="text-sm font-semibold text-gray-700">{caseData.property.plotNo}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase">Size</p>
            <p className="text-sm font-semibold text-gray-700">{caseData.property.size}</p>
          </div>
        </div>
      </div>

      {/* Financial Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <CreditCard className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-tight">Financial Status</h3>
          </div>
          {caseData.financials.ledgerVerified ? (
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-500" />
          )}
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 font-medium">Net Price</p>
            <p className="text-sm font-bold text-gray-900">PKR {caseData.financials.netPrice.toLocaleString()}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 font-medium">Received</p>
            <p className="text-sm font-bold text-emerald-600">PKR {caseData.financials.received.toLocaleString()}</p>
          </div>
          <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
            <p className="text-xs text-gray-900 font-bold">Outstanding</p>
            <p className="text-sm font-black text-red-600">PKR {caseData.financials.outstanding.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
