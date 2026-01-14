import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
// 导入 Mock 请求工具
import { get, post } from "../mock/mockRequest";

// 项目类型定义（和 Mock JSON 结构完全对齐）
interface Project {
  projectId: string;
  projectName: string;
  iterationCycle: string;
  demandCount: number;
  bugCount: number;
  taskCount: number;
  progress: number;
  createTime: string;
}

// 新建项目表单类型
interface NewProjectForm {
  projectName: string;
  iterationStart: string;
  iterationEnd: string;
  description: string;
}

// 新建项目提交参数类型（和后端接口参数对齐）
interface CreateProjectParams {
  projectName: string;
  iterationStart: string;
  iterationEnd: string;
  description?: string;
}

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // 核心状态管理
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true); // 加载状态
  const [errorMsg, setErrorMsg] = useState(""); // 错误提示
  const [showCreateModal, setShowCreateModal] = useState(false); // 新建弹窗显隐
  const [newProjectForm, setNewProjectForm] = useState<NewProjectForm>({
    projectName: "",
    iterationStart: "",
    iterationEnd: "",
    description: "",
  });

  // 加载项目列表（调用 Mock 接口，模拟后端请求）
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // 调用 Mock GET 接口（后续替换为真实后端接口地址）
        const res = await get<Project[]>("/api/projects");

        if (res.code === 200) {
          setProjectList(res.data);
          setErrorMsg("");
        } else {
          setErrorMsg(res.message || "获取项目列表失败");
        }
      } catch (err) {
        setErrorMsg("网络异常，无法获取项目列表");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 进入项目需求管理页面
  const goToRequirements = (projectId: string, projectName: string) => {
    navigate(`/projects/${projectId}/requirements`, { state: { projectName } });
  };

  // 表单输入变化处理
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  // 提交新建项目（预留 POST 接口对接位）
  const handleCreateProject = async () => {
    // 前端表单验证
    if (!newProjectForm.projectName) {
      alert("项目名称不能为空！");
      return;
    }
    if (!newProjectForm.iterationStart || !newProjectForm.iterationEnd) {
      alert("请选择完整的迭代周期！");
      return;
    }
    if (newProjectForm.iterationStart > newProjectForm.iterationEnd) {
      alert("迭代开始时间不能晚于结束时间！");
      return;
    }

    try {
      // 构造提交参数（和后端接口参数格式对齐）
      const submitData: CreateProjectParams = {
        projectName: newProjectForm.projectName,
        iterationStart: newProjectForm.iterationStart,
        iterationEnd: newProjectForm.iterationEnd,
        description: newProjectForm.description || "",
      };

      // 模拟调用 POST 接口（后续替换为真实接口）
      // const res = await post<Project>("/api/projects/create", submitData);
      // if (res.code === 200) { ... }

      // 前端临时模拟新增（对接后端后删除此段，改用接口返回数据）
      const newProject: Project = {
        projectId: `proj_${1000 + projectList.length + 1}`,
        projectName: newProjectForm.projectName,
        iterationCycle: `${newProjectForm.iterationStart} ~ ${newProjectForm.iterationEnd}`,
        demandCount: 0,
        bugCount: 0,
        taskCount: 0,
        progress: 0,
        createTime: new Date()
          .toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(/\//g, "-"),
      };

      // 更新列表
      setProjectList((prev) => [...prev, newProject]);
      setShowCreateModal(false);
      // 重置表单
      setNewProjectForm({
        projectName: "",
        iterationStart: "",
        iterationEnd: "",
        description: "",
      });
      alert("项目创建成功！");
    } catch (err) {
      alert("创建项目失败，请重试！");
    }
  };

  // ========== 状态渲染 ==========
  // 加载中
  if (loading) {
    return (
      <div
        className={`p-4 min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full mb-2"></div>
          <p>加载项目列表中...</p>
        </div>
      </div>
    );
  }

  // 加载失败
  if (errorMsg) {
    return (
      <div
        className={`p-4 min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center">
          <p className="text-red-500 mb-4">{errorMsg}</p>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded ${
              isDarkMode
                ? "bg-blue-900 text-blue-200"
                : "bg-blue-500 text-white"
            }`}
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // ========== 正常渲染 ==========
  return (
    <div
      className={`p-4 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* 页面头部 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">项目管理</h2>
        <button
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            isDarkMode
              ? "bg-green-900 text-green-200"
              : "bg-green-500 text-white"
          }`}
          onClick={() => setShowCreateModal(true)}
        >
          <FaPlus size={16} /> 创建项目
        </button>
      </div>

      {/* 项目列表区域 */}
      {projectList.length === 0 ? (
        // 空数据提示
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            暂无项目数据，点击"创建项目"添加
          </p>
          <button
            className={`px-4 py-2 rounded flex items-center gap-2 mx-auto ${
              isDarkMode
                ? "bg-green-900 text-green-200"
                : "bg-green-500 text-white"
            }`}
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus size={16} /> 创建第一个项目
          </button>
        </div>
      ) : (
        // 项目卡片列表
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectList.map((project) => (
            <div
              key={project.projectId}
              className={`rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition ${
                isDarkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
              onClick={() =>
                goToRequirements(project.projectId, project.projectName)
              }
            >
              {/* 项目名称 + 操作按钮 */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{project.projectName}</h3>
                <div className="flex gap-2">
                  <button
                    className="text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止跳转
                      // 编辑逻辑（预留）
                      alert(`编辑项目：${project.projectName}`);
                    }}
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    className="text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止跳转
                      // 删除逻辑（预留）
                      if (confirm(`确认删除项目：${project.projectName}？`)) {
                        setProjectList(
                          projectList.filter(
                            (item) => item.projectId !== project.projectId
                          )
                        );
                      }
                    }}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>

              {/* 迭代周期 */}
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                迭代周期：{project.iterationCycle}
              </div>

              {/* 统计数据 */}
              <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 dark:text-gray-400">需求</span>
                  <span className="font-medium">{project.demandCount}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 dark:text-gray-400">缺陷</span>
                  <span className="font-medium">{project.bugCount}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 dark:text-gray-400">任务</span>
                  <span className="font-medium">{project.taskCount}</span>
                </div>
              </div>

              {/* 进度条 */}
              <div className="w-full">
                <div className="flex justify-between text-xs mb-1">
                  <span>进度</span>
                  <span>{project.progress}%</span>
                </div>
                <div
                  className={`w-full h-2 rounded-full ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`h-full rounded-full ${
                      project.progress > 80 ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 新建项目弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div
            className={`w-full max-w-md rounded-lg shadow-lg p-6 ${
              isDarkMode
                ? "bg-gray-800 text-gray-100"
                : "bg-white text-gray-900"
            }`}
          >
            {/* 弹窗头部 */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">新建项目</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* 弹窗表单 */}
            <div className="space-y-4">
              {/* 项目名称 */}
              <div>
                <label className="block text-sm mb-1 font-medium">
                  项目名称*
                </label>
                <input
                  type="text"
                  name="projectName"
                  value={newProjectForm.projectName}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 rounded border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  placeholder="请输入项目名称（如：用户端5迭代）"
                />
              </div>

              {/* 迭代周期 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1 font-medium">
                    迭代开始时间*
                  </label>
                  <input
                    type="date"
                    name="iterationStart"
                    value={newProjectForm.iterationStart}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 rounded border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 font-medium">
                    迭代结束时间*
                  </label>
                  <input
                    type="date"
                    name="iterationEnd"
                    value={newProjectForm.iterationEnd}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 rounded border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  />
                </div>
              </div>

              {/* 项目描述 */}
              <div>
                <label className="block text-sm mb-1 font-medium">
                  项目描述
                </label>
                <textarea
                  name="description"
                  value={newProjectForm.description}
                  onChange={handleFormChange}
                  rows={3}
                  className={`w-full px-3 py-2 rounded border resize-none ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  placeholder="请输入项目描述（选填）"
                />
              </div>
            </div>

            {/* 弹窗底部按钮 */}
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className={`px-4 py-2 rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                取消
              </button>
              <button
                onClick={handleCreateProject}
                className={`px-4 py-2 rounded ${
                  isDarkMode
                    ? "bg-green-900 text-green-200"
                    : "bg-green-500 text-white"
                }`}
              >
                确认创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
