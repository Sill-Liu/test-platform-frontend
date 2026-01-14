import React, { useState } from "react";
import ProjectList from "./project/ProjectList";
import IterationCard from "./iteration/IterationCard";
import DemandList from "./demand/DemandList";

const ProjectManagement: React.FC = () => {
  // 二级菜单切换：project/iteration/demand
  const [activeTab, setActiveTab] = useState("project");
  // 选中的迭代ID（迭代-需求管理用）
  const [selectedIterationId, setSelectedIterationId] = useState<string>("");

  return (
    <div className="p-4">
      {/* 二级菜单栏 */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        <button
          onClick={() => setActiveTab("project")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "project"
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          项目管理
        </button>
        <button
          onClick={() => setActiveTab("iteration")}
          className={`px-4 py-2 rounded-md ${
            activeTab === "iteration"
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          迭代-需求管理
        </button>
      </div>

      {/* 内容区域 */}
      {activeTab === "project" ? (
        <ProjectList />
      ) : (
        <div className="flex gap-6">
          {/* 左侧迭代卡片 */}
          <div className="w-1/4 border rounded-lg p-4">
            <IterationCard
              onSelectIteration={setSelectedIterationId}
              selectedIterationId={selectedIterationId}
            />
          </div>
          {/* 右侧需求列表 */}
          <div className="w-3/4 border rounded-lg p-4">
            <DemandList iterationId={selectedIterationId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
