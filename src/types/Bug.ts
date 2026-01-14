// src/types/Bug.ts - 确保所有接口都是命名导出（export interface）
export interface Bug {
  id: string;
  title: string;
  type: "BUG";
  version: string;
  severity: "一般" | "严重" | "致命";
  priority: "低" | "中" | "高";
  status: "已关闭" | "处理中" | "待处理";
  handler: string;
  startDate: string;
  endDate: string;
  creator: string;
  createTime: string;
  platform: string;
  testData: string;
  apiUrl: string;
  testSteps: string;
  testResult: string;
  expectedResult: string;
  relatedRequirement: string;
  reproduceRule: string;
  attachment: string; // 模拟附件URL
}

export interface Comment {
  id: string;
  bugId: string;
  content: string;
  creator: string;
  createTime: string;
}

export interface BugFormValues {
  title: string;
  content: string; // 整体富文本内容
  relatedRequirement: string;
  startDate: string;
  endDate: string;
  priority: string;
  severity: string;
  handler: string;
  copyTo: string;
  verifier: string;
  version: string;
  platform: string;
  developer: string;
  tester: string;
  reproduceRule: string;
}
