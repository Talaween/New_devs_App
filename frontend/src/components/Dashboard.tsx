import React, { useState, useMemo } from "react";
import { RevenueSummary } from "./RevenueSummary";
import { useAppContext } from "../contexts/AppContext";

// Properties organized by tenant for proper isolation
const TENANT_PROPERTIES: Record<string, { id: string; name: string }[]> = {
  'tenant-a': [
    { id: 'prop-001', name: 'Beach House Alpha' },
    { id: 'prop-002', name: 'City Apartment Downtown' },
    { id: 'prop-003', name: 'Country Villa Estate' },
  ],
  'tenant-b': [
    { id: 'prop-001', name: 'Mountain Lodge Beta' },
    { id: 'prop-004', name: 'Lakeside Cottage' },
    { id: 'prop-005', name: 'Urban Loft Modern' },
  ],
};

// Map authenticated user emails to their tenant identifiers.
// In production this would come from the backend API; here we use the
// known client credentials from the assignment.
const EMAIL_TENANT_MAP: Record<string, string> = {
  'sunset@propertyflow.com': 'tenant-a',
  'ocean@propertyflow.com': 'tenant-b',
};

const Dashboard: React.FC = () => {
  const { user } = useAppContext();

  // Resolve tenant: email mapping takes priority because it produces the
  // 'tenant-a' / 'tenant-b' keys that match TENANT_PROPERTIES.
  // The AppContext tenant_id is a Supabase UUID and serves as a fallback.
  const tenantId = (user?.email ? EMAIL_TENANT_MAP[user.email] : '')
    || user?.tenant_id
    || user?.app_metadata?.tenant_id
    || user?.user_metadata?.tenant_id
    || '';

  // Filter properties based on logged-in user's tenant
  const properties = useMemo(() => {
    return TENANT_PROPERTIES[tenantId] || [];
  }, [tenantId]);

  const [selectedProperty, setSelectedProperty] = useState('');

  // Auto-select first property when tenant properties load
  const activeProperty = selectedProperty || (properties.length > 0 ? properties[0].id : '');

  return (
    <div className="p-4 lg:p-6 min-h-full">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Property Management Dashboard</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <h2 className="text-lg lg:text-xl font-medium text-gray-900 mb-2">Revenue Overview</h2>
                <p className="text-sm lg:text-base text-gray-600">
                  Monthly performance insights for your properties
                </p>
              </div>
              
              {/* Property Selector */}
              <div className="flex flex-col sm:items-end">
                <label className="text-xs font-medium text-gray-700 mb-1">Select Property</label>
                <select
                  value={activeProperty}
                  onChange={(e) => setSelectedProperty(e.target.value)}
                  className="block w-full sm:w-auto min-w-[200px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {activeProperty ? (
              <RevenueSummary propertyId={activeProperty} />
            ) : (
              <div className="text-center text-gray-500 py-8">No properties available for your account.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
