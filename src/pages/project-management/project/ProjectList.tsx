import React, { useState, useEffect } from "react";
import { Project } from "../../types/project";
import {
  projectList,
  addProject,
  editProject,
  deleteProject,
  searchProject,
} from "../../mock/project.mock";
import SearchInput from "../../components/SearchInput";
import ConfirmModal from "../../components/ConfirmModal";
import EditModal from "../../components/EditModal";

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchResult, setSearchResult] = useState<Project[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<
    Omit<Project, "id" | "createTime">
  >({
    name: "",
    owner: "",
    admin: "",
  });

  // 初始化加载项目列表
  useEffect(() => {
    setProjects([...projectList]);
    setSearchResult([...projectList]);
  }, []);

  // 搜索项目
  const handleSearch = (keyword: string) => {
    const result = searchProject(keyword);
    setSearchResult(result);
  };

  // 新增项目
  const handleAddProject = () => {
    if (!newProject.name || !newProject.admin) return;
    addProject(newProject);
    setProjects([...projectList]);
    setSearchResult([...projectList]);
    setAddModalVisible(false);
    setNewProject({ name: "", owner: "", admin: "" });
  };

  // 编辑项目
  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setEditModalVisible(true);
  };

  const saveEditProject = (data: Project) => {
    if (!data.id) return;
    editProject(data.id, data);
    setProjects([...projectList]);
    setSearchResult([...projectList]);
    setEditModalVisible(false);
  };

  // 删除项目
  const handleDeleteProject = (project: Project) => {
    setCurrentProject(project);
    setDeleteModalVisible(true);
  };

  const confirmDeleteProject = () => {
    if (!currentProject) return;
    deleteProject(currentProject.id);
    setProjects([...projectList]);
    setSearchResult([...projectList]);
    setDeleteModalVisible(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">项目列表</h2>
        <div className="flex gap-4">
          <SearchInput
            placeholder="输入项目名称/ID查询"
            onSearch={handleSearch}
          />
          <button
            onClick={() => setAddModalVisible(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            新增项目
          </button>
        </div>
      </div>

      {/* 项目列表表格 */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">项目ID</th>
              <th className="border px-4 py-2">项目名称</th>
              <th className="border px-4 py-2">项目负责人</th>
              <th className="border px-4 py-2">管理员</th>
              <th className="border px-4 py-2">创建时间</th>
              <th className="border px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {searchResult.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{project.id}</td>
                <td className="border px-4 py-2">{project.name}</td>
                <td className="border px-4 py-2">{project.owner}</td>
                <td className="border px-4 py-2">{project.admin}</td>
                <td className="border px-4 py-2">{project.createTime}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    onClick={() => handleEditProject(project)}
                    className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project)}
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

      {/* 新增项目弹窗 */}
      <EditModal
        visible={addModalVisible}
        title="新增项目"
        initialData={null}
        onSave={handleAddProject}
        onCancel={() => setAddModalVisible(false)}
        renderForm={() => (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-1">项目名称 *</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1">项目负责人</label>
              <input
                type="text"
                value={newProject.owner}
                onChange={(e) =>
                  setNewProject({ ...newProject, owner: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block mb-1">管理员 *</label>
              <input
                type="text"
                value={newProject.admin}
                onChange={(e) =>
                  setNewProject({ ...newProject, admin: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}
      />

      {/* 编辑项目弹窗 */}
      <EditModal
        visible={editModalVisible}
        title="编辑项目"
        initialData={currentProject}
        onSave={saveEditProject}
        onCancel={() => setEditModalVisible(false)}
        renderForm={(formData, setFormData) => (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block mb-1">项目名称</label>
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
              <label className="block mb-1">项目负责人</label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) =>
                  setFormData({ ...formData, owner: e.target.value })
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
          </div>
        )}
      />

      {/* 删除确认弹窗 */}
      <ConfirmModal
        visible={deleteModalVisible}
        title="删除确认"
        content={`确定要删除项目【${currentProject?.name || ""}】吗？`}
        onConfirm={confirmDeleteProject}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </div>
  );
};

export default ProjectList;
