// src/pages/BugList.tsx 顶部完整导入
import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { format } from "date-fns";
import {
  FaSearch,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
// ✅ 正确的导入（相对路径 + 无后缀 + 命名导入）
import { Bug } from "../types/Bug";

// 模拟数据生成
const generateBugList = (count: number): Bug[] => {
  const severities = ["一般", "严重", "致命"];
  const priorities = ["低", "中", "高"];
  const statuses = ["已关闭", "处理中", "待处理"];
  const platforms = ["前端", "产品/设计", "后端"];
  const handlers = ["张三", "王五", "张四"];
  const creators = ["张三", "王五"];

  return Array.from({ length: count }, (_, index) => ({
    id: `BUG-${1000 + index}`,
    title: `【PC-py学伴优化】${index % 2 === 0 ? "学伴拖拽" : "代码检测"}${
      index % 3 === 0 ? "超出范围" : "失败"
    }的问题`,
    type: "BUG",
    version: "迭代版本",
    severity: severities[index % severities.length] as "一般" | "严重" | "致命",
    priority: priorities[index % priorities.length] as "低" | "中" | "高",
    status: statuses[index % statuses.length] as "已关闭" | "处理中" | "待处理",
    handler: handlers[index % handlers.length],
    startDate: `2026-01-${String(8 + (index % 5)).padStart(2, "0")}`,
    endDate: `2026-01-${String(9 + (index % 5)).padStart(2, "0")}`,
    creator: creators[index % creators.length],
    createTime: `2026-01-${String(8 + (index % 5)).padStart(2, "0")} ${String(
      14 + (index % 4)
    ).padStart(2, "0")}:${String(30 + (index % 30)).padStart(2, "0")}`,
    platform: platforms[index % platforms.length],
    testData: `账号：1661170010 密码：123456 课包：yb体验综合无IM 课程名称：yb_pyA101 环节：常驻富文本学伴`,
    apiUrl: "https://api.test.com/py-student/companion",
    testSteps: `1. 进入学伴的Python步骤\n2. ${
      index % 2 === 0 ? "代码不通过检测" : "点击完成触发学伴检测"
    }\n3. 出现检测失败弹窗\n4. 再拖动学伴`,
    testResult: `${
      index % 2 === 0
        ? "弹窗样式回到了初始的帮助状态"
        : "学伴还是检测失败的表情"
    }，但是弹窗已经变回帮助状态了；应该保持学伴检测失败的状态`,
    expectedResult: "弹窗样式要保持当前状态，不能回到初始状态",
    relatedRequirement: "关联需求-关联需求 1148699533001179235",
    reproduceRule: "必现",
    attachment: "https://picsum.photos/id/237/600/400",
  }));
};

interface BugListProps {
  // 可选：外部传入bug列表（对接接口时用）
  initialBugList?: Bug[];
  // 点击新增按钮的回调
  onAddBug: () => void;
}

export const BugList = ({ initialBugList, onAddBug }: BugListProps) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [isDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // 数据状态（优先使用外部传入的列表，否则用模拟数据）
  const [bugList, setBugList] = useState<Bug[]>(
    initialBugList || generateBugList(8)
  );
  const [pageSize, setPageSize] = useState(10);

  // 筛选/搜索状态
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterConditions, setFilterConditions] = useState<{
    [key: string]: string;
  }>({
    relatedRequirement: "关联需求-关联需求 1148699533001179235",
  });

  // ========== 筛选逻辑 ==========
  const filteredBugList = useMemo(() => {
    return bugList.filter((bug) => {
      const matchSearch =
        searchKeyword === "" ||
        bug.title.toLowerCase().includes(searchKeyword.toLowerCase());
      const matchRequirement =
        filterConditions.relatedRequirement === "" ||
        bug.relatedRequirement === filterConditions.relatedRequirement;
      return matchSearch && matchRequirement;
    });
  }, [bugList, searchKeyword, filterConditions]);

  // ========== 表格配置 ==========
  const columns = useMemo(
    () => [
      {
        header: () => <input type="checkbox" />,
        cell: () => <input type="checkbox" />,
        id: "checkbox",
        size: 40,
      },
      {
        header: "标题",
        accessorKey: "title",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {row.original.type}
            </span>
            <span
              className="hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer"
              onClick={() => {
                // 跳转到Bug详情页（后续可扩展）
                navigate(`/projects/${projectId}/bugs/${row.original.id}`);
              }}
            >
              {row.original.title}
            </span>
          </div>
        ),
        size: 300,
      },
      { header: "发现版本", accessorKey: "version", size: 100 },
      {
        header: "严重程度",
        accessorKey: "severity",
        cell: ({ row }) => {
          const severity = row.original.severity;
          const colorMap = {
            一般: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            严重: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
            致命: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          };
          return (
            <span
              className={`px-2 py-0.5 text-xs rounded ${colorMap[severity]}`}
            >
              {severity}
            </span>
          );
        },
        size: 100,
      },
      {
        header: "优先级",
        accessorKey: "priority",
        cell: ({ row }) => {
          const priority = row.original.priority;
          const colorMap = {
            低: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
            中: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            高: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
          };
          return (
            <span
              className={`px-2 py-0.5 text-xs rounded ${colorMap[priority]}`}
            >
              {priority}
            </span>
          );
        },
        size: 80,
      },
      {
        header: "状态",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row.original.status;
          const colorMap = {
            已关闭:
              "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
            处理中:
              "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            待处理:
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          };
          return (
            <span className={`px-2 py-0.5 text-xs rounded ${colorMap[status]}`}>
              {status}
            </span>
          );
        },
        size: 80,
      },
      { header: "处理人", accessorKey: "handler", size: 100 },
      { header: "预计开始", accessorKey: "startDate", size: 100 },
      { header: "预计结束", accessorKey: "endDate", size: 100 },
      { header: "创建人", accessorKey: "creator", size: 100 },
      { header: "创建时间", accessorKey: "createTime", size: 150 },
      { header: "归属软件平台", accessorKey: "platform", size: 120 },
    ],
    [isDarkMode]
  );

  const table = useReactTable({
    data: filteredBugList,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination: { pageIndex: 0, pageSize } },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;
      if (newPagination.pageSize !== undefined)
        setPageSize(newPagination.pageSize);
    },
  });

  return (
    <div
      className={`p-4 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* 搜索筛选区 */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索标题（# + K）"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className={`pl-8 pr-3 py-2 rounded border ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-white border-gray-300 text-gray-800"
            } w-64`}
          />
          <FaSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={14}
          />
        </div>

        {filterConditions.relatedRequirement && (
          <span
            className={`px-3 py-2 rounded ${
              isDarkMode
                ? "bg-gray-700 text-gray-200"
                : "bg-blue-50 text-blue-800"
            } flex items-center gap-1`}
          >
            {filterConditions.relatedRequirement}
            <button
              onClick={() =>
                setFilterConditions((prev) => ({
                  ...prev,
                  relatedRequirement: "",
                }))
              }
              className="text-gray-500"
            >
              ×
            </button>
          </span>
        )}

        <button
          className={`px-3 py-2 rounded border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-gray-200"
              : "bg-white border-gray-300 text-gray-800"
          } flex items-center gap-1`}
        >
          <FaPlus size={14} /> 添加条件
        </button>

        <button
          className={`px-3 py-2 rounded border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-gray-200"
              : "bg-white border-gray-300 text-gray-800"
          } flex items-center gap-1`}
        >
          <FaSearch size={14} /> 高级查询
        </button>

        <button
          className={`px-3 py-2 rounded border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-gray-200"
              : "bg-white border-gray-300 text-gray-800"
          }`}
        >
          另存为视图
        </button>

        <button
          className={`px-3 py-2 rounded border ${
            isDarkMode
              ? "bg-gray-700 border-gray-600 text-gray-200"
              : "bg-white border-gray-300 text-gray-800"
          }`}
        >
          清除条件
        </button>

        {/* 新增Bug按钮：调用外部回调 */}
        <button
          onClick={onAddBug}
          className={`ml-auto px-3 py-2 rounded ${
            isDarkMode
              ? "bg-green-900 text-green-200"
              : "bg-green-500 text-white"
          } flex items-center gap-1`}
        >
          <FaPlus size={14} /> 快速创建
        </button>
      </div>

      {/* BUG列表表格 */}
      <div
        className={`rounded-lg overflow-auto ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } shadow-md`}
      >
        <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead
            className={`${
              isDarkMode
                ? "bg-gray-700 text-gray-200"
                : "bg-gray-50 text-gray-700"
            }`}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.column.columnDef.size }}
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider border border-gray-200 dark:border-gray-700"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={isDarkMode ? "text-gray-200" : "text-gray-800"}>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  row.index % 2 === 0
                    ? isDarkMode
                      ? "bg-gray-800"
                      : "bg-white"
                    : isDarkMode
                    ? "bg-gray-800"
                    : "bg-gray-50"
                }`}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-3 py-3 text-sm border border-gray-200 dark:border-gray-700"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm">
          共 {table.getRowCount()} 条数据，共 {table.getPageCount()} 页，当前第{" "}
          {table.getState().pagination.pageIndex + 1} 页
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={table.getState().pagination.pageIndex === 0}
            className={`px-3 py-1 rounded text-sm ${
              table.getState().pagination.pageIndex === 0
                ? isDarkMode
                  ? "bg-gray-700 text-gray-500"
                  : "bg-gray-200 text-gray-500"
                : isDarkMode
                ? "bg-blue-900 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            首页
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`p-1 rounded text-sm ${
              !table.getCanPreviousPage()
                ? isDarkMode
                  ? "bg-gray-700 text-gray-500"
                  : "bg-gray-200 text-gray-500"
                : isDarkMode
                ? "bg-blue-900 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            <FaChevronLeft size={12} />
          </button>
          {Array.from({ length: table.getPageCount() })
            .slice(0, 5)
            .map((_, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={`px-3 py-1 rounded text-sm ${
                  table.getState().pagination.pageIndex === i
                    ? isDarkMode
                      ? "bg-red-900 text-white"
                      : "bg-red-500 text-white"
                    : isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`p-1 rounded text-sm ${
              !table.getCanNextPage()
                ? isDarkMode
                  ? "bg-gray-700 text-gray-500"
                  : "bg-gray-200 text-gray-500"
                : isDarkMode
                ? "bg-blue-900 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            <FaChevronRight size={12} />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={
              table.getState().pagination.pageIndex === table.getPageCount() - 1
            }
            className={`px-3 py-1 rounded text-sm ${
              table.getState().pagination.pageIndex === table.getPageCount() - 1
                ? isDarkMode
                  ? "bg-gray-700 text-gray-500"
                  : "bg-gray-200 text-gray-500"
                : isDarkMode
                ? "bg-blue-900 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            尾页
          </button>
        </div>
      </div>
    </div>
  );
};
