const utils = require("./../utils/index");
const errcode = require("./../utils/errcode");
const cloud = require("tencentcloud-sdk-nodejs");
const config = require("./../../config");
const sign = require("./../utils/sign");

const CmeClient = cloud.cme.v20191029.Client;
const CmeModel = cloud.cme.v20191029.Models;
const Credential = cloud.common.Credential;
const PersonType = "PERSON";

const cred = new Credential(config.secretId, config.secretKey);
const client = new CmeClient(cred, "ap-guangzhou");

module.exports = {
  //CreateProject官网API链接[]
  async createProject(ctx) {
    const params = ctx.request.body;
    let createProjectReq = new CmeModel.CreateProjectRequest();
    createProjectReq.Name = params.Name;
    createProjectReq.Category = params.Category;
    createProjectReq.AspectRatio = params.AspectRatio;
    createProjectReq.Platform = config.platform;
    let owner = new CmeModel.Entity();
    owner.Id = ctx.request.userId;
    owner.Type = PersonType; //demo仅演示创建PERSON类型的项目，开发者可以按照自身业务需求选择PERSON/TEAM类型的项目
    createProjectReq.Owner = owner;
    console.debug(createProjectReq.to_json_string());
    let resp = await doCreateProject(ctx, createProjectReq);
    ctx.body = resp;
    console.debug("resp await", resp);
  },

  //DescribeProjects官网API链接[]
  async describeProjects(ctx) {
    let params = ctx.request.body;
    let describeProjectReq = new CmeModel.DescribeProjectsRequest();
    describeProjectReq.Platform = config.platform;
    let owner = new CmeModel.Entity();
    owner.Type = PersonType;
    owner.Id = ctx.request.userId;
    describeProjectReq.Owner = owner;
    if (params.ProjectIds && params.ProjectIds.length > 0) {
      describeProjectReq.ProjectIds = params.ProjectIds;
    }
    if (params.AspectRatioSet && params.AspectRatioSet.length > 0) {
      describeProjectReq.AspectRatioSet = params.AspectRatioSet;
    }
    if (params.CategorySet && params.CategorySet.length > 0) {
      describeProjectReq.CategorySet = params.CategorySet;
    }
    let resp = await doDescribeProjects(ctx, describeProjectReq);
    ctx.body = resp;
  },

  //ExportVideoEditProject官网API链接[]
  async exportVideoEditProject(ctx) {
    let params = ctx.request.body;
    //校验当前用户是否有权限访问projectId的项目
    let access = await checkProjectRight(ctx, params.ProjectId);
    console.debug("access:", access);
    if (access == false) {
      ctx.body = errcode.permissionErr;
      return;
    }
    let exportVideoEditProjectReq = new CmeModel.ExportVideoEditProjectRequest();
    exportVideoEditProjectReq.Platform = config.platform;
    exportVideoEditProjectReq.Definition = 11;
    exportVideoEditProjectReq.ProjectId = params.ProjectId;
    exportVideoEditProjectReq.ExportDestination = "VOD"; //demo这里仅演示了导出到VOD，用户也可以根据官网API要求选择其他导出方式
    let vodExportInfo = new CmeModel.VODExportInfo();
    if (params.Name) {
      vodExportInfo.Name = params.Name;
    } else {
      vodExportInfo.Name = "tfusion_export_test";
    }
    exportVideoEditProjectReq.VODExportInfo = vodExportInfo;
    let resp = await doExportVideoEditProject(ctx, exportVideoEditProjectReq);
    ctx.body = resp;
  },

  //ImportMediaToProject官网API链接[]
  async importMediaToProject(ctx) {
    let params = ctx.request.body;
    //校验当前用户是否有权限访问projectId的项目
    let access = await checkProjectRight(ctx, params.ProjectId);
    console.debug("access:", access);
    if (access == false) {
      ctx.body = errcode.permissionErr;
      return;
    }
    let importMediaToProjectReq = new CmeModel.ImportMediaToProjectRequest();
    importMediaToProjectReq.Platform = config.platform;
    importMediaToProjectReq.ProjectId = params.ProjectId;
    importMediaToProjectReq.VodFileId = params.VodFileId;
    importMediaToProjectReq.PreProcessDefinition = 10;
    if (params.Name) {
      importMediaToProjectReq.Name = params.Name;
    }
    let resp = await doImportMediaToProject(ctx, importMediaToProjectReq);
    ctx.body = resp;
  },

  //DescribeTaskDetail官网API链接[]
  async describeTaskDetail(ctx) {
    let params = ctx.request.body;
    let describeTaskDetailReq = new CmeModel.DescribeTaskDetailRequest();
    describeTaskDetailReq.Platform = config.platform;
    describeTaskDetailReq.TaskId = params.TaskId;
    let resp = await doDescribeTaskDetail(ctx, describeTaskDetailReq);
    ctx.body = resp;
  },
};

async function checkProjectRight(ctx, projectId) {
  let describeProjectReq = new CmeModel.DescribeProjectsRequest();
  describeProjectReq.Platform = config.platform;
  let owner = new CmeModel.Entity();
  owner.Type = PersonType;
  owner.Id = ctx.request.userId;
  describeProjectReq.Owner = owner;
  let projectIds = [];
  projectIds.push(projectId);
  describeProjectReq.ProjectIds = projectIds;
  let resp = await doDescribeProjects(ctx, describeProjectReq);
  console.debug("checkProjectRight ", resp);
  if (resp.Code == 0 && resp.Data && resp.Data.TotalCount > 0) {
    return true;
  }
  return false;
}

function doCreateProject(ctx, createProjectReq) {
  return new Promise((resolve, reject) => {
    client.CreateProject(createProjectReq, function (err, response) {
      if (err) {
        console.error(err);
        reject(errcode.systemErr);
      } else {
        console.debug("response", response);
        let resp = utils.buildResp({
          ProjectId: response.ProjectId,
          RequestId: response.RequestId,
          Signature: sign.getOpenProjectSign(
            response.ProjectId,
            ctx.request.userId
          ),
        });
        console.debug("resp", resp);
        resolve(resp);
      }
    });
  });
}

function doDescribeProjects(ctx, describeProjectReq) {
  return new Promise((resolve, reject) => {
    client.DescribeProjects(describeProjectReq, function (err, response) {
      // 请求异常返回，打印异常信息
      if (err) {
        console.error(err);
        reject(errcode.systemErr);
      } else {
        // 请求正常返回，打印response对象
        console.log(response.to_json_string());
        response.ProjectInfoSet.forEach((item) => {
          item.Signature = sign.getOpenProjectSign(
            item.ProjectId,
            ctx.request.userId
          );
        });
        resolve(utils.buildResp(response));
      }
    });
  });
}

function doExportVideoEditProject(ctx, exportVideoEditProjectReq) {
  console.debug("exportVideoEditProjectReq", exportVideoEditProjectReq);
  return new Promise((resolve, reject) => {
    client.ExportVideoEditProject(exportVideoEditProjectReq, function (
      err,
      response
    ) {
      // 请求异常返回，打印异常信息
      if (err) {
        console.error(err);
        reject(
          Object.assign({}, errcode.systemErr, {
            requestId: response.RequestId,
          })
        );
      } else {
        // 请求正常返回，打印response对象
        console.log(response.to_json_string());
        resolve(utils.buildResp(response));
      }
    });
  });
}

function doImportMediaToProject(ctx, importMediaToProjectReq) {
  console.debug("importMediaToProjectReq", importMediaToProjectReq);
  return new Promise((resolve, reject) => {
    client.ImportMediaToProject(importMediaToProjectReq, function (
      err,
      response
    ) {
      if (err) {
        console.error(err);
        reject(errcode.systemErr);
      } else {
        // 请求正常返回，打印response对象
        console.log(response.to_json_string());
        resolve(utils.buildResp(response));
      }
    });
  });
}

function doDescribeTaskDetail(ctx, describeTaskDetailReq) {
  console.debug("describeTaskDetailReq", describeTaskDetailReq);
  return new Promise((resolve, reject) => {
    client.DescribeTaskDetail(describeTaskDetailReq, function (err, response) {
      if (err) {
        console.error(err);
        reject(errcode.systemErr);
      } else {
        // 请求正常返回，打印response对象
        console.log(response.to_json_string());
        let result = {
          Status: response.Status,
          Progress: response.Progress,
          ErrorCode: response.ErrCode,
          ErrMsg: response.ErrMsg,
          CreateTime: response.CreateTime,
        };
        if (
          response.VideoEditProjectOutput &&
          response.VideoEditProjectOutput.URL
        ) {
          result.URL = response.VideoEditProjectOutput.URL;
        }
        Object.assign(result, response);
        resolve(utils.buildResp(result));
      }
    });
  });
}
