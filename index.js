// @flow
// Flow type definitions for AWS Lex
// See documentation: https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html
// Definitions by Peter W <https://github.com/techieshark>
// Definitions: https://github.com/techieshark/flow-aws-lex

type value = string
type resolved_value = string
type Resolution = { value: resolved_value }
type KeyValueMap = {
  // set of key => value
  [key: string]: value,
}

export type LexInputEvent = {
  currentIntent: {
    name: string,
    slots: {
      [slot_name: string]: value
    },
    slotDetails: {
      [slot_name: string]: {
        "resolutions": Array<Resolution>,
        originalValue: string
      },
    },
    confirmationStatus: "None" | "Confirmed" | "Denied"
  },
  bot: {
    name: string, // "bot name",
    alias: string, // "bot alias",
    version: string, // "bot version"
  },
  userId: string, // "User ID specified in the POST request to Amazon Lex."
  inputTranscript: string, // "Text used to process the request"
  invocationSource: "FulfillmentCodeHook" | "DialogCodeHook",
  outputDialogMode: "Text" | "Voice", // "based on ContentType request header in runtime API request"
  messageVersion: "1.0",
  sessionAttributes: KeyValueMap,
  requestAttributes: KeyValueMap
}


export type LexResponse = {|
  sessionAttributes?: KeyValueMap,
  dialogAction: DialogAction
|}

export type LexLambdaCb = (error: ?Error, result?: LexResponse) => void;

type DialogAction = DialogElicitIntent | DialogElicitSlot | DialogConfirmIntent | DialogDelegate | DialogClose

// Full DialogAction structure based on the type field.
type DialogElicitIntent  = { type: "ElicitIntent"  } & ElicitIntentFields
type DialogElicitSlot    = { type: "ElicitSlot"    } & ElicitSlotFields
type DialogConfirmIntent = { type: "ConfirmIntent" } & ConfirmIntentFields
type DialogDelegate      = { type: "Delegate"      } & DelegateFields
type DialogClose         = { type: "Close"         } & CloseFields

type IntentSlots = {
  // must include all of the slots specified for the requested intent
  [slot_name: string]: string | null, //"value" Use null if the slot's value is unknown.
}

type Message = {
  contentType: "PlainText" | "SSML",
  content: string // Message to convey to the user.
}

type ResponseCard = {
  version: number, // integer, actually
  contentType: "application/vnd.amazonaws.card.generic",
  genericAttachments: Array<{
    title: string, // "card-title"
    subTitle: string, // "card-sub-title"
    imageUrl: string, // "URL of the image to be shown"
    attachmentLinkUrl: string, // "URL of the attachment to be associated with the card"
    buttons: Array<{
      text: string, // "button-text"
      value: string //"Value sent to server on button click"
    }>
  }>
}


type ElicitIntentFields = {
  message?: Message, // For example, "What can I help you with?"
  responseCard?: ResponseCard
}

type ElicitSlotFields = {
  message?: Message,  // For example "What size pizza would you like?"
  intentName: string, // "intent-name"
  slots: IntentSlots,
  slotToElicit: string, // "slot-name"
  responseCard?: ResponseCard
}

// For when user is expected to provide yes/no answer to confirm/deny current intent.
type ConfirmIntentFields = {
  message?: Message,  // For example, "Thanks, your pizza has been ordered."
  intentName: string, // "intent-name"
  slots: IntentSlots,
  responseCard?: ResponseCard
}

// Directs Amazon Lex to choose the next course of action based on the bot configuration.
type DelegateFields = {
  slots: IntentSlots
}

type CloseFields = {
  fulfillmentState: "Fulfilled" | "Failed",
  message?: Message,
  responseCard?: ResponseCard
}


