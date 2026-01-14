import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaQrcode,
  FaCommentDots,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // 表单状态
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false); // 钉钉扫码模态框

  // 页面加载时检查是否已登录（后续对接接口）
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/"); // 已登录直接跳转到仪表盘
    }
  }, [navigate]);

  // 输入框变化处理
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 登录逻辑（模拟，后续替换为真实接口）
  const handleLogin = async () => {
    if (!form.username || !form.password) {
      alert("请输入账号和密码");
      return;
    }

    try {
      setLoading(true);
      // 模拟登录请求延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 模拟登录成功，存储token
      localStorage.setItem("token", "mock_token_" + Date.now());
      if (rememberMe) {
        localStorage.setItem("rememberedUser", form.username);
      } else {
        localStorage.removeItem("rememberedUser");
      }

      navigate("/"); // 登录成功跳转到仪表盘
    } catch (err) {
      alert("登录失败，请检查账号密码");
    } finally {
      setLoading(false);
    }
  };

  // 页面样式（适配明暗模式）
  const pageBgClass = isDarkMode
    ? "bg-gray-900 text-gray-100"
    : "bg-gray-50 text-gray-900";
  const cardBgClass = isDarkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";
  const inputBgClass = isDarkMode
    ? "bg-gray-700 border-gray-600 text-gray-200"
    : "bg-white border-gray-300 text-gray-800";

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${pageBgClass}`}
    >
      {/* 登录卡片 */}
      <div
        className={`w-full max-w-md rounded-lg shadow-lg p-6 border ${cardBgClass}`}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">TestLab 登录</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            请登录您的账号以继续
          </p>
        </div>

        {/* 账号输入框 */}
        <div className="mb-4">
          <label className="block text-sm mb-1 font-medium">账号</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <FaUser size={16} />
            </span>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-3 py-2 rounded border ${inputBgClass}`}
              placeholder="请输入账号"
              autoFocus
            />
          </div>
        </div>

        {/* 密码输入框 */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium">密码</label>
            <a
              href="#"
              className="text-sm text-blue-500 dark:text-blue-400 hover:underline"
            >
              忘记密码？
            </a>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              <FaLock size={16} />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-10 py-2 rounded border ${inputBgClass}`}
              placeholder="请输入密码"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
        </div>

        {/* 记住密码 */}
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded text-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm">
            记住账号
          </label>
        </div>

        {/* 登录按钮 */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 rounded font-medium ${
            isDarkMode
              ? "bg-blue-900 text-blue-200 hover:bg-blue-800 disabled:bg-blue-900/60"
              : "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-500/60"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full mr-2"></div>
              登录中...
            </div>
          ) : (
            "登录"
          )}
        </button>

        {/* 其他登录方式 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            或使用其他方式登录
          </p>
          <div className="flex justify-center gap-4">
            {/* 钉钉扫码登录（预留） */}
            <button
              onClick={() => setShowQrModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded border ${
                isDarkMode
                  ? "border-gray-700 hover:bg-gray-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <FaCommentDots size={16} className="text-green-500" />
              <span>钉钉扫码</span>
            </button>
          </div>
        </div>
      </div>

      {/* 钉钉扫码登录模态框（预留） */}
      {showQrModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div
            className={`w-full max-w-sm rounded-lg p-6 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">钉钉扫码登录</h3>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <FaQrcode size={18} />
              </button>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-48 h-48 border ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                } flex items-center justify-center mb-4`}
              >
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  请使用钉钉扫描下方二维码
                </span>
                {/* 后续替换为真实的钉钉登录二维码 */}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                打开钉钉 &gt; 扫描二维码 &gt; 确认登录
              </p>
            </div>
            <button
              onClick={() => setShowQrModal(false)}
              className={`w-full mt-6 py-2 rounded border ${
                isDarkMode
                  ? "border-gray-700 hover:bg-gray-700"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
