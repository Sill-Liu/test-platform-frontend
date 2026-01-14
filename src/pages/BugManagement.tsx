// src/pages/BugManagement.tsx
import { useState } from "react";
import { BugList } from "./BugList";
import { CreateBug } from "./CreateBug";
import { Bug } from "../types/Bug"; // 而非 "/src/types/Bug.ts"（绝对路径可能报错）

export const BugManagement = () => {
  // 视图控制：list（列表）/ create（新增）
  const [currentView, setCurrentView] = useState<"list" | "create">("list");
  // 共享的Bug列表数据
  const [bugList, setBugList] = useState<Bug[]>([]);

  // 点击新增按钮：切换到新增视图
  const handleAddBug = () => {
    setCurrentView("create");
  };

  // 取消新增：切回列表视图
  const handleCancelCreate = () => {
    setCurrentView("list");
  };

  // 提交新增Bug：更新列表并切回列表视图
  const handleSubmitBug = (newBug: Bug) => {
    setBugList((prev) => [newBug, ...prev]);
    setCurrentView("list");
    alert(`缺陷创建成功：${newBug.title}`);
  };

  return (
    <>
      {currentView === "list" && (
        <BugList initialBugList={bugList} onAddBug={handleAddBug} />
      )}
      {currentView === "create" && (
        <CreateBug onSubmit={handleSubmitBug} onCancel={handleCancelCreate} />
      )}
    </>
  );
};
