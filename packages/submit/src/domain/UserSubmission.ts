import { Dispatch } from '@df/data-models/src/models/Dispatch';

export interface UserSubmission {
  userId: string;
  taxReturnId: string;
  submissionId: string;
  manifestXmlPath: string;
  submissionXmlPath: string;
  userContextPath: string;
}

export function fromDispatch(dispatch: Dispatch): UserSubmission {
  return {
    userId: dispatch.userId,
    taxReturnId: dispatch.taxReturnId,
    submissionId: dispatch.mefSubmissionId,
    manifestXmlPath: dispatch.pathToManifest,
    submissionXmlPath: dispatch.pathToSubmission,
    userContextPath: dispatch.pathToUserContext,
  };
}
