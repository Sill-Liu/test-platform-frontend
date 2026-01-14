import React, { useState, ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { FaPaperclip } from "react-icons/fa";

// 需求表单类型定义
interface ReqFormValues {
  title: string;
  content: string;
  parentRequirement: string;
  handler: string;
  ccPerson: string;
  type: string;
  expectedEnd: string;
  expectedStart: string;
  priority: string;
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
}

export const CreateRequirement: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [isDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // 表单初始值
  const [formValues, setFormValues] = useState<ReqFormValues>({
    title: "",
    content: "",
    parentRequirement: "",
    handler: "",
    ccPerson: "",
    type: "",
    expectedEnd: "",
    expectedStart: "",
    priority: "",
    reviewTime: "",
    testCaseReviewTime: "",
    submitTime: "",
    testStartTime: "",
    onlineDeadline: "",
    estimatedHours: "",
    client: "",
    tester: "",
    developer: "",
    producter: "",
    designer: "",
  });

  // 表单值变化处理
  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // 提交需求
  const handleSubmit = () => {
    if (!formValues.title || !formValues.content) {
      alert("标题和内容不能为空！");
      return;
    }
    alert("需求创建成功！");
    navigate(`/projects/${projectId}/requirements`);
  };

  return (
    <div
      className={`p-4 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* 页面头部 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">创建需求</h2>
        <button
          onClick={() => navigate(`/projects/${projectId}/requirements`)}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ×
        </button>
      </div>

      {/* 主体布局：标题+富文本（左） + 表单（右） */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 左侧：标题 + 富文本 */}
        <div
          className={`flex-1 rounded-lg p-3 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-sm flex flex-col`}
        >
          {/* 标题输入框 */}
          <div className="mb-4">
            <label className="block text-sm mb-1 font-medium">输入标题*</label>
            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleFormChange}
              className={`w-full px-3 py-2 rounded border ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
              placeholder="输入需求标题"
            />
          </div>

          {/* 富文本编辑区 */}
          <div className="flex-grow">
            <label className="block text-sm mb-1 font-medium">
              请输入内容*
            </label>
            <div style={{ height: "calc(100vh - 240px)" }}>
              <MDEditor
                value={formValues.content}
                onChange={(value) =>
                  setFormValues((prev) => ({ ...prev, content: value || "" }))
                }
                height="100%"
                preview="edit"
                dark={isDarkMode}
                placeholder="请输入需求详情内容"
              />
            </div>
          </div>
        </div>

        {/* 右侧：表单区域 */}
        <div
          className={`w-full lg:w-80 rounded-lg p-3 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-sm`}
        >
          <div className="space-y-3">
            {/* 父需求 */}
            <div>
              <label className="block text-sm mb-1">父需求</label>
              <input
                type="text"
                name="parentRequirement"
                value={formValues.parentRequirement}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              />
            </div>

            {/* 处理人 */}
            <div>
              <label className="block text-sm mb-1">处理人*</label>
              <input
                type="text"
                name="handler"
                value={formValues.handler}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              />
            </div>

            {/* 抄送人 */}
            <div>
              <label className="block text-sm mb-1">抄送人</label>
              <input
                type="text"
                name="ccPerson"
                value={formValues.ccPerson}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              />
            </div>

            {/* 类型 */}
            <div>
              <label className="block text-sm mb-1">类型*</label>
              <select
                name="type"
                value={formValues.type}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                <option value="">请选择</option>
                <option value="PRODUCT">产品需求</option>
                <option value="TASK">任务</option>
                <option value="TOOLS">工具需求</option>
              </select>
            </div>

            {/* 时间类字段（示例：预计结束/开始） */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm mb-1">预计结束</label>
                <input
                  type="date"
                  name="expectedEnd"
                  value={formValues.expectedEnd}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 rounded border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">预计开始</label>
                <input
                  type="date"
                  name="expectedStart"
                  value={formValues.expectedStart}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 rounded border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                />
              </div>
            </div>

            {/* 优先级 */}
            <div>
              <label className="block text-sm mb-1">优先级</label>
              <select
                name="priority"
                value={formValues.priority}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                <option value="">请选择</option>
                <option value="High">High</option>
                <option value="Middle">Middle</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* 其他时间/人员字段（示例：评审时间、测试人员） */}
            <div>
              <label className="block text-sm mb-1">需求评审时间</label>
              <input
                type="datetime-local"
                name="reviewTime"
                value={formValues.reviewTime}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">测试人员</label>
              <input
                type="text"
                name="tester"
                value={formValues.tester}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              />
            </div>

            {/* 附件 */}
            <div className="mt-4">
              <label className="block text-sm mb-1 flex items-center gap-1">
                <FaPaperclip size={14} /> 附件
                <button className="text-blue-500 dark:text-blue-400 text-sm">
                  + 添加
                </button>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作按钮 */}
      <div className="mt-6 flex gap-2 border-t pt-4 border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 rounded ${
            isDarkMode ? "bg-blue-900 text-blue-200" : "bg-blue-500 text-white"
          }`}
        >
          创建
        </button>
        <button
          onClick={() => {
            handleSubmit();
            setFormValues((prev) => ({ ...prev, title: "", content: "" }));
          }}
          className={`px-4 py-2 rounded ${
            isDarkMode
              ? "bg-gray-700 text-gray-200"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          提交并继续创建
        </button>
        <button
          className={`px-4 py-2 rounded ${
            isDarkMode
              ? "bg-gray-700 text-gray-200"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          保存草稿
        </button>
        <button
          onClick={() => navigate(`/projects/${projectId}/requirements`)}
          className={`px-4 py-2 rounded ${
            isDarkMode
              ? "bg-gray-700 text-gray-200"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          取消
        </button>
      </div>
    </div>
  );
};
