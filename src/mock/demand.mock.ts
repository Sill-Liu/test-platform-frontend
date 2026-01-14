import { Demand, DemandStatus, Priority } from "../types/project";

// 模拟需求列表
export const demandList: Demand[] = [
  {
    id: "demand_001",
    iterationId: "iter_001",
    name: "登录功能开发",
    creator: "张三",
    priority: Priority.HIGH,
    status: DemandStatus.ONLINE,
    createTime: "2024-01-06 10:00:00",
    expectEndTime: "2024-01-15",
  },
  {
    id: "demand_002",
    iterationId: "iter_001",
    name: "用户列表展示",
    creator: "李四",
    priority: Priority.MIDDLE,
    status: DemandStatus.TESTING,
    createTime: "2024-01-08 11:00:00",
    expectEndTime: "2024-01-20",
  },
];

// 新增需求
export const addDemand = (
  newDemand: Omit<Demand, "id" | "createTime">
): Demand => {
  const newId = `demand_${String(demandList.length + 1).padStart(3, "0")}`;
  const demand: Demand = {
    ...newDemand,
    id: newId,
    createTime: new Date().toLocaleString(),
  };
  demandList.push(demand);
  // 更新迭代的需求数量
  import("./iteration.mock").then((mod) => {
    const iter = mod.iterationList.find(
      (item) => item.id === newDemand.iterationId
    );
    if (iter) {
      iter.demandCount += 1;
      iter.progress = mod.calculateIterProgress(iter.id);
    }
  });
  return demand;
};

// 编辑需求
export const editDemand = (
  id: string,
  updateData: Partial<Demand>
): Demand | undefined => {
  const index = demandList.findIndex((item) => item.id === id);
  if (index === -1) return undefined;
  // 如果状态变更为已完成/上线，更新迭代已完成数量
  if (updateData.status) {
    const oldDemand = demandList[index];
    const isOldFinished = [
      DemandStatus.TEST_FINISHED,
      DemandStatus.ONLINE,
    ].includes(oldDemand.status);
    const isNewFinished = [
      DemandStatus.TEST_FINISHED,
      DemandStatus.ONLINE,
    ].includes(updateData.status as DemandStatus);

    if (!isOldFinished && isNewFinished) {
      import("./iteration.mock").then((mod) => {
        const iter = mod.iterationList.find(
          (item) => item.id === oldDemand.iterationId
        );
        if (iter) {
          iter.finishedDemandCount += 1;
          iter.progress = mod.calculateIterProgress(iter.id);
        }
      });
    } else if (isOldFinished && !isNewFinished) {
      import("./iteration.mock").then((mod) => {
        const iter = mod.iterationList.find(
          (item) => item.id === oldDemand.iterationId
        );
        if (iter) {
          iter.finishedDemandCount -= 1;
          iter.progress = mod.calculateIterProgress(iter.id);
        }
      });
    }
  }
  demandList[index] = { ...demandList[index], ...updateData };
  return demandList[index];
};

// 删除需求
export const deleteDemand = (id: string): boolean => {
  const index = demandList.findIndex((item) => item.id === id);
  if (index === -1) return false;
  const deletedDemand = demandList[index];
  demandList.splice(index, 1);
  // 更新迭代的需求数量
  import("./iteration.mock").then((mod) => {
    const iter = mod.iterationList.find(
      (item) => item.id === deletedDemand.iterationId
    );
    if (iter) {
      iter.demandCount -= 1;
      // 如果删除的是已完成需求，更新已完成数量
      if (
        [DemandStatus.TEST_FINISHED, DemandStatus.ONLINE].includes(
          deletedDemand.status
        )
      ) {
        iter.finishedDemandCount -= 1;
      }
      iter.progress = mod.calculateIterProgress(iter.id);
    }
  });
  return true;
};

// 根据迭代ID获取需求
export const getDemandByIterationId = (iterationId: string): Demand[] => {
  return demandList.filter((item) => item.iterationId === iterationId);
};
