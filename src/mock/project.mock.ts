import { Project } from "../types/project";

// 模拟项目列表
export const projectList: Project[] = [
  {
    id: "proj_001",
    name: "测试平台V1",
    owner: "张三",
    admin: "李四",
    createTime: "2024-01-01 10:00:00",
  },
  {
    id: "proj_002",
    name: "用户中心重构",
    owner: "王五",
    admin: "赵六",
    createTime: "2024-02-15 14:30:00",
  },
];

// 模拟新增项目
export const addProject = (
  newProject: Omit<Project, "id" | "createTime">
): Project => {
  const newId = `proj_${String(projectList.length + 1).padStart(3, "0")}`;
  const project: Project = {
    ...newProject,
    id: newId,
    createTime: new Date().toLocaleString(),
  };
  projectList.push(project);
  return project;
};

// 模拟编辑项目
export const editProject = (
  id: string,
  updateData: Partial<Project>
): Project | undefined => {
  const index = projectList.findIndex((item) => item.id === id);
  if (index === -1) return undefined;
  projectList[index] = { ...projectList[index], ...updateData };
  return projectList[index];
};

// 模拟删除项目
export const deleteProject = (id: string): boolean => {
  const index = projectList.findIndex((item) => item.id === id);
  if (index === -1) return false;
  projectList.splice(index, 1);
  return true;
};

// 模拟查询项目
export const searchProject = (keyword: string): Project[] => {
  return projectList.filter(
    (item) => item.name.includes(keyword) || item.id.includes(keyword)
  );
};
