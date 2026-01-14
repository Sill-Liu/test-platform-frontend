import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { marked } from "marked";
import { get } from "../mock/mockRequest"; // 导入 Mock 请求工具

// 需求类型定义（保持不变）
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

export const RequirementDetail: React.FC = () => {
  const navigate = useNavigate();
  const { projectId, reqId } = useParams<{
    projectId: string;
    reqId: string;
  }>();
  const { state } = useLocation<{
    projectName: string;
    requirement?: Requirement;
  }>();
  const projectName = state?.projectName || "未知项目";
  const [isDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // 状态管理：需求详情 + 加载状态 + 错误提示
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 加载需求详情数据（优先用跳转参数，否则调用 Mock 接口）
  useEffect(() => {
    const fetchRequirementDetail = async () => {
      try {
        setLoading(true);

        // 优先使用跳转传递的需求数据
        if (state?.requirement) {
          setRequirement(state.requirement);
          setErrorMsg("");
          return;
        }

        // 无跳转参数时，调用 Mock 接口获取
        if (reqId) {
          const res = await get<Requirement>(`/api/requirements/${reqId}`);
          if (res.code === 200) {
            setRequirement(res.data);
            setErrorMsg("");
          } else {
            setErrorMsg(res.message || "获取需求详情失败");
          }
        }
      } catch (err) {
        setErrorMsg("网络异常，无法获取需求详情");
      } finally {
        setLoading(false);
      }
    };

    fetchRequirementDetail();
  }, [reqId, state]);

  // 返回需求列表页
  const goBackToList = () => {
    navigate(`/projects/${projectId}/requirements`, { state: { projectName } });
  };

  // 加载中状态
  if (loading) {
    return (
      <div
        className={`p-4 min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full mb-2"></div>
          <p>加载需求详情中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
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
            onClick={goBackToList}
            className={`px-4 py-2 rounded ${
              isDarkMode
                ? "bg-blue-900 text-blue-200"
                : "bg-blue-500 text-white"
            }`}
          >
            返回需求列表
          </button>
        </div>
      </div>
    );
  }

  // 需求不存在
  if (!requirement) {
    return (
      <div
        className={`p-4 min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center">
          <h3 className="text-lg mb-2">需求不存在或已删除</h3>
          <button
            onClick={goBackToList}
            className={`px-4 py-2 rounded mt-4 ${
              isDarkMode
                ? "bg-blue-900 text-blue-200"
                : "bg-blue-500 text-white"
            }`}
          >
            返回需求列表
          </button>
        </div>
      </div>
    );
  }

  // 正常渲染
  return (
    <div
      className={`p-4 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* 页面头部 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={goBackToList}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <FaArrowLeft size={18} />
          </button>
          <h2 className="text-xl font-medium">{projectName} - 需求详情</h2>
        </div>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded flex items-center gap-1 ${
              isDarkMode
                ? "bg-blue-900 text-blue-200"
                : "bg-blue-500 text-white"
            }`}
          >
            <FaEdit size={14} /> 编辑
          </button>
          <button
            className={`px-3 py-1 rounded flex items-center gap-1 ${
              isDarkMode ? "bg-red-900 text-red-200" : "bg-red-500 text-white"
            }`}
          >
            <FaTrash size={14} /> 删除
          </button>
        </div>
      </div>

      {/* 需求详情主体 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 左侧：需求标题+内容 */}
        <div className="lg:col-span-2">
          <div
            className={`rounded-lg p-4 mb-4 ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3 className="text-lg font-semibold mb-2">{requirement.title}</h3>
            <div className="flex flex-wrap gap-3 text-sm">
              <span
                className={`px-2 py-1 rounded ${
                  requirement.type === "TOOLS"
                    ? "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                    : requirement.type === "TASK"
                    ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                }`}
              >
                {requirement.type}
              </span>
              <span
                className={`px-2 py-1 rounded ${
                  requirement.priority === "High"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : requirement.priority === "Middle"
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                }`}
              >
                {requirement.priority}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                创建时间：{requirement.createTime}
              </span>
            </div>
          </div>

          <div
            className={`rounded-lg p-4 ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
            style={{ minHeight: "400px" }}
          >
            <div
              className={`prose max-w-none ${isDarkMode ? "prose-invert" : ""}`}
              dangerouslySetInnerHTML={{
                __html: marked.parse(requirement.content || "暂无需求内容"),
              }}
            />
          </div>
        </div>

        {/* 右侧：需求属性信息 */}
        <div
          className={`rounded-lg p-4 ${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <h4 className="font-medium mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            需求属性
          </h4>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">处理人：</span>
              <span>{requirement.handler || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">抄送人：</span>
              <span>{requirement.ccPerson || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">
                预计开始：
              </span>
              <span>{requirement.expectedStart || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">
                预计结束：
              </span>
              <span>{requirement.expectedEnd || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">父需求：</span>
              <span>{requirement.parentRequirement || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">
                需求评审时间：
              </span>
              <span>{requirement.reviewTime || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">
                用例评审时间：
              </span>
              <span>{requirement.testCaseReviewTime || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">
                提测时间：
              </span>
              <span>{requirement.submitTime || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">
                测试开始时间：
              </span>
              <span>{requirement.testStartTime || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">
                上线截止时间：
              </span>
              <span>{requirement.onlineDeadline || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">
                预估工时：
              </span>
              <span>{requirement.estimatedHours || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">客户端：</span>
              <span>{requirement.client || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">
                测试人员：
              </span>
              <span>{requirement.tester || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">
                开发人员：
              </span>
              <span>{requirement.developer || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">
                产品人员：
              </span>
              <span>{requirement.producter || "-"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-gray-500 dark:text-gray-400">
                设计人员：
              </span>
              <span>{requirement.designer || "-"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
