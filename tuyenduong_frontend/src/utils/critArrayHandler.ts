import { Submission } from "../types/Submission";
import { Criteria } from "../types/TieuChi";
import { v4 as uuid, v4 } from "uuid";

interface DeleteOperationReturnType {
  resultArr: Criteria[];
  itemExist: boolean;
}
export const handleAdd = (
  arr: Criteria[],
  crit: Criteria,
  parentId: number
): boolean => {
  if (arr.length === 0) return false;
  let found = false;
  for (var item of arr) {
    if (item.id === parentId) {
      item.children = [...item.children, crit];
      return true;
    } else {
      found = handleAdd(item.children, crit, parentId);
      if (found === true) return true;
    }
  }
  return found;
};
export const isNameExist = (name: string, arr: Criteria[]): boolean => {
  if (arr.length === 0) return false;
  let found = false;
  for (var item of arr) {
    if (item.name === name) {
      return true;
    } else {
      found = isNameExist(name, item.children);
      if (found === true) return true;
    }
  }
  return found;
};
export const handleDelete = (
  arr: Criteria[],
  id: string | number
): DeleteOperationReturnType => {
  if (arr.length === 0) return { resultArr: [], itemExist: false };
  for (var item of arr) {
    if (item.id === id) {
      return { resultArr: arr.filter((ele) => ele.id !== id), itemExist: true };
    } else {
      const result = handleDelete(item.children, id);
      if (result.itemExist === true) {
        item.children = result.resultArr;
        item.soft = item.soft - 1 >= 0 ? item.soft - 1 : item.soft;
      }
    }
  }
  return { resultArr: arr, itemExist: false };
};

export const handleModify = (
  arr: Criteria[],
  crit: Criteria,
  parentId: number
): boolean => {
  if (arr.length === 0) return false;
  if (parentId === 0) {
    for (const item of arr) {
      if (item.id === crit.id) {
        let indexOfItem = arr.indexOf(item);
        arr[indexOfItem] = crit;
        return true;
      }
    }
    return false;
  }
  for (const item of arr) {
    if (item.id === parentId) {
      for (var subItem of item.children) {
        if (subItem.id === crit.id) {
          let indexOfItem = item.children.indexOf(subItem);
          item.children[indexOfItem] = crit;
          return true;
        }
      }
    } else {
      var found = handleModify(item.children, crit, parentId);
      if (found === true) return found;
    }
  }
  return false;
};

export const handleUpdateSoft = (
  arr: Criteria[],
  critId: string | number,
  soft: number
): boolean => {
  if (arr.length === 0) return false;
  for (var item of arr) {
    if (item.id === critId) {
      let indexOfItem = arr.indexOf(item);
      arr[indexOfItem] = { ...item, soft: soft };
      return true;
    } else {
      var found = handleUpdateSoft(item.children, critId, soft);
      if (found === true) return found;
    }
  }
  return false;
};

//Application part
export const GenerateApplicationHandler = (
  arr: Criteria[],
  userId: number,
  achId: number
): Submission[] => {
  if (arr.length === 0) return [];
  var result: Submission[] = [];
  for (var item of arr) {
    const id = uuid();
    const sub: Submission = {
      id: id,
      userId: userId,
      achievementId: achId,
      criteriaID: item.id,
      file: "",
      point: 0,
      binary: false,
      description: "",
      studentComment: "",
      studentSelect: "",
    };
    var subsOfChild = GenerateApplicationHandler(item.children, userId, achId);
    if (subsOfChild.length > 0) {
      result = [...result, sub].concat(subsOfChild);
    } else {
      result = [...result, sub];
    }
  }
  return result;
};
export const handleApplicationPointChange = (
  arr: Submission[],
  subId: string | number,
  point: number
): boolean => {
  if (arr.length === 0) return false;
  for (var item of arr) {
    if (item.id === subId) {
      let indexOfItem = arr.indexOf(item);
      arr[indexOfItem] = { ...item, point: point };
      return true;
    }
  }
  return false;
};
export const handleApplicationBinaryChange = (
  arr: Submission[],
  subId: string | number,
  bin: boolean
): boolean => {
  if (arr.length === 0) return false;
  for (var item of arr) {
    if (item.id === subId) {
      let indexOfItem = arr.indexOf(item);
      arr[indexOfItem] = { ...item, binary: bin };
      return true;
    }
  }
  return false;
};
export const handleApplicationStudentCommentChange = (
  arr: Submission[],
  subId: string | number,
  studentComment: string
): boolean => {
  if (arr.length === 0) return false;
  for (var item of arr) {
    if (item.id === subId) {
      let indexOfItem = arr.indexOf(item);
      arr[indexOfItem] = { ...item, studentComment: studentComment };
      return true;
    }
  }
  return false;
};

export const handleApplicationStudentSelectChange = (
  arr: Submission[],
  subId: string | number,
  studentSelect: string
): boolean => {
  if (arr.length === 0) return false;
  for (var item of arr) {
    if (item.id === subId) {
      let indexOfItem = arr.indexOf(item);
      arr[indexOfItem] = { ...item, studentSelect: studentSelect };
      return true;
    }
  }
  return false;
};

export const handleApplicationFileChange = (
  arr: Submission[],
  subId: string | number,
  file: string
): boolean => {
  if (arr.length === 0) return false;
  for (var item of arr) {
    if (item.id === subId) {
      let indexOfItem = arr.indexOf(item);
      arr[indexOfItem] = { ...item, file: file };
      return true;
    }
  }
  return false;
};

export const DoiTrangThayDen = (arr: Criteria[], newId: number): boolean => {
  if (arr.length === 0) return true;
  for (let item of arr) {
    item.id = v4();
  }
  return false;
};
