import { Iteration } from "../types/project";

// 模拟迭代列表
export const iterationList: Iteration[] = [
  {
    id: "iter_001",
    projectId: "proj_001",
    name: "V1.0迭代",
    creator: "张三",
    admin: "李四",
    startTime: "2024-01-05",
    createTime: "2024-01-02 09:00:00",
    demandCount: 5,
    finishedDemandCount: 3,
    progress: 60,
  },
  {
    id: "iter_002",
    projectId: "proj_001",
    name: "V1.1迭代",
    creator: "张三",
    admin: "李四",
    startTime: "2024-02-01",
    createTime: "2024-01-20 11:00:00",
    demandCount: 8,
    finishedDemandCount: 2,
    progress: 25,
  },
];

// 新增迭代
export const addIteration = (
  newIter: Omit<
    Iteration,
    "id" | "createTime" | "demandCount" | "finishedDemandCount" | "progress"
  >
): Iteration => {
  const newId = `iter_${String(iterationList.length + 1).padStart(3, "0")}`;
  const iteration: Iteration = {
    ...newIter,
    id: newId,
    createTime: new Date().toLocaleString(),
    demandCount: 0,
    finishedDemandCount: 0,
    progress: 0,
  };
  iterationList.push(iteration);
  return iteration;
};

// 编辑迭代
export const editIteration = (
  id: string,
  updateData: Partial<Iteration>
): Iteration | undefined => {
  const index = iterationList.findIndex((item) => item.id === id);
  if (index === -1) return undefined;
  iterationList[index] = { ...iterationList[index], ...updateData };
  return iterationList[index];
};

// 删除迭代
export const deleteIteration = (id: string): boolean => {
  const index = iterationList.findIndex((item) => item.id === id);
  if (index === -1) return false;
  iterationList.splice(index, 1);
  return true;
};

// 查询迭代
export const searchIteration = (keyword: string): Iteration[] => {
  return iterationList.filter(
    (item) => item.name.includes(keyword) || item.id.includes(keyword)
  );
};

// 获取迭代进度
export const calculateIterProgress = (id: string): number => {
  const iter = iterationList.find((item) => item.id === id);
  if (!iter || iter.demandCount === 0) return 0;
  return Math.round((iter.finishedDemandCount / iter.demandCount) * 100);
};
