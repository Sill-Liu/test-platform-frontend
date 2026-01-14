import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

// 模拟用例数据（按项目分组）
const mockTestCases = [
  { id: 1, name: "登录功能测试", projectId: "1", projectName: "电商平台" },
  { id: 2, name: "下单功能测试", projectId: "1", projectName: "电商平台" },
  { id: 3, name: "支付接口测试", projectId: "2", projectName: "支付系统" },
];

export const TestCases = () => {
  // 获取路由中的projectId（可选）
  const { projectId } = useParams<{ projectId?: string }>();
  const [cases, setCases] = useState(mockTestCases);

  // 按projectId筛选数据
  useEffect(() => {
    if (projectId) {
      // 有projectId：筛选该项目的用例
      const filtered = mockTestCases.filter(
        (item) => item.projectId === projectId
      );
      setCases(filtered);
    } else {
      // 无projectId：展示全部用例
      setCases(mockTestCases);
    }
  }, [projectId]);

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-4">用例管理</h3>
      {/* 项目筛选下拉框（可选，方便手动切换） */}
      <select
        className="mb-4 p-2 border rounded"
        onChange={(e) => {
          if (e.target.value === "all") {
            window.location.href = "/testcases";
          } else {
            window.location.href = `/testcases/${e.target.value}`;
          }
        }}
        value={projectId || "all"}
      >
        <option value="all">全部项目</option>
        <option value="1">电商平台</option>
        <option value="2">支付系统</option>
      </select>

      {/* 用例列表 */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">用例名称</th>
            <th className="border p-2">所属项目</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.projectName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 新增用例按钮 */}
      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={() => (window.location.href = "/testcases/create")}
      >
        新增用例
      </button>
    </div>
  );
};
