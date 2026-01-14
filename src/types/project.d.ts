// 项目类型
export interface Project {
  id: string;
  name: string;
  owner: string; // 项目负责人
  admin: string; // 管理员
  createTime: string; // 创建时间
}

// 迭代类型
export interface Iteration {
  id: string;
  projectId: string; // 关联项目ID
  name: string;
  creator: string; // 创建人
  admin: string; // 管理员
  startTime: string; // 起始时间
  createTime: string; // 创建时间
  demandCount: number; // 需求总数
  finishedDemandCount: number; // 已完成需求数
  progress: number; // 进度百分比
}

// 需求状态枚举
export enum DemandStatus {
  PENDING_REVIEW = "待评审",
  REVIEWED = "已评审",
  DEVELOPING = "开发中",
  PENDING_TEST = "待测试",
  TESTING = "测试中",
  TEST_FINISHED = "测试完成",
  ONLINE = "已上线",
}

// 优先级枚举
export enum Priority {
  HIGH = "高",
  MIDDLE = "中",
  LOW = "低",
}

// 需求类型
export interface Demand {
  id: string;
  iterationId: string; // 关联迭代ID
  name: string;
  creator: string; // 创建人
  priority: Priority; // 优先级
  status: DemandStatus; // 状态
  createTime: string; // 创建时间
  expectEndTime: string; // 预计结束时间
}
