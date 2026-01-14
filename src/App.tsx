import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// 布局组件
import { BaseLayout } from "./layouts/BaseLayout";

// 核心页面
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";

// 项目管理相关
import { Projects } from "./pages/Projects";

// 需求管理相关（强绑定项目）
import { ProjectRequirements } from "./pages/ProjectRequirements";
import { CreateRequirement } from "./pages/CreateRequirement";
import { RequirementDetail } from "./pages/RequirementDetail";

// 用例管理相关（🌟 注释掉丢失的 TestCaseDetail 导入）
import { TestCases } from "./pages/TestCases";
import { CreateTestCase } from "./pages/CreateTestCase";
// import { TestCaseDetail } from "./pages/TestCaseDetail"; // 注释：文件丢失，暂时注释

// 缺陷管理相关
import { BugManagement } from "./pages/BugManagement";

// 私有路由组件
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 登录页面 */}
        <Route path="/login" element={<Login />} />

        {/* 核心业务页面（需要登录） */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <BaseLayout />
            </PrivateRoute>
          }
        >
          {/* 仪表盘（默认首页） */}
          <Route index element={<Dashboard />} />

          {/* 项目管理 */}
          <Route path="projects" element={<Projects />} />

          {/* 需求管理（强绑定项目，必须带projectId） */}
          <Route path="projects/:projectId/requirements">
            <Route index element={<ProjectRequirements />} />
            <Route path="create" element={<CreateRequirement />} />
            <Route path=":reqId" element={<RequirementDetail />} />
          </Route>

          {/* 用例管理（无projectId展示全部） */}
          <Route path="testcases">
            <Route index element={<TestCases />} /> {/* 全部用例列表 */}
            <Route path=":projectId" element={<TestCases />} />{" "}
            {/* 单个项目的用例 */}
            <Route path="create" element={<CreateTestCase />} />{" "}
            {/* 新增用例 */}
            {/* 🌟 注释掉丢失的 TestCaseDetail 路由 */}
            {/* <Route path="detail/:caseId" element={<TestCaseDetail />} /> */}
          </Route>

          {/* 缺陷管理（无projectId展示全部） */}
          <Route path="bugs">
            <Route index element={<BugManagement />} /> {/* 全部缺陷列表 */}
            <Route path=":projectId" element={<BugManagement />} />{" "}
            {/* 单个项目的缺陷 */}
          </Route>

          {/* 其他页面 */}
          <Route path="api-auto" element={<div>API自动化页面</div>} />
          <Route path="app-auto" element={<div>App自动化页面</div>} />
          <Route path="web-auto" element={<div>Web自动化页面</div>} />
          <Route path="team" element={<div>团队文化页面</div>} />
        </Route>

        {/* 404页面 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
