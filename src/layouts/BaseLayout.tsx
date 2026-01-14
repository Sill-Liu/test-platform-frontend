import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaTachometerAlt,
  FaProjectDiagram,
  FaBug,
  FaCode,
  FaMobileAlt,
  FaLaptop,
  FaServer,
  FaUsers,
  FaSun,
  FaMoon,
  FaBars,
} from "react-icons/fa";

type MenuItem = {
  path: string;
  title: string;
  icon: React.ReactNode;
};

export const BaseLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarWidth = isSidebarOpen ? "220px" : "60px";
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node) &&
        userButtonRef.current &&
        !userButtonRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🌟 恢复无projectId的菜单路径（符合业务逻辑）
  const menuList: MenuItem[] = [
    { path: "/", title: "仪表盘", icon: <FaTachometerAlt size={16} /> },
    {
      path: "/projects",
      title: "项目管理",
      icon: <FaProjectDiagram size={16} />,
    },
    { path: "/testcases", title: "用例管理", icon: <FaCode size={16} /> }, // 去掉横线，统一路径
    { path: "/bugs", title: "缺陷管理", icon: <FaBug size={16} /> },
    { path: "/api-auto", title: "API自动化", icon: <FaServer size={16} /> },
    { path: "/app-auto", title: "App自动化", icon: <FaMobileAlt size={16} /> },
    { path: "/web-auto", title: "Web自动化", icon: <FaLaptop size={16} /> },
    { path: "/team", title: "团队文化", icon: <FaUsers size={16} /> },
  ];

  // 深色模式逻辑
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const isDark = savedMode === "true";
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("darkMode", String(newMode));
  };

  // 🌟 恢复严格匹配激活状态（路径无动态参数）
  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={`flex min-h-screen transition-colors duration-200 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* 侧边栏 */}
      <aside
        style={{ width: sidebarWidth }}
        className={`fixed top-0 left-0 h-full shadow-lg transition-all duration-300 z-20
          ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="flex items-center justify-between p-2.5 border-b border-gray-200 dark:border-gray-700">
          {isSidebarOpen && <h1 className="text-base font-bold">TestLab</h1>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors`}
          >
            <FaBars size={14} />
          </button>
        </div>

        {/* 侧边栏菜单 */}
        <nav className="mt-2 px-2">
          {menuList.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full px-2.5 py-1.5 mb-1 rounded-lg transition-colors text-sm
                ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                    : `hover:bg-gray-200 dark:hover:bg-gray-700 ${
                        isDarkMode ? "text-gray-300" : "text-gray-800"
                      }`
                }`}
            >
              <span className="mr-2">{item.icon}</span>
              {isSidebarOpen && <span>{item.title}</span>}
            </button>
          ))}
        </nav>

        {/* 深色模式切换 */}
        <div className="absolute bottom-2.5 left-0 w-full px-2.5">
          <button
            onClick={toggleDarkMode}
            className={`flex items-center justify-center w-full p-1.5 rounded-lg text-xs
              ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              } hover:bg-gray-300 dark:hover:bg-gray-600`}
          >
            {isDarkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
            {isSidebarOpen && (
              <span className="ml-2">{isDarkMode ? "浅色" : "深色"}</span>
            )}
          </button>
        </div>
      </aside>

      {/* 主内容区域 */}
      <main
        style={{ marginLeft: sidebarWidth }}
        className={`flex-1 transition-all duration-300 overflow-x-hidden`}
      >
        {/* 顶部栏 */}
        <header
          className={`sticky top-0 z-10 p-2.5 shadow-md transition-colors duration-200
          ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border-b`}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-semibold">
                {menuList.find((item) => item.path === location.pathname)
                  ?.title || "TestLab"}
              </h2>
            </div>

            <div className="flex items-center space-x-2.5">
              <div
                className={`relative rounded-lg overflow-hidden w-48
                ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
              >
                <input
                  type="text"
                  placeholder="搜索..."
                  className={`py-1.5 pl-6 pr-2.5 w-full outline-none bg-transparent text-xs
                    ${
                      isDarkMode
                        ? "text-gray-100 placeholder:text-gray-400"
                        : "text-gray-900 placeholder:text-gray-500"
                    }`}
                />
                <span className="absolute left-1.5 top-1.5 text-xs">🔍</span>
              </div>

              <div className="relative">
                <button
                  ref={userButtonRef}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-1.5 p-1.5 rounded-lg text-xs
                    hover:bg-gray-200 dark:hover:bg-gray-700`}
                >
                  <span>👤</span>
                  {isSidebarOpen && <span>测试工程师</span>}
                </button>
                {isUserMenuOpen && (
                  <div
                    ref={userMenuRef}
                    className={`absolute right-0 mt-1 w-32 rounded-lg shadow-lg z-30 text-xs
                    ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    } border`}
                  >
                    <ul className="py-1">
                      <li
                        className={`px-2.5 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer`}
                      >
                        个人中心
                      </li>
                      <li
                        className={`px-2.5 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer`}
                      >
                        账号设置
                      </li>
                      <li
                        className={`px-2.5 py-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-red-500`}
                      >
                        退出登录
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* 页面内容容器 */}
        <div className="p-3">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
