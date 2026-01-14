import React from "react";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  content: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  content,
  onConfirm,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="mb-6">{content}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
