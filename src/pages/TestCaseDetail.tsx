import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

// 模拟用例详情数据（可后续替换为接口请求）
const mockTestCaseData = {
  1: {
    id: "1",
    name: "登录功能正向测试",
    projectId: "1",
    projectName: "电商平台",
    priority: "高",
    type: "功能测试",
    status: "已完成",
    creator: "测试工程师",
    createTime: "2026-01-10",
    testSteps: [
      "1. 打开登录页，输入正确的用户名/密码",
      "2. 点击登录按钮",
      "3. 观察页面跳转",
    ],
    expectedResult: "成功跳转到首页，显示用户昵称",
    actualResult: "符合预期",
    attachment: "无",
  },
  2: {
    id: "2",
    name: "下单功能异常测试",
    projectId: "1",
    projectName: "电商平台",
    priority: "中",
    type: "功能测试",
    status: "待执行",
    creator: "测试工程师",
    createTime: "2026-01-12",
    testSteps: [
      "1. 加入商品到购物车",
      "2. 结算时输入空的收货地址",
      "3. 点击提交订单",
    ],
    expectedResult: "提示“收货地址不能为空”，不跳转",
    actualResult: "",
    attachment: "无",
  },
};

// 用例详情页组件
export const TestCaseDetail = () => {
  // 获取路由中的用例ID
  const { caseId } = useParams<{ caseId?: string }>();
  // 导航实例（用于返回列表页）
  const navigate = useNavigate();
  // 编辑状态控制
  const [isEditing, setIsEditing] = useState(false);
  // 用例详情数据（支持编辑）
  const [caseData, setCaseData] = useState(
    caseId ? mockTestCaseData[caseId] || null : null
  );

  // 无匹配用例时的提示
  if (!caseData) {
    return (
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold mb-4 text-red-500">用例不存在</h3>
        <button
          onClick={() => navigate("/testcases")}
          className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 mx-auto"
        >
          <FaArrowLeft size={14} /> 返回用例列表
        </button>
      </div>
    );
  }

  // 处理输入框变更
  const handleInputChange = (key: string, value: string) => {
    setCaseData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  // 处理步骤变更（数组类型）
  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...caseData.testSteps];
    newSteps[index] = value;
    setCaseData((prev) => (prev ? { ...prev, testSteps: newSteps } : null));
  };

  // 保存编辑
  const handleSave = () => {
    setIsEditing(false);
    // 这里可后续对接接口，保存修改后的用例数据
    alert("用例详情修改成功！");
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* 顶部操作栏 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/testcases")}
          className="flex items-center gap-2 text-blue-600 hover:underline"
        >
          <FaArrowLeft size={16} /> 返回用例列表
        </button>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-500 text-white rounded flex items-center gap-1"
              >
                <FaSave size={14} /> 保存
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-500 text-white rounded flex items-center gap-1"
              >
                <FaTimes size={14} /> 取消
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 bg-blue-500 text-white rounded flex items-center gap-1"
              >
                <FaEdit size={14} /> 编辑
              </button>
              <button
                onClick={() => {
                  if (window.confirm("确定删除该用例吗？")) {
                    navigate("/testcases");
                    // 后续对接删除接口
                    alert("用例删除成功！");
                  }
                }}
                className="px-3 py-1 bg-red-500 text-white rounded flex items-center gap-1"
              >
                <FaTrash size={14} /> 删除
              </button>
            </>
          )}
        </div>
      </div>

      {/* 用例详情卡片 */}
      <div className="border rounded-lg p-5 shadow-sm">
        {/* 基础信息 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">用例名称</label>
            {isEditing ? (
              <input
                type="text"
                value={caseData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            ) : (
              <p className="font-medium">{caseData.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">所属项目</label>
            {isEditing ? (
              <input
                type="text"
                value={caseData.projectName}
                onChange={(e) =>
                  handleInputChange("projectName", e.target.value)
                }
                className="w-full px-3 py-2 border rounded"
                readOnly // 所属项目建议只读，如需修改可放开
              />
            ) : (
              <p>{caseData.projectName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">优先级</label>
            {isEditing ? (
              <select
                value={caseData.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="高">高</option>
                <option value="中">中</option>
                <option value="低">低</option>
              </select>
            ) : (
              <p>{caseData.priority}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">测试类型</label>
            {isEditing ? (
              <input
                type="text"
                value={caseData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            ) : (
              <p>{caseData.type}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">用例状态</label>
            {isEditing ? (
              <select
                value={caseData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="待执行">待执行</option>
                <option value="执行中">执行中</option>
                <option value="已完成">已完成</option>
                <option value="已废弃">已废弃</option>
              </select>
            ) : (
              <p>{caseData.status}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">创建人</label>
            <p className="text-gray-600">{caseData.creator}</p>
          </div>
        </div>

        {/* 测试步骤 */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">测试步骤</label>
          {isEditing ? (
            <div>
              {caseData.testSteps.map((step, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded"
                  />
                </div>
              ))}
            </div>
          ) : (
            <ul className="list-decimal pl-5 space-y-1">
              {caseData.testSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          )}
        </div>

        {/* 预期结果 */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">预期结果</label>
          {isEditing ? (
            <textarea
              value={caseData.expectedResult}
              onChange={(e) =>
                handleInputChange("expectedResult", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 border rounded"
            />
          ) : (
            <p className="whitespace-pre-line">{caseData.expectedResult}</p>
          )}
        </div>

        {/* 实际结果 */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-1">实际结果</label>
          {isEditing ? (
            <textarea
              value={caseData.actualResult}
              onChange={(e) =>
                handleInputChange("actualResult", e.target.value)
              }
              rows={3}
              className="w-full px-3 py-2 border rounded"
            />
          ) : (
            <p className="whitespace-pre-line text-gray-600">
              {caseData.actualResult || "暂无执行结果"}
            </p>
          )}
        </div>

        {/* 附件 */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">附件</label>
          {isEditing ? (
            <input
              type="text"
              value={caseData.attachment}
              onChange={(e) => handleInputChange("attachment", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              placeholder="输入附件URL/描述"
            />
          ) : (
            <p className="text-gray-600">{caseData.attachment}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCaseDetail;
