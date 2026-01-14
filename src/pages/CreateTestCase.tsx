// src/pages/CreateTestCase.tsx（占位组件）
import React from "react";
import { useParams } from "react-router-dom";

export const CreateTestCase: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [isDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  return (
    <div
      className={`p-4 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h2 className="text-xl font-medium mb-4">
        新增测试用例 - 项目 {projectId}
      </h2>
      <p className="text-gray-500 dark:text-gray-400">新增用例表单（待开发）</p>
    </div>
  );
};
