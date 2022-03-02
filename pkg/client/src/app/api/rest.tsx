import { AxiosPromise } from "axios";
import { APIClient } from "@app/axios-config";

import {
  BusinessService,
  Stakeholder,
  StakeholderGroup,
  Application,
  Assessment,
  JobFunction,
  ApplicationDependency,
  TagType,
  Tag,
  Review,
  AssessmentRisk,
  AssessmentQuestionRisk,
  ApplicationAdoptionPlan,
  AssessmentConfidence,
  ApplicationImportSummary,
  BulkCopyAssessment,
  BulkCopyReview,
  Identity,
  Setting,
} from "./models";

// TACKLE_HUB
export const CONTROLS_BASE_URL = "controls";
export const BUSINESS_SERVICES = "/businessservices";
export const STAKEHOLDERS = "/stakeholders";
export const STAKEHOLDER_GROUPS = "/stakeholdergroups";
export const JOB_FUNCTIONS = "/jobfunctions";
export const TAG_TYPES = "/tagtypes";
export const TAGS = "/tags";

export const APPLICATIONS = "/applications";
export const APPLICATION_DEPENDENCY = "/dependencies";
export const REVIEW = "/review";
export const REPORT = "/application-inventory/reports";
export const UPLOAD_FILE = "/importsummaries/upload";
export const APP_IMPORT_SUMMARY = "/importsummaries";
export const APP_IMPORT = "/imports";
export const APP_IMPORT_CSV = "/importsummaries/download";

export const IDENTITIES = "/identities";
export const SETTINGS = "/settings";
export const TASKS = "/tasks";

// PATHFINDER
export const PATHFINDER_BASE_URL = "pathfinder";
export const ASSESSMENTS = PATHFINDER_BASE_URL + "/assessments";

const jsonHeaders = { headers: { Accept: "application/json" } };

type Direction = "asc" | "desc";

const buildQuery = (params: any) => {
  const query: string[] = [];

  Object.keys(params).forEach((key) => {
    const value = (params as any)[key];

    if (value !== undefined && value !== null) {
      let queryParamValues: string[] = [];
      if (Array.isArray(value)) {
        queryParamValues = value;
      } else {
        queryParamValues = [value];
      }
      queryParamValues.forEach((v) => query.push(`${key}=${v}`));
    }
  });

  return query;
};

// Business services

export enum BusinessServiceSortBy {
  NAME,
  OWNER,
}
export interface BusinessServiceSortByQuery {
  field: BusinessServiceSortBy;
  direction?: Direction;
}

export const getBusinessServices = (): AxiosPromise<Array<any>> => {
  return APIClient.get(`${BUSINESS_SERVICES}`, jsonHeaders);
};

export const deleteBusinessService = (id: number | string): AxiosPromise => {
  return APIClient.delete(`${BUSINESS_SERVICES}/${id}`);
};

export const createBusinessService = (
  obj: BusinessService
): AxiosPromise<BusinessService> => {
  return APIClient.post(`${BUSINESS_SERVICES}`, obj);
};

export const updateBusinessService = (
  obj: BusinessService
): AxiosPromise<BusinessService> => {
  return APIClient.put(`${BUSINESS_SERVICES}/${obj.id}`, obj);
};

export const getBusinessServiceById = (
  id: number | string
): AxiosPromise<BusinessService> => {
  return APIClient.get(`${BUSINESS_SERVICES}/${id}`);
};

// Stakeholders

export enum StakeholderSortBy {
  EMAIL,
  DISPLAY_NAME,
  JOB_FUNCTION,
  STAKEHOLDER_GROUPS_COUNT,
}
export interface StakeholderSortByQuery {
  field: StakeholderSortBy;
  direction?: Direction;
}

export const getStakeholders = (): AxiosPromise<Array<any>> => {
  return APIClient.get(`${STAKEHOLDERS}`);
};

export const createJobFunction = (
  obj: JobFunction
): AxiosPromise<JobFunction> => {
  return APIClient.post(`${JOB_FUNCTIONS}`, obj);
};

export const updateJobFunction = (
  obj: JobFunction
): AxiosPromise<JobFunction> => {
  return APIClient.put(`${JOB_FUNCTIONS}/${obj.id}`, obj);
};

export const deleteJobFunction = (id: number): AxiosPromise => {
  return APIClient.delete(`${JOB_FUNCTIONS}/${id}`);
};

export const deleteStakeholder = (id: number): AxiosPromise => {
  return APIClient.delete(`${STAKEHOLDERS}/${id}`);
};

export const createStakeholder = (
  obj: Stakeholder
): AxiosPromise<Stakeholder> => {
  return APIClient.post(`${STAKEHOLDERS}`, obj);
};

export const updateStakeholder = (
  obj: Stakeholder
): AxiosPromise<Stakeholder> => {
  return APIClient.put(`${STAKEHOLDERS}/${obj.id}`, obj);
};

// Stakeholder groups

export enum StakeholderGroupSortBy {
  NAME,
  STAKEHOLDERS_COUNT,
}
export interface StakeholderGroupSortByQuery {
  field: StakeholderGroupSortBy;
  direction?: Direction;
}

export const getStakeholderGroups = (): AxiosPromise<Array<any>> => {
  return APIClient.get(`${STAKEHOLDER_GROUPS}`, jsonHeaders);
};

export const deleteStakeholderGroup = (id: number): AxiosPromise => {
  return APIClient.delete(`${STAKEHOLDER_GROUPS}/${id}`);
};

export const createStakeholderGroup = (
  obj: StakeholderGroup
): AxiosPromise<StakeholderGroup> => {
  return APIClient.post(`${STAKEHOLDER_GROUPS}`, obj);
};

export const updateStakeholderGroup = (
  obj: StakeholderGroup
): AxiosPromise<StakeholderGroup> => {
  return APIClient.put(`${STAKEHOLDER_GROUPS}/${obj.id}`, obj);
};

// Job functions

export enum JobFunctionSortBy {
  ROLE,
}
export interface JobFunctionSortByQuery {
  field: JobFunctionSortBy;
  direction?: Direction;
}

export const getJobFunctions = (): AxiosPromise<Array<any>> => {
  return APIClient.get(`${JOB_FUNCTIONS}`, jsonHeaders);
};

// Tag types

export enum TagTypeSortBy {
  NAME,
  RANK,
  COLOR,
  TAGS_COUNT,
}
export interface TagTypeSortByQuery {
  field: TagTypeSortBy;
  direction?: Direction;
}

export const getTagTypes = (): AxiosPromise<Array<TagType>> => {
  return APIClient.get(`${TAG_TYPES}`, jsonHeaders);
};

export const deleteTagType = (id: number): AxiosPromise => {
  return APIClient.delete(`${TAG_TYPES}/${id}`);
};

export const createTagType = (obj: TagType): AxiosPromise<TagType> => {
  return APIClient.post(`${TAG_TYPES}`, obj);
};

export const updateTagType = (obj: TagType): AxiosPromise<TagType> => {
  return APIClient.put(`${TAG_TYPES}/${obj.id}`, obj);
};

export const getTagTypeById = (id: number): AxiosPromise<TagType> => {
  return APIClient.get(`${TAG_TYPES}/${id}`);
};

export const deleteTag = (id: number): AxiosPromise => {
  return APIClient.delete(`${TAGS}/${id}`);
};

export const createTag = (obj: Tag): AxiosPromise<Tag> => {
  return APIClient.post(`${TAGS}`, obj);
};

export const updateTag = (obj: Tag): AxiosPromise<Tag> => {
  return APIClient.put(`${TAGS}/${obj.id}`, obj);
};

export const getTagById = (id: number | string): AxiosPromise<Tag> => {
  return APIClient.get(`${TAGS}/${id}`);
};

// App inventory

export enum ApplicationSortBy {
  NAME,
  TAGS,
  REVIEW,
}
export interface ApplicationSortByQuery {
  field: ApplicationSortBy;
  direction?: Direction;
}

export const getApplications = (): AxiosPromise<Array<Application>> => {
  return APIClient.get(`${APPLICATIONS}`, jsonHeaders);
};

export const deleteApplication = (id: number): AxiosPromise => {
  return APIClient.delete(`${APPLICATIONS}/${id}`);
};

export const createApplication = (
  obj: Application
): AxiosPromise<Application> => {
  return APIClient.post(`${APPLICATIONS}`, obj);
};

export const updateApplication = (
  obj: Application
): AxiosPromise<Application> => {
  return APIClient.put(`${APPLICATIONS}/${obj.id}`, obj);
};

export const getApplicationById = (
  id: number | string
): AxiosPromise<Application> => {
  return APIClient.get(`${APPLICATIONS}/${id}`);
};

//

export const getApplicationDependencies = (): AxiosPromise<
  Array<ApplicationDependency>
> => {
  return APIClient.get(`${APPLICATION_DEPENDENCY}`, jsonHeaders);
};

export const createApplicationDependency = (
  obj: ApplicationDependency
): AxiosPromise<ApplicationDependency> => {
  return APIClient.post(`${APPLICATION_DEPENDENCY}`, obj);
};

export const deleteApplicationDependency = (id: number): AxiosPromise => {
  return APIClient.delete(`${APPLICATION_DEPENDENCY}/${id}`);
};

//

export const getReviewId = (id: number | string): AxiosPromise<Review> => {
  return APIClient.get(`${REVIEW}/${id}`);
};

export const createReview = (obj: Review): AxiosPromise<Review> => {
  return APIClient.post(`${REVIEW}`, obj);
};

export const updateReview = (obj: Review): AxiosPromise<Review> => {
  return APIClient.put(`${REVIEW}/${obj.id}`, obj);
};

export const deleteReview = (id: number): AxiosPromise => {
  return APIClient.delete(`${REVIEW}/${id}`);
};

export const getApplicationAdoptionPlan = (
  applicationIds: number[]
): AxiosPromise<ApplicationAdoptionPlan[]> => {
  return APIClient.post(
    `${REPORT}/adoptionplan`,
    applicationIds.map((f) => ({
      applicationId: f,
    }))
  );
};

export enum ApplicationImportSummarySortBy {
  DATE,
  USER,
  FILE_NAME,
  STATUS,
}
export interface ApplicationImportSummarySortByQuery {
  field: ApplicationImportSummarySortBy;
  direction?: Direction;
}

export const getApplicationImportSummary = (): AxiosPromise<
  Array<ApplicationImportSummary>
> => {
  return APIClient.get(`${APP_IMPORT_SUMMARY}`, jsonHeaders);
};

export const getApplicationImportSummaryById = (
  id: number | string
): AxiosPromise<ApplicationImportSummary> => {
  return APIClient.get(`${APP_IMPORT_SUMMARY}/${id}`);
};

export const deleteApplicationImportSummary = (id: number): AxiosPromise => {
  return APIClient.delete(`${APP_IMPORT_SUMMARY}/${id}`);
};

export const getApplicationImport = (): AxiosPromise<Array<any>> => {
  return APIClient.get(`${APP_IMPORT}`, jsonHeaders);
};

export const getApplicationSummaryCSV = (id: string): AxiosPromise => {
  return APIClient.get(`${APP_IMPORT_CSV}?importSummaryId=${id}`, {
    responseType: "arraybuffer",
    headers: { Accept: "text/csv", responseType: "blob" },
  });
};

export const createBulkCopyReview = (
  bulk: BulkCopyReview
): AxiosPromise<BulkCopyReview> => {
  return APIClient.post<BulkCopyReview>(`${REVIEW}/bulk`, bulk);
};

export const getBulkCopyReview = (id: number): AxiosPromise<BulkCopyReview> => {
  return APIClient.get<BulkCopyReview>(`${REVIEW}/bulk/${id}`);
};

//

export const getAssessments = (filters: {
  applicationId?: number | string;
}): AxiosPromise<Assessment[]> => {
  const params = {
    applicationId: filters.applicationId,
  };

  const query: string[] = buildQuery(params);
  return APIClient.get(`${ASSESSMENTS}?${query.join("&")}`);
};

export const createAssessment = (obj: Assessment): AxiosPromise<Assessment> => {
  return APIClient.post(`${ASSESSMENTS}`, obj);
};

export const patchAssessment = (obj: Assessment): AxiosPromise<Assessment> => {
  return APIClient.patch(`${ASSESSMENTS}/${obj.id}`, obj);
};

export const getAssessmentById = (
  id: number | string
): AxiosPromise<Assessment> => {
  return APIClient.get(`${ASSESSMENTS}/${id}`);
};

export const deleteAssessment = (id: number): AxiosPromise => {
  return APIClient.delete(`${ASSESSMENTS}/${id}`);
};

export const getAssessmentLandscape = (
  applicationIds: number[]
): AxiosPromise<AssessmentRisk[]> => {
  return APIClient.post(
    `${ASSESSMENTS}/assessment-risk`,
    applicationIds.map((f) => ({ applicationId: f }))
  );
};

export const getAssessmentIdentifiedRisks = (
  applicationIds: number[]
): AxiosPromise<AssessmentQuestionRisk[]> => {
  return APIClient.post(
    `${ASSESSMENTS}/risks`,
    applicationIds.map((f) => ({ applicationId: f }))
  );
};

export const getAssessmentConfidence = (
  applicationIds: number[]
): AxiosPromise<AssessmentConfidence[]> => {
  return APIClient.post(
    `${ASSESSMENTS}/confidence`,
    applicationIds.map((f) => ({ applicationId: f }))
  );
};

export const createBulkCopyAssessment = (
  bulk: BulkCopyAssessment
): AxiosPromise<BulkCopyAssessment> => {
  return APIClient.post<BulkCopyAssessment>(`${ASSESSMENTS}/bulk`, bulk);
};

export const getBulkCopyAssessment = (
  id: number
): AxiosPromise<BulkCopyAssessment> => {
  return APIClient.get<BulkCopyAssessment>(`${ASSESSMENTS}/bulk/${id}`);
};

export const getIdentities = (): AxiosPromise<Array<any>> => {
  return APIClient.get(`${IDENTITIES}`, jsonHeaders);
};

export const createIdentity = (obj: Identity): AxiosPromise<Identity> => {
  return APIClient.post(`${IDENTITIES}`, obj);
};

export const updateIdentity = (obj: Identity): AxiosPromise<Identity> => {
  return APIClient.put(`${IDENTITIES}/${obj.id}`, obj);
};

export const deleteIdentity = (id: number): AxiosPromise => {
  return APIClient.delete(`${IDENTITIES}/${id}`);
};

export const getSettingById = (id: number | string): AxiosPromise<boolean> => {
  return APIClient.get(`${SETTINGS}/${id}`, jsonHeaders);
};

export const updateSetting = (obj: Setting): AxiosPromise<Setting> => {
  return APIClient.put(
    `${SETTINGS}/${obj.key}`,
    obj.value?.toString(),
    jsonHeaders
  );
};

export const createSetting = (obj: Setting): AxiosPromise<Setting> => {
  return APIClient.post(`${SETTINGS}`, obj);
};

export const getTasks = (): AxiosPromise<Array<any>> => {
  return APIClient.get(`${TASKS}`, jsonHeaders);
};
