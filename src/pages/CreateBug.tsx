// src/pages/CreateBug.tsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { format } from "date-fns";
import {
  FaSearch,
  FaCalendarAlt,
  FaPaperclip,
  FaBan,
  FaSave,
} from "react-icons/fa";
import { Bug, BugFormValues } from "../types/Bug";

interface CreateBugProps {
  // 提交成功后的回调（返回新创建的Bug）
  onSubmit: (newBug: Bug) => void;
  // 取消创建的回调
  onCancel: () => void;
}

export const CreateBug = ({ onSubmit, onCancel }: CreateBugProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // 新增表单状态
  const [formValues, setFormValues] = useState<BugFormValues>({
    title: "",
    content: "",
    relatedRequirement: "",
    startDate: "",
    endDate: "",
    priority: "",
    severity: "",
    handler: "",
    copyTo: "",
    verifier: "",
    version: "",
    platform: "",
    developer: "",
    tester: "",
    reproduceRule: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Record<keyof BugFormValues, string>
  >({
    title: "",
    content: "",
    relatedRequirement: "",
    startDate: "",
    endDate: "",
    priority: "",
    severity: "",
    handler: "",
    copyTo: "",
    verifier: "",
    version: "",
    platform: "",
    developer: "",
    tester: "",
    reproduceRule: "",
  });

  // ========== 表单处理 ==========
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    // 清除对应字段的错误提示
    if (formErrors[name as keyof BugFormValues]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 富文本内容变化处理
  const handleRichTextChange = (value: string | undefined) => {
    setFormValues((prev) => ({ ...prev, content: value || "" }));
    if (formErrors.content) {
      setFormErrors((prev) => ({ ...prev, content: "" }));
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    const errors: Record<keyof BugFormValues, string> = {
      title: "",
      content: "",
      relatedRequirement: "",
      startDate: "",
      endDate: "",
      priority: "",
      severity: "",
      handler: "",
      copyTo: "",
      verifier: "",
      version: "",
      platform: "",
      developer: "",
      tester: "",
      reproduceRule: "",
    };
    let isValid = true;

    if (!formValues.title.trim()) {
      errors.title = "缺陷标题不能为空";
      isValid = false;
    }
    if (!formValues.content.trim()) {
      errors.content = "缺陷详情不能为空";
      isValid = false;
    }
    if (!formValues.relatedRequirement.trim()) {
      errors.relatedRequirement = "关联需求不能为空";
      isValid = false;
    }
    if (!formValues.priority) {
      errors.priority = "优先级不能为空";
      isValid = false;
    }
    if (!formValues.severity) {
      errors.severity = "严重程度不能为空";
      isValid = false;
    }
    if (!formValues.handler.trim()) {
      errors.handler = "处理人不能为空";
      isValid = false;
    }
    if (!formValues.version) {
      errors.version = "发现版本不能为空";
      isValid = false;
    }
    if (!formValues.developer.trim()) {
      errors.developer = "开发人员不能为空";
      isValid = false;
    }
    if (!formValues.tester.trim()) {
      errors.tester = "测试人员不能为空";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // 提交表单
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setFormLoading(true);
      // 模拟接口请求延迟
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 构造新Bug数据
      const newBug: Bug = {
        id: `BUG-${Date.now()}`, // 用时间戳生成唯一ID
        title: formValues.title,
        type: "BUG",
        version: formValues.version,
        severity: formValues.severity as "一般" | "严重" | "致命",
        priority: formValues.priority as "低" | "中" | "高",
        status: "待处理",
        handler: formValues.handler,
        startDate: formValues.startDate,
        endDate: formValues.endDate,
        creator: "当前用户", // 实际开发中替换为登录用户
        createTime: format(new Date(), "yyyy-MM-dd HH:mm"),
        platform: formValues.platform,
        testData: "",
        apiUrl: "",
        testSteps: formValues.content, // 富文本内容存到testSteps
        testResult: "",
        expectedResult: "",
        relatedRequirement: formValues.relatedRequirement,
        reproduceRule: formValues.reproduceRule,
        attachment: "",
      };

      // 调用外部提交回调
      onSubmit(newBug);
    } catch (err) {
      alert("创建缺陷失败，请重试");
    } finally {
      setFormLoading(false);
    }
  };

  // 提交并继续创建
  const handleSubmitAndContinue = () => {
    if (!validateForm()) return;
    handleSubmit();
    // 重置表单
    setFormValues({
      title: "",
      content: "",
      relatedRequirement: "",
      startDate: "",
      endDate: "",
      priority: "",
      severity: "",
      handler: "",
      copyTo: "",
      verifier: "",
      version: "",
      platform: "",
      developer: "",
      tester: "",
      reproduceRule: "",
    });
  };

  // 样式适配
  const modalBgClass = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
  const inputBgClass = isDarkMode
    ? "bg-gray-700 border-gray-600 text-gray-200"
    : "bg-white border-gray-300 text-gray-800";
  const btnClass = isDarkMode
    ? "bg-blue-900 text-blue-200 hover:bg-blue-800"
    : "bg-blue-500 text-white hover:bg-blue-600";
  const cancelBtnClass = isDarkMode
    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
    : "bg-gray-200 text-gray-800 hover:bg-gray-300";
  const errorClass = isDarkMode ? "text-red-400" : "text-red-600";

  return (
    <div
      className={`p-4 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">创建缺陷</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ×
        </button>
      </div>

      {/* 主体布局：标题 + 富文本（左） + 表单（右） */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* 左侧：标题 + 整体富文本 */}
        <div
          className={`flex-1 rounded-lg p-3 ${modalBgClass} shadow-sm flex flex-col`}
        >
          {/* 标题输入框 */}
          <div className="mb-4">
            <label className="block text-sm mb-1 font-medium">缺陷标题*</label>
            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleFormChange}
              placeholder="输入缺陷标题（如：【PC-py学伴优化】学伴拖拽状态异常）"
              className={`w-full px-3 py-2 rounded border ${inputBgClass} ${
                formErrors.title ? "border-red-500" : ""
              }`}
            />
            {formErrors.title && (
              <p className={`text-xs mt-1 ${errorClass}`}>{formErrors.title}</p>
            )}
          </div>

          {/* 整体富文本编辑区（占满剩余高度） */}
          <div className="flex-grow">
            <label className="block text-sm mb-1 font-medium">
              缺陷详情（自定义填写）*
            </label>
            {/* 外层容器：key 随 isDarkMode 变化，强制组件刷新 */}
            <div
              key={`md-editor-${isDarkMode}`}
              style={{
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                borderRadius: "0.375rem",
                overflow: "hidden",
                height: "calc(100vh - 240px)",
              }}
            >
              <MDEditor
                value={formValues.content}
                onChange={handleRichTextChange}
                height="100%"
                preview="edit"
                placeholder="请输入缺陷详情（如测试数据、步骤、结果等）"
                toolbar={[
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["code", "clean"],
                ]}
                // 挂载后修改样式适配明暗模式
                onMounted={(editor) => {
                  if (!editor) return;
                  const root = editor as HTMLElement;
                  root.style.backgroundColor = isDarkMode
                    ? "#1f2937"
                    : "#ffffff";
                  root.style.color = isDarkMode ? "#ffffff" : "#000000";

                  const input = root.querySelector(".w-md-editor-text-input");
                  if (input) {
                    (input as HTMLElement).style.backgroundColor = isDarkMode
                      ? "#1f2937"
                      : "#ffffff";
                    (input as HTMLElement).style.color = isDarkMode
                      ? "#ffffff"
                      : "#000000";
                    (input as HTMLElement).style.caretColor = isDarkMode
                      ? "#ffffff"
                      : "#000000";
                  }

                  const preview = root.querySelector(".w-md-editor-text-pre");
                  if (preview) {
                    (preview as HTMLElement).style.backgroundColor = isDarkMode
                      ? "#1f2937"
                      : "#ffffff";
                    (preview as HTMLElement).style.color = isDarkMode
                      ? "#ffffff"
                      : "#000000";
                    const code = preview.querySelector("code");
                    if (code) {
                      (code as HTMLElement).style.backgroundColor = isDarkMode
                        ? "#2d3748"
                        : "#f9fafb";
                      (code as HTMLElement).style.color = isDarkMode
                        ? "#ffffff"
                        : "#000000";
                    }
                  }

                  const toolbar = root.querySelector(".w-md-editor-toolbar");
                  if (toolbar) {
                    (toolbar as HTMLElement).style.backgroundColor = isDarkMode
                      ? "#2d3748"
                      : "#f5f5f5";
                    (toolbar as HTMLElement).style.borderBottom = `1px solid ${
                      isDarkMode ? "#374151" : "#e5e7eb"
                    }`;
                    const buttons = toolbar.querySelectorAll("button");
                    buttons.forEach((btn) => {
                      (btn as HTMLElement).style.color = isDarkMode
                        ? "#ffffff"
                        : "#000000";
                    });
                  }
                }}
              />
            </div>
            {formErrors.content && (
              <p className={`text-xs mt-1 ${errorClass}`}>
                {formErrors.content}
              </p>
            )}
          </div>
        </div>

        {/* 右侧：表单区域（固定宽度） */}
        <div
          className={`w-full lg:w-80 rounded-lg p-3 ${modalBgClass} shadow-sm`}
        >
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">关联需求*</label>
              <div className="relative">
                <input
                  type="text"
                  name="relatedRequirement"
                  value={formValues.relatedRequirement}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 rounded border ${inputBgClass} ${
                    formErrors.relatedRequirement ? "border-red-500" : ""
                  }`}
                />
                <FaSearch
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  size={14}
                />
              </div>
              {formErrors.relatedRequirement && (
                <p className={`text-xs mt-1 ${errorClass}`}>
                  {formErrors.relatedRequirement}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm mb-1">预计开始</label>
                <div className="relative">
                  <input
                    type="date"
                    name="startDate"
                    value={formValues.startDate}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 rounded border ${inputBgClass}`}
                  />
                  <FaCalendarAlt
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={14}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">预计结束</label>
                <div className="relative">
                  <input
                    type="date"
                    name="endDate"
                    value={formValues.endDate}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 rounded border ${inputBgClass}`}
                  />
                  <FaCalendarAlt
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={14}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">优先级*</label>
              <select
                name="priority"
                value={formValues.priority}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${inputBgClass} ${
                  formErrors.priority ? "border-red-500" : ""
                }`}
              >
                <option value="">请选择</option>
                <option value="低">低</option>
                <option value="中">中</option>
                <option value="高">高</option>
              </select>
              {formErrors.priority && (
                <p className={`text-xs mt-1 ${errorClass}`}>
                  {formErrors.priority}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">严重程度*</label>
              <select
                name="severity"
                value={formValues.severity}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${inputBgClass} ${
                  formErrors.severity ? "border-red-500" : ""
                }`}
              >
                <option value="">请选择</option>
                <option value="一般">一般</option>
                <option value="严重">严重</option>
                <option value="致命">致命</option>
              </select>
              {formErrors.severity && (
                <p className={`text-xs mt-1 ${errorClass}`}>
                  {formErrors.severity}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">处理人*</label>
              <input
                type="text"
                name="handler"
                value={formValues.handler}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${inputBgClass} ${
                  formErrors.handler ? "border-red-500" : ""
                }`}
              />
              {formErrors.handler && (
                <p className={`text-xs mt-1 ${errorClass}`}>
                  {formErrors.handler}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">抄送人</label>
              <input
                type="text"
                name="copyTo"
                value={formValues.copyTo}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${inputBgClass}`}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">归属人*</label>
              <input
                type="text"
                name="verifier"
                value={formValues.verifier}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${inputBgClass}`}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">发现版本*</label>
              <select
                name="version"
                value={formValues.version}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${inputBgClass} ${
                  formErrors.version ? "border-red-500" : ""
                }`}
              >
                <option value="">请选择</option>
                <option value="迭代版本">迭代版本</option>
                <option value="正式版本">正式版本</option>
              </select>
              {formErrors.version && (
                <p className={`text-xs mt-1 ${errorClass}`}>
                  {formErrors.version}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">软件平台</label>
              <select
                name="platform"
                value={formValues.platform}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${inputBgClass}`}
              >
                <option value="">请选择</option>
                <option value="前端">前端</option>
                <option value="后端">后端</option>
                <option value="产品/设计">产品/设计</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">开发人员*</label>
              <input
                type="text"
                name="developer"
                value={formValues.developer}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${inputBgClass} ${
                  formErrors.developer ? "border-red-500" : ""
                }`}
              />
              {formErrors.developer && (
                <p className={`text-xs mt-1 ${errorClass}`}>
                  {formErrors.developer}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">测试人员*</label>
              <input
                type="text"
                name="tester"
                value={formValues.tester}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${inputBgClass} ${
                  formErrors.tester ? "border-red-500" : ""
                }`}
              />
              {formErrors.tester && (
                <p className={`text-xs mt-1 ${errorClass}`}>
                  {formErrors.tester}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1">重现规律</label>
              <select
                name="reproduceRule"
                value={formValues.reproduceRule}
                onChange={handleFormChange}
                className={`w-full px-3 py-2 rounded border ${inputBgClass}`}
              >
                <option value="">请选择</option>
                <option value="必现">必现</option>
                <option value="偶现">偶现</option>
                <option value="不可复现">不可复现</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">归属软件平台</label>
              <select
                className={`w-full px-3 py-2 rounded border ${inputBgClass}`}
              >
                <option value="">请选择</option>
                <option value="前端">前端</option>
                <option value="后端">后端</option>
              </select>
            </div>

            <div>
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

      {/* 底部操作按钮（固定在页面底部） */}
      <div className="mt-6 flex gap-2 border-t pt-4 border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSubmit}
          disabled={formLoading}
          className={`px-4 py-2 rounded ${btnClass}`}
        >
          {formLoading ? (
            <div className="flex items-center justify-center">
              <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full mr-2"></div>
              提交中...
            </div>
          ) : (
            <>
              <FaSave size={16} className="mr-1" />
              创建
            </>
          )}
        </button>
        <button
          onClick={handleSubmitAndContinue}
          disabled={formLoading}
          className={`px-4 py-2 rounded ${cancelBtnClass}`}
        >
          提交并继续创建
        </button>
        <button className={`px-4 py-2 rounded ${cancelBtnClass}`}>
          保存草稿
        </button>
        <button
          onClick={onCancel}
          disabled={formLoading}
          className={`px-4 py-2 rounded ${cancelBtnClass}`}
        >
          <FaBan size={16} className="mr-1" />
          取消
        </button>
      </div>
    </div>
  );
};
