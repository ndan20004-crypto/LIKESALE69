import React, { useMemo, useState } from 'react';
import { Plus, Save, Trash2, Pencil } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import type { PlatformKey } from '../../data/services/defaultCatalog';

const platformLabels: Record<PlatformKey, string> = {
  facebook: 'Facebook',
  tiktok: 'TikTok',
  instagram: 'Instagram',
  telegram: 'Telegram',
};

function nextId(items: any[]): number {
  const nums = items
    .map((x) => Number(x?.id))
    .filter((n) => Number.isFinite(n));
  return (nums.length ? Math.max(...nums) : 0) + 1;
}

export default function AdminServices() {
  const {
    serviceCatalog,
    updateServiceItem,
    updateServicePackage,
    addServicePackage,
    deleteServicePackage,
  } = useData();

  const [platform, setPlatform] = useState<PlatformKey>('facebook');
  const serviceKeys = useMemo(() => Object.keys((serviceCatalog as any)[platform] || {}), [serviceCatalog, platform]);
  const [serviceKey, setServiceKey] = useState<string>(() => serviceKeys[0] || '');

  const svc = (serviceCatalog as any)[platform]?.[serviceKey];
  const pkgs = Array.isArray(svc?.packages) ? svc.packages : [];

  // Keep serviceKey valid when platform changes
  React.useEffect(() => {
    const keys = Object.keys((serviceCatalog as any)[platform] || {});
    setServiceKey((prev) => (keys.includes(prev) ? prev : keys[0] || ''));
  }, [platform, serviceCatalog]);

  const handleServiceMeta = (field: 'title' | 'description', value: string) => {
    updateServiceItem(platform, serviceKey, { [field]: value });
  };

  const handlePkgField = (pkgId: any, field: string, value: string) => {
    // numeric fields
    const numericFields = new Set(['price', 'min', 'max', 'cancelFee']);
    const v: any = numericFields.has(field) ? Number(value || 0) : value;
    updateServicePackage(platform, serviceKey, pkgId, { [field]: v });
  };

  const addNewPackage = () => {
    const id = nextId(pkgs);
    addServicePackage(platform, serviceKey, {
      id,
      name: `Server ${id}`,
      price: 0,
      min: 1,
      max: 1000,
      description: '',
      speed: '',
      warranty: '',
      canCancel: true,
      cancelFee: 0,
      dropRate: '',
    });
  };

  if (!svc) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 text-slate-200">
        Không tìm thấy dịch vụ. Hãy chọn nền tảng/dịch vụ khác.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl text-white mb-2">Quản lý dịch vụ</h1>
        <p className="text-slate-300">
          Chỉnh sửa trực tiếp server/gói, giá tiền, mô tả. Dữ liệu được lưu ở localStorage (demo).
        </p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center gap-2">
          <span className="text-slate-300">Nền tảng</span>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as PlatformKey)}
            className="bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2"
          >
            {(Object.keys(platformLabels) as PlatformKey[]).map((p) => (
              <option key={p} value={p}>
                {platformLabels[p]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-300">Dịch vụ</span>
          <select
            value={serviceKey}
            onChange={(e) => setServiceKey(e.target.value)}
            className="bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2"
          >
            {serviceKeys.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Service meta */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 text-white">
          <Pencil className="size-5" />
          <h2 className="text-xl">Thông tin dịch vụ</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 mb-1">Tiêu đề</label>
            <input
              value={svc.title || ''}
              onChange={(e) => handleServiceMeta('title', e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-slate-300 mb-1">Mô tả</label>
            <input
              value={svc.description || ''}
              onChange={(e) => handleServiceMeta('description', e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl text-white">Danh sách server/gói</h2>
          <button
            onClick={addNewPackage}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <Plus className="size-4" /> Thêm server/gói
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-sm">
            <thead>
              <tr className="text-slate-300 border-b border-slate-700">
                <th className="text-left py-2 pr-2">ID</th>
                <th className="text-left py-2 pr-2">Tên gói</th>
                <th className="text-left py-2 pr-2">Giá</th>
                <th className="text-left py-2 pr-2">Min</th>
                <th className="text-left py-2 pr-2">Max</th>
                <th className="text-left py-2 pr-2">Bảo hành</th>
                <th className="text-left py-2 pr-2">Mô tả</th>
                <th className="text-right py-2">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {pkgs.map((p: any) => (
                <tr key={p.id} className="border-b border-slate-700 text-slate-200 align-top">
                  <td className="py-2 pr-2 w-[60px]">{p.id}</td>
                  <td className="py-2 pr-2">
                    <input
                      value={p.name || ''}
                      onChange={(e) => handlePkgField(p.id, 'name', e.target.value)}
                      className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-2 py-1"
                    />
                  </td>
                  <td className="py-2 pr-2 w-[120px]">
                    <input
                      type="number"
                      value={Number(p.price ?? 0)}
                      onChange={(e) => handlePkgField(p.id, 'price', e.target.value)}
                      className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-2 py-1"
                    />
                  </td>
                  <td className="py-2 pr-2 w-[100px]">
                    <input
                      type="number"
                      value={Number(p.min ?? 0)}
                      onChange={(e) => handlePkgField(p.id, 'min', e.target.value)}
                      className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-2 py-1"
                    />
                  </td>
                  <td className="py-2 pr-2 w-[100px]">
                    <input
                      type="number"
                      value={Number(p.max ?? 0)}
                      onChange={(e) => handlePkgField(p.id, 'max', e.target.value)}
                      className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-2 py-1"
                    />
                  </td>
                  <td className="py-2 pr-2 w-[140px]">
                    <input
                      value={p.warranty || ''}
                      onChange={(e) => handlePkgField(p.id, 'warranty', e.target.value)}
                      className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-2 py-1"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <textarea
                      value={p.description || ''}
                      onChange={(e) => handlePkgField(p.id, 'description', e.target.value)}
                      className="w-full bg-slate-900 text-white border border-slate-600 rounded-lg px-2 py-1 min-h-[60px]"
                    />
                  </td>
                  <td className="py-2 text-right w-[70px]">
                    <button
                      onClick={() => {
                        if (confirm('Xóa gói này?')) deleteServicePackage(platform, serviceKey, p.id);
                      }}
                      className="text-red-400 hover:text-red-300"
                      title="Xóa"
                    >
                      <Trash2 className="size-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-slate-400 text-sm flex items-center gap-2">
          <Save className="size-4" /> Mỗi thay đổi được lưu ngay (auto-save).
        </div>
      </div>
    </div>
  );
}
