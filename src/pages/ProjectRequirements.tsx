import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaPlus, FaFilter } from "react-icons/fa";
import { get } from "../mock/mockRequest"; // 导入Mock请求工具

// 需求类型定义（和Mock数据结构一致）
interface Requirement {
  reqId: string;
  projectId: string;
  title: string;
  content: string;
  type: "TOOLS" | "TASK" | "PRODUCT" | "QUESTION";
  scale: string;
  handler: string;
  priority: "High" | "Middle" | "Low";
  expectedStart: string;
  expectedEnd: string;
  parentRequirement: string;
  ccPerson: string;
  reviewTime: string;
  testCaseReviewTime: string;
  submitTime: string;
  testStartTime: string;
  onlineDeadline: string;
  estimatedHours: string;
  client: string;
  tester: string;
  developer: string;
  producter: string;
  designer: string;
  createTime: string;
}

export const ProjectRequirements: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const { state } = useLocation<{ projectName: string }>();
  const projectName = state?.projectName || "未知项目";
  const [isDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // 状态管理：需求列表 + 加载状态 + 错误提示 + 筛选条件
  const [requirementList, setRequirementList] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedIteration, setSelectedIteration] = useState(
    "2026-02-04~2026-03-04"
  );
  const [selectedType, setSelectedType] = useState("");

  // 加载需求列表（根据projectId筛选）
  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setLoading(true);
        const res = await get<Requirement[]>("/api/requirements"); // 调用Mock接口
        if (res.code === 200) {
          // 筛选当前项目的需求
          const projectRequirements = res.data.filter(
            (req) => req.projectId === projectId
          );
          setRequirementList(projectRequirements);
          setErrorMsg("");
        } else {
          setErrorMsg(res.message || "获取需求列表失败");
        }
      } catch (err) {
        setErrorMsg("网络异常，无法获取需求列表");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchRequirements();
    }
  }, [projectId]);

  // 筛选需求（模拟接口筛选，后续可传递筛选参数到后端）
  const filteredRequirements = requirementList.filter((req) => {
    // 迭代筛选（简化处理，实际可根据迭代周期字段匹配）
    const iterationMatch = selectedIteration ? true : false;
    // 类型筛选
    const typeMatch = selectedType ? req.type === selectedType : true;
    return iterationMatch && typeMatch;
  });

  // 进入新增需求页面
  const goToCreateRequirement = () => {
    navigate(`/projects/${projectId}/requirements/create`);
  };

  // 跳转到需求详情页
  const goToRequirementDetail = (requirement: Requirement) => {
    navigate(`/projects/${projectId}/requirements/${requirement.reqId}`, {
      state: { projectName, requirement },
    });
  };

  // 加载中/错误提示
  if (loading) {
    return (
      <div
        className={`p-4 min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full mb-2"></div>
          <p>加载需求列表中...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div
      className={`p-4 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* 页面头部 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">{projectName} - 需求管理</h2>
        <button
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            isDarkMode ? "bg-blue-900 text-blue-200" : "bg-blue-500 text-white"
          }`}
          onClick={goToCreateRequirement}
        >
          <FaPlus size={16} /> 创建需求
        </button>
      </div>

      {/* 筛选栏 */}
      <div
        className={`flex flex-wrap gap-3 mb-4 p-3 rounded-lg ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <FaFilter size={14} />
          <span className="font-medium">筛选：</span>
        </div>

        {/* 迭代筛选（核心条件） */}
        <div>
          <select
            className={`px-3 py-1 rounded border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-300"
            }`}
            value={selectedIteration}
            onChange={(e) => setSelectedIteration(e.target.value)}
          >
            <option value="">请选择迭代</option>
            <option value="2026-02-04~2026-03-04">
              2026-02-04 ~ 2026-03-04
            </option>
            <option value="2026-01-22~2026-02-04">
              2026-01-22 ~ 2026-02-04
            </option>
          </select>
        </div>

        {/* 需求类型筛选 */}
        <div>
          <select
            className={`px-3 py-1 rounded border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-300"
            }`}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">所有类型</option>
            <option value="PRODUCT">产品需求</option>
            <option value="TASK">任务</option>
            <option value="TOOLS">工具需求</option>
          </select>
        </div>
      </div>

      {/* 需求列表 */}
      {filteredRequirements.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">
            暂无需求数据，点击"创建需求"添加
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table
            className={`w-full ${
              isDarkMode
                ? "bg-gray-800 text-gray-200"
                : "bg-white text-gray-800"
            }`}
          >
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">标题</th>
                <th className="px-4 py-2 text-left">类型</th>
                <th className="px-4 py-2 text-left">规模</th>
                <th className="px-4 py-2 text-left">处理人</th>
                <th className="px-4 py-2 text-left">优先级</th>
                <th className="px-4 py-2 text-left">预计开始</th>
                <th className="px-4 py-2 text-left">预计结束</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequirements.map((req) => (
                <tr
                  key={req.reqId}
                  className={`hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                    req.type === "PRODUCT" ? "border-l-4 border-purple-500" : ""
                  }`}
                  onClick={() => goToRequirementDetail(req)}
                >
                  <td className="px-4 py-2">{req.title}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        req.type === "TOOLS"
                          ? "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                          : req.type === "TASK"
                          ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      }`}
                    >
                      {req.type}
                    </span>
                  </td>
                  <td className="px-4 py-2">{req.scale}</td>
                  <td className="px-4 py-2">{req.handler}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        req.priority === "High"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : req.priority === "Middle"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {req.priority}
                    </span>
                  </td>
                  <td className="px-4 py-2">{req.expectedStart}</td>
                  <td className="px-4 py-2">{req.expectedEnd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
