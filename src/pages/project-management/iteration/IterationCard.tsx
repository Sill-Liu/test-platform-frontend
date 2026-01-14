import React, { useState, useEffect } from "react";
import { Iteration } from "../../types/project";
import {
  iterationList,
  addIteration,
  editIteration,
  deleteIteration,
  searchIteration,
} from "../../mock/iteration.mock";
import SearchInput from "../../components/SearchInput";
import ConfirmModal from "../../components/ConfirmModal";
import EditModal from "../../components/EditModal";

interface IterationCardProps {
  onSelectIteration: (id: string) => void;
  selectedIterationId: string;
}

const IterationCard: React.FC<IterationCardProps> = ({
  onSelectIteration,
  selectedIterationId,
}) => {
  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [searchResult, setSearchResult] = useState<Iteration[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [currentIteration, setCurrentIteration] = useState<Iteration | null>(
    null
  );
  const [newIteration, setNewIteration] = useState<
    Omit<
      Iteration,
      "id" | "createTime" | "demandCount" | "finishedDemandCount" | "progress"
    >
  >({
    projectId: "proj_001", // 默认关联第一个项目
    name: "",
    creator: "",
    admin: "",
    startTime: "",
  });

  // 初始化加载迭代列表（按创建时间倒序）
  useEffect(() => {
    const sortedIterations = [...iterationList].sort(
      (a, b) =>
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    );
    setIterations(sortedIterations);
    setSearchResult(sortedIterations);
    // 默认选中第一个迭代
    if (sortedIterations.length > 0 && !selectedIterationId) {
      onSelectIteration(sortedIterations[0].id);
    }
  }, [onSelectIteration, selectedIterationId]);

  // 搜索迭代
  const handleSearch = (keyword: string) => {
    const result = searchIteration(keyword);
    const sortedResult = [...result].sort(
      (a, b) =>
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    );
    setSearchResult(sortedResult);
  };

  // 新增迭代
  const handleAddIteration = () => {
    if (!newIteration.name || !newIteration.admin) return;
    addIteration(newIteration);
    const sortedIterations = [...iterationList].sort(
      (a, b) =>
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    );
    setIterations(sortedIterations);
    setSearchResult(sortedIterations);
    setAddModalVisible(false);
    setNewIteration({
      projectId: "proj_001",
      name: "",
      creator: "",
      admin: "",
      startTime: "",
    });
  };

  // 编辑迭代
  const handleEditIteration = (iteration: Iteration) => {
    setCurrentIteration(iteration);
    setEditModalVisible(true);
  };

  const saveEditIteration = (data: Iteration) => {
    if (!data.id) return;
    editIteration(data.id, data);
    const sortedIterations = [...iterationList].sort(
      (a, b) =>
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    );
    setIterations(sortedIterations);
    setSearchResult(sortedIterations);
    setEditModalVisible(false);
  };

  // 删除迭代
  const handleDeleteIteration = (iteration: Iteration) => {
    setCurrentIteration(iteration);
    setDeleteModalVisible(true);
  };

  const confirmDeleteIteration = () => {
    if (!currentIteration) return;
    deleteIteration(currentIteration.id);
    const sortedIterations = [...iterationList].sort(
      (a, b) =>
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    );
    setIterations(sortedIterations);
    setSearchResult(sortedIterations);
    // 如果删除的是当前选中的迭代，选中第一个
    if (
      selectedIterationId === currentIteration.id &&
      sortedIterations.length > 0
    ) {
      onSelectIteration(sortedIterations[0].id);
    } else if (sortedIterations.length === 0) {
      onSelectIteration("");
    }
    setDeleteModalVisible(false);
  };

  // 选择迭代
  const handleSelectIteration = (id: string) => {
    onSelectIteration(id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">迭代列表</h3>
        <button
          onClick={() => setAddModalVisible(true)}
          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
        >
          新增迭代
        </button>
      </div>

      <SearchInput
        placeholder="输入迭代名称/ID查询"
        onSearch={handleSearch}
        className="mb-4"
      />

      {/* 迭代卡片列表 */}
      <div className="flex flex-col gap-4 mt-4">
        {searchResult.map((iter) => (
          <div
            key={iter.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedIterationId === iter.id
                ? "bg-blue-100 border-blue-500"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleSelectIteration(iter.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{iter.name}</h4>
                <p className="text-sm text-gray-600 mt-1">ID: {iter.id}</p>
                <p className="text-sm text-gray-600">创建人: {iter.creator}</p>
                <p className="text-sm text-gray-600">管理员: {iter.admin}</p>
                <p className="text-sm text-gray-600">
                  起始时间: {iter.startTime}
                </p>
                <p className="text-sm text-gray-600">
                  创建时间: {iter.createTime}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditIteration(iter);
                  }}
                  className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs"
                >
                  编辑
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteIteration(iter);
                  }}
                  className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs"
                >
                  删除
                </button>
              </div>
            </div>
            {/* 迭代进度 */}
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span>进度</span>
                <span>{iter.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-600 rounded-full"
                  style={{ width: `${iter.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {iter.finishedDemandCount}/{iter.demandCount} 需求已完成
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 新增迭代弹窗 */}
      <EditModal
        visible={addModalVisible}
        title="新增迭代"
        initialData={null}
        onSave={handleAddIteration}
        onCancel={() => setAddModalVisible(false)}
        renderForm={() => (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-1">迭代名称 *</label>
              <input
                type="text"
                value={newIteration.name}
                onChange={(e) =>
                  setNewIteration({ ...newIteration, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1">关联项目ID</label>
              <input
                type="text"
                value={newIteration.projectId}
                onChange={(e) =>
                  setNewIteration({
                    ...newIteration,
                    projectId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1">创建人</label>
              <input
                type="text"
                value={newIteration.creator}
                onChange={(e) =>
                  setNewIteration({ ...newIteration, creator: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1">管理员 *</label>
              <input
                type="text"
                value={newIteration.admin}
                onChange={(e) =>
                  setNewIteration({ ...newIteration, admin: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1">起始时间</label>
              <input
                type="date"
                value={newIteration.startTime}
                onChange={(e) =>
                  setNewIteration({
                    ...newIteration,
                    startTime: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}
      />

      {/* 编辑迭代弹窗 */}
      <EditModal
        visible={editModalVisible}
        title="编辑迭代"
        initialData={currentIteration}
        onSave={saveEditIteration}
        onCancel={() => setEditModalVisible(false)}
        renderForm={(formData, setFormData) => (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-1">迭代名称</label>
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
              <label className="block mb-1">关联项目ID</label>
              <input
                type="text"
                value={formData.projectId}
                onChange={(e) =>
                  setFormData({ ...formData, projectId: e.target.value })
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
              <label className="block mb-1">管理员</label>
              <input
                type="text"
                value={formData.admin}
                onChange={(e) =>
                  setFormData({ ...formData, admin: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1">起始时间</label>
              <input
                type="date"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
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
        content={`确定要删除迭代【${currentIteration?.name || ""}】吗？`}
        onConfirm={confirmDeleteIteration}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </div>
  );
};

export default IterationCard;
