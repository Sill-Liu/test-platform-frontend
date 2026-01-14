import React, { useState, useEffect } from "react";
import {
  FaClipboardList,
  FaBug,
  FaTasks,
  FaProjectDiagram,
  FaClock,
} from "react-icons/fa";
import { get } from "../mock/mockRequest";

// ========== 类型定义 ==========
interface Overview {
  totalProjects: number;
  totalRequirements: number;
  totalBugs: number;
  totalTasks: number;
  completedRequirements: number;
  closedBugs: number;
  completedTasks: number;
  progressRate: number;
}
interface IterationTrendItem {
  name: string;
  progress: number;
}
interface DistributionItem {
  name: string;
  value: number;
}
interface PendingItem {
  id: string;
  title: string;
  type: "需求" | "缺陷" | "任务";
  deadline: string;
}
interface DashboardData {
  overview: Overview;
  iterationTrend: IterationTrendItem[];
  requirementTypeDistribution: DistributionItem[];
  bugStatusDistribution: DistributionItem[];
  pendingItems: PendingItem[];
}
interface PieData {
  gradient: string[];
  items: (DistributionItem & { color: string; displayColor: string })[];
  total: number;
}

export const Dashboard: React.FC = () => {
  const [isDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 加载数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await get<DashboardData>("/api/dashboard");
        if (res.code === 200) setDashboardData(res.data);
        else setErrorMsg(res.message);
      } catch (err) {
        setErrorMsg("网络异常");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 需求类型饼图数据（用实际色值）
  const getRequirementPieData = (): PieData => {
    if (!dashboardData) return { gradient: [], items: [], total: 0 };
    const { requirementTypeDistribution } = dashboardData;
    const total = requirementTypeDistribution.reduce(
      (sum, item) => sum + item.value,
      0
    );

    // 实际色值（适配明暗模式）
    const colors = isDarkMode
      ? [
          "#a78bfa", // 紫色-400（暗模式）
          "#9ca3af", // 灰色-400
          "#f472b6", // 粉色-400
          "#facc15", // 黄色-400
        ]
      : [
          "#9333ea", // 紫色-600（亮模式）
          "#6b7280", // 灰色-600
          "#ec4899", // 粉色-600
          "#eab308", // 黄色-600
        ];
    const displayColors = isDarkMode
      ? ["bg-purple-400", "bg-gray-400", "bg-pink-400", "bg-yellow-400"]
      : ["bg-purple-600", "bg-gray-600", "bg-pink-600", "bg-yellow-600"];

    let lastAngle = 0;
    const gradient: string[] = [];
    const items: (DistributionItem & {
      color: string;
      displayColor: string;
    })[] = [];

    requirementTypeDistribution.forEach((item, index) => {
      const color = colors[index % colors.length];
      const displayColor = displayColors[index % displayColors.length];
      const angle = (item.value / total) * 360;
      const startAngle = lastAngle;
      const endAngle = startAngle + angle;
      gradient.push(`${color} ${startAngle}deg ${endAngle}deg`);
      items.push({ ...item, color, displayColor });
      lastAngle = endAngle;
    });

    return { gradient, items, total };
  };

  // 缺陷状态饼图数据（用实际色值）
  const getBugPieData = (): PieData => {
    if (!dashboardData) return { gradient: [], items: [], total: 0 };
    const { bugStatusDistribution } = dashboardData;
    const total = bugStatusDistribution.reduce(
      (sum, item) => sum + item.value,
      0
    );

    // 实际色值（适配明暗模式）
    const colors = isDarkMode
      ? [
          "#f87171", // 红色-400
          "#facc15", // 黄色-400
          "#4ade80", // 绿色-400
        ]
      : [
          "#dc2626", // 红色-600
          "#eab308", // 黄色-600
          "#16a34a", // 绿色-600
        ];
    const displayColors = isDarkMode
      ? ["bg-red-400", "bg-yellow-400", "bg-green-400"]
      : ["bg-red-600", "bg-yellow-600", "bg-green-600"];

    let lastAngle = 0;
    const gradient: string[] = [];
    const items: (DistributionItem & {
      color: string;
      displayColor: string;
    })[] = [];

    bugStatusDistribution.forEach((item, index) => {
      const color = colors[index % colors.length];
      const displayColor = displayColors[index % displayColors.length];
      const angle = (item.value / total) * 360;
      const startAngle = lastAngle;
      const endAngle = startAngle + angle;
      gradient.push(`${color} ${startAngle}deg ${endAngle}deg`);
      items.push({ ...item, color, displayColor });
      lastAngle = endAngle;
    });

    return { gradient, items, total };
  };

  // 加载中
  if (loading) {
    return (
      <div
        className={`p-4 min-h-screen flex items-center justify-center ${
          isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full mb-2"></div>
          <p>加载中...</p>
        </div>
      </div>
    );
  }

  // 错误
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

  // 解构数据
  const { overview, iterationTrend, pendingItems } = dashboardData!;
  const requirementPieData = getRequirementPieData();
  const bugPieData = getBugPieData();

  // 渲染
  return (
    <div
      className={`p-4 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* 头部 */}
      <div className="mb-6">
        <h2 className="text-xl font-medium">项目仪表盘</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          实时监控项目、需求、缺陷、任务的整体进度和状态
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div
          className={`rounded-lg shadow p-4 ${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                isDarkMode ? "bg-blue-900" : "bg-blue-100"
              }`}
            >
              <FaProjectDiagram
                size={20}
                className={isDarkMode ? "text-blue-300" : "text-blue-600"}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                项目总数
              </p>
              <h3 className="text-2xl font-bold">{overview.totalProjects}</h3>
            </div>
          </div>
        </div>
        <div
          className={`rounded-lg shadow p-4 ${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                isDarkMode ? "bg-purple-900" : "bg-purple-100"
              }`}
            >
              <FaClipboardList
                size={20}
                className={isDarkMode ? "text-purple-300" : "text-purple-600"}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                需求总数
              </p>
              <h3 className="text-2xl font-bold">
                {overview.completedRequirements}/{overview.totalRequirements}
              </h3>
            </div>
          </div>
        </div>
        <div
          className={`rounded-lg shadow p-4 ${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                isDarkMode ? "bg-red-900" : "bg-red-100"
              }`}
            >
              <FaBug
                size={20}
                className={isDarkMode ? "text-red-300" : "text-red-600"}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                缺陷总数
              </p>
              <h3 className="text-2xl font-bold">
                {overview.closedBugs}/{overview.totalBugs}
              </h3>
            </div>
          </div>
        </div>
        <div
          className={`rounded-lg shadow p-4 ${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full ${
                isDarkMode ? "bg-green-900" : "bg-green-100"
              }`}
            >
              <FaTasks
                size={20}
                className={isDarkMode ? "text-green-300" : "text-green-600"}
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                任务总数
              </p>
              <h3 className="text-2xl font-bold">
                {overview.completedTasks}/{overview.totalTasks}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* 趋势+待处理 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <div
            className={`rounded-lg shadow p-4 h-full ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3 className="font-medium mb-4">迭代进度趋势</h3>
            <div className="h-64">
              <div className="grid grid-cols-6 gap-2 h-full">
                {iterationTrend.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-end gap-1"
                  >
                    <div
                      className={`w-full rounded-t-sm ${
                        item.progress > 80
                          ? "bg-green-500"
                          : item.progress > 50
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                      style={{ height: `${item.progress}%`, minHeight: "10px" }}
                    ></div>
                    <span className="text-xs">{item.name}</span>
                    <span className="text-xs">{item.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>整体进度</span>
                <span>{overview.progressRate}%</span>
              </div>
              <div
                className={`w-full h-2 rounded-full ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${overview.progressRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`rounded-lg shadow p-4 h-full ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <FaClock size={16} /> 近期待处理项
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {pendingItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-2 rounded border ${
                    isDarkMode
                      ? "border-gray-700 hover:bg-gray-700"
                      : "border-gray-200 hover:bg-gray-50"
                  } cursor-pointer`}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        item.type === "需求"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          : item.type === "缺陷"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.deadline}
                    </span>
                  </div>
                  <p className="text-sm mt-1 truncate">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 饼图区域（修复后） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 需求类型分布 */}
        <div
          className={`rounded-lg shadow p-4 ${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <h3 className="font-medium mb-4">需求类型分布</h3>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
            {/* 饼图主体 */}
            <div className="w-40 h-40 relative">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background:
                    requirementPieData.gradient.length > 0
                      ? `conic-gradient(${requirementPieData.gradient.join(
                          ", "
                        )})`
                      : isDarkMode
                      ? "#374151"
                      : "#e5e7eb",
                }}
              ></div>
              {/* 中心空白 */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full"
                style={{
                  background: isDarkMode ? "#1f2937" : "#ffffff",
                }}
              ></div>
            </div>
            {/* 图例 */}
            <div className="space-y-2">
              {requirementPieData.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${item.displayColor}`}
                  ></div>
                  <span className="text-sm">
                    {item.name}：{item.value} (
                    {requirementPieData.total > 0
                      ? Math.round(
                          (item.value / requirementPieData.total) * 100
                        )
                      : 0}
                    %)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 缺陷状态分布 */}
        <div
          className={`rounded-lg shadow p-4 ${
            isDarkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          <h3 className="font-medium mb-4">缺陷状态分布</h3>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
            {/* 饼图主体 */}
            <div className="w-40 h-40 relative">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background:
                    bugPieData.gradient.length > 0
                      ? `conic-gradient(${bugPieData.gradient.join(", ")})`
                      : isDarkMode
                      ? "#374151"
                      : "#e5e7eb",
                }}
              ></div>
              {/* 中心空白 */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full"
                style={{
                  background: isDarkMode ? "#1f2937" : "#ffffff",
                }}
              ></div>
            </div>
            {/* 图例 */}
            <div className="space-y-2">
              {bugPieData.items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${item.displayColor}`}
                  ></div>
                  <span className="text-sm">
                    {item.name}：{item.value} (
                    {bugPieData.total > 0
                      ? Math.round((item.value / bugPieData.total) * 100)
                      : 0}
                    %)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
