// src/mock/mockRequest.ts
interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
}

// 模拟请求延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 导入所有 Mock 数据
import projectsData from "./projects.json";
import requirementsData from "./requirements.json";
import requirementDetailData from "./requirementDetail.json";
import dashboardData from "./dashboard.json"; // 新增仪表盘数据

// 核心请求函数
export const mockRequest = async <T>(
  url: string,
  options: RequestOptions = { method: "GET" }
): Promise<{ code: number; message: string; data: T }> => {
  try {
    await delay(300);

    // 匹配需求详情接口
    const reqIdMatch = url.match(/\/api\/requirements\/(\w+)/);
    if (reqIdMatch) {
      const reqId = reqIdMatch[1];
      const detailData = requirementDetailData.data[reqId];
      return detailData
        ? { code: 200, message: "success", data: detailData as T }
        : { code: 404, message: "需求不存在", data: {} as T };
    }

    // 匹配各模块接口
    let result: { code: number; message: string; data: T };
    switch (url) {
      case "/api/dashboard": // 新增仪表盘接口
        result = dashboardData;
        break;
      case "/api/projects":
        result = projectsData;
        break;
      case "/api/requirements":
        result = requirementsData;
        break;
      default:
        result = { code: 404, message: "接口不存在", data: {} as T };
    }

    return result;
  } catch (error) {
    return {
      code: 500,
      message: "请求失败",
      data: {} as T,
    };
  }
};

export const get = <T>(url: string) => mockRequest<T>(url, { method: "GET" });
export const post = <T>(url: string, data: any) =>
  mockRequest<T>(url, { method: "POST", data });
