import React, { useState, useEffect } from "react";
import { Demand, DemandStatus, Priority } from "../../types/project";
import {
  demandList,
  addDemand,
  editDemand,
  deleteDemand,
  getDemandByIterationId,
} from "../../mock/demand.mock";
import ConfirmModal from "../../components/ConfirmModal";
import EditModal from "../../components/EditModal";

interface DemandListProps {
  iterationId: string;
}

const DemandList: React.FC<DemandListProps> = ({ iterationId }) => {
  const [demands, setDemands] = useState<Demand[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [currentDemand, setCurrentDemand] = useState<Demand | null>(null);
  const [newDemand, setNewDemand] = useState<Omit<Demand, "id" | "createTime">>(
    {
      iterationId: "",
      name: "",
      creator: "",
      priority: Priority.MIDDLE,
      status: DemandStatus.PENDING_REVIEW,
      expectEndTime: "",
    }
  );

  // 根据迭代ID加载需求列表
  useEffect(() => {
    if (!iterationId) {
      setDemands([]);
      return;
    }
    const list = getDemandByIterationId(iterationId);
    setDemands(list);
    setNewDemand({ ...newDemand, iterationId });
  }, [iterationId]);

  // 新增需求
  const handleAddDemand = () => {
    if (!newDemand.name || !newDemand.iterationId) return;
    addDemand(newDemand);
    const list = getDemandByIterationId(iterationId);
    setDemands(list);
    setAddModalVisible(false);
    setNewDemand({
      iterationId: iterationId,
      name: "",
      creator: "",
      priority: Priority.MIDDLE,
      status: DemandStatus.PENDING_REVIEW,
      expectEndTime: "",
    });
  };

  // 编辑需求
  const handleEditDemand = (demand: Demand) => {
    setCurrentDemand(demand);
    setEditModalVisible(true);
  };

  const saveEditDemand = (data: Demand) => {
    if (!data.id) return;
    editDemand(data.id, data);
    const list = getDemandByIterationId(iterationId);
    setDemands(list);
    setEditModalVisible(false);
  };

  // 删除需求
  const handleDeleteDemand = (demand: Demand) => {
    setCurrentDemand(demand);
    setDeleteModalVisible(true);
  };

  const confirmDeleteDemand = () => {
    if (!currentDemand) return;
    deleteDemand(currentDemand.id);
    const list = getDemandByIterationId(iterationId);
    setDemands(list);
    setDeleteModalVisible(false);
  };

  if (!iterationId) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        请选择左侧迭代
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">需求列表（{iterationId}）</h3>
        <button
          onClick={() => setAddModalVisible(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          新增需求
        </button>
      </div>

      {/* 需求列表表格 */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">需求ID</th>
              <th className="border px-4 py-2">需求名称</th>
              <th className="border px-4 py-2">创建人</th>
              <th className="border px-4 py-2">优先级</th>
              <th className="border px-4 py-2">状态</th>
              <th className="border px-4 py-2">创建时间</th>
              <th className="border px-4 py-2">预计结束时间</th>
              <th className="border px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {demands.map((demand) => (
              <tr key={demand.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{demand.id}</td>
                <td className="border px-4 py-2">{demand.name}</td>
                <td className="border px-4 py-2">{demand.creator}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      demand.priority === Priority.HIGH
                        ? "bg-red-100 text-red-800"
                        : demand.priority === Priority.MIDDLE
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {demand.priority}
                  </span>
                </td>
                <td className="border px-4 py-2">{demand.status}</td>
                <td className="border px-4 py-2">{demand.createTime}</td>
                <td className="border px-4 py-2">{demand.expectEndTime}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEditDemand(demand)}
                    className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDeleteDemand(demand)}
                    className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 新增需求弹窗 */}
      <EditModal
        visible={addModalVisible}
        title="新增需求"
        initialData={null}
        onSave={handleAddDemand}
        onCancel={() => setAddModalVisible(false)}
        renderForm={() => (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-1">需求名称 *</label>
              <input
                type="text"
                value={newDemand.name}
                onChange={(e) =>
                  setNewDemand({ ...newDemand, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1">创建人</label>
              <input
                type="text"
                value={newDemand.creator}
                onChange={(e) =>
                  setNewDemand({ ...newDemand, creator: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1">优先级</label>
              <select
                value={newDemand.priority}
                onChange={(e) =>
                  setNewDemand({
                    ...newDemand,
                    priority: e.target.value as Priority,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={Priority.HIGH}>高</option>
                <option value={Priority.MIDDLE}>中</option>
                <option value={Priority.LOW}>低</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">状态</label>
              <select
                value={newDemand.status}
                onChange={(e) =>
                  setNewDemand({
                    ...newDemand,
                    status: e.target.value as DemandStatus,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {Object.values(DemandStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">预计结束时间</label>
              <input
                type="date"
                value={newDemand.expectEndTime}
                onChange={(e) =>
                  setNewDemand({ ...newDemand, expectEndTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}
      />

      {/* 编辑需求弹窗 */}
      <EditModal
        visible={editModalVisible}
        title="编辑需求"
        initialData={currentDemand}
        onSave={saveEditDemand}
        onCancel={() => setEditModalVisible(false)}
        renderForm={(formData, setFormData) => (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-1">需求名称</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1">创建人</label>
              <input
                type="text"
                value={formData.creator}
                onChange={(e) =>
                  setFormData({ ...formData, creator: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1">优先级</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as Priority,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value={Priority.HIGH}>高</option>
                <option value={Priority.MIDDLE}>中</option>
                <option value={Priority.LOW}>低</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">状态</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as DemandStatus,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {Object.values(DemandStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">预计结束时间</label>
              <input
                type="date"
                value={formData.expectEndTime}
                onChange={(e) =>
                  setFormData({ ...formData, expectEndTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}
      />

      {/* 删除确认弹窗 */}
      <ConfirmModal
        visible={deleteModalVisible}
        title="删除确认"
        content={`确定要删除需求【${currentDemand?.name || ""}】吗？`}
        onConfirm={confirmDeleteDemand}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </div>
  );
};

export default DemandList;
