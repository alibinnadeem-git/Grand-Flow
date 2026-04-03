import React from 'react';
import { Remark } from '../types';
import { FileText, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface MinuteSheetProps {
  remarks: Remark[];
  onAddRemark: (text: string) => void;
}

export const MinuteSheet: React.FC<MinuteSheetProps> = ({ remarks = [], onAddRemark }) => {
  const [newRemark, setNewRemark] = React.useState('');

  const handleSubmit = () => {
    if (!newRemark.trim()) return;
    onAddRemark(newRemark);
    setNewRemark('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-600" />
        <h2 className="font-bold text-gray-800">Digital Minute Sheet</h2>
      </div>

      <div className="p-6">
        {/* New Remark Input */}
        <div className="mb-8 bg-blue-50/30 p-4 rounded-xl border border-blue-100 border-dashed">
          <textarea
            className="w-full bg-white border border-gray-200 p-4 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Enter your official remarks, recommendations, or findings..."
            rows={4}
            value={newRemark}
            onChange={(e) => setNewRemark(e.target.value)}
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm"
            >
              Post Remark & Sign
            </button>
          </div>
        </div>

        {/* Remarks Timeline */}
        <div className="space-y-8">
          {(remarks || []).length === 0 ? (
            <div className="text-center py-12 text-gray-400 italic text-sm">
              No remarks recorded yet.
            </div>
          ) : (
            (remarks || []).map((remark, index) => (
              <div key={remark.id} className="relative pl-8">
                {index !== (remarks || []).length - 1 && (
                  <div className="absolute left-[15px] top-[32px] w-[2px] h-[calc(100%+32px)] bg-gray-100" />
                )}
                
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center z-10">
                  <User className="w-4 h-4 text-blue-600" />
                </div>

                <div className={cn(
                  "p-5 rounded-2xl border transition-all",
                  index === 0 ? "bg-white border-blue-200 shadow-md shadow-blue-50" : "bg-gray-50/50 border-gray-100"
                )}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{remark.author}</h4>
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                        {remark.role} • {remark.dept}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(remark.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {remark.text}
                  </p>
                  
                  {remark.action && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <span className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded uppercase">
                        Action: {remark.action}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
