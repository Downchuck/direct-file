export type IpPin = string;

export interface IpPinValidationFailure {
  validationMessage: {
    toUserFriendlyReason: () => string;
  };
}
