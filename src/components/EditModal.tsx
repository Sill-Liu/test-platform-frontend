import React, { useState, useEffect } from "react";

interface EditModalProps<T> {
  visible: boolean;
  title: string;
  initialData: T | null;
  onSave: (data: T) => void;
  onCancel: () => void;
  renderForm: (
    formData: T,
    setFormData: React.Dispatch<React.SetStateAction<T>>
  ) => React.ReactNode;
}

function EditModal<T extends Record<string, any>>({
  visible,
  title,
  initialData,
  onSave,
  onCancel,
  renderForm,
}: EditModalProps<T>) {
  const [formData, setFormData] = useState<T>({} as T);

  useEffect(() => {
    if (initialData && visible) {
      setFormData({ ...initialData });
    }
  }, [initialData, visible]);

  if (!visible) return null;

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="mb-6">{renderForm(formData, setFormData)}</div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
