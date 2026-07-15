






 
                                    
  
                                                                  
                             
  
           
  
        
                                               
                                            
                                  
     
      
  
                                                                 
  
                    
 
declare function cronAdd(
  jobId:    string,
  cronExpr: string,
  handler:  () => void,
): void;

 
                                                               
  
           
  
        
                      
      
  
                                                                 
  
                    
 
declare function cronRemove(jobId: string): void;





 
                                              
  
           
  
        
                                      
                                                
                          
      
  
                                                                 
  
                    
 
declare function routerAdd(
  method: string,
  path: string,
  handler: (e: core.RequestEvent) => void,
  ...middlewares: Array<string|((e: core.RequestEvent) => void)|Middleware>,
): void;

 
                                                                       
                                                                 
  
           
  
        
                     
                                    
                    
     
      
  
                                                                 
  
                    
 
declare function routerUse(...middlewares: Array<string|((e: core.RequestEvent) => void)|Middleware>): void;





 
                                                                                        
  
                    
 
declare var __hooks: string





type excludeHooks<Type> = {
    [Property in keyof Type as Exclude<Property, `on${string}`|'cron'>]: Type[Property]
};


type CoreApp = excludeHooks<core.App>


type PocketBase = excludeHooks<pocketbase.PocketBase>

 
                                                                     
                                 
  
                                                                   
  
             
                    
 
declare var $app: PocketBase

 
                                                                              
  
                                                                                       
                                                                        
  
           
  
        
                                    
                           
                            
                             
      
  
             
                    
 
declare var $template: template.Registry

 
                                         
  
              
                    
 
declare function readerToString(reader: any, maxBytes?: number): string;

 
                                            
  
                                                                        
                                                   
  
                                                                            
  
           
  
        
               
                                       
  
                    
                                                         
  
          
                                   
      
  
                    
 
declare function toString(val: any, maxBytes?: number): string;

 
                                                           
  
                                                                        
                                                   
  
                                                                      
                                                                 
  
           
  
        
               
                                      
  
            
                                                        
  
                                                  
                                                                           
  
          
                                  
      
  
                    
 
declare function toBytes(val: any, maxBytes?: number): Array<number>;

 
                                                                                       
                                                   
  
           
  
        
                                 
      
  
                    
 
declare function sleep(milliseconds: number): void;

 
                                                               
                                                              
  
           
  
        
                                      
  
                                                      
      
  
                    
 
declare function arrayOf<T>(model: T): Array<T>;

 
                                                               
  
                                                                  
                                                 
  
                                                              
                                                                
                                                   
  
                                                                                  
                                                                         
  
           
  
        
                                                          
      
  
                    
 
declare function unmarshal(data: any, dst: any): void;

 
                                                                                     
  
           
                                                                                          
                                                                                                                                                                                        
                                                                                                                                       
                                                                                                                                                               
  
           
  
        
                                   
                                                        
                                                     
                                                       
                                                      
                                                                                                                                          
                                                        
     
      
  
                    
 
declare class DynamicModel {
  [key: string]: any;
  constructor(shape?: { [key:string]: any })
}

 
                                                                 
                                                         
  
                    
 
declare function nullString(): string;

 
                                                             
                                                      
  
                    
 
declare function nullInt(): number;

 
                                                                 
                                                        
  
                    
 
declare function nullFloat(): number;

 
                                                             
                                                       
  
                    
 
declare function nullBool(): boolean;

 
                                                                         
                                                             
  
                    
 
declare function nullArray(): Array<any>;

 
                                                                        
                                                              
  
                    
 
declare function nullObject(): { get(key:string):any; set(key:string,value:any):void };

interface Context extends context.Context{} 
 
                                                  
  
                                                               
  
           
  
        
                              
  
                                
                                           
                                      
  
                                           
                                          
                                     
                                     
      
  
                    
 
declare class Context implements context.Context {
  constructor(parentCtx?: Context, key?: any, value?: any)
}

 
                      
  
        
                                                              
  
                                          
                           
     
  
                                                  
                                   
      
  
                    
 
declare const Record: {
  new(collection?: core.Collection, data?: { [key:string]: any }): core.Record

  
}

interface Collection extends core.Collection{
  type: "base" | "view" | "auth"
} 
 
                          
  
        
                                      
                          
                             
                                                                 
                                                                 
                                            
                
            
                             
                            
                              
                      
                        
             
            
                                   
                            
             
        
     
      
  
                    
 
declare class Collection implements core.Collection {
  constructor(data?: Partial<Collection>)
}

interface FieldsList extends core.FieldsList{} 
 
                                                                        
  
                    
 
declare class FieldsList implements core.FieldsList {
  constructor(data?: Partial<core.FieldsList>)
}

interface Field extends core.Field{} 
 
                                                                   
  
                    
 
declare class Field implements core.Field {
  constructor(data?: Partial<core.Field>)
}

interface NumberField extends core.NumberField{} 
 
                                 
  
                    
 
declare class NumberField implements core.NumberField {
  constructor(data?: Partial<core.NumberField>)
}

interface BoolField extends core.BoolField{} 
 
                               
  
                    
 
declare class BoolField implements core.BoolField {
  constructor(data?: Partial<core.BoolField>)
}

interface TextField extends core.TextField{} 
 
                               
  
                    
 
declare class TextField implements core.TextField {
  constructor(data?: Partial<core.TextField>)
}

interface URLField extends core.URLField{} 
 
                              
  
                    
 
declare class URLField implements core.URLField {
  constructor(data?: Partial<core.URLField>)
}

interface EmailField extends core.EmailField{} 
 
                                
  
                    
 
declare class EmailField implements core.EmailField {
  constructor(data?: Partial<core.EmailField>)
}

interface EditorField extends core.EditorField{} 
 
                                 
  
                    
 
declare class EditorField implements core.EditorField {
  constructor(data?: Partial<core.EditorField>)
}

interface PasswordField extends core.PasswordField{} 
 
                                   
  
                    
 
declare class PasswordField implements core.PasswordField {
  constructor(data?: Partial<core.PasswordField>)
}

interface DateField extends core.DateField{} 
 
                               
  
                    
 
declare class DateField implements core.DateField {
  constructor(data?: Partial<core.DateField>)
}

interface AutodateField extends core.AutodateField{} 
 
                                   
  
                    
 
declare class AutodateField implements core.AutodateField {
  constructor(data?: Partial<core.AutodateField>)
}

interface JSONField extends core.JSONField{} 
 
                               
  
                    
 
declare class JSONField implements core.JSONField {
  constructor(data?: Partial<core.JSONField>)
}

interface RelationField extends core.RelationField{} 
 
                                   
  
                    
 
declare class RelationField implements core.RelationField {
  constructor(data?: Partial<core.RelationField>)
}

interface SelectField extends core.SelectField{} 
 
                                 
  
                    
 
declare class SelectField implements core.SelectField {
  constructor(data?: Partial<core.SelectField>)
}

interface FileField extends core.FileField{} 
 
                               
  
                    
 
declare class FileField implements core.FileField {
  constructor(data?: Partial<core.FileField>)
}

interface GeoPointField extends core.GeoPointField{} 
 
                                   
  
                    
 
declare class GeoPointField implements core.GeoPointField {
  constructor(data?: Partial<core.GeoPointField>)
}

interface MailerMessage extends mailer.Message{} 
 
                                                
  
        
                                      
              
                                                       
                                                    
         
                                                
                                  
                                    
     
  
                                     
      
  
                    
 
declare class MailerMessage implements mailer.Message {
  constructor(message?: Partial<mailer.Message>)
}

interface Command extends cobra.Command{} 
 
                                            
  
           
  
        
                                
                    
                                                           
     
  
                                    
      
  
                    
 
declare class Command implements cobra.Command {
  constructor(cmd?: Partial<cobra.Command>)
}

 
                                                                       
                                    
  
           
  
        
                                                                             
  
                                 
                           
                              
                                   
     
  
                                                                         
  
                                                                                                             
      
  
                    
 
declare const RequestInfo: {
  new(info?: Partial<core.RequestInfo>): core.RequestInfo

 
}

 
                                                          
  
                                                                                                             
  
           
  
        
                                    
                                    
                    
           
      
  
                    
 
declare class Middleware {
  constructor(
    func: string|((e: core.RequestEvent) => void),
    priority?: number,
    id?: string,
  )
}

interface Timezone extends time.Location{} 
 
                                                              
  
                                                                     
                                                              
  
                                                      
  
                                                    
  
                                                                                    
  
           
  
        
                                                
                                
      
  
                    
 
declare class Timezone implements time.Location {
  constructor(name?: string)
}

interface DateTime extends types.DateTime{} 
 
                                                    
                                                  
  
           
  
        
                                    
  
                          
                                                       
  
                                                               
     
                                                                                                         
                                                     
                                                                      
      
  
                    
 
declare class DateTime implements types.DateTime {
  constructor(date?: string, defaultParseInLocation?: string)
}

interface ValidationError extends ozzo_validation.Error{} 
 
                                                                    
                                             
  
        
                                                             
      
  
                    
 
declare class ValidationError implements ozzo_validation.Error {
  constructor(code?: string, message?: string)
}

interface Cookie extends http.Cookie{} 
 
                                                                            
                 
  
           
  
        
                                         
                               
                                    
                                     
                         
                                   
                        
                          
                          
                       
          
  
                                   
     
      
  
                    
 
declare class Cookie implements http.Cookie {
  constructor(options?: Partial<http.Cookie>)
}

interface SubscriptionMessage extends subscriptions.Message{} 
 
                                                               
  
           
  
        
                                    
                                              
                           
                                              
          
     
      
  
                    
 
declare class SubscriptionMessage implements subscriptions.Message {
  constructor(options?: Partial<subscriptions.Message>)
}





 
                                                                     
                                                                                                     
  
                    
 
declare namespace $dbx {
   
                              
   
  export function hashExp(pairs: { [key:string]: any }): dbx.Expression

  let _in: dbx._in
  export { _in as in }

  export let exp:        dbx.newExp
  export let not:        dbx.not
  export let and:        dbx.and
  export let or:         dbx.or
  export let notIn:      dbx.notIn
  export let like:       dbx.like
  export let orLike:     dbx.orLike
  export let notLike:    dbx.notLike
  export let orNotLike:  dbx.orNotLike
  export let exists:     dbx.exists
  export let notExists:  dbx.notExists
  export let between:    dbx.between
  export let notBetween: dbx.notBetween
}





 
                                          
                                                              
  
                    
 
declare namespace $mails {
  let sendRecordPasswordReset: mails.sendRecordPasswordReset
  let sendRecordVerification:  mails.sendRecordVerification
  let sendRecordChangeEmail:   mails.sendRecordChangeEmail
  let sendRecordOTP:           mails.sendRecordOTP
  let sendRecordAuthAlert:     mails.sendRecordAuthAlert
}





 
                                                     
                                                                   
  
                    
 
declare namespace $security {
  let randomString:                   security.randomString
  let randomStringWithAlphabet:       security.randomStringWithAlphabet
  let randomStringByRegex:            security.randomStringByRegex
  let pseudorandomString:             security.pseudorandomString
  let pseudorandomStringWithAlphabet: security.pseudorandomStringWithAlphabet
  let encrypt:                        security.encrypt
  let decrypt:                        security.decrypt
  let hs256:                          security.hs256
  let hs512:                          security.hs512
  let equal:                          security.equal
  let md5:                            security.md5
  let sha256:                         security.sha256
  let sha512:                         security.sha512

   
                                  
   
  function createJWT(payload: { [key:string]: any }, signingKey: string, secDuration: number): string

   
                                              
   
  function parseUnverifiedJWT(token: string): _TygojaDict

   
                                    
   
  function parseJWT(token: string, verificationKey: string): _TygojaDict
}





 
                                                   
                                              
  
                    
 
declare namespace $filesystem {
  let fileFromPath:      filesystem.newFileFromPath
  let fileFromBytes:     filesystem.newFileFromBytes
  let fileFromMultipart: filesystem.newFileFromMultipart

   
                                                  
                                                                      
    
                                                               
                                                                                     
   
  let s3: filesystem.newS3

   
                                                     
                                                                      
    
                                                               
                                                                                     
   
  let local: filesystem.newLocal

   
                                                            
                                                         
    
             
    
          
                                          
                                                         
    
                                    
                                                             
        
   
  function fileFromURL(url: string, secTimeout?: number): filesystem.File
}





 
                                                               
                                                                                 
  
                    
 
declare namespace $filepath {
  let base:      filepath.base
  let clean:     filepath.clean
  let dir:       filepath.dir
  let ext:       filepath.ext
  let fromSlash: filepath.fromSlash
  let glob:      filepath.glob
  let isAbs:     filepath.isAbs
  let join:      filepath.join
  let match:     filepath.match
  let rel:       filepath.rel
  let split:     filepath.split
  let splitList: filepath.splitList
  let toSlash:   filepath.toSlash
  let walk:      filepath.walk
  let walkDir:   filepath.walkDir
}





 
                                                                        
                                                              
  
                    
 
declare namespace $os {
   
                                
   
  let exec: exec.command

   
                                     
    
             
    
          
                                      
                                     
    
                                                                    
                                           
        
   
  let cmd: exec.command

   
                                                                          
   
  let args: Array<string>

  let exit:       os.exit
  let getenv:     os.getenv
  let dirFS:      os.dirFS
  let readFile:   os.readFile
  let writeFile:  os.writeFile
  let stat:       os.stat
  let readDir:    os.readDir
  let tempDir:    os.tempDir
  let truncate:   os.truncate
  let getwd:      os.getwd
  let mkdir:      os.mkdir
  let mkdirAll:   os.mkdirAll
  let rename:     os.rename
  let remove:     os.remove
  let removeAll:  os.removeAll
  let openRoot:   os.openRoot
  let openInRoot: os.openInRoot
}





interface AppleClientSecretCreateForm extends forms.AppleClientSecretCreate{} 
 
              
                    
 
declare class AppleClientSecretCreateForm implements forms.AppleClientSecretCreate {
  constructor(app: CoreApp)
}

interface RecordUpsertForm extends forms.RecordUpsert{} 
 
              
                    
 
declare class RecordUpsertForm implements forms.RecordUpsert {
  constructor(app: CoreApp, record: core.Record)
}

interface TestEmailSendForm extends forms.TestEmailSend{} 
 
              
                    
 
declare class TestEmailSendForm implements forms.TestEmailSend {
  constructor(app: CoreApp)
}

interface TestS3FilesystemForm extends forms.TestS3Filesystem{} 
 
              
                    
 
declare class TestS3FilesystemForm implements forms.TestS3Filesystem {
  constructor(app: CoreApp)
}





interface ApiError extends router.ApiError{} 
 
              
  
                    
 
declare class ApiError implements router.ApiError {
  constructor(status?: number, message?: string, data?: any)
}

interface NotFoundError extends router.ApiError{} 
 
                                     
  
                    
 
declare class NotFoundError implements router.ApiError {
  constructor(message?: string, data?: any)
}

interface BadRequestError extends router.ApiError{} 
 
                                        
  
                    
 
declare class BadRequestError implements router.ApiError {
  constructor(message?: string, data?: any)
}

interface ForbiddenError extends router.ApiError{} 
 
                                       
  
                    
 
declare class ForbiddenError implements router.ApiError {
  constructor(message?: string, data?: any)
}

interface UnauthorizedError extends router.ApiError{} 
 
                                          
  
                    
 
declare class UnauthorizedError implements router.ApiError {
  constructor(message?: string, data?: any)
}

interface TooManyRequestsError extends router.ApiError{} 
 
                                             
  
                    
 
declare class TooManyRequestsError implements router.ApiError {
  constructor(message?: string, data?: any)
}

interface InternalServerError extends router.ApiError{} 
 
                                            
  
                    
 
declare class InternalServerError implements router.ApiError {
  constructor(message?: string, data?: any)
}

 
                                                                        
  
                    
 
declare namespace $apis {
   
                                                                           
    
                                                                        
                                                               
   
  function static(dir: string, indexFallback: boolean): (e: core.RequestEvent) => void

  let requireGuestOnly:              apis.requireGuestOnly
  let requireAuth:                   apis.requireAuth
  let requireSuperuserAuth:          apis.requireSuperuserAuth
  let requireSuperuserOrOwnerAuth:   apis.requireSuperuserOrOwnerAuth
  let skipSuccessActivityLog:        apis.skipSuccessActivityLog
  let gzip:                          apis.gzip
  let bodyLimit:                     apis.bodyLimit
  let enrichRecord:                  apis.enrichRecord
  let enrichRecords:                 apis.enrichRecords

   
                                                                     
                                      
    
                                                                                                               
                                                                                     
    
                                                                                             
                                                                          
   
  function recordAuthResponse(e: core.RequestEvent, authRecord: core.Record, authMethod: string, meta?: any): void
}






interface FormData {
  append(key:string, value:any): void
  set(key:string, value:any): void
}

 
                                                                 
  
                    
 
declare namespace $http {
   
                                 
    
             
    
          
                             
                         
                                        
                                                    
                                                        
       
    
                                                                 
                                                                                         
                                                                                          
                                                                        
                                                                                 
        
   
  function send(config: {
    url:      string,
    body?:    string|FormData,
    method?:  string, 
    headers?: { [key:string]: string },
    timeout?: number, 

    
    data?: { [key:string]: any },
  }): {
    statusCode: number,
    headers:    { [key:string]: Array<string> },
    cookies:    { [key:string]: http.Cookie },
    json:       any,
    body:       Array<number>,

    
    raw: string,
  };
}





 
                                                               
  
                                                                      
  
                    
 
declare function migrate(
  up: (txApp: CoreApp) => void,
  down?: (txApp: CoreApp) => void
): void;
                    declare function onBackupCreate(handler: (e: core.BackupEvent) => void): void
                    declare function onBackupRestore(handler: (e: core.BackupEvent) => void): void
                    declare function onBatchRequest(handler: (e: core.BatchRequestEvent) => void): void
                    declare function onBootstrap(handler: (e: core.BootstrapEvent) => void): void
                    declare function onCollectionAfterCreateError(handler: (e: core.CollectionErrorEvent) => void, ...tags: string[]): void
                    declare function onCollectionAfterCreateSuccess(handler: (e: core.CollectionEvent) => void, ...tags: string[]): void
                    declare function onCollectionAfterDeleteError(handler: (e: core.CollectionErrorEvent) => void, ...tags: string[]): void
                    declare function onCollectionAfterDeleteSuccess(handler: (e: core.CollectionEvent) => void, ...tags: string[]): void
                    declare function onCollectionAfterUpdateError(handler: (e: core.CollectionErrorEvent) => void, ...tags: string[]): void
                    declare function onCollectionAfterUpdateSuccess(handler: (e: core.CollectionEvent) => void, ...tags: string[]): void
                    declare function onCollectionCreate(handler: (e: core.CollectionEvent) => void, ...tags: string[]): void
                    declare function onCollectionCreateExecute(handler: (e: core.CollectionEvent) => void, ...tags: string[]): void
                    declare function onCollectionCreateRequest(handler: (e: core.CollectionRequestEvent) => void): void
                    declare function onCollectionDelete(handler: (e: core.CollectionEvent) => void, ...tags: string[]): void
                    declare function onCollectionDeleteExecute(handler: (e: core.CollectionEvent) => void, ...tags: string[]): void
                    declare function onCollectionDeleteRequest(handler: (e: core.CollectionRequestEvent) => void): void
                    declare function onCollectionUpdate(handler: (e: core.CollectionEvent) => void, ...tags: string[]): void
                    declare function onCollectionUpdateExecute(handler: (e: core.CollectionEvent) => void, ...tags: string[]): void
                    declare function onCollectionUpdateRequest(handler: (e: core.CollectionRequestEvent) => void): void
                    declare function onCollectionValidate(handler: (e: core.CollectionEvent) => void, ...tags: string[]): void
                    declare function onCollectionViewRequest(handler: (e: core.CollectionRequestEvent) => void): void
                    declare function onCollectionsImportRequest(handler: (e: core.CollectionsImportRequestEvent) => void): void
                    declare function onCollectionsListRequest(handler: (e: core.CollectionsListRequestEvent) => void): void
                    declare function onFileDownloadRequest(handler: (e: core.FileDownloadRequestEvent) => void, ...tags: string[]): void
                    declare function onFileTokenRequest(handler: (e: core.FileTokenRequestEvent) => void, ...tags: string[]): void
                    declare function onMailerRecordAuthAlertSend(handler: (e: core.MailerRecordEvent) => void, ...tags: string[]): void
                    declare function onMailerRecordEmailChangeSend(handler: (e: core.MailerRecordEvent) => void, ...tags: string[]): void
                    declare function onMailerRecordOTPSend(handler: (e: core.MailerRecordEvent) => void, ...tags: string[]): void
                    declare function onMailerRecordPasswordResetSend(handler: (e: core.MailerRecordEvent) => void, ...tags: string[]): void
                    declare function onMailerRecordVerificationSend(handler: (e: core.MailerRecordEvent) => void, ...tags: string[]): void
                    declare function onMailerSend(handler: (e: core.MailerEvent) => void): void
                    declare function onModelAfterCreateError(handler: (e: core.ModelErrorEvent) => void, ...tags: string[]): void
                    declare function onModelAfterCreateSuccess(handler: (e: core.ModelEvent) => void, ...tags: string[]): void
                    declare function onModelAfterDeleteError(handler: (e: core.ModelErrorEvent) => void, ...tags: string[]): void
                    declare function onModelAfterDeleteSuccess(handler: (e: core.ModelEvent) => void, ...tags: string[]): void
                    declare function onModelAfterUpdateError(handler: (e: core.ModelErrorEvent) => void, ...tags: string[]): void
                    declare function onModelAfterUpdateSuccess(handler: (e: core.ModelEvent) => void, ...tags: string[]): void
                    declare function onModelCreate(handler: (e: core.ModelEvent) => void, ...tags: string[]): void
                    declare function onModelCreateExecute(handler: (e: core.ModelEvent) => void, ...tags: string[]): void
                    declare function onModelDelete(handler: (e: core.ModelEvent) => void, ...tags: string[]): void
                    declare function onModelDeleteExecute(handler: (e: core.ModelEvent) => void, ...tags: string[]): void
                    declare function onModelUpdate(handler: (e: core.ModelEvent) => void, ...tags: string[]): void
                    declare function onModelUpdateExecute(handler: (e: core.ModelEvent) => void, ...tags: string[]): void
                    declare function onModelValidate(handler: (e: core.ModelEvent) => void, ...tags: string[]): void
                    declare function onRealtimeConnectRequest(handler: (e: core.RealtimeConnectRequestEvent) => void): void
                    declare function onRealtimeMessageSend(handler: (e: core.RealtimeMessageEvent) => void): void
                    declare function onRealtimeSubscribeRequest(handler: (e: core.RealtimeSubscribeRequestEvent) => void): void
                    declare function onRecordAfterCreateError(handler: (e: core.RecordErrorEvent) => void, ...tags: string[]): void
                    declare function onRecordAfterCreateSuccess(handler: (e: core.RecordEvent) => void, ...tags: string[]): void
                    declare function onRecordAfterDeleteError(handler: (e: core.RecordErrorEvent) => void, ...tags: string[]): void
                    declare function onRecordAfterDeleteSuccess(handler: (e: core.RecordEvent) => void, ...tags: string[]): void
                    declare function onRecordAfterUpdateError(handler: (e: core.RecordErrorEvent) => void, ...tags: string[]): void
                    declare function onRecordAfterUpdateSuccess(handler: (e: core.RecordEvent) => void, ...tags: string[]): void
                    declare function onRecordAuthRefreshRequest(handler: (e: core.RecordAuthRefreshRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordAuthRequest(handler: (e: core.RecordAuthRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordAuthWithOAuth2Request(handler: (e: core.RecordAuthWithOAuth2RequestEvent) => void, ...tags: string[]): void
                    declare function onRecordAuthWithOTPRequest(handler: (e: core.RecordAuthWithOTPRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordAuthWithPasswordRequest(handler: (e: core.RecordAuthWithPasswordRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordConfirmEmailChangeRequest(handler: (e: core.RecordConfirmEmailChangeRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordConfirmPasswordResetRequest(handler: (e: core.RecordConfirmPasswordResetRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordConfirmVerificationRequest(handler: (e: core.RecordConfirmVerificationRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordCreate(handler: (e: core.RecordEvent) => void, ...tags: string[]): void
                    declare function onRecordCreateExecute(handler: (e: core.RecordEvent) => void, ...tags: string[]): void
                    declare function onRecordCreateRequest(handler: (e: core.RecordRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordDelete(handler: (e: core.RecordEvent) => void, ...tags: string[]): void
                    declare function onRecordDeleteExecute(handler: (e: core.RecordEvent) => void, ...tags: string[]): void
                    declare function onRecordDeleteRequest(handler: (e: core.RecordRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordEnrich(handler: (e: core.RecordEnrichEvent) => void, ...tags: string[]): void
                    declare function onRecordRequestEmailChangeRequest(handler: (e: core.RecordRequestEmailChangeRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordRequestOTPRequest(handler: (e: core.RecordCreateOTPRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordRequestPasswordResetRequest(handler: (e: core.RecordRequestPasswordResetRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordRequestVerificationRequest(handler: (e: core.RecordRequestVerificationRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordUpdate(handler: (e: core.RecordEvent) => void, ...tags: string[]): void
                    declare function onRecordUpdateExecute(handler: (e: core.RecordEvent) => void, ...tags: string[]): void
                    declare function onRecordUpdateRequest(handler: (e: core.RecordRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordValidate(handler: (e: core.RecordEvent) => void, ...tags: string[]): void
                    declare function onRecordViewRequest(handler: (e: core.RecordRequestEvent) => void, ...tags: string[]): void
                    declare function onRecordsListRequest(handler: (e: core.RecordsListRequestEvent) => void, ...tags: string[]): void
                    declare function onSettingsListRequest(handler: (e: core.SettingsListRequestEvent) => void): void
                    declare function onSettingsReload(handler: (e: core.SettingsReloadEvent) => void): void
                    declare function onSettingsUpdateRequest(handler: (e: core.SettingsUpdateRequestEvent) => void): void
                    declare function onTerminate(handler: (e: core.TerminateEvent) => void): void
type _TygojaDict = { [key:string | number | symbol]: any; }
type _TygojaAny = any

 
                                                                           
                                                                         
                                                                                
                                                                      
                                                                              
                                                                      
                                                            
   
                                                                           
                                                                                  
   
                                                                   
   
      
                                                       
                   
                   
     
      
   
                                                                     
   
      
                                           
      
   
                                                                   
                                                                      
   
      
                             
                                 
                   
                   
     
                                                          
      
   
                
   
                                                                      
                                                            
                                                                   
                                                                     
                      
 
namespace os {
 interface readdirMode extends Number{}
 interface File {
   
                                                                         
                                                                       
                                                                                 
                       
     
                                                                              
                                                                   
                                                                      
     
                                                                      
                                                                 
                                                                     
                                                               
                                                                  
                         
     
                                                                         
   
  readdir(n: number): Array<FileInfo>
 }
 interface File {
   
                                                                          
                                                                    
                                                                     
                   
     
                                                                     
                                                                        
                                                                      
     
                                                                        
                                                                      
                                                                     
                                                               
                                                                        
                     
   
  readdirnames(n: number): Array<string>
 }
  
                                                
                                                              
  
 interface DirEntry extends fs.DirEntry{}
 interface File {
   
                                                                           
                                                                 
                                                                                          
     
                                                          
                                                                                             
                                                      
     
                                                                                    
                                                           
   
  readDir(n: number): Array<DirEntry>
 }
 interface readDir {
   
                                       
                                                            
                                              
                                                                      
                          
   
  (name: string): Array<DirEntry>
 }
 interface copyFS {
   
                                                               
                               
     
                                                                   
                                                                 
                    
     
                                                                     
                                                                   
                                                        
     
                                        
     
                                                                         
                                                             
     
                                                              
   
  (dir: string, fsys: fs.FS): void
 }
  
                                                           
  
 interface dirInfo {
 }
 interface expand {
   
                                                                                
                                                                                 
   
  (s: string, mapping: (_arg0: string) => string): string
 }
 interface expandEnv {
   
                                                                            
                                                                  
                                                
   
  (s: string): string
 }
 interface getenv {
   
                                                                             
                                                                              
                                                                               
   
  (key: string): string
 }
 interface lookupEnv {
   
                                                                    
                                                                  
                                                                    
                                                                    
              
   
  (key: string): [string, boolean]
 }
 interface setenv {
   
                                                                        
                                 
   
  (key: string, value: string): void
 }
 interface unsetenv {
   
                                                   
   
  (key: string): void
 }
 interface clearenv {
   
                                                
   
  (): void
 }
 interface environ {
   
                                                                    
                             
   
  (): Array<string>
 }
 interface timeout {
  [key:string]: any;
  timeout(): boolean
 }
  
                                                                              
  
 interface PathError extends fs.PathError{}
  
                                                              
  
 interface SyscallError {
  syscall: string
  err: Error
 }
 interface SyscallError {
  error(): string
 }
 interface SyscallError {
  unwrap(): void
 }
 interface SyscallError {
   
                                                             
   
  timeout(): boolean
 }
 interface newSyscallError {
   
                                                               
                                                       
                                                                  
   
  (syscall: string, err: Error): void
 }
 interface isExist {
   
                                                                                 
                                                                              
                                 
     
                                                                            
                                                                     
   
  (err: Error): boolean
 }
 interface isNotExist {
   
                                                                             
                                                                       
                                                  
     
                                                                            
                                                                        
   
  (err: Error): boolean
 }
 interface isPermission {
   
                                                                               
                                                                                 
                            
     
                                                                            
                                                                          
   
  (err: Error): boolean
 }
 interface isTimeout {
   
                                                                         
                                       
     
                                                                     
                                                                      
                                                                            
                                                                       
                                                           
   
  (err: Error): boolean
 }
 interface syscallErrorType extends syscall.Errno{}
  
                                                      
  
 interface processStatus extends Number{}
  
                                                                             
  
 interface Process {
  pid: number
 }
  
                                                                
                                                           
                                
                                                   
                                                           
  
 interface processHandle {
 }
  
                                                                       
                            
  
 interface ProcAttr {
   
                                                                     
                          
   
  dir: string
   
                                                                  
                                                 
                                                      
   
  env: Array<string>
   
                                                                     
                                                                           
                                                                      
                                                                          
                                                       
                                                                
                                                                     
                                                          
   
  files: Array<(File | undefined)>
   
                                                           
                                                         
                                                     
                       
   
  sys?: syscall.SysProcAttr
 }
  
                                                   
                                                                      
                                 
  
 interface Signal {
  [key:string]: any;
  string(): string
  signal(): void 
 }
 interface getpid {
   
                                                 
   
  (): number
 }
 interface getppid {
   
                                                           
   
  (): number
 }
 interface findProcess {
   
                                                        
     
                                                               
                                                   
     
                                                                       
                                                                                 
                                                                                 
              
   
  (pid: number): (Process)
 }
 interface startProcess {
   
                                                                                 
                                                                                  
                                                              
     
                                                                    
                                                                      
                                                                     
                                                    
     
                                                                          
                             
     
                                                           
   
  (name: string, argv: Array<string>, attr: ProcAttr): (Process)
 }
 interface Process {
   
                                                                    
                                         
                                                              
   
  release(): void
 }
 interface Process {
   
                                                                            
                                                                         
                                                 
   
  kill(): void
 }
 interface Process {
   
                                                             
                                                             
                                                             
                                                           
                                                         
   
  wait(): (ProcessState)
 }
 interface Process {
   
                                            
                                                       
   
  signal(sig: Signal): void
 }
 interface ProcessState {
   
                                                                               
   
  userTime(): time.Duration
 }
 interface ProcessState {
   
                                                                                   
   
  systemTime(): time.Duration
 }
 interface ProcessState {
   
                                                   
                                                                                 
                                                         
   
  exited(): boolean
 }
 interface ProcessState {
   
                                                             
                                        
   
  success(): boolean
 }
 interface ProcessState {
   
                                                        
                                                          
                                                                        
   
  sys(): any
 }
 interface ProcessState {
   
                                                                       
                                                                 
                                                                     
                                                                      
                               
   
  sysUsage(): any
 }
  
                                                                         
  
 interface ProcessState {
 }
 interface ProcessState {
   
                                                      
   
  pid(): number
 }
 interface ProcessState {
  string(): string
 }
 interface ProcessState {
   
                                                                
                                                                
   
  exitCode(): number
 }
 interface executable {
   
                                                                     
                                                                      
                                                                       
                                                                     
                                                                    
                                                     
     
                                                                  
     
                                                                  
                
   
  (): string
 }
 interface File {
   
                                                            
     
                                           
   
  name(): string
 }
  
                                                                 
                                             
  
 interface LinkError {
  op: string
  old: string
  new: string
  err: Error
 }
 interface LinkError {
  error(): string
 }
 interface LinkError {
  unwrap(): void
 }
 interface newFile {
   
                                                                          
                                                                         
     
                                                  
     
        
                                                                                                
                                                                                                  
                                                                                                        
                                                                        
                                                                                     
        
     
                                                                                                         
     
                                                                                           
                                                                  
   
  (fd: number, name: string): (File)
 }
 interface File {
   
                                                                      
                                                                   
                                            
   
  read(b: string|Array<number>): number
 }
 interface File {
   
                                                                         
                                                               
                                                           
                                          
   
  readAt(b: string|Array<number>, off: number): number
 }
 interface File {
   
                                       
   
  readFrom(r: io.Reader): number
 }
  
                                                        
                                                
  
 interface noReadFrom {
 }
 interface noReadFrom {
   
                                            
                               
   
  readFrom(_arg0: io.Reader): number
 }
  
                                                                 
                                                                  
                                                    
  
 type _sxHrDbQ = noReadFrom&File
 interface fileWithoutReadFrom extends _sxHrDbQ {
 }
 interface File {
   
                                                  
                                                                 
                                                    
   
  write(b: string|Array<number>): number
 }
 interface File {
   
                                                                         
                                                                 
                                                      
     
                                                                           
   
  writeAt(b: string|Array<number>, off: number): number
 }
 interface File {
   
                                    
   
  writeTo(w: io.Writer): number
 }
  
                                                       
                                               
  
 interface noWriteTo {
 }
 interface noWriteTo {
   
                                          
                               
   
  writeTo(_arg0: io.Writer): number
 }
  
                                                                
                                                                
                                                   
  
 type _sQzDHAE = noWriteTo&File
 interface fileWithoutWriteTo extends _sQzDHAE {
 }
 interface File {
   
                                                                                   
                                                                             
                                                                     
                                                    
                                                                            
   
  seek(offset: number, whence: number): number
 }
 interface File {
   
                                                                               
                      
   
  writeString(s: string): number
 }
 interface mkdir {
   
                                                                         
                         
                                                           
   
  (name: string, perm: FileMode): void
 }
 interface chdir {
   
                                                                        
                                                           
   
  (dir: string): void
 }
 interface open {
   
                                                                     
                                                                   
                                    
                                                           
   
  (name: string): (File)
 }
 interface create {
   
                                                                            
                                                                               
                                                                    
                                                                       
                                                          
                                                           
   
  (name: string): (File)
 }
 interface openFile {
   
                                                                    
                                                                   
                                                                           
                                                            
                                                        
                                                      
                                                           
   
  (name: string, flag: number, perm: FileMode): (File)
 }
 interface rename {
   
                                               
                                                                          
                                                                           
                                                                                              
                                                                                             
                                                         
   
  (oldpath: string, newpath: string): void
 }
 interface readlink {
   
                                                                 
                                                           
     
                                                                            
                                             
   
  (name: string): string
 }
 interface tempDir {
   
                                                                      
     
                                                                 
                                                                   
                                                                       
                                
     
                                                                     
                 
   
  (): string
 }
 interface userCacheDir {
   
                                                                             
                                                                                 
                                  
     
                                                                
                                                                                    
                                  
                                                
                                           
                                           
     
                                                                                
                                                                           
   
  (): string
 }
 interface userConfigDir {
   
                                                                              
                                                                           
                                               
     
                                                                 
                                                                                    
                                   
                                                             
                                      
                                     
     
                                                                                
                                                                            
   
  (): string
 }
 interface userHomeDir {
   
                                                           
     
                                                                         
                                          
                                                          
     
                                                                        
                                                                         
   
  (): string
 }
 interface chmod {
   
                                                      
                                                                              
                                                           
     
                                                                   
                      
     
                                                                         
                           
     
                                                                        
                                                                       
                                                                        
                                                                     
                                                 
     
                                                                          
                                  
   
  (name: string, mode: FileMode): void
 }
 interface File {
   
                                                
                                                           
   
  chmod(mode: FileMode): void
 }
 interface File {
   
                                                              
                                                                           
     
                                                                              
                                                                       
                                                                           
     
                                                                           
                                                                              
                                                                   
                                                                        
                                         
     
                                                                        
                                                                 
                                                                     
                                                                      
                                                                           
                                                                             
     
                                                               
                                                       
     
                                                               
   
  setDeadline(t: time.Time): void
 }
 interface File {
   
                                                                    
                                 
                                                     
                                                              
   
  setReadDeadline(t: time.Time): void
 }
 interface File {
   
                                                                          
                                  
                                                                  
                                               
                                                      
                                                              
   
  setWriteDeadline(t: time.Time): void
 }
 interface File {
   
                                    
                                                
   
  syscallConn(): syscall.RawConn
 }
 interface File {
   
                                                                               
                                                    
                                                                     
                                                                               
                              
     
                                                                   
                                                 
     
                                             
     
        
                                                                           
                                                                       
                                                                      
                                
        
     
                                                   
   
  fd(): number
 }
 interface dirFS {
   
                                                                                              
     
                                                                                   
                                                                                     
                                                                                            
                                                                                    
                                                                                    
                                                                                      
                                                                                       
                                
     
                                                                                            
     
                                      
     
                                                                                     
                        
   
  (dir: string): fs.FS
 }
 interface dirFS extends String{}
 interface dirFS {
  open(name: string): fs.File
 }
 interface dirFS {
   
                                                                   
                                                                
                                                              
                                                              
   
  readFile(name: string): string|Array<number>
 }
 interface dirFS {
   
                                                                                  
                                                                          
   
  readDir(name: string): Array<DirEntry>
 }
 interface dirFS {
  stat(name: string): fs.FileInfo
 }
 interface dirFS {
  lstat(name: string): fs.FileInfo
 }
 interface dirFS {
  readLink(name: string): string
 }
 interface readFile {
   
                                                            
                                                          
                                                                              
                                
   
  (name: string): string|Array<number>
 }
 interface writeFile {
   
                                                                       
                                                                                           
                                                                                   
                                                                                        
                                                     
   
  (name: string, data: string|Array<number>, perm: FileMode): void
 }
 interface File {
   
                                                            
                                                                              
                                                                  
                                                              
   
  close(): void
 }
 interface chown {
   
                                                             
                                                                                     
                                                       
                                                           
     
                                                                         
                                                     
   
  (name: string, uid: number, gid: number): void
 }
 interface lchown {
   
                                                              
                                                                                   
                                                           
     
                                                                        
                     
   
  (name: string, uid: number, gid: number): void
 }
 interface File {
   
                                                             
                                                           
     
                                                                        
                     
   
  chown(uid: number, gid: number): void
 }
 interface File {
   
                                           
                                       
                                                           
   
  truncate(size: number): void
 }
 interface File {
   
                                                                     
                                                                    
                                      
   
  sync(): void
 }
 interface chtimes {
   
                                                                   
                                                             
                                                                               
     
                                                                    
                            
                                                           
   
  (name: string, atime: time.Time, mtime: time.Time): void
 }
 interface File {
   
                                                             
                               
                                                           
   
  chdir(): void
 }
  
                                             
                                                                
                                                            
                                       
  
 interface file {
 }
  
                                                      
  
 interface newFileKind extends Number{}
 interface truncate {
   
                                                 
                                                                              
                                                           
   
  (name: string, size: number): void
 }
 interface remove {
   
                                                        
                                                           
   
  (name: string): void
 }
 interface link {
   
                                                             
                                                         
   
  (oldname: string, newname: string): void
 }
 interface symlink {
   
                                                           
                                                                            
                                                                          
                                                         
   
  (oldname: string, newname: string): void
 }
 interface unixDirent {
 }
 interface unixDirent {
  name(): string
 }
 interface unixDirent {
  isDir(): boolean
 }
 interface unixDirent {
  type(): FileMode
 }
 interface unixDirent {
  info(): FileInfo
 }
 interface unixDirent {
  string(): string
 }
 interface getwd {
   
                                                             
                                                       
                                                        
                                      
     
                                                       
                                                       
                                       
   
  (): string
 }
 interface mkdirAll {
   
                                             
                                                       
                              
                                                             
                                       
                                                          
                     
   
  (path: string, perm: FileMode): void
 }
 interface removeAll {
   
                                                         
                                                             
                                                         
                            
                                                           
   
  (path: string): void
 }
 interface isPathSeparator {
   
                                                                          
   
  (c: number): boolean
 }
 interface pipe {
   
                                                                                    
                                               
   
  (): [(File), (File)]
 }
 interface getuid {
   
                                                      
     
                               
   
  (): number
 }
 interface geteuid {
   
                                                                 
     
                               
   
  (): number
 }
 interface getgid {
   
                                                       
     
                               
   
  (): number
 }
 interface getegid {
   
                                                                  
     
                               
   
  (): number
 }
 interface getgroups {
   
                                                                                      
     
                                                                         
                                
   
  (): Array<number>
 }
 interface exit {
   
                                                                        
                                                                    
                                                                        
     
                                                                      
   
  (code: number): void
 }
  
                                       
  
 interface rawConn {
 }
 interface rawConn {
  control(f: (_arg0: number) => void): void
 }
 interface rawConn {
  read(f: (_arg0: number) => boolean): void
 }
 interface rawConn {
  write(f: (_arg0: number) => boolean): void
 }
 interface openInRoot {
   
                                                         
                                                                                
     
                                                             
                                          
     
                                            
   
  (dir: string, name: string): (File)
 }
  
                                                                         
    
                                                                                   
                                                                                    
                                                  
                                                      
    
                                                                          
                                          
                                        
    
                                                                       
                                                                           
    
                                                                                
    
                                                                                    
                                                                                    
                                  
    
                                              
    
       
                                                                                     
                             
                                                                                                   
                                                                                  
                                                                                      
                                    
                                                                              
                                                                                 
                        
                                                                                   
                                                                                      
                                                                   
       
  
 interface Root {
 }
 interface openRoot {
   
                                        
                                                     
                                                           
   
  (name: string): (Root)
 }
 interface Root {
   
                                                                  
     
                                           
   
  name(): string
 }
 interface Root {
   
                           
                                                          
   
  close(): void
 }
 interface Root {
   
                                                       
                                 
   
  open(name: string): (File)
 }
 interface Root {
   
                                                            
                                   
   
  create(name: string): (File)
 }
 interface Root {
   
                                               
                                     
     
                                                                              
                               
   
  openFile(name: string, flag: number, perm: FileMode): (File)
 }
 interface Root {
   
                                                    
                                                           
   
  openRoot(name: string): (Root)
 }
 interface Root {
   
                                                                  
                                  
   
  chmod(name: string, mode: FileMode): void
 }
 interface Root {
   
                                              
                                                                
                                  
     
                                                                              
                            
   
  mkdir(name: string, perm: FileMode): void
 }
 interface Root {
   
                                                                                    
                                     
     
                                                                              
                               
   
  mkdirAll(name: string, perm: FileMode): void
 }
 interface Root {
   
                                                                         
                                  
   
  chown(name: string, uid: number, gid: number): void
 }
 interface Root {
   
                                                                          
                                   
   
  lchown(name: string, uid: number, gid: number): void
 }
 interface Root {
   
                                                                                     
                                    
   
  chtimes(name: string, atime: time.Time, mtime: time.Time): void
 }
 interface Root {
   
                                                                    
                                   
   
  remove(name: string): void
 }
 interface Root {
   
                                                                                     
                                      
   
  removeAll(name: string): void
 }
 interface Root {
   
                                                                     
                                 
   
  stat(name: string): FileInfo
 }
 interface Root {
   
                                                                      
                                                          
                                 
                                  
   
  lstat(name: string): FileInfo
 }
 interface Root {
   
                                                                             
                                     
   
  readlink(name: string): string
 }
 interface Root {
   
                                               
                                         
                                   
   
  rename(oldname: string, newname: string): void
 }
 interface Root {
   
                                                             
                                         
                                 
     
                                                                                        
                                                                    
     
                                                                       
   
  link(oldname: string, newname: string): void
 }
 interface Root {
   
                                                           
                                    
     
                                       
                                                     
     
                                                                  
                                                                   
   
  symlink(oldname: string, newname: string): void
 }
 interface Root {
   
                                                                        
                                     
   
  readFile(name: string): string|Array<number>
 }
 interface Root {
   
                                                                                   
                                      
   
  writeFile(name: string, data: string|Array<number>, perm: FileMode): void
 }
 interface Root {
   
                                                                           
     
                                                              
                                               
   
  fs(): fs.FS
 }
 interface rootFS extends Root{}
 interface rootFS {
  open(name: string): fs.File
 }
 interface rootFS {
  readDir(name: string): Array<DirEntry>
 }
 interface rootFS {
  readFile(name: string): string|Array<number>
 }
 interface rootFS {
  readLink(name: string): string
 }
 interface rootFS {
  stat(name: string): FileInfo
 }
 interface rootFS {
  lstat(name: string): FileInfo
 }
  
                                                                    
                            
  
 interface root {
 }
 interface root {
  close(): void
 }
 interface root {
  name(): string
 }
  
                                                                           
                                   
  
 interface errSymlink extends String{}
 interface errSymlink {
  error(): string
 }
  
                                                 
                                             
                                                       
  
 interface sysfdType extends Number{}
 interface stat {
   
                                                         
                                                           
   
  (name: string): FileInfo
 }
 interface lstat {
   
                                                          
                                                          
                                                                            
                                                           
     
                                                                               
                                                                           
                                                                              
   
  (name: string): FileInfo
 }
 interface File {
   
                                                           
                                                           
   
  stat(): FileInfo
 }
 interface hostname {
   
                                                           
   
  (): string
 }
 interface createTemp {
   
                                                                  
                                                                            
                                                                                       
                                                                        
                                                        
                                                                                                                     
                                                                                                     
                                                                                
                                                                                      
   
  (dir: string, pattern: string): (File)
 }
 interface mkdirTemp {
   
                                                                     
                                                   
                                                                                           
                                                                                
                                                             
                                                                                                                  
                                                                                                         
                                                                                           
   
  (dir: string, pattern: string): string
 }
 interface getpagesize {
   
                                                                  
   
  (): number
 }
  
                                            
    
                                                    
  
 type _sKSuTlM = file
 interface File extends _sKSuTlM {
 }
  
                                                                      
  
 interface FileInfo extends fs.FileInfo{}
  
                                                            
                                                             
                                                        
                                                           
                                                       
  
 interface FileMode extends fs.FileMode{}
 interface fileStat {
  name(): string
 }
 interface fileStat {
  isDir(): boolean
 }
 interface sameFile {
   
                                                                 
                                                                     
                                                                     
                                                 
                                                                        
                                     
   
  (fi1: FileInfo, fi2: FileInfo): boolean
 }
  
                                                                            
  
 interface fileStat {
 }
 interface fileStat {
  size(): number
 }
 interface fileStat {
  mode(): FileMode
 }
 interface fileStat {
  modTime(): time.Time
 }
 interface fileStat {
  sys(): any
 }
}

 
                                                                               
                                                                           
   
                                                                   
                                                                   
                                                              
                                  
 
namespace filepath {
 interface match {
   
                                                                    
                           
     
        
              
               
           
                                                                   
                                                             
                                          
                                                      
                                                                 
                                      
     
                      
                                                            
                                      
                                                        
        
     
                                                                       
                                                                      
                  
     
                                                                  
                    
   
  (pattern: string, name: string): boolean
 }
 interface glob {
   
                                                                
                                                                     
                                                                       
                                                      
     
                                                                            
                                                                      
                  
   
  (pattern: string): Array<string>
 }
 interface clean {
   
                                                            
                                                                 
                                                         
     
                                                                 
                                                                    
                                                                         
        
                                                        
        
                                                        
        
                                                                  
                                   
        
     
                                                                              
                                             
     
                                                                 
     
                                                            
                            
     
                                                                            
                                 
                                                                      
     
                                                        
                            
                                        
   
  (path: string): string
 }
 interface isLocal {
   
                                                                                            
     
        
                                                                                 
                                
                     
                                                         
        
     
                                        
                                                                          
                                                                                 
     
                                           
                                                                            
                                      
   
  (path: string): boolean
 }
 interface localize {
   
                                                                            
                                                                          
     
                                                                                         
                                                                                
                                                
     
                                                                                
   
  (path: string): string
 }
 interface toSlash {
   
                                                                     
                                                                  
                                  
   
  (path: string): string
 }
 interface fromSlash {
   
                                                                         
                                                                      
                            
     
                                                                          
                                                              
   
  (path: string): string
 }
 interface splitList {
   
                                                                                
                                                           
                                                                                
            
   
  (path: string): Array<string>
 }
 interface split {
   
                                                                   
                                                            
                                                                 
                          
                                                                
   
  (path: string): [string, string]
 }
 interface join {
   
                                                               
                                                                    
                                                                 
                                                              
                     
                                                                
                                     
   
  (...elem: string[]): string
 }
 interface ext {
   
                                                      
                                                           
                                                          
            
   
  (path: string): string
 }
 interface evalSymlinks {
   
                                                                            
           
                                                                              
                                                               
                                              
   
  (path: string): string
 }
 interface isAbs {
   
                                                
   
  (path: string): boolean
 }
 interface abs {
   
                                                    
                                                                   
                                                                     
                                                               
                                     
   
  (path: string): string
 }
 interface rel {
   
                                                                              
                                                               
                                                                                
                                                                       
                                                     
                                                                              
                                                                            
                                     
   
  (basepath: string, targpath: string): string
 }
  
                                                                       
                      
    
                                                                
                                                                        
                                                                      
                     
    
                                                                    
                                                                       
                                                                        
                                                      
    
                                                            
    
                                                                          
                                                                       
                                                                     
                                                                           
                                                                              
                                                                        
    
                                                                          
                                                                     
                                                                     
                                               
    
                                                                     
    
                                                                          
                                                                    
                                                                       
                  
    
                                                                      
                                                                   
                                                                         
                 
  
 interface WalkFunc {(path: string, info: fs.FileInfo, err: Error): void }
 interface walkDir {
   
                                                                            
                                           
     
                                                                             
                                                        
     
                                                                                
                                                                                   
                            
     
                                            
     
                                                                             
                                                                           
                                
   
  (root: string, fn: fs.WalkDirFunc): void
 }
 interface walk {
   
                                                                         
                                           
     
                                                                             
                                                  
     
                                                                                
                                                                                
                            
     
                                         
     
                                                                  
                                                                      
   
  (root: string, fn: WalkFunc): void
 }
 interface base {
   
                                           
                                                                             
                                            
                                                                                  
   
  (path: string): string
 }
 interface dir {
   
                                                                                  
                                                                                 
                         
                                           
                                                                                 
                                                                                   
   
  (path: string): string
 }
 interface volumeName {
   
                                            
                                                   
                                                        
                                      
   
  (path: string): string
 }
 interface hasPrefix {
   
                                                                          
     
                                                               
                                        
   
  (p: string, prefix: string): boolean
 }
}

 
                                                                           
                                                                         
               
   
                                                                   
                                                                     
                                                                
                                                                   
                                                                   
                                                                      
                                                                       
                                                               
   
                                                               
                                                                        
                                 
   
                                         
   
                                                            
                                                               
                                            
                                                          
                                                               
                                             
                                                          
                                                              
   
                                                                                           
                                                                              
                                                                        
                                                                              
                                                                     
                                                                             
   
                                                    
   
      
                                      
                   
                   
     
             
      
   
      
   
      
                               
                                     
                   
     
      
   
                                                    
                                                
   
                                                                     
                                                      
   
                                                                    
                                                           
   
      
                                      
                                    
              
     
                   
                   
     
             
      
   
      
   
      
                               
                                        
                  
     
                                     
                   
     
      
   
                                                        
                                                                                
                                                                      
                                                               
   
                                                             
                                     
                                                              
 
namespace exec {
 interface command {
   
                                                                       
                         
     
                                                              
     
                                                                    
                                                                        
                      
     
                                                                       
                                                                   
                                                                
                                                            
     
                                                                            
                                                                              
                                                                     
                                                                              
                                                                                
                                                                         
                                                                               
                        
   
  (name: string, ...arg: string[]): (Cmd)
 }
}

 
                                                                                                             
 
namespace dbx {
  
                                                                  
                                                                                                
                                                                                               
  
 interface Builder {
  [key:string]: any;
   
                                                                      
                                                                                                  
                                             
   
  newQuery(_arg0: string): (Query)
   
                                                                                          
                                                                                  
                                                                                                 
   
  select(..._arg0: string[]): (SelectQuery)
   
                                                                                                                  
                                                                                                                         
   
  model(_arg0: {
  }): (ModelQuery)
   
                                                                                                  
   
  generatePlaceholder(_arg0: number): string
   
                                                                                           
   
  quote(_arg0: string): string
   
                                                     
                                                            
   
  quoteSimpleTableName(_arg0: string): string
   
                                                       
                                                            
   
  quoteSimpleColumnName(_arg0: string): string
   
                                                                      
   
  queryBuilder(): QueryBuilder
   
                                                                    
                                                                                                 
                           
   
  insert(table: string, cols: Params): (Query)
   
                                                                    
                                                                                         
                                                          
                                                                                                 
                           
   
  upsert(table: string, cols: Params, ...constraints: string[]): (Query)
   
                                                                    
                                                                                                     
                                                                                                 
                                                                                      
   
  update(table: string, cols: Params, where: Expression): (Query)
   
                                                                   
                                                                                         
                                                                                      
   
  delete(table: string, where: Expression): (Query)
   
                                                                              
                                                                                                        
                                                                                       
   
  createTable(table: string, cols: _TygojaDict, ...options: string[]): (Query)
   
                                                                    
   
  renameTable(oldName: string, newName: string): (Query)
   
                                                                
   
  dropTable(table: string): (Query)
   
                                                                        
   
  truncateTable(table: string): (Query)
   
                                                                           
   
  addColumn(table: string, col: string, typ: string): (Query)
   
                                                                               
   
  dropColumn(table: string, col: string): (Query)
   
                                                                                 
   
  renameColumn(table: string, oldName: string, newName: string): (Query)
   
                                                                                             
   
  alterColumn(table: string, col: string, typ: string): (Query)
   
                                                                                          
                                                                           
   
  addPrimaryKey(table: string, name: string, ...cols: string[]): (Query)
   
                                                                                                             
   
  dropPrimaryKey(table: string, name: string): (Query)
   
                                                                                               
                                                                                                          
                                                                                                 
                                                 
   
  addForeignKey(table: string, name: string, cols: Array<string>, refCols: Array<string>, refTable: string, ...options: string[]): (Query)
   
                                                                                                             
   
  dropForeignKey(table: string, name: string): (Query)
   
                                                                                 
   
  createIndex(table: string, name: string, ...cols: string[]): (Query)
   
                                                                                             
   
  createUniqueIndex(table: string, name: string, ...cols: string[]): (Query)
   
                                                                                       
   
  dropIndex(table: string, name: string): (Query)
 }
  
                                                                         
  
 interface BaseBuilder {
 }
 interface newBaseBuilder {
   
                                                       
   
  (db: DB, executor: Executor): (BaseBuilder)
 }
 interface BaseBuilder {
   
                                                                     
   
  db(): (DB)
 }
 interface BaseBuilder {
   
                                                                                                        
   
  executor(): Executor
 }
 interface BaseBuilder {
   
                                                                      
                                                                                                  
                                             
   
  newQuery(sql: string): (Query)
 }
 interface BaseBuilder {
   
                                                                                                  
   
  generatePlaceholder(_arg0: number): string
 }
 interface BaseBuilder {
   
                                                                                           
   
  quote(s: string): string
 }
 interface BaseBuilder {
   
                                                     
                                                            
   
  quoteSimpleTableName(s: string): string
 }
 interface BaseBuilder {
   
                                                       
                                                            
   
  quoteSimpleColumnName(s: string): string
 }
 interface BaseBuilder {
   
                                                                    
                                                                                                 
                           
   
  insert(table: string, cols: Params): (Query)
 }
 interface BaseBuilder {
   
                                                                    
                                                                                         
                                                          
                                                                                                 
                           
   
  upsert(table: string, cols: Params, ...constraints: string[]): (Query)
 }
 interface BaseBuilder {
   
                                                                    
                                                                                                     
                                                                                                 
                                                                                      
   
  update(table: string, cols: Params, where: Expression): (Query)
 }
 interface BaseBuilder {
   
                                                                   
                                                                                         
                                                                                      
   
  delete(table: string, where: Expression): (Query)
 }
 interface BaseBuilder {
   
                                                                              
                                                                                                        
                                                                                       
   
  createTable(table: string, cols: _TygojaDict, ...options: string[]): (Query)
 }
 interface BaseBuilder {
   
                                                                    
   
  renameTable(oldName: string, newName: string): (Query)
 }
 interface BaseBuilder {
   
                                                                
   
  dropTable(table: string): (Query)
 }
 interface BaseBuilder {
   
                                                                        
   
  truncateTable(table: string): (Query)
 }
 interface BaseBuilder {
   
                                                                           
   
  addColumn(table: string, col: string, typ: string): (Query)
 }
 interface BaseBuilder {
   
                                                                               
   
  dropColumn(table: string, col: string): (Query)
 }
 interface BaseBuilder {
   
                                                                                 
   
  renameColumn(table: string, oldName: string, newName: string): (Query)
 }
 interface BaseBuilder {
   
                                                                                             
   
  alterColumn(table: string, col: string, typ: string): (Query)
 }
 interface BaseBuilder {
   
                                                                                          
                                                                           
   
  addPrimaryKey(table: string, name: string, ...cols: string[]): (Query)
 }
 interface BaseBuilder {
   
                                                                                                             
   
  dropPrimaryKey(table: string, name: string): (Query)
 }
 interface BaseBuilder {
   
                                                                                               
                                                                                                          
                                                                                                 
                                                 
   
  addForeignKey(table: string, name: string, cols: Array<string>, refCols: Array<string>, refTable: string, ...options: string[]): (Query)
 }
 interface BaseBuilder {
   
                                                                                                             
   
  dropForeignKey(table: string, name: string): (Query)
 }
 interface BaseBuilder {
   
                                                                                 
   
  createIndex(table: string, name: string, ...cols: string[]): (Query)
 }
 interface BaseBuilder {
   
                                                                                             
   
  createUniqueIndex(table: string, name: string, ...cols: string[]): (Query)
 }
 interface BaseBuilder {
   
                                                                                       
   
  dropIndex(table: string, name: string): (Query)
 }
  
                                                         
  
 type _slNMcLV = BaseBuilder
 interface MssqlBuilder extends _slNMcLV {
 }
  
                                                                    
  
 type _snndtWR = BaseQueryBuilder
 interface MssqlQueryBuilder extends _snndtWR {
 }
 interface newMssqlBuilder {
   
                                                         
   
  (db: DB, executor: Executor): Builder
 }
 interface MssqlBuilder {
   
                                                                      
   
  queryBuilder(): QueryBuilder
 }
 interface MssqlBuilder {
   
                                                                                          
                                                                                  
                                                                                                 
   
  select(...cols: string[]): (SelectQuery)
 }
 interface MssqlBuilder {
   
                                                                                                 
                                                                           
   
  model(model: {
   }): (ModelQuery)
 }
 interface MssqlBuilder {
   
                                                     
                                                            
   
  quoteSimpleTableName(s: string): string
 }
 interface MssqlBuilder {
   
                                                       
                                                            
   
  quoteSimpleColumnName(s: string): string
 }
 interface MssqlBuilder {
   
                                                                    
   
  renameTable(oldName: string, newName: string): (Query)
 }
 interface MssqlBuilder {
   
                                                                                 
   
  renameColumn(table: string, oldName: string, newName: string): (Query)
 }
 interface MssqlBuilder {
   
                                                                                             
   
  alterColumn(table: string, col: string, typ: string): (Query)
 }
 interface MssqlQueryBuilder {
   
                                                                   
   
  buildOrderByAndLimit(sql: string, cols: Array<string>, limit: number, offset: number): string
 }
  
                                                    
  
 type _sXkXwYY = BaseBuilder
 interface MysqlBuilder extends _sXkXwYY {
 }
 interface newMysqlBuilder {
   
                                                         
   
  (db: DB, executor: Executor): Builder
 }
 interface MysqlBuilder {
   
                                                                      
   
  queryBuilder(): QueryBuilder
 }
 interface MysqlBuilder {
   
                                                                                          
                                                                                  
                                                                                                 
   
  select(...cols: string[]): (SelectQuery)
 }
 interface MysqlBuilder {
   
                                                                                                 
                                                                           
   
  model(model: {
   }): (ModelQuery)
 }
 interface MysqlBuilder {
   
                                                     
                                                            
   
  quoteSimpleTableName(s: string): string
 }
 interface MysqlBuilder {
   
                                                       
                                                            
   
  quoteSimpleColumnName(s: string): string
 }
 interface MysqlBuilder {
   
                                                                    
                                                                                         
                                                          
                                                                                                 
                           
   
  upsert(table: string, cols: Params, ...constraints: string[]): (Query)
 }
 interface MysqlBuilder {
   
                                                                                 
   
  renameColumn(table: string, oldName: string, newName: string): (Query)
 }
 interface MysqlBuilder {
   
                                                                                                             
   
  dropPrimaryKey(table: string, name: string): (Query)
 }
 interface MysqlBuilder {
   
                                                                                                             
   
  dropForeignKey(table: string, name: string): (Query)
 }
  
                                                   
  
 type _swHBWoc = BaseBuilder
 interface OciBuilder extends _swHBWoc {
 }
  
                                                              
  
 type _swXAlJO = BaseQueryBuilder
 interface OciQueryBuilder extends _swXAlJO {
 }
 interface newOciBuilder {
   
                                                     
   
  (db: DB, executor: Executor): Builder
 }
 interface OciBuilder {
   
                                                                                          
                                                                                  
                                                                                                 
   
  select(...cols: string[]): (SelectQuery)
 }
 interface OciBuilder {
   
                                                                                                 
                                                                           
   
  model(model: {
   }): (ModelQuery)
 }
 interface OciBuilder {
   
                                                                                                  
   
  generatePlaceholder(i: number): string
 }
 interface OciBuilder {
   
                                                                      
   
  queryBuilder(): QueryBuilder
 }
 interface OciBuilder {
   
                                                                                       
   
  dropIndex(table: string, name: string): (Query)
 }
 interface OciBuilder {
   
                                                                    
   
  renameTable(oldName: string, newName: string): (Query)
 }
 interface OciBuilder {
   
                                                                                             
   
  alterColumn(table: string, col: string, typ: string): (Query)
 }
 interface OciQueryBuilder {
   
                                                                   
   
  buildOrderByAndLimit(sql: string, cols: Array<string>, limit: number, offset: number): string
 }
  
                                                         
  
 type _sWhdeui = BaseBuilder
 interface PgsqlBuilder extends _sWhdeui {
 }
 interface newPgsqlBuilder {
   
                                                         
   
  (db: DB, executor: Executor): Builder
 }
 interface PgsqlBuilder {
   
                                                                                          
                                                                                  
                                                                                                 
   
  select(...cols: string[]): (SelectQuery)
 }
 interface PgsqlBuilder {
   
                                                                                                 
                                                                           
   
  model(model: {
   }): (ModelQuery)
 }
 interface PgsqlBuilder {
   
                                                                                                  
   
  generatePlaceholder(i: number): string
 }
 interface PgsqlBuilder {
   
                                                                      
   
  queryBuilder(): QueryBuilder
 }
 interface PgsqlBuilder {
   
                                                                    
                                                                                         
                                                          
                                                                                                 
                           
   
  upsert(table: string, cols: Params, ...constraints: string[]): (Query)
 }
 interface PgsqlBuilder {
   
                                                                                       
   
  dropIndex(table: string, name: string): (Query)
 }
 interface PgsqlBuilder {
   
                                                                    
   
  renameTable(oldName: string, newName: string): (Query)
 }
 interface PgsqlBuilder {
   
                                                                                             
   
  alterColumn(table: string, col: string, typ: string): (Query)
 }
  
                                                                 
  
 type _sRBJWzA = BaseQueryBuilder
 interface SqliteQueryBuilder extends _sRBJWzA {
 }
 interface SqliteQueryBuilder {
   
                                                                          
     
                                                                                         
   
  buildUnion(unions: Array<UnionInfo>, params: Params): string
 }
 interface SqliteQueryBuilder {
   
                                                                                 
     
                                                                                           
   
  combineUnion(sql: string, unionClause: string): string
 }
  
                                                      
  
 type _sUeIsZw = BaseBuilder
 interface SqliteBuilder extends _sUeIsZw {
 }
 interface newSqliteBuilder {
   
                                                           
   
  (db: DB, executor: Executor): Builder
 }
 interface SqliteBuilder {
   
                                                                      
   
  queryBuilder(): QueryBuilder
 }
 interface SqliteBuilder {
   
                                                                                          
                                                                                  
                                                                                                 
   
  select(...cols: string[]): (SelectQuery)
 }
 interface SqliteBuilder {
   
                                                                                                 
                                                                           
   
  model(model: {
   }): (ModelQuery)
 }
 interface SqliteBuilder {
   
                                                     
                                                            
   
  quoteSimpleTableName(s: string): string
 }
 interface SqliteBuilder {
   
                                                       
                                                            
   
  quoteSimpleColumnName(s: string): string
 }
 interface SqliteBuilder {
   
                                                                                       
   
  dropIndex(table: string, name: string): (Query)
 }
 interface SqliteBuilder {
   
                                                                        
   
  truncateTable(table: string): (Query)
 }
 interface SqliteBuilder {
   
                                                                    
   
  renameTable(oldName: string, newName: string): (Query)
 }
 interface SqliteBuilder {
   
                                                                                             
   
  alterColumn(table: string, col: string, typ: string): (Query)
 }
 interface SqliteBuilder {
   
                                                                                          
                                                                           
   
  addPrimaryKey(table: string, name: string, ...cols: string[]): (Query)
 }
 interface SqliteBuilder {
   
                                                                                                             
   
  dropPrimaryKey(table: string, name: string): (Query)
 }
 interface SqliteBuilder {
   
                                                                                               
                                                                                                          
                                                                                                 
                                                 
   
  addForeignKey(table: string, name: string, cols: Array<string>, refCols: Array<string>, refTable: string, ...options: string[]): (Query)
 }
 interface SqliteBuilder {
   
                                                                                                             
   
  dropForeignKey(table: string, name: string): (Query)
 }
  
                                                                            
  
 type _sBNpHMD = BaseBuilder
 interface StandardBuilder extends _sBNpHMD {
 }
 interface newStandardBuilder {
   
                                                               
   
  (db: DB, executor: Executor): Builder
 }
 interface StandardBuilder {
   
                                                                      
   
  queryBuilder(): QueryBuilder
 }
 interface StandardBuilder {
   
                                                                                          
                                                                                  
                                                                                                 
   
  select(...cols: string[]): (SelectQuery)
 }
 interface StandardBuilder {
   
                                                                                                 
                                                                           
   
  model(model: {
   }): (ModelQuery)
 }
  
                                                                 
                                                                       
                                                                              
                                                                                   
  
 interface LogFunc {(format: string, ...a: {
  }[]): void }
  
                                                       
                                                                                  
                                                                                
                                                                                   
                                                                         
  
 interface PerfFunc {(ns: number, sql: string, execute: boolean): void }
  
                                                                 
                                                                             
                                                   
  
 interface QueryLogFunc {(ctx: context.Context, t: time.Duration, sql: string, rows: sql.Rows, err: Error): void }
  
                                                                     
                                                                             
                                                              
  
 interface ExecLogFunc {(ctx: context.Context, t: time.Duration, sql: string, result: sql.Result, err: Error): void }
  
                                                                                    
  
 interface BuilderFunc {(_arg0: DB, _arg1: Executor): Builder }
  
                                                                                
                                                                             
  
 type _ssMAapP = Builder
 interface DB extends _ssMAapP {
   
                                                                                   
   
  fieldMapper: FieldMapFunc
   
                                                                       
   
  tableMapper: TableMapFunc
   
                                                                                         
   
  logFunc: LogFunc
   
                                                                                             
                                                                 
   
  perfFunc: PerfFunc
   
                                                                                    
   
  queryLogFunc: QueryLogFunc
   
                                                                      
   
  execLogFunc: ExecLogFunc
 }
  
                                       
  
 interface Errors extends Array<Error>{}
 interface newFromDB {
   
                                                            
   
  (sqlDB: sql.DB, driverName: string): (DB)
 }
 interface open {
   
                                                                                 
                                                                                                                     
                                                     
   
  (driverName: string, dsn: string): (DB)
 }
 interface mustOpen {
   
                                                                  
                                                                    
   
  (driverName: string, dsn: string): (DB)
 }
 interface DB {
   
                                      
   
  clone(): (DB)
 }
 interface DB {
   
                                                                                
   
  withContext(ctx: context.Context): (DB)
 }
 interface DB {
   
                                                                 
                                                
   
  context(): context.Context
 }
 interface DB {
   
                                                           
   
  db(): (sql.DB)
 }
 interface DB {
   
                                                             
                                                              
                                                   
   
  close(): void
 }
 interface DB {
   
                                
   
  begin(): (Tx)
 }
 interface DB {
   
                                                                                 
   
  beginTx(ctx: context.Context, opts: sql.TxOptions): (Tx)
 }
 interface DB {
   
                                               
   
  wrap(sqlTx: sql.Tx): (Tx)
 }
 interface DB {
   
                                                                        
                                                                           
                                                  
   
  transactional(f: (_arg0: Tx) => void): void
 }
 interface DB {
   
                                                                                                                              
                                                                           
                                                  
   
  transactionalContext(ctx: context.Context, opts: sql.TxOptions, f: (_arg0: Tx) => void): void
 }
 interface DB {
   
                                                  
   
  driverName(): string
 }
 interface DB {
   
                                                              
                                                                                 
                                                                                                   
   
  quoteTableName(s: string): string
 }
 interface DB {
   
                                                                
                                                                                  
                                                                                                    
   
  quoteColumnName(s: string): string
 }
 interface Errors {
   
                                              
   
  error(): string
 }
  
                                                                                  
  
 interface Expression {
  [key:string]: any;
   
                                                      
                                                                                           
   
  build(_arg0: DB, _arg1: Params): string
 }
  
                                         
    
                                                                                                 
                                                                                           
                                     
    
                                                                                                                     
                                                        
  
 interface HashExp extends _TygojaDict{}
 interface newExp {
   
                                                                                                        
   
  (e: string, ...params: Params[]): Expression
 }
 interface not {
   
                                                                                     
   
  (e: Expression): Expression
 }
 interface and {
   
                                                                                         
   
  (...exps: Expression[]): Expression
 }
 interface or {
   
                                                                                      
   
  (...exps: Expression[]): Expression
 }
 interface _in {
   
                                                                                           
                                                                                           
   
  (col: string, ...values: {
   }[]): Expression
 }
 interface notIn {
   
                                                                                                     
                                                                                       
   
  (col: string, ...values: {
   }[]): Expression
 }
 interface like {
   
                                                                                                                       
                                                                                                                      
                                                                                  
     
                                                                                                                        
                                                               
     
                                                                                                                             
                                  
   
  (col: string, ...values: string[]): (LikeExp)
 }
 interface notLike {
   
                                             
                                                                                
                                                                                              
   
  (col: string, ...values: string[]): (LikeExp)
 }
 interface orLike {
   
                                            
                                                                                                
                                                                               
                                                                                     
   
  (col: string, ...values: string[]): (LikeExp)
 }
 interface orNotLike {
   
                                                   
                                                                                  
                                                                                             
   
  (col: string, ...values: string[]): (LikeExp)
 }
 interface exists {
   
                                                                                         
   
  (exp: Expression): Expression
 }
 interface notExists {
   
                                                                                                
   
  (exp: Expression): Expression
 }
 interface between {
   
                                            
                                                                           
   
  (col: string, from: {
   }, to: {
   }): Expression
 }
 interface notBetween {
   
                                                   
                                                                                  
   
  (col: string, from: {
   }, to: {
   }): Expression
 }
  
                                                                                               
  
 interface Exp {
 }
 interface Exp {
   
                                                      
   
  build(db: DB, params: Params): string
 }
 interface HashExp {
   
                                                      
   
  build(db: DB, params: Params): string
 }
  
                                                                                       
  
 interface NotExp {
 }
 interface NotExp {
   
                                                      
   
  build(db: DB, params: Params): string
 }
  
                                                                                                        
  
 interface AndOrExp {
 }
 interface AndOrExp {
   
                                                      
   
  build(db: DB, params: Params): string
 }
  
                                                    
  
 interface InExp {
 }
 interface InExp {
   
                                                      
   
  build(db: DB, params: Params): string
 }
  
                                                     
  
 interface LikeExp {
   
                                                                 
                                                         
   
  like: string
 }
 interface LikeExp {
   
                                                              
                                                                                                 
                                       
   
  escape(...chars: string[]): (LikeExp)
 }
 interface LikeExp {
   
                                                                                               
   
  match(left: boolean, right: boolean): (LikeExp)
 }
 interface LikeExp {
   
                                                      
   
  build(db: DB, params: Params): string
 }
  
                                                            
  
 interface ExistsExp {
 }
 interface ExistsExp {
   
                                                      
   
  build(db: DB, params: Params): string
 }
  
                                                                
  
 interface BetweenExp {
 }
 interface BetweenExp {
   
                                                      
   
  build(db: DB, params: Params): string
 }
 interface enclose {
   
                                                                              
   
  (exp: Expression): Expression
 }
  
                                                            
  
 interface EncloseExp {
 }
 interface EncloseExp {
   
                                                      
   
  build(db: DB, params: Params): string
 }
  
                                                                                                           
  
 interface TableModel {
  [key:string]: any;
  tableName(): string
 }
  
                                                                 
  
 interface ModelQuery {
 }
 interface newModelQuery {
  (model: {
   }, fieldMapFunc: FieldMapFunc, db: DB, builder: Builder): (ModelQuery)
 }
 interface ModelQuery {
   
                                                           
   
  context(): context.Context
 }
 interface ModelQuery {
   
                                                     
   
  withContext(ctx: context.Context): (ModelQuery)
 }
 interface ModelQuery {
   
                                                                                                
   
  exclude(...attrs: string[]): (ModelQuery)
 }
 interface ModelQuery {
   
                                                                                         
     
                                                                                                  
                                                                                                            
                                                                          
     
                                                                                                        
                                                                                            
   
  insert(...attrs: string[]): void
 }
 interface ModelQuery {
   
                                                                                         
                                                                              
     
                                                                                                
                                                                                                           
                                                                         
   
  update(...attrs: string[]): void
 }
 interface ModelQuery {
   
                                                                                                                      
   
  delete(): void
 }
  
                                                                                  
  
 interface ExecHookFunc {(q: Query, op: () => void): void }
  
                                                                                                  
  
 interface OneHookFunc {(q: Query, a: {
  }, op: (b: {
  }) => void): void }
  
                                                                                                  
  
 interface AllHookFunc {(q: Query, sliceA: {
  }, op: (sliceB: {
  }) => void): void }
  
                                                                                
                                                                                                     
  
 interface Params extends _TygojaDict{}
  
                                                            
  
 interface Executor {
  [key:string]: any;
   
                                  
   
  exec(query: string, ...args: {
  }[]): sql.Result
   
                                                                
   
  execContext(ctx: context.Context, query: string, ...args: {
  }[]): sql.Result
   
                                  
   
  query(query: string, ...args: {
  }[]): (sql.Rows)
   
                                                                
   
  queryContext(ctx: context.Context, query: string, ...args: {
  }[]): (sql.Rows)
   
                                         
   
  prepare(query: string): (sql.Stmt)
 }
  
                                                    
  
 interface Query {
   
                                                            
   
  fieldMapper: FieldMapFunc
   
                                                             
                                                                        
   
  lastError: Error
   
                                                             
   
  logFunc: LogFunc
   
                                                                          
                                                                 
   
  perfFunc: PerfFunc
   
                                                                                    
   
  queryLogFunc: QueryLogFunc
   
                                                                      
   
  execLogFunc: ExecLogFunc
 }
 interface newQuery {
   
                                                               
   
  (db: DB, executor: Executor, sql: string): (Query)
 }
 interface Query {
   
                                                           
                                                                              
                                                
   
  sql(): string
 }
 interface Query {
   
                                                           
   
  context(): context.Context
 }
 interface Query {
   
                                                     
   
  withContext(ctx: context.Context): (Query)
 }
 interface Query {
   
                                                                            
     
                                                                                      
                                                                                
   
  withExecHook(fn: ExecHookFunc): (Query)
 }
 interface Query {
   
                                                                      
                                                                          
                                         
   
  withOneHook(fn: OneHookFunc): (Query)
 }
 interface Query {
   
                                                                      
                                                                         
                                         
   
  withAllHook(fn: AllHookFunc): (Query)
 }
 interface Query {
   
                                                                                              
   
  params(): Params
 }
 interface Query {
   
                                                                          
                                                          
   
  prepare(): (Query)
 }
 interface Query {
   
                                                    
                                                                  
   
  close(): void
 }
 interface Query {
   
                                                                        
                                                                                         
   
  bind(params: Params): (Query)
 }
 interface Query {
   
                                                                
   
  execute(): sql.Result
 }
 interface Query {
   
                                                                                                             
                                                                                     
                                  
                                                                                               
   
  one(a: {
   }): void
 }
 interface Query {
   
                                                                                                                 
                                                                                                         
                                                                                                     
                                                                             
   
  all(slice: {
   }): void
 }
 interface Query {
   
                                                                                                       
                                                                                                   
                                                                                               
   
  row(...a: {
   }[]): void
 }
 interface Query {
   
                                                                                                 
                                                          
   
  column(a: {
   }): void
 }
 interface Query {
   
                                                                                                   
   
  rows(): (Rows)
 }
  
                                                                     
  
 interface QueryBuilder {
  [key:string]: any;
   
                                                                                
   
  buildSelect(cols: Array<string>, distinct: boolean, option: string): string
   
                                                             
   
  buildFrom(tables: Array<string>): string
   
                                                                              
   
  buildGroupBy(cols: Array<string>): string
   
                                                                       
   
  buildJoin(_arg0: Array<JoinInfo>, _arg1: Params): string
   
                                                                   
   
  buildWhere(_arg0: Expression, _arg1: Params): string
   
                                                                     
   
  buildHaving(_arg0: Expression, _arg1: Params): string
   
                                                                   
   
  buildOrderByAndLimit(_arg0: string, _arg1: Array<string>, _arg2: number, _arg3: number): string
   
                                                                          
   
  buildUnion(_arg0: Array<UnionInfo>, _arg1: Params): string
   
                                                                                 
     
                                                                
                                                                                  
     
                                                                    
                                                                       
                                                          
                                                                                                 
   
  combineUnion(sql: string, unionClause: string): string
 }
  
                                                                     
  
 interface BaseQueryBuilder {
 }
 interface newBaseQueryBuilder {
   
                                                                 
   
  (db: DB): (BaseQueryBuilder)
 }
 interface BaseQueryBuilder {
   
                                                                  
   
  db(): (DB)
 }
 interface BaseQueryBuilder {
   
                                                                                
   
  buildSelect(cols: Array<string>, distinct: boolean, option: string): string
 }
 interface BaseQueryBuilder {
   
                                                             
   
  buildFrom(tables: Array<string>): string
 }
 interface BaseQueryBuilder {
   
                                                                       
   
  buildJoin(joins: Array<JoinInfo>, params: Params): string
 }
 interface BaseQueryBuilder {
   
                                                                   
   
  buildWhere(e: Expression, params: Params): string
 }
 interface BaseQueryBuilder {
   
                                                                     
   
  buildHaving(e: Expression, params: Params): string
 }
 interface BaseQueryBuilder {
   
                                                                              
   
  buildGroupBy(cols: Array<string>): string
 }
 interface BaseQueryBuilder {
   
                                                                   
   
  buildOrderByAndLimit(sql: string, cols: Array<string>, limit: number, offset: number): string
 }
 interface BaseQueryBuilder {
   
                                                                          
   
  buildUnion(unions: Array<UnionInfo>, params: Params): string
 }
 interface BaseQueryBuilder {
   
                                                                                 
     
                                                                
                                                                                  
     
                                                                    
                                                                       
                                                          
                                                                                                 
   
  combineUnion(sql: string, unionClause: string): string
 }
 interface BaseQueryBuilder {
   
                                                
   
  buildOrderBy(cols: Array<string>): string
 }
 interface BaseQueryBuilder {
   
                                           
   
  buildLimit(limit: number, offset: number): string
 }
  
                                                                                                     
  
 interface VarTypeError extends String{}
 interface VarTypeError {
   
                                     
   
  error(): string
 }
  
                                                                                      
                                                                                                               
  
 interface NullStringMap extends _TygojaDict{}
  
                                                                      
                                                                                                
  
 type _skETluh = sql.Rows
 interface Rows extends _skETluh {
 }
 interface Rows {
   
                                                                    
                                                                   
                                                                                       
                                      
   
  scanMap(a: NullStringMap): void
 }
 interface Rows {
   
                                                                
                                           
     
                                                                                                
                                                                        
                                                             
     
                                                                                     
                                                                                                                
                                                                                              
                                                                                          
                                                                                      
   
  scanStruct(a: {
   }): void
 }
  
                                                                                 
  
 interface BuildHookFunc {(q: Query): void }
  
                                                      
                                                                           
  
 interface SelectQuery {
   
                                                            
   
  fieldMapper: FieldMapFunc
   
                                                
   
  tableMapper: TableMapFunc
 }
  
                                                          
  
 interface JoinInfo {
  join: string
  table: string
  on: Expression
 }
  
                                                            
  
 interface UnionInfo {
  all: boolean
  query?: Query
 }
 interface newSelectQuery {
   
                                                       
   
  (builder: Builder, db: DB): (SelectQuery)
 }
 interface SelectQuery {
   
                                                                                     
   
  withBuildHook(fn: BuildHookFunc): (SelectQuery)
 }
 interface SelectQuery {
   
                                                           
   
  context(): context.Context
 }
 interface SelectQuery {
   
                                                     
   
  withContext(ctx: context.Context): (SelectQuery)
 }
 interface SelectQuery {
   
                                                                                                       
   
  preFragment(fragment: string): (SelectQuery)
 }
 interface SelectQuery {
   
                                                                                                
     
                                                                        
                                         
   
  postFragment(fragment: string): (SelectQuery)
 }
 interface SelectQuery {
   
                                                 
                                               
   
  select(...cols: string[]): (SelectQuery)
 }
 interface SelectQuery {
   
                                                      
                                               
   
  andSelect(...cols: string[]): (SelectQuery)
 }
 interface SelectQuery {
   
                                                                
                                   
   
  distinct(v: boolean): (SelectQuery)
 }
 interface SelectQuery {
   
                                                                                
   
  selectOption(option: string): (SelectQuery)
 }
 interface SelectQuery {
   
                                                
                                              
   
  from(...tables: string[]): (SelectQuery)
 }
 interface SelectQuery {
   
                                         
   
  where(e: Expression): (SelectQuery)
 }
 interface SelectQuery {
   
                                                                                            
   
  andWhere(e: Expression): (SelectQuery)
 }
 interface SelectQuery {
   
                                                                                          
   
  orWhere(e: Expression): (SelectQuery)
 }
 interface SelectQuery {
   
                                  
                                                                                  
   
  join(typ: string, table: string, on: Expression): (SelectQuery)
 }
 interface SelectQuery {
   
                                              
                                        
   
  innerJoin(table: string, on: Expression): (SelectQuery)
 }
 interface SelectQuery {
   
                                           
                                        
   
  leftJoin(table: string, on: Expression): (SelectQuery)
 }
 interface SelectQuery {
   
                                             
                                        
   
  rightJoin(table: string, on: Expression): (SelectQuery)
 }
 interface SelectQuery {
   
                                           
                                                                                                                        
   
  orderBy(...cols: string[]): (SelectQuery)
 }
 interface SelectQuery {
   
                                                                           
                                                                                                                        
   
  andOrderBy(...cols: string[]): (SelectQuery)
 }
 interface SelectQuery {
   
                                           
                                          
   
  groupBy(...cols: string[]): (SelectQuery)
 }
 interface SelectQuery {
   
                                                                           
                                          
   
  andGroupBy(...cols: string[]): (SelectQuery)
 }
 interface SelectQuery {
   
                                        
   
  having(e: Expression): (SelectQuery)
 }
 interface SelectQuery {
   
                                                                                              
   
  andHaving(e: Expression): (SelectQuery)
 }
 interface SelectQuery {
   
                                                                                            
   
  orHaving(e: Expression): (SelectQuery)
 }
 interface SelectQuery {
   
                                    
   
  union(q: Query): (SelectQuery)
 }
 interface SelectQuery {
   
                                           
   
  unionAll(q: Query): (SelectQuery)
 }
 interface SelectQuery {
   
                                      
                                     
   
  limit(limit: number): (SelectQuery)
 }
 interface SelectQuery {
   
                                        
                                       
   
  offset(offset: number): (SelectQuery)
 }
 interface SelectQuery {
   
                                                                  
   
  bind(params: Params): (SelectQuery)
 }
 interface SelectQuery {
   
                                                                    
   
  andBind(params: Params): (SelectQuery)
 }
 interface SelectQuery {
   
                                                                          
   
  build(): (Query)
 }
 interface SelectQuery {
   
                                                                                                         
     
                                                                                                      
                                                                                                  
                                                                                   
     
                                                                                               
   
  one(a: {
   }): void
 }
 interface SelectQuery {
   
                                                                                                    
     
                                                                                                       
                                                                                                          
                                                                                                                   
                                                           
   
  model(pk: {
   }, model: {
   }): void
 }
 interface SelectQuery {
   
                                                                                     
     
                                                        
     
                                                                                                      
                                                                                                               
                                                                                        
   
  all(slice: {
   }): void
 }
 interface SelectQuery {
   
                                                                                                    
                                                     
   
  rows(): (Rows)
 }
 interface SelectQuery {
   
                                                                                                                     
                                                    
   
  row(...a: {
   }[]): void
 }
 interface SelectQuery {
   
                                                                                                               
                                                          
                                                       
   
  column(a: {
   }): void
 }
  
                                                                              
  
 interface QueryInfo {
  preFragment: string
  postFragment: string
  builder: Builder
  selects: Array<string>
  distinct: boolean
  selectOption: string
  from: Array<string>
  where: Expression
  join: Array<JoinInfo>
  orderBy: Array<string>
  groupBy: Array<string>
  having: Expression
  union: Array<UnionInfo>
  limit: number
  offset: number
  params: Params
  context: context.Context
  buildHook: BuildHookFunc
 }
 interface SelectQuery {
   
                                                                   
                                  
   
  info(): (QueryInfo)
 }
  
                                                                    
  
 interface FieldMapFunc {(_arg0: string): string }
  
                                                               
  
 interface TableMapFunc {(a: {
  }): string }
 interface structInfo {
 }
 type _sCcyuQh = structInfo
 interface structValue extends _sCcyuQh {
 }
 interface fieldInfo {
 }
 interface structInfoMapKey {
 }
  
                                                            
  
 interface PostScanner {
  [key:string]: any;
   
                                                                
                                                                      
                     
   
  postScan(): void
 }
 interface defaultFieldMapFunc {
   
                                                               
                                                                                                       
                                                                                                                            
                                         
   
  (f: string): string
 }
 interface getTableName {
   
                                                                                                                  
                                                                                                             
                                                                                                 
   
  (a: {
   }): string
 }
  
                                                        
  
 type _sSxDvZK = Builder
 interface Tx extends _sSxDvZK {
 }
 interface Tx {
   
                                    
   
  commit(): void
 }
 interface Tx {
   
                                     
   
  rollback(): void
 }
}

namespace security {
 interface s256Challenge {
   
                                                                                    
                                                                        
     
                                                                          
   
  (code: string): string
 }
 interface md5 {
   
                                                       
   
  (text: string): string
 }
 interface sha256 {
   
                                                                                
   
  (text: string): string
 }
 interface sha512 {
   
                                                                                
   
  (text: string): string
 }
 interface hs256 {
   
                                                            
   
  (text: string, secret: string): string
 }
 interface hs512 {
   
                                                            
   
  (text: string, secret: string): string
 }
 interface equal {
   
                                                                                     
   
  (hash1: string, hash2: string): boolean
 }
 
 import crand = rand
 interface encrypt {
   
                                                                                      
     
                                                    
   
  (data: string|Array<number>, key: string): string
 }
 interface decrypt {
   
                                                                               
     
                                                    
   
  (cipherText: string, key: string): string|Array<number>
 }
 interface parseUnverifiedJWT {
   
                                                         
                                       
     
                                                  
   
  (token: string): jwt.MapClaims
 }
 interface parseJWT {
   
                                                             
   
  (token: string, verificationKey: string): jwt.MapClaims
 }
 interface newJWT {
   
                                                       
   
  (payload: jwt.MapClaims, signingKey: string, duration: time.Duration): string
 }
 
 import cryptoRand = rand
 
 import mathRand = rand
 interface randomString {
   
                                                                                        
     
                                                                                    
   
  (length: number): string
 }
 interface randomStringWithAlphabet {
   
                                                                         
                                                  
     
                                                                   
   
  (length: number, alphabet: string): string
 }
 interface pseudorandomString {
   
                                                                                  
     
                                                                                    
     
                                                                                              
   
  (length: number): string
 }
 interface pseudorandomStringWithAlphabet {
   
                                                                   
                                                  
     
                                                                                                   
   
  (length: number, alphabet: string): string
 }
 interface randomStringByRegex {
   
                                                                              
                                                        
     
                                                                                
                                                                                 
                                                                                
                                                         
                                                                         
                                                                                 
     
                                                                                                                       
   
  (pattern: string, ...optFlags: syntax.Flags[]): string
 }
}

namespace filesystem {
  
                                                               
  
 interface FileReader {
  [key:string]: any;
  open(): io.ReadSeekCloser
 }
  
                                                            
    
                                                                         
  
 interface File {
  reader: FileReader
  name: string
  originalName: string
  size: number
 }
 interface File {
   
                                                                      
                                          
   
  asMap(): _TygojaDict
 }
 interface newFileFromPath {
   
                                                                                   
   
  (path: string): (File)
 }
 interface newFileFromBytes {
   
                                                                               
   
  (b: string|Array<number>, name: string): (File)
 }
 interface newFileFromMultipart {
   
                                                                                
   
  (mh: multipart.FileHeader): (File)
 }
 interface newFileFromURL {
   
                                                               
                                                         
     
            
     
        
                                                                              
                    
     
                                                                                  
        
   
  (ctx: context.Context, url: string): (File)
 }
  
                                                                     
  
 interface MultipartReader {
  header?: multipart.FileHeader
 }
 interface MultipartReader {
   
                                                           
   
  open(): io.ReadSeekCloser
 }
  
                                                           
  
 interface PathReader {
  path: string
 }
 interface PathReader {
   
                                                           
   
  open(): io.ReadSeekCloser
 }
  
                                                        
  
 interface BytesReader {
  bytes: string|Array<number>
 }
 interface BytesReader {
   
                                                           
   
  open(): io.ReadSeekCloser
 }
 type _spnMMjm = bytes.Reader
 interface bytesReadSeekCloser extends _spnMMjm {
 }
 interface bytesReadSeekCloser {
   
                                                        
   
  close(): void
 }
  
                                                                    
  
 interface openFuncAsReader {(): io.ReadSeekCloser }
 interface openFuncAsReader {
   
                                                           
   
  open(): io.ReadSeekCloser
 }
 interface System {
 }
 interface newS3 {
   
                                                    
     
                                                                        
   
  (bucketName: string, region: string, endpoint: string, accessKey: string, secretKey: string, s3ForcePathStyle: boolean): (System)
 }
 interface newLocal {
   
                                                          
     
                                                                        
   
  (dirPath: string): (System)
 }
 interface System {
   
                                                                        
   
  setContext(ctx: context.Context): void
 }
 interface System {
   
                                                                  
   
  close(): void
 }
 interface System {
   
                                                           
   
  exists(fileKey: string): boolean
 }
 interface System {
   
                                                                      
     
                                                      
   
  attributes(fileKey: string): (blob.Attributes)
 }
 interface System {
   
                                                                   
     
                                                                                  
     
                                                   
   
  getReader(fileKey: string): (blob.Reader)
 }
 interface System {
   
                                                       
   
  getFile(fileKey: string): (blob.Reader)
 }
 interface System {
   
                                                                 
                                             
     
                                                                   
                                                                               
     
                                                                      
                                                                                   
     
                                                                      
                                                 
   
  getReuploadableFile(fileKey: string, preserveName: boolean): (File)
 }
 interface System {
   
                                                     
     
                                                          
     
                                                      
   
  copy(srcKey: string, dstKey: string): void
 }
 interface System {
   
                                                                                 
   
  list(prefix: string): Array<(blob.ListObject | undefined)>
 }
 interface System {
   
                                                     
   
  upload(content: string|Array<number>, fileKey: string): void
 }
 interface System {
   
                                                                  
   
  uploadFile(file: File, fileKey: string): void
 }
 interface System {
   
                                                                                 
   
  uploadMultipart(fh: multipart.FileHeader, fileKey: string): void
 }
 interface System {
   
                                                    
     
                                                   
   
  delete(fileKey: string): void
 }
 interface System {
   
                                                                        
     
                                                                                     
   
  deletePrefix(prefix: string): Array<Error>
 }
 interface System {
   
                                                              
     
                                                                         
                                                        
     
                                                                           
   
  isEmptyDir(dir: string): boolean
 }
 interface System {
   
                                                                   
     
                                                                                 
                                                                                  
     
                                                                       
                                                                           
   
  serve(res: http.ResponseWriter, req: http.Request, fileKey: string, name: string): void
 }
 interface System {
   
                                                                                
                                                       
     
                                
                                                                           
                                                                          
                                                                         
                                                                      
                                                                         
                                                                        
   
  createThumb(originalKey: string, thumbKey: string, thumbSize: string): void
 }
}

 
                                                                                                      
 
namespace ozzo_validation {
  
                                                  
  
 interface Error {
  [key:string]: any;
  error(): string
  code(): string
  message(): string
  setMessage(_arg0: string): Error
  params(): _TygojaDict
  setParams(_arg0: _TygojaDict): Error
 }
}

 
                                              
   
                                                                            
 
namespace core {
  
                                                  
    
                                                                               
                                                                                                       
    
                                                                      
                                                                     
                                                                      
  
 interface App {
  [key:string]: any;
   
                                                                                               
     
                                                                                  
                                                                                   
                                   
   
  unsafeWithoutHooks(): App
   
                                           
     
                                                                             
   
  logger(): (slog.Logger)
   
                                                             
                                           
   
  isBootstrapped(): boolean
   
                                                                                 
   
  isTransactional(): boolean
   
                                                                                      
     
                                                                     
                                                                                      
   
  txInfo(): (TxAppInfo)
   
                                          
                                                                      
     
                                                                                    
   
  bootstrap(): void
   
                                                                    
                                                          
   
  resetBootstrapState(): void
   
                                                 
   
  dataDir(): string
   
                                                             
                                                                                                   
   
  encryptionEnv(): string
   
                                                  
     
                                                                                
   
  isDev(): boolean
   
                                              
   
  settings(): (Settings)
   
                                         
   
  store(): (store.Store<string, any>)
   
                                        
   
  cron(): (cron.Cron)
   
                                                                                
   
  subscriptionsBroker(): (subscriptions.Broker)
   
                                                                    
                                       
   
  newMailClient(): mailer.Mailer
   
                                                                
                                                        
                                       
     
                                                         
                                        
   
  newFilesystem(): (filesystem.System)
   
                                                                       
                                                                
     
                                                         
                                        
   
  newBackupsFilesystem(): (filesystem.System)
   
                                                                              
   
  reloadSettings(): void
   
                                                                            
     
                                                                               
     
                                                                     
                                          
   
  createBackup(ctx: context.Context, name: string): void
   
                                                                           
                                             
     
                                                                             
                                                             
     
                                                                     
                                           
     
                                                                                                   
   
  restoreBackup(ctx: context.Context, name: string): void
   
                                                                              
     
                                                                           
   
  restart(): void
   
                                                                                                   
   
  runSystemMigrations(): void
   
                                                                                            
   
  runAppMigrations(): void
   
                                                           
                                                                      
   
  runAllMigrations(): void
   
                                                         
     
                                                                
                                                                            
                              
     
                                                                   
                                                       
   
  db(): dbx.Builder
   
                                                                      
     
                                                                
                                                    
     
                                                               
                                                                      
     
                                                                                                  
   
  concurrentDB(): dbx.Builder
   
                                                                            
     
                                                                          
                                                                                        
     
                                                                            
                                                                                    
     
                                                               
                                                                      
     
                                                                                                  
   
  nonconcurrentDB(): dbx.Builder
   
                                                         
     
                                                                
                                                                            
                              
     
                                                                   
                                                             
   
  auxDB(): dbx.Builder
   
                                                                              
     
                                                                
                                                    
     
                                                                  
                                                                            
     
                                                                                                        
   
  auxConcurrentDB(): dbx.Builder
   
                                                                                    
     
                                                                          
                                                                                        
     
                                                                            
                                                                                    
     
                                                                  
                                                                            
     
                                                                                                        
   
  auxNonconcurrentDB(): dbx.Builder
   
                                                                                           
                    
   
  hasTable(tableName: string): boolean
   
                                                                                             
                         
   
  auxHasTable(tableName: string): boolean
   
                                                                         
   
  tableColumns(tableName: string): Array<string>
   
                                                                              
   
  tableInfo(tableName: string): Array<(TableInfoRow | undefined)>
   
                                                                                             
     
                                                                    
   
  tableIndexes(tableName: string): _TygojaDict
   
                                           
     
                                                                            
     
                                                                         
                                                                     
   
  deleteTable(dangerousTableName: string): void
   
                                              
     
                                                                           
     
                                                                         
                                                                    
   
  deleteView(dangerousViewName: string): void
   
                                                                        
     
                                                                     
                                                     
   
  saveView(dangerousViewName: string, dangerousSelectQuery: string): void
   
                                                                              
     
                            
                                                 
                                                                                             
     
                                                                         
                                                                       
   
  createViewFields(dangerousSelectQuery: string): FieldsList
   
                                                                                           
   
  findRecordByViewFile(viewCollectionModelOrIdentifier: any, fileFieldName: string, filename: string): (Record)
   
                                                                                         
   
  vacuum(): void
   
                                                                                                      
   
  auxVacuum(): void
   
                                                                            
                                                                      
   
  modelQuery(model: Model): (dbx.SelectQuery)
   
                                                                                    
                                                                      
   
  auxModelQuery(model: Model): (dbx.SelectQuery)
   
                                                                      
   
  delete(model: Model): void
   
                                                                     
                                                              
   
  deleteWithContext(ctx: context.Context, model: Model): void
   
                                                                       
   
  auxDelete(model: Model): void
   
                                                                                 
                                                              
   
  auxDeleteWithContext(ctx: context.Context, model: Model): void
   
                                                                                
     
                                                                      
   
  save(model: Model): void
   
                                                                                                           
     
                                                                                 
   
  saveWithContext(ctx: context.Context, model: Model): void
   
                                                                                                           
     
                                                                             
   
  saveNoValidate(model: Model): void
   
                                                                    
                                                               
     
                                                                                        
   
  saveNoValidateWithContext(ctx: context.Context, model: Model): void
   
                                                                                     
     
                                                                         
   
  auxSave(model: Model): void
   
                                                                                                                 
     
                                                                                    
   
  auxSaveWithContext(ctx: context.Context, model: Model): void
   
                                                                                                                
     
                                                                                
   
  auxSaveNoValidate(model: Model): void
   
                                                                          
                                                               
     
                                                                                           
   
  auxSaveNoValidateWithContext(ctx: context.Context, model: Model): void
   
                                                                        
   
  validate(model: Model): void
   
                                                                                              
   
  validateWithContext(ctx: context.Context, model: Model): void
   
                                                                               
     
                                                                                       
   
  runInTransaction(fn: (txApp: App) => void): void
   
                                                                                    
     
                                                                                       
   
  auxRunInTransaction(fn: (txApp: App) => void): void
   
                                             
   
  logQuery(): (dbx.SelectQuery)
   
                                                    
   
  findLogById(id: string): (Log)
   
                                                          
   
  logsStats(expr: dbx.Expression): Array<(LogsStatsItem | undefined)>
   
                                                                         
   
  deleteOldLogs(createdBefore: time.Time): void
   
                                                           
   
  collectionQuery(): (dbx.SelectQuery)
   
                                                                
     
                                                               
     
             
     
        
                                                 
                                                                              
        
   
  findAllCollections(...collectionTypes: string[]): Array<(Collection | undefined)>
   
                                                                                        
   
  reloadCachedCollections(): void
   
                                                                                              
   
  findCollectionByNameOrId(nameOrId: string): (Collection)
   
                                                                                
                                                                                 
     
                                                                     
     
                                                                      
                                                    
     
                                                                 
                                                
     
             
     
        
                                                                              
                                                                                  
                                                                                       
                                                                                                   
                                                                                                   
                                                                                            
                                                                                
        
   
  findCachedCollectionByNameOrId(nameOrId: string): (Collection)
   
                                                                  
                                                
     
                                                                       
                                                                       
                                
   
  findCollectionReferences(collection: Collection, ...excludeIds: string[]): _TygojaDict
   
                                                                                
                                                                                 
     
                                                                     
     
                                                                 
                                                
     
             
     
        
                                                                              
                                                                                  
                                                                                       
                                                                                                   
                                                                                                   
                                                                                            
                                                                                 
        
   
  findCachedCollectionReferences(collection: Collection, ...excludeIds: string[]): _TygojaDict
   
                                                                       
                                                
     
                                                                  
                                
   
  isCollectionNameUnique(name: string, ...excludeIds: string[]): boolean
   
                                                                                    
     
                                                                
                                               
     
                                                                
                                     
   
  truncateCollection(collection: Collection): void
   
                                                                                     
     
                                                                                                      
     
                                                                                
                                                                        
                                                
   
  importCollections(toImport: Array<_TygojaDict>, deleteMissing: boolean): void
   
                                                                        
                                                                                                   
   
  importCollectionsByMarshaledJSON(rawSliceOfMaps: string|Array<number>, deleteMissing: boolean): void
   
                                                                
                                                            
     
                                                                                          
     
                                                                                                 
   
  syncRecordTableSchema(newCollection: Collection, oldCollection: Collection): void
   
                                                                 
                                        
   
  findAllExternalAuthsByRecord(authRecord: Record): Array<(ExternalAuth | undefined)>
   
                                                                     
                                            
   
  findAllExternalAuthsByCollection(collection: Collection): Array<(ExternalAuth | undefined)>
   
                                                                                      
                                                              
   
  findFirstExternalAuthByExpr(expr: dbx.Expression): (ExternalAuth)
   
                                                                                   
   
  findAllMFAsByRecord(authRecord: Record): Array<(MFA | undefined)>
   
                                                                                      
   
  findAllMFAsByCollection(collection: Collection): Array<(MFA | undefined)>
   
                                                      
   
  findMFAById(id: string): (MFA)
   
                                                                                      
     
                                                      
   
  deleteAllMFAsByRecord(authRecord: Record): void
   
                                                                         
   
  deleteExpiredMFAs(): void
   
                                                                                   
   
  findAllOTPsByRecord(authRecord: Record): Array<(OTP | undefined)>
   
                                                                                      
   
  findAllOTPsByCollection(collection: Collection): Array<(OTP | undefined)>
   
                                                      
   
  findOTPById(id: string): (OTP)
   
                                                                                      
     
                                                      
   
  deleteAllOTPsByRecord(authRecord: Record): void
   
                                                                         
   
  deleteExpiredOTPs(): void
   
                                                                                                                 
   
  findAllAuthOriginsByRecord(authRecord: Record): Array<(AuthOrigin | undefined)>
   
                                                                                                                    
   
  findAllAuthOriginsByCollection(collection: Collection): Array<(AuthOrigin | undefined)>
   
                                                                    
   
  findAuthOriginById(id: string): (AuthOrigin)
   
                                                                           
                                                
   
  findAuthOriginByRecordAndFingerprint(authRecord: Record, fingerprint: string): (AuthOrigin)
   
                                                                                                    
     
                                                      
   
  deleteAllAuthOriginsByRecord(authRecord: Record): void
   
                                                                                       
     
                                                                            
                                                                                  
                                                                          
   
  recordQuery(collectionModelOrIdentifier: any): (dbx.SelectQuery)
   
                                                     
   
  findRecordById(collectionModelOrIdentifier: any, recordId: string, ...optFilters: ((q: dbx.SelectQuery) => void)[]): (Record)
   
                                                             
                                                     
   
  findRecordsByIds(collectionModelOrIdentifier: any, recordIds: Array<string>, ...optFilters: ((q: dbx.SelectQuery) => void)[]): Array<(Record | undefined)>
   
                                                                        
     
                                                                 
     
                                                    
     
             
     
        
                             
                                   
     
                               
                                                       
                                                                                          
                                                 
        
   
  findAllRecords(collectionModelOrIdentifier: any, ...exprs: dbx.Expression[]): Array<(Record | undefined)>
   
                                                                  
                                 
   
  findFirstRecordByData(collectionModelOrIdentifier: any, key: string, value: any): (Record)
   
                                                                     
                            
     
                                                                         
     
                                                                      
                           
     
                                                                             
                                                
     
                                                                        
                                       
     
                                                    
     
             
     
        
                              
               
                                                  
                  
          
         
                                                          
       
        
   
  findRecordsByFilter(collectionModelOrIdentifier: any, filter: string, sort: string, limit: number, offset: number, ...params: dbx.Params[]): Array<(Record | undefined)>
   
                                                                                                      
     
                                                                       
     
                                                 
     
             
     
        
                                              
                                                                                                         
        
   
  findFirstRecordByFilter(collectionModelOrIdentifier: any, filter: string, ...params: dbx.Params[]): (Record)
   
                                                                      
   
  countRecords(collectionModelOrIdentifier: any, ...exprs: dbx.Expression[]): number
   
                                                                                 
                                                                 
     
                                                                                   
     
                                                                                                    
   
  findAuthRecordByToken(token: string, ...validTypes: string[]): (Record)
   
                                                                                    
     
                                                                                 
   
  findAuthRecordByEmail(collectionModelOrIdentifier: any, email: string): (Record)
   
                                                                        
                                          
     
                                                                            
     
                                                                          
                                                    
     
                                                                      
     
             
     
        
                                       
                                                             
                                                                          
                                                                                         
     
                                                                            
        
   
  canAccessRecord(record: Record, requestInfo: RequestInfo, accessRule: string): boolean
   
                                                                 
     
                                                                     
                                       
     
                                                                      
   
  expandRecord(record: Record, expands: Array<string>, optFetchFunc: ExpandFetchFunc): _TygojaDict
   
                                                                            
     
                                                                     
                                       
     
                                                                      
   
  expandRecords(records: Array<(Record | undefined)>, expands: Array<string>, optFetchFunc: ExpandFetchFunc): _TygojaDict
   
                                                                         
                                       
   
  onBootstrap(): (hook.Hook<BootstrapEvent | undefined>)
   
                                                                 
                                                                                       
                                                                             
   
  onServe(): (hook.Hook<ServeEvent | undefined>)
   
                                                                 
                                                 
     
                                                                                         
   
  onTerminate(): (hook.Hook<TerminateEvent | undefined>)
   
                                                                      
   
  onBackupCreate(): (hook.Hook<BackupEvent | undefined>)
   
                                                                                                 
     
                                                                                                             
   
  onBackupRestore(): (hook.Hook<BackupEvent | undefined>)
   
                                                                            
                                                      
     
                                                                     
                                                                                             
     
                                                                                           
                                                                    
                                                                           
   
  onModelValidate(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
   
                                                                            
                                    
     
                                                                       
                                 
     
                                                                     
                                 
     
                                                                    
                                                                    
                                 
                                                                       
                                                                            
     
                                                                     
                                                                                             
     
                                                                                           
                                                                    
                                                                           
   
  onModelCreate(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
   
                                                                        
                                                              
     
                                                                                     
                    
        
                                                              
                               
        
      
     
                                                                    
                                                                              
                   
                                                               
                                                                                    
     
                                                                     
                                                                                             
     
                                                                                           
                                                                    
                                                                           
   
  onModelCreateExecute(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
   
                                                                 
                                 
     
                                                                  
                                                                                     
                                                                 
                                            
     
                                                                     
                                                                                             
     
                                                                                           
                                                                    
                                                                           
   
  onModelAfterCreateSuccess(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
   
                                                           
                                 
     
                                                                        
                            
        
                                          
                                          
        
     
                                                                     
                                                                                             
     
                                                                                           
                                                                    
                                                                           
   
  onModelAfterCreateError(...tags: string[]): (hook.TaggedHook<ModelErrorEvent | undefined>)
   
                                                                            
                                    
     
                                                                       
                                 
     
                                                                     
                                 
     
                                                                    
                                                                    
                                 
                                                                       
                                                                            
     
                                                                     
                                                                                             
     
                                                                                           
                                                                    
                                                                           
   
  onModelUpdate(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
   
                                                                        
                                                              
     
                                                                                     
                    
        
                                                              
                               
        
      
     
                                                                    
                                                                              
                   
                                                               
                                                                                    
     
                                                                     
                                                                                             
     
                                                                                           
                                                                    
                                                                           
   
  onModelUpdateExecute(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
   
                                                                 
                                 
     
                                                                  
                                                                                     
                                                                 
                                                     
     
                                                                     
                                                                                             
     
                                                                                           
                                                                    
                                                                           
   
  onModelAfterUpdateSuccess(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
   
                                                           
                                 
     
                                                                        
                            
        
                                          
                                          
        
     
                                                                     
                                                                                             
     
                                                                                           
                                                                    
                                                                           
   
  onModelAfterUpdateError(...tags: string[]): (hook.TaggedHook<ModelErrorEvent | undefined>)
   
                                                                            
                                      
     
                                                                    
                                                                    
                                 
                                                                               
                                                                            
     
                                                                     
                                                                                             
     
                                                                                           
                                                                    
                                                                           
   
  onModelDelete(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
   
                                                             
                                   
     
                                                                                       
                    
        
                                   
                               
        
      
     
                                                                    
                                                                    
                                 
                                                                               
                                                                            
     
                                                                     
                                                                                             
     
                                                                                           
                                                                    
                                                                           
   
  onModelDeleteExecute(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
   
                                                                 
                                 
     
                                                                
                                                                                     
                                                                 
                                                   
     
                                                                     
                                                                                             
     
                                                                                           
                                                                    
                                                                           
   
  onModelAfterDeleteSuccess(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
   
                                                           
                                 
     
                                                                        
                            
        
                                            
                                          
        
     
                                                                     
                                                                                             
     
                                                                                           
                                                                    
                                                                           
   
  onModelAfterDeleteError(...tags: string[]): (hook.TaggedHook<ModelErrorEvent | undefined>)
   
                                                                     
                                                                                                                            
     
                                                                          
                                                                        
     
                                                                            
        
                                    
                               
     
                                                      
                                                                                           
                                                                                           
                                                                                                              
           
     
                         
        
        
     
                                                                        
                                                                    
                                                                           
   
  onRecordEnrich(...tags: string[]): (hook.TaggedHook<RecordEnrichEvent | undefined>)
   
                                                                        
     
                                                                        
                                                                    
                                                                           
   
  onRecordValidate(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
   
                                                                    
     
                                                                        
                                                                    
                                                                           
   
  onRecordCreate(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
   
                                                                                  
     
                                                                        
                                                                    
                                                                           
   
  onRecordCreateExecute(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
   
                                                                                            
     
                                                                        
                                                                    
                                                                           
   
  onRecordAfterCreateSuccess(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
   
                                                                                        
     
                                                                        
                                                                    
                                                                           
   
  onRecordAfterCreateError(...tags: string[]): (hook.TaggedHook<RecordErrorEvent | undefined>)
   
                                                                    
     
                                                                        
                                                                    
                                                                           
   
  onRecordUpdate(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
   
                                                                                  
     
                                                                        
                                                                    
                                                                           
   
  onRecordUpdateExecute(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
   
                                                                                            
     
                                                                        
                                                                    
                                                                           
   
  onRecordAfterUpdateSuccess(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
   
                                                                                        
     
                                                                        
                                                                    
                                                                           
   
  onRecordAfterUpdateError(...tags: string[]): (hook.TaggedHook<RecordErrorEvent | undefined>)
   
                                                                    
     
                                                                        
                                                                    
                                                                           
   
  onRecordDelete(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
   
                                                                                  
     
                                                                        
                                                                    
                                                                           
   
  onRecordDeleteExecute(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
   
                                                                                            
     
                                                                        
                                                                    
                                                                           
   
  onRecordAfterDeleteSuccess(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
   
                                                                                        
     
                                                                        
                                                                    
                                                                           
   
  onRecordAfterDeleteError(...tags: string[]): (hook.TaggedHook<RecordErrorEvent | undefined>)
   
                                                                                
     
                                                                        
                                                                    
                                                                           
   
  onCollectionValidate(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
   
                                                                            
     
                                                                        
                                                                    
                                                                           
   
  onCollectionCreate(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
   
                                                                                          
     
                                                                        
                                                                    
                                                                           
   
  onCollectionCreateExecute(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
   
                                                                                                    
     
                                                                        
                                                                    
                                                                           
   
  onCollectionAfterCreateSuccess(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
   
                                                                                                
     
                                                                        
                                                                    
                                                                           
   
  onCollectionAfterCreateError(...tags: string[]): (hook.TaggedHook<CollectionErrorEvent | undefined>)
   
                                                                            
     
                                                                        
                                                                    
                                                                           
   
  onCollectionUpdate(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
   
                                                                                          
     
                                                                        
                                                                    
                                                                           
   
  onCollectionUpdateExecute(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
   
                                                                                                    
     
                                                                        
                                                                    
                                                                           
   
  onCollectionAfterUpdateSuccess(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
   
                                                                                                
     
                                                                        
                                                                    
                                                                           
   
  onCollectionAfterUpdateError(...tags: string[]): (hook.TaggedHook<CollectionErrorEvent | undefined>)
   
                                                                            
     
                                                                        
                                                                    
                                                                           
   
  onCollectionDelete(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
   
                                                                                          
     
                                                                        
                                                                    
                                                                           
   
  onCollectionDeleteExecute(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
   
                                                                                                    
     
                                                                        
                                                                    
                                                                           
   
  onCollectionAfterDeleteSuccess(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
   
                                                                                                
     
                                                                        
                                                                    
                                                                           
   
  onCollectionAfterDeleteError(...tags: string[]): (hook.TaggedHook<CollectionErrorEvent | undefined>)
   
                                                                  
                                                         
     
                                                                               
   
  onMailerSend(): (hook.Hook<MailerEvent | undefined>)
   
                                                       
                                                                 
                                                                  
     
                                                                        
                                                                    
                                                                           
   
  onMailerRecordAuthAlertSend(...tags: string[]): (hook.TaggedHook<MailerRecordEvent | undefined>)
   
                                                                 
                                                               
                                                                         
     
                                                                        
                                                                    
                                                                           
   
  onMailerRecordPasswordResetSend(...tags: string[]): (hook.TaggedHook<MailerRecordEvent | undefined>)
   
                                                                
                                                             
                                                                         
     
                                                                        
                                                                    
                                                                           
   
  onMailerRecordVerificationSend(...tags: string[]): (hook.TaggedHook<MailerRecordEvent | undefined>)
   
                                                                   
                                                               
                                                                         
     
                                                                        
                                                                    
                                                                           
   
  onMailerRecordEmailChangeSend(...tags: string[]): (hook.TaggedHook<MailerRecordEvent | undefined>)
   
                                                                      
                                                                   
                                      
     
                                                                        
                                                                    
                                                                           
   
  onMailerRecordOTPSend(...tags: string[]): (hook.TaggedHook<MailerRecordEvent | undefined>)
   
                                                                                            
     
                                                                                         
   
  onRealtimeConnectRequest(): (hook.Hook<RealtimeConnectRequestEvent | undefined>)
   
                                                                                     
   
  onRealtimeMessageSend(): (hook.Hook<RealtimeMessageEvent | undefined>)
   
                                                                   
                                                               
                                 
   
  onRealtimeSubscribeRequest(): (hook.Hook<RealtimeSubscribeRequestEvent | undefined>)
   
                                                                               
     
                                                                                        
   
  onSettingsListRequest(): (hook.Hook<SettingsListRequestEvent | undefined>)
   
                                                                                   
     
                                                               
                                                         
   
  onSettingsUpdateRequest(): (hook.Hook<SettingsUpdateRequestEvent | undefined>)
   
                                                                          
                                        
     
                                                                 
   
  onSettingsReload(): (hook.Hook<SettingsReloadEvent | undefined>)
   
                                                                                   
     
                                                                 
                                
   
  onFileDownloadRequest(...tags: string[]): (hook.TaggedHook<FileDownloadRequestEvent | undefined>)
   
                                                                                    
     
                                                                        
                                                                    
                                                                           
   
  onFileTokenRequest(...tags: string[]): (hook.TaggedHook<FileTokenRequestEvent | undefined>)
   
                                                                 
                                                                  
     
                                                                       
                           
     
                                                                        
                                                                    
                                                                           
   
  onRecordAuthRequest(...tags: string[]): (hook.TaggedHook<RecordAuthRequestEvent | undefined>)
   
                                                              
                                           
     
                                                                                                        
                                                                                                                  
     
                                                                        
                                                                    
                                                                           
   
  onRecordAuthWithPasswordRequest(...tags: string[]): (hook.TaggedHook<RecordAuthWithPasswordRequestEvent | undefined>)
   
                                                                   
                                                                                                    
     
                                                                             
                                                  
     
                                                                
                                                                
     
                                                                        
                                                                    
                                                                           
   
  onRecordAuthWithOAuth2Request(...tags: string[]): (hook.TaggedHook<RecordAuthWithOAuth2RequestEvent | undefined>)
   
                                                                
                                                                         
     
                                                                         
                                                
     
                                                                        
                                                                    
                                                                           
   
  onRecordAuthRefreshRequest(...tags: string[]): (hook.TaggedHook<RecordAuthRefreshRequestEvent | undefined>)
   
                                                             
                                                    
     
                                                                         
                                                  
     
                                                                        
                                                                    
                                                                           
   
  onRecordRequestPasswordResetRequest(...tags: string[]): (hook.TaggedHook<RecordRequestPasswordResetRequestEvent | undefined>)
   
                                                             
                                                    
     
                                                                         
                                               
     
                                                                        
                                                                    
                                                                           
   
  onRecordConfirmPasswordResetRequest(...tags: string[]): (hook.TaggedHook<RecordConfirmPasswordResetRequestEvent | undefined>)
   
                                                            
                                                  
     
                                                                                
                                                
     
                                                                        
                                                                    
                                                                           
   
  onRecordRequestVerificationRequest(...tags: string[]): (hook.TaggedHook<RecordRequestVerificationRequestEvent | undefined>)
   
                                                                 
                                             
     
                                                                         
                                               
     
                                                                        
                                                                    
                                                                           
   
  onRecordConfirmVerificationRequest(...tags: string[]): (hook.TaggedHook<RecordConfirmVerificationRequestEvent | undefined>)
   
                                                                
                                             
     
                                                                         
                                                        
     
                                                                        
                                                                    
                                                                           
   
  onRecordRequestEmailChangeRequest(...tags: string[]): (hook.TaggedHook<RecordRequestEmailChangeRequestEvent | undefined>)
   
                                                                
                                             
     
                                                                         
                                               
     
                                                                        
                                                                    
                                                                           
   
  onRecordConfirmEmailChangeRequest(...tags: string[]): (hook.TaggedHook<RecordConfirmEmailChangeRequestEvent | undefined>)
   
                                                               
                             
     
                                                                                                 
                                                                                                                     
     
                                                                        
                                                                    
                                                                           
   
  onRecordRequestOTPRequest(...tags: string[]): (hook.TaggedHook<RecordCreateOTPRequestEvent | undefined>)
   
                                                                
                               
     
                                                                        
                                                                    
                                                                           
   
  onRecordAuthWithOTPRequest(...tags: string[]): (hook.TaggedHook<RecordAuthWithOTPRequestEvent | undefined>)
   
                                                                             
     
                                                                                        
     
                                                                        
                                                                    
                                                                           
   
  onRecordsListRequest(...tags: string[]): (hook.TaggedHook<RecordsListRequestEvent | undefined>)
   
                                                                           
     
                                                                                        
     
                                                                        
                                                                    
                                                                           
   
  onRecordViewRequest(...tags: string[]): (hook.TaggedHook<RecordRequestEvent | undefined>)
   
                                                                               
     
                                                                         
                                               
     
                                                                        
                                                                    
                                                                           
   
  onRecordCreateRequest(...tags: string[]): (hook.TaggedHook<RecordRequestEvent | undefined>)
   
                                                                               
     
                                                                         
                                               
     
                                                                        
                                                                    
                                                                           
   
  onRecordUpdateRequest(...tags: string[]): (hook.TaggedHook<RecordRequestEvent | undefined>)
   
                                                                               
     
                                                                         
                                          
     
                                                                        
                                                                    
                                                                           
   
  onRecordDeleteRequest(...tags: string[]): (hook.TaggedHook<RecordRequestEvent | undefined>)
   
                                                                                     
     
                                                                                        
   
  onCollectionsListRequest(): (hook.Hook<CollectionsListRequestEvent | undefined>)
   
                                                                                   
     
                                                                                        
   
  onCollectionViewRequest(): (hook.Hook<CollectionRequestEvent | undefined>)
   
                                                                                       
     
                                                                         
                                               
   
  onCollectionCreateRequest(): (hook.Hook<CollectionRequestEvent | undefined>)
   
                                                                                       
     
                                                                         
                                               
   
  onCollectionUpdateRequest(): (hook.Hook<CollectionRequestEvent | undefined>)
   
                                                                                       
     
                                                                         
                                          
   
  onCollectionDeleteRequest(): (hook.Hook<CollectionRequestEvent | undefined>)
   
                                                                   
                                
     
                                                                       
                                                       
   
  onCollectionsImportRequest(): (hook.Hook<CollectionsImportRequestEvent | undefined>)
   
                                                                
     
                                                                                   
   
  onBatchRequest(): (hook.Hook<BatchRequestEvent | undefined>)
 }
 
 import validation = ozzo_validation
  
                                                                                  
  
 type _sSDGrxg = Record
 interface AuthOrigin extends _sSDGrxg {
 }
 interface newAuthOrigin {
   
                                                                          
     
                   
     
        
                                   
                                  
                                                   
                                  
                      
        
   
  (app: App): (AuthOrigin)
 }
 interface AuthOrigin {
   
                                                                   
                                          
   
  preValidate(ctx: context.Context, app: App): void
 }
 interface AuthOrigin {
   
                                                  
   
  proxyRecord(): (Record)
 }
 interface AuthOrigin {
   
                                                                            
   
  setProxyRecord(record: Record): void
 }
 interface AuthOrigin {
   
                                                           
   
  collectionRef(): string
 }
 interface AuthOrigin {
   
                                                                     
   
  setCollectionRef(collectionId: string): void
 }
 interface AuthOrigin {
   
                                                          
   
  recordRef(): string
 }
 interface AuthOrigin {
   
                                                             
   
  setRecordRef(recordId: string): void
 }
 interface AuthOrigin {
   
                                                              
   
  fingerprint(): string
 }
 interface AuthOrigin {
   
                                                                 
   
  setFingerprint(fingerprint: string): void
 }
 interface AuthOrigin {
   
                                                      
   
  created(): types.DateTime
 }
 interface AuthOrigin {
   
                                                      
   
  updated(): types.DateTime
 }
 interface BaseApp {
   
                                                                                                                 
   
  findAllAuthOriginsByRecord(authRecord: Record): Array<(AuthOrigin | undefined)>
 }
 interface BaseApp {
   
                                                                                                                    
   
  findAllAuthOriginsByCollection(collection: Collection): Array<(AuthOrigin | undefined)>
 }
 interface BaseApp {
   
                                                                    
   
  findAuthOriginById(id: string): (AuthOrigin)
 }
 interface BaseApp {
   
                                                                           
                                                
   
  findAuthOriginByRecordAndFingerprint(authRecord: Record, fingerprint: string): (AuthOrigin)
 }
 interface BaseApp {
   
                                                                                                    
     
                                                      
   
  deleteAllAuthOriginsByRecord(authRecord: Record): void
 }
  
                                                                                                     
  
 interface FilesManager {
  [key:string]: any;
   
                                                                               
   
  baseFilesPath(): string
 }
  
                                                                        
  
 interface DBConnectFunc {(dbPath: string): (dbx.DB) }
  
                                                        
  
 interface BaseAppConfig {
  dbConnect: DBConnectFunc
  dataDir: string
  encryptionEnv: string
  queryTimeout: time.Duration
  dataMaxOpenConns: number
  dataMaxIdleConns: number
  auxMaxOpenConns: number
  auxMaxIdleConns: number
  isDev: boolean
 }
  
                                                                             
  
 interface BaseApp {
 }
 interface newBaseApp {
   
                                                          
                                            
     
                                                               
   
  (config: BaseAppConfig): (BaseApp)
 }
 interface BaseApp {
   
                                                                                               
     
                                                                                  
                                                                                   
                                   
   
  unsafeWithoutHooks(): App
 }
 interface BaseApp {
   
                                           
     
                                                                             
   
  logger(): (slog.Logger)
 }
 interface BaseApp {
   
                                                                                      
     
                                                                     
                                                                                      
   
  txInfo(): (TxAppInfo)
 }
 interface BaseApp {
   
                                                                                 
   
  isTransactional(): boolean
 }
 interface BaseApp {
   
                                                             
                                           
   
  isBootstrapped(): boolean
 }
 interface BaseApp {
   
                                          
                                                                      
     
                                                                                    
   
  bootstrap(): void
 }
 interface closer {
  [key:string]: any;
  close(): void
 }
 interface BaseApp {
   
                                                                    
                                                          
   
  resetBootstrapState(): void
 }
 interface BaseApp {
   
                                                         
     
                                                                
                                                                       
                                   
     
                                                                   
                                                       
   
  db(): dbx.Builder
 }
 interface BaseApp {
   
                                                                      
     
                                                                
                                                    
     
                                                               
                                                                      
     
                                                                                                  
   
  concurrentDB(): dbx.Builder
 }
 interface BaseApp {
   
                                                                            
     
                                                                          
                                                                                        
     
                                                                            
                                                                                    
     
                                                               
                                                                      
     
                                                                                                  
   
  nonconcurrentDB(): dbx.Builder
 }
 interface BaseApp {
   
                                                         
     
                                                                
                                                                       
                                   
     
                                                                   
                                                             
   
  auxDB(): dbx.Builder
 }
 interface BaseApp {
   
                                                                              
     
                                                                
                                                    
     
                                                                  
                                                                            
     
                                                                                                        
   
  auxConcurrentDB(): dbx.Builder
 }
 interface BaseApp {
   
                                                                                    
     
                                                                          
                                                                                        
     
                                                                            
                                                                                    
     
                                                                  
                                                                            
     
                                                                                                        
   
  auxNonconcurrentDB(): dbx.Builder
 }
 interface BaseApp {
   
                                                 
   
  dataDir(): string
 }
 interface BaseApp {
   
                                                             
                                                                                                   
   
  encryptionEnv(): string
 }
 interface BaseApp {
   
                                                  
     
                                                                                
   
  isDev(): boolean
 }
 interface BaseApp {
   
                                              
   
  settings(): (Settings)
 }
 interface BaseApp {
   
                                         
   
  store(): (store.Store<string, any>)
 }
 interface BaseApp {
   
                                        
   
  cron(): (cron.Cron)
 }
 interface BaseApp {
   
                                                                                
   
  subscriptionsBroker(): (subscriptions.Broker)
 }
 interface BaseApp {
   
                                                                    
                                       
   
  newMailClient(): mailer.Mailer
 }
 interface BaseApp {
   
                                                                
                                                        
                                       
     
                                                         
                                        
   
  newFilesystem(): (filesystem.System)
 }
 interface BaseApp {
   
                                                                       
                                                                
     
                                                         
                                        
   
  newBackupsFilesystem(): (filesystem.System)
 }
 interface BaseApp {
   
                                                                              
     
                                                                           
   
  restart(): void
 }
 interface BaseApp {
   
                                                                                                   
   
  runSystemMigrations(): void
 }
 interface BaseApp {
   
                                                                                            
   
  runAppMigrations(): void
 }
 interface BaseApp {
   
                                                           
                                                                      
   
  runAllMigrations(): void
 }
 interface BaseApp {
  onBootstrap(): (hook.Hook<BootstrapEvent | undefined>)
 }
 interface BaseApp {
  onServe(): (hook.Hook<ServeEvent | undefined>)
 }
 interface BaseApp {
  onTerminate(): (hook.Hook<TerminateEvent | undefined>)
 }
 interface BaseApp {
  onBackupCreate(): (hook.Hook<BackupEvent | undefined>)
 }
 interface BaseApp {
  onBackupRestore(): (hook.Hook<BackupEvent | undefined>)
 }
 interface BaseApp {
  onModelCreate(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
 }
 interface BaseApp {
  onModelCreateExecute(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
 }
 interface BaseApp {
  onModelAfterCreateSuccess(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
 }
 interface BaseApp {
  onModelAfterCreateError(...tags: string[]): (hook.TaggedHook<ModelErrorEvent | undefined>)
 }
 interface BaseApp {
  onModelUpdate(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
 }
 interface BaseApp {
  onModelUpdateExecute(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
 }
 interface BaseApp {
  onModelAfterUpdateSuccess(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
 }
 interface BaseApp {
  onModelAfterUpdateError(...tags: string[]): (hook.TaggedHook<ModelErrorEvent | undefined>)
 }
 interface BaseApp {
  onModelValidate(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
 }
 interface BaseApp {
  onModelDelete(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
 }
 interface BaseApp {
  onModelDeleteExecute(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
 }
 interface BaseApp {
  onModelAfterDeleteSuccess(...tags: string[]): (hook.TaggedHook<ModelEvent | undefined>)
 }
 interface BaseApp {
  onModelAfterDeleteError(...tags: string[]): (hook.TaggedHook<ModelErrorEvent | undefined>)
 }
 interface BaseApp {
  onRecordEnrich(...tags: string[]): (hook.TaggedHook<RecordEnrichEvent | undefined>)
 }
 interface BaseApp {
  onRecordValidate(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
 }
 interface BaseApp {
  onRecordCreate(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
 }
 interface BaseApp {
  onRecordCreateExecute(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
 }
 interface BaseApp {
  onRecordAfterCreateSuccess(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
 }
 interface BaseApp {
  onRecordAfterCreateError(...tags: string[]): (hook.TaggedHook<RecordErrorEvent | undefined>)
 }
 interface BaseApp {
  onRecordUpdate(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
 }
 interface BaseApp {
  onRecordUpdateExecute(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
 }
 interface BaseApp {
  onRecordAfterUpdateSuccess(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
 }
 interface BaseApp {
  onRecordAfterUpdateError(...tags: string[]): (hook.TaggedHook<RecordErrorEvent | undefined>)
 }
 interface BaseApp {
  onRecordDelete(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
 }
 interface BaseApp {
  onRecordDeleteExecute(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
 }
 interface BaseApp {
  onRecordAfterDeleteSuccess(...tags: string[]): (hook.TaggedHook<RecordEvent | undefined>)
 }
 interface BaseApp {
  onRecordAfterDeleteError(...tags: string[]): (hook.TaggedHook<RecordErrorEvent | undefined>)
 }
 interface BaseApp {
  onCollectionValidate(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
 }
 interface BaseApp {
  onCollectionCreate(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
 }
 interface BaseApp {
  onCollectionCreateExecute(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
 }
 interface BaseApp {
  onCollectionAfterCreateSuccess(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
 }
 interface BaseApp {
  onCollectionAfterCreateError(...tags: string[]): (hook.TaggedHook<CollectionErrorEvent | undefined>)
 }
 interface BaseApp {
  onCollectionUpdate(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
 }
 interface BaseApp {
  onCollectionUpdateExecute(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
 }
 interface BaseApp {
  onCollectionAfterUpdateSuccess(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
 }
 interface BaseApp {
  onCollectionAfterUpdateError(...tags: string[]): (hook.TaggedHook<CollectionErrorEvent | undefined>)
 }
 interface BaseApp {
  onCollectionDelete(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
 }
 interface BaseApp {
  onCollectionDeleteExecute(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
 }
 interface BaseApp {
  onCollectionAfterDeleteSuccess(...tags: string[]): (hook.TaggedHook<CollectionEvent | undefined>)
 }
 interface BaseApp {
  onCollectionAfterDeleteError(...tags: string[]): (hook.TaggedHook<CollectionErrorEvent | undefined>)
 }
 interface BaseApp {
  onMailerSend(): (hook.Hook<MailerEvent | undefined>)
 }
 interface BaseApp {
  onMailerRecordPasswordResetSend(...tags: string[]): (hook.TaggedHook<MailerRecordEvent | undefined>)
 }
 interface BaseApp {
  onMailerRecordVerificationSend(...tags: string[]): (hook.TaggedHook<MailerRecordEvent | undefined>)
 }
 interface BaseApp {
  onMailerRecordEmailChangeSend(...tags: string[]): (hook.TaggedHook<MailerRecordEvent | undefined>)
 }
 interface BaseApp {
  onMailerRecordOTPSend(...tags: string[]): (hook.TaggedHook<MailerRecordEvent | undefined>)
 }
 interface BaseApp {
  onMailerRecordAuthAlertSend(...tags: string[]): (hook.TaggedHook<MailerRecordEvent | undefined>)
 }
 interface BaseApp {
  onRealtimeConnectRequest(): (hook.Hook<RealtimeConnectRequestEvent | undefined>)
 }
 interface BaseApp {
  onRealtimeMessageSend(): (hook.Hook<RealtimeMessageEvent | undefined>)
 }
 interface BaseApp {
  onRealtimeSubscribeRequest(): (hook.Hook<RealtimeSubscribeRequestEvent | undefined>)
 }
 interface BaseApp {
  onSettingsListRequest(): (hook.Hook<SettingsListRequestEvent | undefined>)
 }
 interface BaseApp {
  onSettingsUpdateRequest(): (hook.Hook<SettingsUpdateRequestEvent | undefined>)
 }
 interface BaseApp {
  onSettingsReload(): (hook.Hook<SettingsReloadEvent | undefined>)
 }
 interface BaseApp {
  onFileDownloadRequest(...tags: string[]): (hook.TaggedHook<FileDownloadRequestEvent | undefined>)
 }
 interface BaseApp {
  onFileTokenRequest(...tags: string[]): (hook.TaggedHook<FileTokenRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordAuthRequest(...tags: string[]): (hook.TaggedHook<RecordAuthRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordAuthWithPasswordRequest(...tags: string[]): (hook.TaggedHook<RecordAuthWithPasswordRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordAuthWithOAuth2Request(...tags: string[]): (hook.TaggedHook<RecordAuthWithOAuth2RequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordAuthRefreshRequest(...tags: string[]): (hook.TaggedHook<RecordAuthRefreshRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordRequestPasswordResetRequest(...tags: string[]): (hook.TaggedHook<RecordRequestPasswordResetRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordConfirmPasswordResetRequest(...tags: string[]): (hook.TaggedHook<RecordConfirmPasswordResetRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordRequestVerificationRequest(...tags: string[]): (hook.TaggedHook<RecordRequestVerificationRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordConfirmVerificationRequest(...tags: string[]): (hook.TaggedHook<RecordConfirmVerificationRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordRequestEmailChangeRequest(...tags: string[]): (hook.TaggedHook<RecordRequestEmailChangeRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordConfirmEmailChangeRequest(...tags: string[]): (hook.TaggedHook<RecordConfirmEmailChangeRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordRequestOTPRequest(...tags: string[]): (hook.TaggedHook<RecordCreateOTPRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordAuthWithOTPRequest(...tags: string[]): (hook.TaggedHook<RecordAuthWithOTPRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordsListRequest(...tags: string[]): (hook.TaggedHook<RecordsListRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordViewRequest(...tags: string[]): (hook.TaggedHook<RecordRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordCreateRequest(...tags: string[]): (hook.TaggedHook<RecordRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordUpdateRequest(...tags: string[]): (hook.TaggedHook<RecordRequestEvent | undefined>)
 }
 interface BaseApp {
  onRecordDeleteRequest(...tags: string[]): (hook.TaggedHook<RecordRequestEvent | undefined>)
 }
 interface BaseApp {
  onCollectionsListRequest(): (hook.Hook<CollectionsListRequestEvent | undefined>)
 }
 interface BaseApp {
  onCollectionViewRequest(): (hook.Hook<CollectionRequestEvent | undefined>)
 }
 interface BaseApp {
  onCollectionCreateRequest(): (hook.Hook<CollectionRequestEvent | undefined>)
 }
 interface BaseApp {
  onCollectionUpdateRequest(): (hook.Hook<CollectionRequestEvent | undefined>)
 }
 interface BaseApp {
  onCollectionDeleteRequest(): (hook.Hook<CollectionRequestEvent | undefined>)
 }
 interface BaseApp {
  onCollectionsImportRequest(): (hook.Hook<CollectionsImportRequestEvent | undefined>)
 }
 interface BaseApp {
  onBatchRequest(): (hook.Hook<BatchRequestEvent | undefined>)
 }
 interface BaseApp {
   
                                                                            
     
                                                
                                                                              
     
                                                                         
                                                                    
     
                                                                            
                                                       
     
                                                     
                                                                          
     
                                                                         
                                                                               
     
                                                                               
   
  createBackup(ctx: context.Context, name: string): void
 }
 interface BaseApp {
   
                                                                           
                                             
     
                                                                                                   
     
                                                                            
                                                             
     
                             
     
                                                                       
        
                                                                             
        
     
                                                                        
        
                                                       
        
     
                                                                                                      
        
                                                                                 
                                                        
                                                                   
                                                      
        
     
                                                             
     
                                                                                           
     
                                                                                
                                                                  
     
                                                                                
                                                                         
                                                                
   
  restoreBackup(ctx: context.Context, name: string): void
 }
 interface BaseApp {
   
                                                                        
                                                                                                   
   
  importCollectionsByMarshaledJSON(rawSliceOfMaps: string|Array<number>, deleteMissing: boolean): void
 }
 interface BaseApp {
   
                                                                                     
     
                                                                                                      
     
                                                                                
                                                                        
                                                
   
  importCollections(toImport: Array<_TygojaDict>, deleteMissing: boolean): void
 }
  
                                                                          
  
 type _sgCorye = BaseModel
 interface baseCollection extends _sgCorye {
  listRule?: string
  viewRule?: string
  createRule?: string
  updateRule?: string
  deleteRule?: string
   
                                                                                   
                                                                               
                                                          
   
  rawOptions: types.JSONRaw
  name: string
  type: string
  fields: FieldsList
  indexes: types.JSONArray<string>
  created: types.DateTime
  updated: types.DateTime
   
                                                                      
                                                                                                          
   
  system: boolean
 }
  
                                                                                         
  
 type _sTnATDt = baseCollection&collectionAuthOptions&collectionViewOptions
 interface Collection extends _sTnATDt {
 }
 interface newCollection {
   
                                                                                                   
     
                                                                       
                                                               
   
  (typ: string, name: string, ...optId: string[]): (Collection)
 }
 interface newBaseCollection {
   
                                                                             
     
                                                                       
                                                               
   
  (name: string, ...optId: string[]): (Collection)
 }
 interface newViewCollection {
   
                                                                             
     
                                                                       
                                                               
   
  (name: string, ...optId: string[]): (Collection)
 }
 interface newAuthCollection {
   
                                                                             
     
                                                                       
                                                               
   
  (name: string, ...optId: string[]): (Collection)
 }
 interface Collection {
   
                                                           
   
  tableName(): string
 }
 interface Collection {
   
                                                                       
   
  baseFilesPath(): string
 }
 interface Collection {
   
                                                             
   
  isBase(): boolean
 }
 interface Collection {
   
                                                             
   
  isAuth(): boolean
 }
 interface Collection {
   
                                                             
   
  isView(): boolean
 }
 interface Collection {
   
                                                                                                         
   
  integrityChecks(enable: boolean): void
 }
 interface Collection {
   
                                                                          
                                                                       
   
  postScan(): void
 }
 interface Collection {
   
                                                               
     
                                                                           
                                                                    
   
  unmarshalJSON(b: string|Array<number>): void
 }
 interface Collection {
   
                                                           
     
                                                                         
                                                                
   
  marshalJSON(): string|Array<number>
 }
 interface Collection {
   
                                                                      
   
  string(): string
 }
 interface Collection {
   
                                                                                  
   
  dbExport(app: App): _TygojaDict
 }
 interface Collection {
   
                                                                       
   
  getIndex(name: string): string
 }
 interface Collection {
   
                                                           
     
                                                                                                        
   
  addIndex(name: string, unique: boolean, columnsExpr: string, optWhereExpr: string): void
 }
 interface Collection {
   
                                                                                            
   
  removeIndex(name: string): void
 }
  
                                                                             
  
 interface collectionAuthOptions {
   
                                                                    
                                                                       
                                       
     
                                                                  
                       
     
                                                                                
     
                                                                           
                                            
   
  authRule?: string
   
                                                                    
                                                                    
                                                                               
     
                                                                          
   
  manageRule?: string
   
                                                                              
   
  authAlert: AuthAlertConfig
   
                                                                       
                                            
   
  oauth2: OAuth2Config
   
                                                                                    
   
  passwordAuth: PasswordAuthConfig
   
                                                                          
   
  mfa: MFAConfig
   
                                                                               
   
  otp: OTPConfig
   
                                 
        
   
  authToken: TokenConfig
  passwordResetToken: TokenConfig
  emailChangeToken: TokenConfig
  verificationToken: TokenConfig
  fileToken: TokenConfig
   
                            
        
   
  verificationTemplate: EmailTemplate
  resetPasswordTemplate: EmailTemplate
  confirmEmailChangeTemplate: EmailTemplate
 }
 interface EmailTemplate {
  subject: string
  body: string
 }
 interface EmailTemplate {
   
                                                                                                 
   
  validate(): void
 }
 interface EmailTemplate {
   
                                                                     
                                                                 
   
  resolve(placeholders: _TygojaDict): [string, string]
 }
 interface AuthAlertConfig {
  enabled: boolean
  emailTemplate: EmailTemplate
 }
 interface AuthAlertConfig {
   
                                                                                                   
   
  validate(): void
 }
 interface TokenConfig {
  secret: string
   
                                                                         
   
  duration: number
 }
 interface TokenConfig {
   
                                                                                               
   
  validate(): void
 }
 interface TokenConfig {
   
                                                                  
   
  durationTime(): time.Duration
 }
 interface OTPConfig {
  enabled: boolean
   
                                                                 
   
  duration: number
   
                                                         
   
  length: number
   
                                                                                          
     
                                                                    
                                                                 
   
  emailTemplate: EmailTemplate
 }
 interface OTPConfig {
   
                                                                                             
   
  validate(): void
 }
 interface OTPConfig {
   
                                                                  
   
  durationTime(): time.Duration
 }
 interface MFAConfig {
  enabled: boolean
   
                                                                       
   
  duration: number
   
                                                                                          
     
                                               
   
  rule: string
 }
 interface MFAConfig {
   
                                                                                             
   
  validate(): void
 }
 interface MFAConfig {
   
                                                                  
   
  durationTime(): time.Duration
 }
 interface PasswordAuthConfig {
  enabled: boolean
   
                                                                  
                                             
     
                                                                                    
   
  identityFields: Array<string>
 }
 interface PasswordAuthConfig {
   
                                                                                                      
   
  validate(): void
 }
 interface OAuth2KnownFields {
  id: string
  name: string
  username: string
  avatarURL: string
 }
 interface OAuth2Config {
  providers: Array<OAuth2ProviderConfig>
  mappedFields: OAuth2KnownFields
  enabled: boolean
 }
 interface OAuth2Config {
   
                                                                                              
     
                                                                                   
   
  getProviderConfig(name: string): [OAuth2ProviderConfig, boolean]
 }
 interface OAuth2Config {
   
                                                                                                
   
  validate(): void
 }
 interface OAuth2ProviderConfig {
   
                                                             
     
                                                                                      
                                                                                                      
                                                                                          
   
  pkce?: boolean
  name: string
  clientId: string
  clientSecret: string
  authURL: string
  tokenURL: string
  userInfoURL: string
  displayName: string
  extra: _TygojaDict
 }
 interface OAuth2ProviderConfig {
   
                                                                                                        
   
  validate(): void
 }
 interface OAuth2ProviderConfig {
   
                                                                                                            
   
  initProvider(): auth.Provider
 }
  
                                                                             
  
 interface collectionBaseOptions {
 }
  
                                                                             
  
 interface collectionViewOptions {
  viewQuery: string
 }
 interface BaseApp {
   
                                                           
   
  collectionQuery(): (dbx.SelectQuery)
 }
 interface BaseApp {
   
                                                                
     
                                                               
     
             
     
        
                                                 
                                                                              
        
   
  findAllCollections(...collectionTypes: string[]): Array<(Collection | undefined)>
 }
 interface BaseApp {
   
                                                                                        
   
  reloadCachedCollections(): void
 }
 interface BaseApp {
   
                                                                                             
   
  findCollectionByNameOrId(nameOrId: string): (Collection)
 }
 interface BaseApp {
   
                                                                                    
                                                                                 
     
                                                                     
     
                                                                      
                                                        
     
                                                                 
                                                    
     
             
     
        
                                                                              
                                                                                  
                                                                                       
                                                                                                   
                                                                                                   
                                                                                            
                                                                                     
        
   
  findCachedCollectionByNameOrId(nameOrId: string): (Collection)
 }
 interface BaseApp {
   
                                                                         
                                         
     
                                                                       
                                                                       
                                
   
  findCollectionReferences(collection: Collection, ...excludeIds: string[]): _TygojaDict
 }
 interface BaseApp {
   
                                                                                    
                                                                                 
     
                                                                     
     
                                                                 
                                                    
     
             
     
        
                                                                              
                                                                                  
                                                                                       
                                                                                                   
                                                                                                   
                                                                                            
                                                                                     
        
   
  findCachedCollectionReferences(collection: Collection, ...excludeIds: string[]): _TygojaDict
 }
 interface BaseApp {
   
                                                                       
                                                
     
                                                                  
                                
   
  isCollectionNameUnique(name: string, ...excludeIds: string[]): boolean
 }
 interface BaseApp {
   
                                                                                    
     
                                                                
                                               
     
                                                                
                                     
   
  truncateCollection(collection: Collection): void
 }
 interface BaseApp {
   
                                                                
                                                            
     
                                                                                          
     
                                                                                                 
   
  syncRecordTableSchema(newCollection: Collection, oldCollection: Collection): void
 }
 interface collectionValidator {
 }
 interface optionsValidator {
  [key:string]: any;
 }
  
                                                              
                                       
  
 interface DBExporter {
  [key:string]: any;
   
                                                                                                      
   
  dbExport(app: App): _TygojaDict
 }
  
                                                                      
                                                                                              
  
 interface PreValidator {
  [key:string]: any;
   
                                                                          
   
  preValidate(ctx: context.Context, app: App): void
 }
  
                                                                       
                                                                                                
  
 interface PostValidator {
  [key:string]: any;
   
                                                                   
                                       
   
  postValidate(ctx: context.Context, app: App): void
 }
 interface generateDefaultRandomId {
   
                                                                 
                                                                               
   
  (): string
 }
 interface BaseApp {
   
                                                                            
                                                                      
   
  modelQuery(m: Model): (dbx.SelectQuery)
 }
 interface BaseApp {
   
                                                                                    
                                                                      
   
  auxModelQuery(m: Model): (dbx.SelectQuery)
 }
 interface BaseApp {
   
                                                                      
   
  delete(model: Model): void
 }
 interface BaseApp {
   
                                                                     
                                                              
   
  deleteWithContext(ctx: context.Context, model: Model): void
 }
 interface BaseApp {
   
                                                                       
   
  auxDelete(model: Model): void
 }
 interface BaseApp {
   
                                                                                 
                                                              
   
  auxDeleteWithContext(ctx: context.Context, model: Model): void
 }
 interface BaseApp {
   
                                                                                
     
                                                                      
   
  save(model: Model): void
 }
 interface BaseApp {
   
                                                                                                           
     
                                                                                 
   
  saveWithContext(ctx: context.Context, model: Model): void
 }
 interface BaseApp {
   
                                                                                                           
     
                                                                             
   
  saveNoValidate(model: Model): void
 }
 interface BaseApp {
   
                                                                    
                                                               
     
                                                                                        
   
  saveNoValidateWithContext(ctx: context.Context, model: Model): void
 }
 interface BaseApp {
   
                                                                                     
     
                                                                         
   
  auxSave(model: Model): void
 }
 interface BaseApp {
   
                                                                                                                 
     
                                                                                    
   
  auxSaveWithContext(ctx: context.Context, model: Model): void
 }
 interface BaseApp {
   
                                                                                                                
     
                                                                                
   
  auxSaveNoValidate(model: Model): void
 }
 interface BaseApp {
   
                                                                          
                                                               
     
                                                                                           
   
  auxSaveNoValidateWithContext(ctx: context.Context, model: Model): void
 }
 interface BaseApp {
   
                                                                        
   
  validate(model: Model): void
 }
 interface BaseApp {
   
                                                                                              
   
  validateWithContext(ctx: context.Context, model: Model): void
 }
  
                                                     
  
 interface dualDBBuilder {
 }
 interface dualDBBuilder {
   
                                                                 
   
  select(...cols: string[]): (dbx.SelectQuery)
 }
 interface dualDBBuilder {
   
                                                               
   
  model(data: {
   }): (dbx.ModelQuery)
 }
 interface dualDBBuilder {
   
                                                                                           
   
  generatePlaceholder(i: number): string
 }
 interface dualDBBuilder {
   
                                                               
   
  quote(str: string): string
 }
 interface dualDBBuilder {
   
                                                                                             
   
  quoteSimpleTableName(table: string): string
 }
 interface dualDBBuilder {
   
                                                                                               
   
  quoteSimpleColumnName(col: string): string
 }
 interface dualDBBuilder {
   
                                                                             
   
  queryBuilder(): dbx.QueryBuilder
 }
 interface dualDBBuilder {
   
                                                                 
   
  insert(table: string, cols: dbx.Params): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                 
   
  upsert(table: string, cols: dbx.Params, ...constraints: string[]): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                 
   
  update(table: string, cols: dbx.Params, where: dbx.Expression): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                 
   
  delete(table: string, where: dbx.Expression): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                           
   
  createTable(table: string, cols: _TygojaDict, ...options: string[]): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                           
   
  renameTable(oldName: string, newName: string): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                       
   
  dropTable(table: string): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                               
   
  truncateTable(table: string): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                       
   
  addColumn(table: string, col: string, typ: string): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                         
   
  dropColumn(table: string, col: string): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                             
   
  renameColumn(table: string, oldName: string, newName: string): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                           
   
  alterColumn(table: string, col: string, typ: string): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                               
   
  addPrimaryKey(table: string, name: string, ...cols: string[]): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                                 
   
  dropPrimaryKey(table: string, name: string): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                               
   
  addForeignKey(table: string, name: string, cols: Array<string>, refCols: Array<string>, refTable: string, ...options: string[]): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                                 
   
  dropForeignKey(table: string, name: string): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                           
   
  createIndex(table: string, name: string, ...cols: string[]): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                                       
   
  createUniqueIndex(table: string, name: string, ...cols: string[]): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                       
   
  dropIndex(table: string, name: string): (dbx.Query)
 }
 interface dualDBBuilder {
   
                                                                       
                                                                   
   
  newQuery(str: string): (dbx.Query)
 }
 interface defaultDBConnect {
  (dbPath: string): (dbx.DB)
 }
  
                                                                                  
    
                                                        
  
 interface Model {
  [key:string]: any;
  tableName(): string
  pk(): any
  lastSavedPK(): any
  isNew(): boolean
  markAsNew(): void
  markAsNotNew(): void
 }
  
                                                                                             
  
 interface BaseModel {
   
                                        
                                                                    
   
  id: string
 }
 interface BaseModel {
   
                                                                 
     
                                                                                          
   
  lastSavedPK(): any
 }
 interface BaseModel {
  pk(): any
 }
 interface BaseModel {
   
                                                             
                                            
   
  isNew(): boolean
 }
 interface BaseModel {
   
                                                                       
                                        
   
  markAsNew(): void
 }
 interface BaseModel {
   
                                                                           
                                                      
   
  markAsNotNew(): void
 }
 interface BaseModel {
   
                                                         
     
                                                                                      
   
  postScan(): void
 }
 interface BaseApp {
   
                                                                         
   
  tableColumns(tableName: string): Array<string>
 }
 interface TableInfoRow {
   
                                                               
                                                          
   
  pk: number
  index: number
  name: string
  type: string
  notNull: boolean
  defaultValue: sql.NullString
 }
 interface BaseApp {
   
                                                                              
   
  tableInfo(tableName: string): Array<(TableInfoRow | undefined)>
 }
 interface BaseApp {
   
                                                                                             
     
                                                                    
   
  tableIndexes(tableName: string): _TygojaDict
 }
 interface BaseApp {
   
                                           
     
                                                                            
     
                                                                         
                                                                     
   
  deleteTable(dangerousTableName: string): void
 }
 interface BaseApp {
   
                                                                                           
                    
   
  hasTable(tableName: string): boolean
 }
 interface BaseApp {
   
                                                                                             
                          
   
  auxHasTable(tableName: string): boolean
 }
 interface BaseApp {
   
                                                                                         
   
  vacuum(): void
 }
 interface BaseApp {
   
                                                                                                      
   
  auxVacuum(): void
 }
 interface BaseApp {
   
                                                                               
     
                                                                                       
   
  runInTransaction(fn: (txApp: App) => void): void
 }
 interface BaseApp {
   
                                                                                    
     
                                                                                       
   
  auxRunInTransaction(fn: (txApp: App) => void): void
 }
  
                                                                                              
  
 interface TxAppInfo {
 }
 interface TxAppInfo {
   
                                                                    
                                                                                                   
     
                                                                          
                                                                       
                                                                            
   
  onComplete(fn: (txErr: Error) => void): void
 }
  
                                                             
  
 type _swFpQFv = router.Event
 interface RequestEvent extends _swFpQFv {
  app: App
  auth?: Record
 }
 interface RequestEvent {
   
                                                                                    
     
                                                                         
                                  
     
        
                                                                        
                                                                                               
                                           
   
  realIP(): string
 }
 interface RequestEvent {
   
                                                                                                  
   
  hasSuperuserAuth(): boolean
 }
 interface RequestEvent {
   
                                                                      
     
                                                                                             
                                                                                                                       
   
  requestInfo(): (RequestInfo)
 }
  
                                                                
                                                
    
                                                                                    
  
 interface RequestInfo {
  query: _TygojaDict
  headers: _TygojaDict
  body: _TygojaDict
  auth?: Record
  method: string
  context: string
 }
 interface RequestInfo {
   
                                                                     
                                         
   
  hasSuperuserAuth(): boolean
 }
 interface RequestInfo {
   
                                                                                              
   
  clone(): (RequestInfo)
 }
 type _sJxHoKB = hook.Event&RequestEvent
 interface BatchRequestEvent extends _sJxHoKB {
  batch: Array<(InternalRequest | undefined)>
 }
 interface InternalRequest {
   
                                                                                              
   
  body: _TygojaDict
  headers: _TygojaDict
  method: string
  url: string
 }
 interface InternalRequest {
  validate(): void
 }
 interface HookTagger {
  [key:string]: any;
  hookTags(): Array<string>
 }
 interface baseModelEventData {
  model: Model
 }
 interface baseModelEventData {
  tags(): Array<string>
 }
 interface baseRecordEventData {
  record?: Record
 }
 interface baseRecordEventData {
  tags(): Array<string>
 }
 interface baseCollectionEventData {
  collection?: Collection
 }
 interface baseCollectionEventData {
  tags(): Array<string>
 }
 type _sejQixm = hook.Event
 interface BootstrapEvent extends _sejQixm {
  app: App
 }
 type _sybBNKu = hook.Event
 interface TerminateEvent extends _sybBNKu {
  app: App
  isRestart: boolean
 }
 type _sqEhbNR = hook.Event
 interface BackupEvent extends _sqEhbNR {
  app: App
  context: context.Context
  name: string 
  exclude: Array<string> 
 }
 type _sKdizqZ = hook.Event
 interface ServeEvent extends _sKdizqZ {
  app: App
  router?: router.Router<RequestEvent | undefined>
  server?: http.Server
  certManager?: any
   
                                                         
     
                                                                      
   
  listener: net.Listener
   
                                                                   
                                                                
                                  
     
                                                                                          
     
                                                                                   
                                                                                         
                                                              
                                                                  
                                                                        
                                    
     
                                                     
   
  installerFunc: (app: App, systemSuperuser: Record, baseURL: string) => void
 }
 type _sdreoYG = hook.Event&RequestEvent
 interface SettingsListRequestEvent extends _sdreoYG {
  settings?: Settings
 }
 type _sESXPCC = hook.Event&RequestEvent
 interface SettingsUpdateRequestEvent extends _sESXPCC {
  oldSettings?: Settings
  newSettings?: Settings
 }
 type _sugHIea = hook.Event
 interface SettingsReloadEvent extends _sugHIea {
  app: App
 }
 type _susBNhX = hook.Event
 interface MailerEvent extends _susBNhX {
  app: App
  mailer: mailer.Mailer
  message?: mailer.Message
 }
 type _sgFTLby = MailerEvent&baseRecordEventData
 interface MailerRecordEvent extends _sgFTLby {
  meta: _TygojaDict
 }
 type _syJVTjW = hook.Event&baseModelEventData
 interface ModelEvent extends _syJVTjW {
  app: App
  context: context.Context
   
                                                         
             
             
             
               
   
  type: string
 }
 type _szrzmJH = ModelEvent
 interface ModelErrorEvent extends _szrzmJH {
  error: Error
 }
 type _sOSqjGv = hook.Event&baseRecordEventData
 interface RecordEvent extends _sOSqjGv {
  app: App
  context: context.Context
   
                                                         
             
             
             
               
   
  type: string
 }
 type _swqGfJo = RecordEvent
 interface RecordErrorEvent extends _swqGfJo {
  error: Error
 }
 type _sxvlbLv = hook.Event&baseCollectionEventData
 interface CollectionEvent extends _sxvlbLv {
  app: App
  context: context.Context
   
                                                         
             
             
             
               
   
  type: string
 }
 type _soJBydl = CollectionEvent
 interface CollectionErrorEvent extends _soJBydl {
  error: Error
 }
 type _szYAqdM = hook.Event&RequestEvent&baseRecordEventData
 interface FileTokenRequestEvent extends _szYAqdM {
  token: string
 }
 type _suJHmPO = hook.Event&RequestEvent&baseCollectionEventData
 interface FileDownloadRequestEvent extends _suJHmPO {
  record?: Record
  fileField?: FileField
  servedPath: string
  servedName: string
   
                                                                 
                                                                                
     
                                                                                  
                                                                                                   
   
  thumbError: Error
 }
 type _sKnulHe = hook.Event&RequestEvent
 interface CollectionsListRequestEvent extends _sKnulHe {
  collections: Array<(Collection | undefined)>
  result?: search.Result
 }
 type _sRaGbaZ = hook.Event&RequestEvent
 interface CollectionsImportRequestEvent extends _sRaGbaZ {
  collectionsData: Array<_TygojaDict>
  deleteMissing: boolean
 }
 type _syrzfdd = hook.Event&RequestEvent&baseCollectionEventData
 interface CollectionRequestEvent extends _syrzfdd {
 }
 type _stGnaDc = hook.Event&RequestEvent
 interface RealtimeConnectRequestEvent extends _stGnaDc {
  client: subscriptions.Client
   
                                                       
   
  idleTimeout: time.Duration
 }
 type _sRRluMq = hook.Event&RequestEvent
 interface RealtimeMessageEvent extends _sRRluMq {
  client: subscriptions.Client
  message?: subscriptions.Message
 }
 type _sWlrBkA = hook.Event&RequestEvent
 interface RealtimeSubscribeRequestEvent extends _sWlrBkA {
  client: subscriptions.Client
  subscriptions: Array<string>
 }
 type _sgchqvD = hook.Event&RequestEvent&baseCollectionEventData
 interface RecordsListRequestEvent extends _sgchqvD {
   
                                                                           
   
  records: Array<(Record | undefined)>
  result?: search.Result
 }
 type _sIAKosJ = hook.Event&RequestEvent&baseCollectionEventData
 interface RecordRequestEvent extends _sIAKosJ {
  record?: Record
 }
 type _sbaTAxD = hook.Event&baseRecordEventData
 interface RecordEnrichEvent extends _sbaTAxD {
  app: App
  requestInfo?: RequestInfo
 }
 type _szUiBRy = hook.Event&RequestEvent&baseCollectionEventData
 interface RecordCreateOTPRequestEvent extends _szUiBRy {
  record?: Record
  password: string
 }
 type _sYxguCh = hook.Event&RequestEvent&baseCollectionEventData
 interface RecordAuthWithOTPRequestEvent extends _sYxguCh {
  record?: Record
  otp?: OTP
 }
 type _sMvnkTv = hook.Event&RequestEvent&baseCollectionEventData
 interface RecordAuthRequestEvent extends _sMvnkTv {
  record?: Record
  token: string
  meta: any
  authMethod: string
 }
 type _sICvRyF = hook.Event&RequestEvent&baseCollectionEventData
 interface RecordAuthWithPasswordRequestEvent extends _sICvRyF {
  record?: Record
  identity: string
  identityField: string
  password: string
 }
 type _sLyqWpc = hook.Event&RequestEvent&baseCollectionEventData
 interface RecordAuthWithOAuth2RequestEvent extends _sLyqWpc {
  providerName: string
  providerClient: auth.Provider
  record?: Record
  oAuth2User?: auth.AuthUser
  createData: _TygojaDict
  isNewRecord: boolean
 }
 type _sXsCzmk = hook.Event&RequestEvent&baseCollectionEventData
 interface RecordAuthRefreshRequestEvent extends _sXsCzmk {
  record?: Record
 }
 type _skTQQPn = hook.Event&RequestEvent&baseCollectionEventData
 interface RecordRequestPasswordResetRequestEvent extends _skTQQPn {
  record?: Record
 }
 type _sOWtaFK = hook.Event&RequestEvent&baseCollectionEventData
 interface RecordConfirmPasswordResetRequestEvent extends _sOWtaFK {
  record?: Record
 }
 type _svMkLUh = hook.Event&RequestEvent&baseCollectionEventData
 interface RecordRequestVerificationRequestEvent extends _svMkLUh {
  record?: Record
 }
 type _stzNash = hook.Event&RequestEvent&baseCollectionEventData
 interface RecordConfirmVerificationRequestEvent extends _stzNash {
  record?: Record
 }
 type _scgCiPq = hook.Event&RequestEvent&baseCollectionEventData
 interface RecordRequestEmailChangeRequestEvent extends _scgCiPq {
  record?: Record
  newEmail: string
 }
 type _suIaguG = hook.Event&RequestEvent&baseCollectionEventData
 interface RecordConfirmEmailChangeRequestEvent extends _suIaguG {
  record?: Record
  newEmail: string
 }
  
                                                                                      
  
 type _sLrLnIX = Record
 interface ExternalAuth extends _sLrLnIX {
 }
 interface newExternalAuth {
   
                                                                              
     
                   
     
        
                                     
                              
                                               
                              
                             
                  
        
   
  (app: App): (ExternalAuth)
 }
 interface ExternalAuth {
   
                                                                   
                                          
   
  preValidate(ctx: context.Context, app: App): void
 }
 interface ExternalAuth {
   
                                                  
   
  proxyRecord(): (Record)
 }
 interface ExternalAuth {
   
                                                                            
   
  setProxyRecord(record: Record): void
 }
 interface ExternalAuth {
   
                                                           
   
  collectionRef(): string
 }
 interface ExternalAuth {
   
                                                                     
   
  setCollectionRef(collectionId: string): void
 }
 interface ExternalAuth {
   
                                                          
   
  recordRef(): string
 }
 interface ExternalAuth {
   
                                                             
   
  setRecordRef(recordId: string): void
 }
 interface ExternalAuth {
   
                                                        
   
  provider(): string
 }
 interface ExternalAuth {
   
                                                           
   
  setProvider(provider: string): void
 }
 interface ExternalAuth {
   
                                                          
   
  providerId(): string
 }
 interface ExternalAuth {
   
                                                             
   
  setProviderId(providerId: string): void
 }
 interface ExternalAuth {
   
                                                      
   
  created(): types.DateTime
 }
 interface ExternalAuth {
   
                                                      
   
  updated(): types.DateTime
 }
 interface BaseApp {
   
                                                                 
                                        
   
  findAllExternalAuthsByRecord(authRecord: Record): Array<(ExternalAuth | undefined)>
 }
 interface BaseApp {
   
                                                                     
                                            
   
  findAllExternalAuthsByCollection(collection: Collection): Array<(ExternalAuth | undefined)>
 }
 interface BaseApp {
   
                                                                                      
                                                              
   
  findFirstExternalAuthByExpr(expr: dbx.Expression): (ExternalAuth)
 }
  
                                                                                      
  
 interface FieldFactoryFunc {(): Field }
  
                                                                                 
  
 interface Field {
  [key:string]: any;
   
                                
   
  getId(): string
   
                                
   
  setId(id: string): void
   
                                    
   
  getName(): string
   
                                    
   
  setName(name: string): void
   
                                                   
   
  getSystem(): boolean
   
                                                   
   
  setSystem(system: boolean): void
   
                                                   
   
  getHidden(): boolean
   
                                                   
   
  setHidden(hidden: boolean): void
   
                                               
   
  type(): string
   
                                                              
   
  columnType(app: App): string
   
                                                                                         
     
                                                                                             
   
  prepareValue(record: Record, raw: any): any
   
                                                                                            
   
  validateValue(ctx: context.Context, app: App, record: Record): void
   
                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
  
                                                                 
                                             
  
 interface MaxBodySizeCalculator {
  [key:string]: any;
   
                                                                                 
   
  calculateMaxBodySize(): number
 }
 interface SetterFunc {(record: Record, raw: any): void }
  
                                                                                      
  
 interface SetterFinder {
  [key:string]: any;
   
                                                            
                                                                       
     
                                                             
                                                                                        
                                                                                                        
     
                                                                          
   
  findSetter(key: string): SetterFunc
 }
 interface GetterFunc {(record: Record): any }
  
                                                                                      
  
 interface GetterFinder {
  [key:string]: any;
   
                                                            
                                                                       
     
                                                             
                                                                                        
                                                                                                                      
     
                                                                          
   
  findGetter(key: string): GetterFunc
 }
  
                                                                       
                                   
  
 interface DriverValuer {
  [key:string]: any;
   
                                                                              
   
  driverValue(record: Record): any
 }
  
                                                                                                 
  
 interface MultiValuer {
  [key:string]: any;
   
                                                                                            
   
  isMultiple(): boolean
 }
  
                                                                       
                                                               
  
 interface RecordInterceptor {
  [key:string]: any;
   
                                                                
                                                                
                                       
     
                                                                    
                                        
   
  intercept(ctx: context.Context, app: App, record: Record, actionName: string, actionFunc: () => void): void
 }
 interface defaultFieldIdValidationRule {
   
                                                                               
   
  (value: any): void
 }
 interface defaultFieldNameValidationRule {
   
                                                                                 
   
  (value: any): void
 }
  
                                                        
                                                                         
    
                                                                                          
    
                                                                                       
  
 interface AutodateField {
   
                                                     
   
  name: string
   
                                              
     
                                                                                        
   
  id: string
   
                                                           
   
  system: boolean
   
                                                  
   
  hidden: boolean
   
                                                             
                                                      
   
  presentable: boolean
   
                                                                             
   
  onCreate: boolean
   
                                                                             
   
  onUpdate: boolean
 }
 interface AutodateField {
   
                                                   
   
  type(): string
 }
 interface AutodateField {
   
                                                     
   
  getId(): string
 }
 interface AutodateField {
   
                                                     
   
  setId(id: string): void
 }
 interface AutodateField {
   
                                                         
   
  getName(): string
 }
 interface AutodateField {
   
                                                         
   
  setName(name: string): void
 }
 interface AutodateField {
   
                                                             
   
  getSystem(): boolean
 }
 interface AutodateField {
   
                                                             
   
  setSystem(system: boolean): void
 }
 interface AutodateField {
   
                                                             
   
  getHidden(): boolean
 }
 interface AutodateField {
   
                                                             
   
  setHidden(hidden: boolean): void
 }
 interface AutodateField {
   
                                                               
   
  columnType(app: App): string
 }
 interface AutodateField {
   
                                                                   
   
  prepareValue(record: Record, raw: any): any
 }
 interface AutodateField {
   
                                                                     
   
  validateValue(ctx: context.Context, app: App, record: Record): void
 }
 interface AutodateField {
   
                                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
 interface AutodateField {
   
                                                        
   
  findSetter(key: string): SetterFunc
 }
 interface AutodateField {
   
                                                            
   
  intercept(ctx: context.Context, app: App, record: Record, actionName: string, actionFunc: () => void): void
 }
  
                                                                           
    
                                                    
  
 interface BoolField {
   
                                                     
   
  name: string
   
                                              
     
                                                                                        
   
  id: string
   
                                                           
   
  system: boolean
   
                                                  
   
  hidden: boolean
   
                                                             
                                                      
   
  presentable: boolean
   
                                                               
   
  required: boolean
 }
 interface BoolField {
   
                                                   
   
  type(): string
 }
 interface BoolField {
   
                                                     
   
  getId(): string
 }
 interface BoolField {
   
                                                     
   
  setId(id: string): void
 }
 interface BoolField {
   
                                                         
   
  getName(): string
 }
 interface BoolField {
   
                                                         
   
  setName(name: string): void
 }
 interface BoolField {
   
                                                             
   
  getSystem(): boolean
 }
 interface BoolField {
   
                                                             
   
  setSystem(system: boolean): void
 }
 interface BoolField {
   
                                                             
   
  getHidden(): boolean
 }
 interface BoolField {
   
                                                             
   
  setHidden(hidden: boolean): void
 }
 interface BoolField {
   
                                                               
   
  columnType(app: App): string
 }
 interface BoolField {
   
                                                                   
   
  prepareValue(record: Record, raw: any): any
 }
 interface BoolField {
   
                                                                     
   
  validateValue(ctx: context.Context, app: App, record: Record): void
 }
 interface BoolField {
   
                                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
  
                                                                                 
    
                                                                        
  
 interface DateField {
   
                                                     
   
  name: string
   
                                              
     
                                                                                        
   
  id: string
   
                                                           
   
  system: boolean
   
                                                  
   
  hidden: boolean
   
                                                             
                                                      
   
  presentable: boolean
   
                                               
     
                                          
   
  min: types.DateTime
   
                                               
     
                                          
   
  max: types.DateTime
   
                                                                           
   
  required: boolean
 }
 interface DateField {
   
                                                   
   
  type(): string
 }
 interface DateField {
   
                                                     
   
  getId(): string
 }
 interface DateField {
   
                                                     
   
  setId(id: string): void
 }
 interface DateField {
   
                                                         
   
  getName(): string
 }
 interface DateField {
   
                                                         
   
  setName(name: string): void
 }
 interface DateField {
   
                                                             
   
  getSystem(): boolean
 }
 interface DateField {
   
                                                             
   
  setSystem(system: boolean): void
 }
 interface DateField {
   
                                                             
   
  getHidden(): boolean
 }
 interface DateField {
   
                                                             
   
  setHidden(hidden: boolean): void
 }
 interface DateField {
   
                                                               
   
  columnType(app: App): string
 }
 interface DateField {
   
                                                                   
   
  prepareValue(record: Record, raw: any): any
 }
 interface DateField {
   
                                                                     
   
  validateValue(ctx: context.Context, app: App, record: Record): void
 }
 interface DateField {
   
                                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
  
                                                                         
    
                                                           
  
 interface EditorField {
   
                                                     
   
  name: string
   
                                              
     
                                                                                        
   
  id: string
   
                                                           
   
  system: boolean
   
                                                  
   
  hidden: boolean
   
                                                             
                                                      
   
  presentable: boolean
   
                                                                                               
     
                                                 
   
  maxSize: number
   
                                                                  
                                                                    
                                                                           
     
                                                                                
   
  convertURLs: boolean
   
                                                                  
   
  required: boolean
 }
 interface EditorField {
   
                                                   
   
  type(): string
 }
 interface EditorField {
   
                                                     
   
  getId(): string
 }
 interface EditorField {
   
                                                     
   
  setId(id: string): void
 }
 interface EditorField {
   
                                                         
   
  getName(): string
 }
 interface EditorField {
   
                                                         
   
  setName(name: string): void
 }
 interface EditorField {
   
                                                             
   
  getSystem(): boolean
 }
 interface EditorField {
   
                                                             
   
  setSystem(system: boolean): void
 }
 interface EditorField {
   
                                                             
   
  getHidden(): boolean
 }
 interface EditorField {
   
                                                             
   
  setHidden(hidden: boolean): void
 }
 interface EditorField {
   
                                                               
   
  columnType(app: App): string
 }
 interface EditorField {
   
                                                                   
   
  prepareValue(record: Record, raw: any): any
 }
 interface EditorField {
   
                                                                     
   
  validateValue(ctx: context.Context, app: App, record: Record): void
 }
 interface EditorField {
   
                                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
 interface EditorField {
   
                                                                           
   
  calculateMaxBodySize(): number
 }
  
                                                                                    
    
                                                           
  
 interface EmailField {
   
                                                     
   
  name: string
   
                                              
     
                                                                                        
   
  id: string
   
                                                           
   
  system: boolean
   
                                                  
   
  hidden: boolean
   
                                                             
                                                      
   
  presentable: boolean
   
                                                                                       
     
                                                            
   
  exceptDomains: Array<string>
   
                                                                                 
     
                                                              
   
  onlyDomains: Array<string>
   
                                                                        
   
  required: boolean
 }
 interface EmailField {
   
                                                   
   
  type(): string
 }
 interface EmailField {
   
                                                     
   
  getId(): string
 }
 interface EmailField {
   
                                                     
   
  setId(id: string): void
 }
 interface EmailField {
   
                                                         
   
  getName(): string
 }
 interface EmailField {
   
                                                         
   
  setName(name: string): void
 }
 interface EmailField {
   
                                                             
   
  getSystem(): boolean
 }
 interface EmailField {
   
                                                             
   
  setSystem(system: boolean): void
 }
 interface EmailField {
   
                                                             
   
  getHidden(): boolean
 }
 interface EmailField {
   
                                                             
   
  setHidden(hidden: boolean): void
 }
 interface EmailField {
   
                                                               
   
  columnType(app: App): string
 }
 interface EmailField {
   
                                                                   
   
  prepareValue(record: Record, raw: any): any
 }
 interface EmailField {
   
                                                                     
   
  validateValue(ctx: context.Context, app: App, record: Record): void
 }
 interface EmailField {
   
                                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
  
                                                                    
    
                                                             
                                                                            
    
                                                                                               
    
                                                                                      
    
                                                                                                            
    
       
    
                                                       
    
       
                                                                                        
    
                                                                                   
                                                                
    
                                                                                         
    
                                                                                    
                                                                
    
                                                                                                   
    
                                
                                            
       
  
 interface FileField {
   
                                                     
   
  name: string
   
                                              
     
                                                                                        
   
  id: string
   
                                                           
   
  system: boolean
   
                                                  
   
  hidden: boolean
   
                                                             
                                                      
   
  presentable: boolean
   
                                                                                              
     
                                                
   
  maxSize: number
   
                                               
     
                                                                                       
   
  maxSelect: number
   
                                                                         
     
                                             
   
  mimeTypes: Array<string>
   
                                                                                     
     
                                                        
     
        
                                                               
                                                             
                                                                
                                                                          
                                                                             
                                                                            
        
   
  thumbs: Array<string>
   
                                                                                         
     
                                                            
     
                                                                  
                                                                 
                                                            
   
  protected: boolean
   
                                                                     
   
  required: boolean
 }
 interface FileField {
   
                                                   
   
  type(): string
 }
 interface FileField {
   
                                                     
   
  getId(): string
 }
 interface FileField {
   
                                                     
   
  setId(id: string): void
 }
 interface FileField {
   
                                                         
   
  getName(): string
 }
 interface FileField {
   
                                                         
   
  setName(name: string): void
 }
 interface FileField {
   
                                                             
   
  getSystem(): boolean
 }
 interface FileField {
   
                                                             
   
  setSystem(system: boolean): void
 }
 interface FileField {
   
                                                             
   
  getHidden(): boolean
 }
 interface FileField {
   
                                                             
   
  setHidden(hidden: boolean): void
 }
 interface FileField {
   
                                                                       
                                                   
   
  isMultiple(): boolean
 }
 interface FileField {
   
                                                               
   
  columnType(app: App): string
 }
 interface FileField {
   
                                                                   
   
  prepareValue(record: Record, raw: any): any
 }
 interface FileField {
   
                                                         
   
  driverValue(record: Record): any
 }
 interface FileField {
   
                                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
 interface FileField {
   
                                                                     
   
  validateValue(ctx: context.Context, app: App, record: Record): void
 }
 interface FileField {
   
                                                                           
   
  calculateMaxBodySize(): number
 }
 interface FileField {
   
                                                            
     
                                                                                              
   
  intercept(ctx: context.Context, app: App, record: Record, actionName: string, actionFunc: () => void): void
 }
 interface FileField {
   
                                                        
   
  findGetter(key: string): GetterFunc
 }
 interface FileField {
   
                                                        
   
  findSetter(key: string): SetterFunc
 }
  
                                                                                                   
    
                                                                                                             
                                                             
                                                                             
    
                                                                         
    
       
                                                               
                                                                 
                                                            
       
  
 interface GeoPointField {
   
                                                     
   
  name: string
   
                                              
     
                                                                                        
   
  id: string
   
                                                           
   
  system: boolean
   
                                                  
   
  hidden: boolean
   
                                                             
                                                      
   
  presentable: boolean
   
                                                                                         
   
  required: boolean
 }
 interface GeoPointField {
   
                                                   
   
  type(): string
 }
 interface GeoPointField {
   
                                                     
   
  getId(): string
 }
 interface GeoPointField {
   
                                                     
   
  setId(id: string): void
 }
 interface GeoPointField {
   
                                                         
   
  getName(): string
 }
 interface GeoPointField {
   
                                                         
   
  setName(name: string): void
 }
 interface GeoPointField {
   
                                                             
   
  getSystem(): boolean
 }
 interface GeoPointField {
   
                                                             
   
  setSystem(system: boolean): void
 }
 interface GeoPointField {
   
                                                             
   
  getHidden(): boolean
 }
 interface GeoPointField {
   
                                                             
   
  setHidden(hidden: boolean): void
 }
 interface GeoPointField {
   
                                                               
   
  columnType(app: App): string
 }
 interface GeoPointField {
   
                                                                   
   
  prepareValue(record: Record, raw: any): any
 }
 interface GeoPointField {
   
                                                                     
   
  validateValue(ctx: context.Context, app: App, record: Record): void
 }
 interface GeoPointField {
   
                                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
  
                                                                              
    
                                                                       
  
 interface JSONField {
   
                                                     
   
  name: string
   
                                              
     
                                                                                        
   
  id: string
   
                                                           
   
  system: boolean
   
                                                  
   
  hidden: boolean
   
                                                             
                                                      
   
  presentable: boolean
   
                                                                                               
     
                                                
   
  maxSize: number
   
                                                                     
                                         
   
  required: boolean
 }
 interface JSONField {
   
                                                   
   
  type(): string
 }
 interface JSONField {
   
                                                     
   
  getId(): string
 }
 interface JSONField {
   
                                                     
   
  setId(id: string): void
 }
 interface JSONField {
   
                                                         
   
  getName(): string
 }
 interface JSONField {
   
                                                         
   
  setName(name: string): void
 }
 interface JSONField {
   
                                                             
   
  getSystem(): boolean
 }
 interface JSONField {
   
                                                             
   
  setSystem(system: boolean): void
 }
 interface JSONField {
   
                                                             
   
  getHidden(): boolean
 }
 interface JSONField {
   
                                                             
   
  setHidden(hidden: boolean): void
 }
 interface JSONField {
   
                                                               
   
  columnType(app: App): string
 }
 interface JSONField {
   
                                                                   
   
  prepareValue(record: Record, raw: any): any
 }
 interface JSONField {
   
                                                                     
   
  validateValue(ctx: context.Context, app: App, record: Record): void
 }
 interface JSONField {
   
                                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
 interface JSONField {
   
                                                                           
   
  calculateMaxBodySize(): number
 }
  
                                                                                
    
                                                
    
                                                       
    
       
                                                                         
                               
                                                                             
                               
       
  
 interface NumberField {
   
                                                     
   
  name: string
   
                                              
     
                                                                                        
   
  id: string
   
                                                           
   
  system: boolean
   
                                                  
   
  hidden: boolean
   
                                                             
                                                      
   
  presentable: boolean
   
                                               
     
                                        
   
  min?: number
   
                                               
     
                                        
   
  max?: number
   
                                                        
   
  onlyInt: boolean
   
                                                          
   
  required: boolean
 }
 interface NumberField {
   
                                                   
   
  type(): string
 }
 interface NumberField {
   
                                                     
   
  getId(): string
 }
 interface NumberField {
   
                                                     
   
  setId(id: string): void
 }
 interface NumberField {
   
                                                         
   
  getName(): string
 }
 interface NumberField {
   
                                                         
   
  setName(name: string): void
 }
 interface NumberField {
   
                                                             
   
  getSystem(): boolean
 }
 interface NumberField {
   
                                                             
   
  setSystem(system: boolean): void
 }
 interface NumberField {
   
                                                             
   
  getHidden(): boolean
 }
 interface NumberField {
   
                                                             
   
  setHidden(hidden: boolean): void
 }
 interface NumberField {
   
                                                               
   
  columnType(app: App): string
 }
 interface NumberField {
   
                                                                   
   
  prepareValue(record: Record, raw: any): any
 }
 interface NumberField {
   
                                                                     
   
  validateValue(ctx: context.Context, app: App, record: Record): void
 }
 interface NumberField {
   
                                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
 interface NumberField {
   
                                                        
   
  findSetter(key: string): SetterFunc
 }
  
                                                                                 
                                                                                   
    
                                                                                                             
    
       
                                                                     
                                                                                                         
                                     
    
                                                             
                                                           
                                                                                              
       
    
                                                       
    
       
                                                                                                          
                                         
       
  
 interface PasswordField {
   
                                                     
   
  name: string
   
                                              
     
                                                                                        
   
  id: string
   
                                                           
   
  system: boolean
   
                                                  
   
  hidden: boolean
   
                                                             
                                                      
   
  presentable: boolean
   
                                                                                  
     
                                              
   
  pattern: string
   
                                                            
   
  min: number
   
                                                            
     
                                       
   
  max: number
   
                                                                 
     
                                               
     
                                                                              
   
  cost: number
   
                                                                  
   
  required: boolean
 }
 interface PasswordField {
   
                                                   
   
  type(): string
 }
 interface PasswordField {
   
                                                     
   
  getId(): string
 }
 interface PasswordField {
   
                                                     
   
  setId(id: string): void
 }
 interface PasswordField {
   
                                                         
   
  getName(): string
 }
 interface PasswordField {
   
                                                         
   
  setName(name: string): void
 }
 interface PasswordField {
   
                                                             
   
  getSystem(): boolean
 }
 interface PasswordField {
   
                                                             
   
  setSystem(system: boolean): void
 }
 interface PasswordField {
   
                                                             
   
  getHidden(): boolean
 }
 interface PasswordField {
   
                                                             
   
  setHidden(hidden: boolean): void
 }
 interface PasswordField {
   
                                                               
   
  columnType(app: App): string
 }
 interface PasswordField {
   
                                                         
   
  driverValue(record: Record): any
 }
 interface PasswordField {
   
                                                                   
   
  prepareValue(record: Record, raw: any): any
 }
 interface PasswordField {
   
                                                                     
   
  validateValue(ctx: context.Context, app: App, record: Record): void
 }
 interface PasswordField {
   
                                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
 interface PasswordField {
   
                                                            
   
  intercept(ctx: context.Context, app: App, record: Record, actionName: string, actionFunc: () => void): void
 }
 interface PasswordField {
   
                                                        
   
  findGetter(key: string): GetterFunc
 }
 interface PasswordField {
   
                                                        
   
  findSetter(key: string): SetterFunc
 }
 interface PasswordFieldValue {
  lastError: Error
  hash: string
  plain: string
 }
 interface PasswordFieldValue {
  validate(pass: string): boolean
 }
  
                                                                     
                                          
    
                                               
    
                                                                                               
    
                                                                                      
    
                                                                                                            
    
       
    
                                                       
    
       
                                                                                         
    
                                                                                                       
    
                                                                                          
    
                                                                                                       
    
                                                                                             
    
                                                             
       
  
 interface RelationField {
   
                                                     
   
  name: string
   
                                              
     
                                                                                        
   
  id: string
   
                                                           
   
  system: boolean
   
                                                  
   
  hidden: boolean
   
                                                             
                                                      
   
  presentable: boolean
   
                                                      
   
  collectionId: string
   
                                                                     
                                               
   
  cascadeDelete: boolean
   
                                                                   
                                            
     
                                                             
   
  minSelect: number
   
                                                                   
                                            
     
                                                                                        
     
                                                                  
   
  maxSelect: number
   
                                                           
   
  required: boolean
 }
 interface RelationField {
   
                                                   
   
  type(): string
 }
 interface RelationField {
   
                                                     
   
  getId(): string
 }
 interface RelationField {
   
                                                     
   
  setId(id: string): void
 }
 interface RelationField {
   
                                                         
   
  getName(): string
 }
 interface RelationField {
   
                                                         
   
  setName(name: string): void
 }
 interface RelationField {
   
                                                             
   
  getSystem(): boolean
 }
 interface RelationField {
   
                                                             
   
  setSystem(system: boolean): void
 }
 interface RelationField {
   
                                                             
   
  getHidden(): boolean
 }
 interface RelationField {
   
                                                             
   
  setHidden(hidden: boolean): void
 }
 interface RelationField {
   
                                                                         
                                                   
   
  isMultiple(): boolean
 }
 interface RelationField {
   
                                                               
   
  columnType(app: App): string
 }
 interface RelationField {
   
                                                                   
   
  prepareValue(record: Record, raw: any): any
 }
 interface RelationField {
   
                                                         
   
  driverValue(record: Record): any
 }
 interface RelationField {
   
                                                                     
   
  validateValue(ctx: context.Context, app: App, record: Record): void
 }
 interface RelationField {
   
                                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
 interface RelationField {
   
                                                           
   
  findSetter(key: string): SetterFunc
 }
  
                                                                 
                                                  
    
                                         
    
                                                                                                    
    
                                                                                         
    
                                                                                                            
    
       
    
                                                       
    
       
                                                                                         
    
                                                                                                  
    
                                                                                          
    
                                                                                                  
    
                                                                                             
    
                                                        
       
  
 interface SelectField {
   
                                                     
   
  name: string
   
                                              
     
                                                                                        
   
  id: string
   
                                                           
   
  system: boolean
   
                                                  
   
  hidden: boolean
   
                                                             
                                                      
   
  presentable: boolean
   
                                                  
   
  values: Array<string>
   
                                                         
     
                                                                                        
   
  maxSelect: number
   
                                                           
   
  required: boolean
 }
 interface SelectField {
   
                                                   
   
  type(): string
 }
 interface SelectField {
   
                                                     
   
  getId(): string
 }
 interface SelectField {
   
                                                     
   
  setId(id: string): void
 }
 interface SelectField {
   
                                                         
   
  getName(): string
 }
 interface SelectField {
   
                                                         
   
  setName(name: string): void
 }
 interface SelectField {
   
                                                             
   
  getSystem(): boolean
 }
 interface SelectField {
   
                                                             
   
  setSystem(system: boolean): void
 }
 interface SelectField {
   
                                                             
   
  getHidden(): boolean
 }
 interface SelectField {
   
                                                             
   
  setHidden(hidden: boolean): void
 }
 interface SelectField {
   
                                                                         
                                                   
   
  isMultiple(): boolean
 }
 interface SelectField {
   
                                                               
   
  columnType(app: App): string
 }
 interface SelectField {
   
                                                                   
   
  prepareValue(record: Record, raw: any): any
 }
 interface SelectField {
   
                                                         
   
  driverValue(record: Record): any
 }
 interface SelectField {
   
                                                                     
   
  validateValue(ctx: context.Context, app: App, record: Record): void
 }
 interface SelectField {
   
                                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
 interface SelectField {
   
                                                        
   
  findSetter(key: string): SetterFunc
 }
  
                                                                     
    
                                                           
    
                                                       
    
                                                                                                     
    
       
                                                          
                                                                  
       
  
 interface TextField {
   
                                                     
   
  name: string
   
                                              
     
                                                                                        
   
  id: string
   
                                                           
   
  system: boolean
   
                                                  
   
  hidden: boolean
   
                                                             
                                                      
   
  presentable: boolean
   
                                                          
     
                                            
   
  min: number
   
                                                         
     
                                                 
   
  max: number
   
                                                                                  
     
                                              
   
  pattern: string
   
                                                                       
                                                                       
                                                                                               
     
                                                                                
   
  autogeneratePattern: string
   
                                                                  
   
  required: boolean
   
                                                   
     
                                                                     
   
  primaryKey: boolean
 }
 interface TextField {
   
                                                   
   
  type(): string
 }
 interface TextField {
   
                                                     
   
  getId(): string
 }
 interface TextField {
   
                                                     
   
  setId(id: string): void
 }
 interface TextField {
   
                                                         
   
  getName(): string
 }
 interface TextField {
   
                                                         
   
  setName(name: string): void
 }
 interface TextField {
   
                                                             
   
  getSystem(): boolean
 }
 interface TextField {
   
                                                             
   
  setSystem(system: boolean): void
 }
 interface TextField {
   
                                                             
   
  getHidden(): boolean
 }
 interface TextField {
   
                                                             
   
  setHidden(hidden: boolean): void
 }
 interface TextField {
   
                                                               
   
  columnType(app: App): string
 }
 interface TextField {
   
                                                                   
   
  prepareValue(record: Record, raw: any): any
 }
 interface TextField {
   
                                                                     
   
  validateValue(ctx: context.Context, app: App, record: Record): void
 }
 interface TextField {
   
                                                                                
   
  validatePlainValue(value: string): void
 }
 interface TextField {
   
                                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
 interface TextField {
   
                                                            
   
  intercept(ctx: context.Context, app: App, record: Record, actionName: string, actionFunc: () => void): void
 }
 interface TextField {
   
                                                        
   
  findSetter(key: string): SetterFunc
 }
  
                                                                            
    
                                                           
  
 interface URLField {
   
                                                     
   
  name: string
   
                                              
     
                                                                                        
   
  id: string
   
                                                           
   
  system: boolean
   
                                                  
   
  hidden: boolean
   
                                                             
                                                      
   
  presentable: boolean
   
                                                                                     
     
                                                            
   
  exceptDomains: Array<string>
   
                                                                               
     
                                                              
   
  onlyDomains: Array<string>
   
                                                                      
   
  required: boolean
 }
 interface URLField {
   
                                                   
   
  type(): string
 }
 interface URLField {
   
                                                     
   
  getId(): string
 }
 interface URLField {
   
                                                     
   
  setId(id: string): void
 }
 interface URLField {
   
                                                         
   
  getName(): string
 }
 interface URLField {
   
                                                         
   
  setName(name: string): void
 }
 interface URLField {
   
                                                             
   
  getSystem(): boolean
 }
 interface URLField {
   
                                                             
   
  setSystem(system: boolean): void
 }
 interface URLField {
   
                                                             
   
  getHidden(): boolean
 }
 interface URLField {
   
                                                             
   
  setHidden(hidden: boolean): void
 }
 interface URLField {
   
                                                               
   
  columnType(app: App): string
 }
 interface URLField {
   
                                                                   
   
  prepareValue(record: Record, raw: any): any
 }
 interface URLField {
   
                                                                     
   
  validateValue(ctx: context.Context, app: App, record: Record): void
 }
 interface URLField {
   
                                                                           
   
  validateSettings(ctx: context.Context, app: App, collection: Collection): void
 }
 interface newFieldsList {
   
                                                                              
   
  (...fields: Field[]): FieldsList
 }
  
                                                    
  
 interface FieldsList extends Array<Field>{}
 interface FieldsList {
   
                                                    
   
  clone(): FieldsList
 }
 interface FieldsList {
   
                                                                 
   
  fieldNames(): Array<string>
 }
 interface FieldsList {
   
                                                        
                                                      
   
  asMap(): _TygojaDict
 }
 interface FieldsList {
   
                                              
   
  getById(fieldId: string): Field
 }
 interface FieldsList {
   
                                                  
   
  getByName(fieldName: string): Field
 }
 interface FieldsList {
   
                                                 
     
                                                                           
   
  removeById(fieldId: string): void
 }
 interface FieldsList {
   
                                                     
     
                                                                             
   
  removeByName(fieldName: string): void
 }
 interface FieldsList {
   
                                                     
     
                                                                    
                                                                                            
     
                                                                                             
     
                                                                                                                  
                                                                                                                 
   
  add(...fields: Field[]): void
 }
 interface FieldsList {
   
                                                                                  
     
                                                               
     
                                                                                                          
   
  addAt(pos: number, ...fields: Field[]): void
 }
 interface FieldsList {
   
                                                                    
                                                                                    
     
                                          
        
                                          
                             
        
     
             
     
        
                                                                 
                                                                                                    
        
   
  addMarshaledJSON(rawJSON: string|Array<number>): void
 }
 interface FieldsList {
   
                                                                                                            
     
                                                                            
     
                                                                                                          
   
  addMarshaledJSONAt(pos: number, rawJSON: string|Array<number>): void
 }
 interface FieldsList {
   
                                                                  
   
  string(): string
 }
 interface onlyFieldType {
  type: string
 }
 type _sGfQvdz = Field
 interface fieldWithType extends _sGfQvdz {
  type: string
 }
 interface fieldWithType {
  unmarshalJSON(data: string|Array<number>): void
 }
 interface FieldsList {
   
                                                    
                                                              
   
  unmarshalJSON(data: string|Array<number>): void
 }
 interface FieldsList {
   
                                                           
   
  marshalJSON(): string|Array<number>
 }
 interface FieldsList {
   
                                                    
   
  value(): any
 }
 interface FieldsList {
   
                                                                       
                                          
   
  scan(value: any): void
 }
 type _sZfZHka = BaseModel
 interface Log extends _sZfZHka {
  created: types.DateTime
  data: types.JSONMap<any>
  message: string
  level: number
 }
 interface Log {
  tableName(): string
 }
 interface BaseApp {
   
                                             
   
  logQuery(): (dbx.SelectQuery)
 }
 interface BaseApp {
   
                                                    
   
  findLogById(id: string): (Log)
 }
  
                                                                              
  
 interface LogsStatsItem {
  date: types.DateTime
  total: number
 }
 interface BaseApp {
   
                                                      
   
  logsStats(expr: dbx.Expression): Array<(LogsStatsItem | undefined)>
 }
 interface BaseApp {
   
                                                                         
     
                                                                               
                                                    
   
  deleteOldLogs(createdBefore: time.Time): void
 }
  
                                                                    
  
 type _sDvimTY = Record
 interface MFA extends _sDvimTY {
 }
 interface newMFA {
   
                                                            
     
                   
     
        
                             
                               
                                                
                                           
                   
        
   
  (app: App): (MFA)
 }
 interface MFA {
   
                                                                   
                                          
   
  preValidate(ctx: context.Context, app: App): void
 }
 interface MFA {
   
                                                  
   
  proxyRecord(): (Record)
 }
 interface MFA {
   
                                                                            
   
  setProxyRecord(record: Record): void
 }
 interface MFA {
   
                                                           
   
  collectionRef(): string
 }
 interface MFA {
   
                                                                     
   
  setCollectionRef(collectionId: string): void
 }
 interface MFA {
   
                                                          
   
  recordRef(): string
 }
 interface MFA {
   
                                                             
   
  setRecordRef(recordId: string): void
 }
 interface MFA {
   
                                                    
   
  method(): string
 }
 interface MFA {
   
                                                       
   
  setMethod(method: string): void
 }
 interface MFA {
   
                                                      
   
  created(): types.DateTime
 }
 interface MFA {
   
                                                      
   
  updated(): types.DateTime
 }
 interface MFA {
   
                                                                      
                                                  
   
  hasExpired(maxElapsed: time.Duration): boolean
 }
 interface BaseApp {
   
                                                                                   
   
  findAllMFAsByRecord(authRecord: Record): Array<(MFA | undefined)>
 }
 interface BaseApp {
   
                                                                                      
   
  findAllMFAsByCollection(collection: Collection): Array<(MFA | undefined)>
 }
 interface BaseApp {
   
                                                      
   
  findMFAById(id: string): (MFA)
 }
 interface BaseApp {
   
                                                                                      
     
                                                      
   
  deleteAllMFAsByRecord(authRecord: Record): void
 }
 interface BaseApp {
   
                                                                         
   
  deleteExpiredMFAs(): void
 }
 interface Migration {
  up: (txApp: App) => void
  down: (txApp: App) => void
  file: string
  reapplyCondition: (txApp: App, runner: MigrationsRunner, fileName: string) => boolean
 }
  
                                                            
  
 interface MigrationsList {
 }
 interface MigrationsList {
   
                                                                
   
  item(index: number): (Migration)
 }
 interface MigrationsList {
   
                                                      
   
  items(): Array<(Migration | undefined)>
 }
 interface MigrationsList {
   
                                                                   
   
  copy(list: MigrationsList): void
 }
 interface MigrationsList {
   
                                                                
     
                                                                              
     
                                                                             
   
  add(m: Migration): void
 }
 interface MigrationsList {
   
                                                        
     
                                                                                   
     
                                                                             
   
  register(up: (txApp: App) => void, down: (txApp: App) => void, ...optFilename: string[]): void
 }
  
                                                                                         
  
 interface MigrationsRunner {
 }
 interface newMigrationsRunner {
   
                                                                                               
   
  (app: App, migrationsList: MigrationsList): (MigrationsRunner)
 }
 interface MigrationsRunner {
   
                                                                          
     
                                          
                                            
                                                                       
                                                                                  
   
  run(...args: string[]): void
 }
 interface MigrationsRunner {
   
                                                                  
     
                                                                    
   
  up(): Array<string>
 }
 interface MigrationsRunner {
   
                                                             
                                      
     
                                                                     
   
  down(toRevertCount: number): Array<string>
 }
 interface MigrationsRunner {
   
                                                                                    
                                                         
   
  removeMissingAppliedMigrations(): void
 }
  
                                                                    
  
 type _sRvTbTI = Record
 interface OTP extends _sRvTbTI {
 }
 interface newOTP {
   
                                                            
     
                   
     
        
                             
                               
                                                
                                                                         
                   
        
   
  (app: App): (OTP)
 }
 interface OTP {
   
                                                                   
                                          
   
  preValidate(ctx: context.Context, app: App): void
 }
 interface OTP {
   
                                                  
   
  proxyRecord(): (Record)
 }
 interface OTP {
   
                                                                            
   
  setProxyRecord(record: Record): void
 }
 interface OTP {
   
                                                           
   
  collectionRef(): string
 }
 interface OTP {
   
                                                                     
   
  setCollectionRef(collectionId: string): void
 }
 interface OTP {
   
                                                          
   
  recordRef(): string
 }
 interface OTP {
   
                                                             
   
  setRecordRef(recordId: string): void
 }
 interface OTP {
   
                                                    
     
                                                                      
                                                                        
                                                                                        
   
  sentTo(): string
 }
 interface OTP {
   
                                                       
   
  setSentTo(val: string): void
 }
 interface OTP {
   
                                                      
   
  created(): types.DateTime
 }
 interface OTP {
   
                                                      
   
  updated(): types.DateTime
 }
 interface OTP {
   
                                                                      
                                                  
   
  hasExpired(maxElapsed: time.Duration): boolean
 }
 interface BaseApp {
   
                                                                                   
   
  findAllOTPsByRecord(authRecord: Record): Array<(OTP | undefined)>
 }
 interface BaseApp {
   
                                                                                      
   
  findAllOTPsByCollection(collection: Collection): Array<(OTP | undefined)>
 }
 interface BaseApp {
   
                                                      
   
  findOTPById(id: string): (OTP)
 }
 interface BaseApp {
   
                                                                                      
     
                                                      
   
  deleteAllOTPsByRecord(authRecord: Record): void
 }
 interface BaseApp {
   
                                                                         
   
  deleteExpiredOTPs(): void
 }
 interface ruleJoin {
 }
  
                                                                   
                                        
    
                                                 
            
    
       
                                                  
             
                      
                                  
              
      
                                             
        
       
  
 interface RecordFieldResolver {
 }
 interface RecordFieldResolver {
   
                                                                   
   
  allowedFields(): Array<string>
 }
 interface RecordFieldResolver {
   
                                                                               
   
  setAllowedFields(newAllowedFields: Array<string>): void
 }
 interface RecordFieldResolver {
   
                                                                                           
   
  allowHiddenFields(): boolean
 }
 interface RecordFieldResolver {
   
                                                                      
   
  setAllowHiddenFields(allowHiddenFields: boolean): void
 }
 interface newRecordFieldResolver {
   
                                                                                
   
  (app: App, baseCollection: Collection, requestInfo: RequestInfo, allowHiddenFields: boolean): (RecordFieldResolver)
 }
 interface RecordFieldResolver {
   
                                                                               
     
                                                             
     
                                                                 
                                                         
   
  updateQuery(query: dbx.SelectQuery): void
 }
 interface RecordFieldResolver {
   
                                                         
     
                                                  
     
        
        
                     
                           
                                       
                      
                     
                           
                              
                                     
                                     
                             
                                   
                                   
                              
        
   
  resolve(fieldName: string): (search.ResolverResult)
 }
 interface mapExtractor {
  [key:string]: any;
  asMap(): _TygojaDict
 }
  
                                                                       
                                                                     
  
 interface replaceWithExpression {
 }
 interface replaceWithExpression {
   
                                                       
     
                                           
   
  build(db: dbx.DB, params: dbx.Params): string
 }
 interface runner {
 }
 type _sKTAYcL = BaseModel
 interface Record extends _sKTAYcL {
 }
 interface newRecord {
   
                                                    
   
  (collection: Collection): (Record)
 }
 interface Record {
   
                                                                                      
     
                                                                                       
                                                                                                   
   
  collection(): (Collection)
 }
 interface Record {
   
                                                                               
   
  tableName(): string
 }
 interface Record {
   
                                                         
     
                                                                       
                                                                       
     
                                                                         
                                                
   
  postScan(): void
 }
 interface Record {
   
                                                                       
   
  hookTags(): Array<string>
 }
 interface Record {
   
                                                                   
   
  baseFilesPath(): string
 }
 interface Record {
   
                                                                          
                                                                  
                                               
     
                                                                        
                                                  
   
  original(): (Record)
 }
 interface Record {
   
                                                                       
                                                                         
                                                                           
   
  fresh(): (Record)
 }
 interface Record {
   
                                                                         
                                                                     
     
                                                                         
                                                                      
   
  clone(): (Record)
 }
 interface Record {
   
                                                                                    
   
  expand(): _TygojaDict
 }
 interface Record {
   
                                                                                                       
   
  setExpand(expand: _TygojaDict): void
 }
 interface Record {
   
                                                                 
                                         
     
                                                                                   
                                                                                                     
                                                                                                          
   
  mergeExpand(expand: _TygojaDict): void
 }
 interface Record {
   
                                                                                     
   
  fieldsData(): _TygojaDict
 }
 interface Record {
   
                                                                             
                                                                                     
     
                                                                            
   
  customData(): _TygojaDict
 }
 interface Record {
   
                                                                          
                        
   
  withCustomData(state: boolean): (Record)
 }
 interface Record {
   
                                                                                             
   
  ignoreEmailVisibility(state: boolean): (Record)
 }
 interface Record {
   
                                                                          
                                                 
     
                                                                                      
                                                                           
     
                                                                                               
                                                                                                            
                                                               
   
  ignoreUnchangedFields(state: boolean): (Record)
 }
 interface Record {
   
                                                                      
                                                    
     
                           
   
  setRaw(key: string, value: any): void
 }
 interface Record {
   
                                                                                         
                                                            
     
                                                                                   
     
                                                           
     
                                                                                        
   
  setIfFieldExists(key: string, value: any): Field
 }
 interface Record {
   
                                                                             
     
                                                                              
                                                                           
   
  set(key: string, value: any): void
 }
 interface Record {
  getRaw(key: string): any
 }
 interface Record {
   
                                                                       
   
  get(key: string): any
 }
 interface Record {
   
                                                                     
   
  load(data: _TygojaDict): void
 }
 interface Record {
   
                                                        
   
  getBool(key: string): boolean
 }
 interface Record {
   
                                                            
   
  getString(key: string): string
 }
 interface Record {
   
                                                       
   
  getInt(key: string): number
 }
 interface Record {
   
                                                            
   
  getFloat(key: string): number
 }
 interface Record {
   
                                                                         
   
  getDateTime(key: string): types.DateTime
 }
 interface Record {
   
                                                                         
   
  getGeoPoint(key: string): types.GeoPoint
 }
 interface Record {
   
                                                                                           
   
  getStringSlice(key: string): Array<string>
 }
 interface Record {
   
                                                                                  
                                                                               
                                                                                                  
     
             
     
        
                                                  
                               
                                                                    
       
                                                                                                                      
        
   
  getUnsavedFiles(key: string): Array<(filesystem.File | undefined)>
 }
 interface Record {
   
                                               
   
  getUploadedFiles(key: string): Array<(filesystem.File | undefined)>
 }
 interface Record {
   
                                                                          
     
            
     
        
                        
                                              
         
                                                           
        
   
  unmarshalJSONField(key: string, result: any): void
 }
 interface Record {
   
                                                                    
                                             
     
                                                                      
                                                            
     
                                                            
   
  expandedOne(relField: string): (Record)
 }
 interface Record {
   
                                                                       
                                             
     
                                                                       
                                                                 
     
                                                                  
   
  expandedAll(relField: string): Array<(Record | undefined)>
 }
 interface Record {
   
                                                                    
                                                             
   
  findFileFieldByFile(filename: string): (FileField)
 }
 interface Record {
   
                                                                           
                                                                              
   
  dbExport(app: App): _TygojaDict
 }
 interface Record {
   
                                                                                      
   
  hide(...fieldNames: string[]): (Record)
 }
 interface Record {
   
                                                                                    
                                                                               
   
  unhide(...fieldNames: string[]): (Record)
 }
 interface Record {
   
                                                                            
     
                                                                               
     
                                                                             
                                        
   
  publicExport(): _TygojaDict
 }
 interface Record {
   
                                                           
     
                                                                   
   
  marshalJSON(): string|Array<number>
 }
 interface Record {
   
                                                               
   
  unmarshalJSON(data: string|Array<number>): void
 }
 interface Record {
   
                                                             
                                                               
     
                                                
     
                                                          
                                                                            
     
                                                                         
                                                                                                  
     
                   
     
        
                                               
                               
                               
                               
        
   
  replaceModifiers(data: _TygojaDict): _TygojaDict
 }
 interface Record {
   
                                                                                            
   
  email(): string
 }
 interface Record {
   
                                                                                            
   
  setEmail(email: string): void
 }
 interface Record {
   
                                                                                                         
   
  emailVisibility(): boolean
 }
 interface Record {
   
                                                                                                                
   
  setEmailVisibility(visible: boolean): void
 }
 interface Record {
   
                                                                                                  
   
  verified(): boolean
 }
 interface Record {
   
                                                                                                  
   
  setVerified(verified: boolean): void
 }
 interface Record {
   
                                                                                                  
   
  tokenKey(): string
 }
 interface Record {
   
                                                                                                  
   
  setTokenKey(key: string): void
 }
 interface Record {
   
                                                                            
   
  refreshTokenKey(): void
 }
 interface Record {
   
                                                                                                  
   
  setPassword(password: string): void
 }
 interface Record {
   
                                                                                             
     
                                                                                 
                                                                                       
                                                                                 
   
  setRandomPassword(): string
 }
 interface Record {
   
                                                                                     
     
                                                
   
  validatePassword(password: string): boolean
 }
 interface Record {
   
                                                                        
                                                           
   
  isSuperuser(): boolean
 }
  
                                                                      
                                                                       
                                                                 
    
                                                                                          
  
 interface RecordProxy {
  [key:string]: any;
   
                                                  
   
  proxyRecord(): (Record)
   
                                                                            
   
  setProxyRecord(record: Record): void
 }
  
                                                                             
                                                                     
  
 type _szzpzJp = Record
 interface BaseRecordProxy extends _szzpzJp {
 }
 interface BaseRecordProxy {
   
                                                  
   
  proxyRecord(): (Record)
 }
 interface BaseRecordProxy {
   
                                                                            
   
  setProxyRecord(record: Record): void
 }
 interface BaseApp {
   
                                                                                       
     
                                                                            
                                                                                  
                                                                          
   
  recordQuery(collectionModelOrIdentifier: any): (dbx.SelectQuery)
 }
 interface BaseApp {
   
                                                     
   
  findRecordById(collectionModelOrIdentifier: any, recordId: string, ...optFilters: ((q: dbx.SelectQuery) => void)[]): (Record)
 }
 interface BaseApp {
   
                                                             
                                                     
   
  findRecordsByIds(collectionModelOrIdentifier: any, recordIds: Array<string>, ...optFilters: ((q: dbx.SelectQuery) => void)[]): Array<(Record | undefined)>
 }
 interface BaseApp {
   
                                                                        
     
                                                                 
     
                                                    
     
             
     
        
                             
                                   
     
                               
                                                       
                                                                                          
                                                 
        
   
  findAllRecords(collectionModelOrIdentifier: any, ...exprs: dbx.Expression[]): Array<(Record | undefined)>
 }
 interface BaseApp {
   
                                                                  
                                 
   
  findFirstRecordByData(collectionModelOrIdentifier: any, key: string, value: any): (Record)
 }
 interface BaseApp {
   
                                                                     
                            
     
                                                                         
     
                                                                      
                           
     
                                                                             
                                                
     
                                                                        
                                       
     
                                                    
     
             
     
        
                              
               
                                                  
                  
          
         
                                                          
       
        
   
  findRecordsByFilter(collectionModelOrIdentifier: any, filter: string, sort: string, limit: number, offset: number, ...params: dbx.Params[]): Array<(Record | undefined)>
 }
 interface BaseApp {
   
                                                                                                      
     
                                                                       
     
                                                 
     
             
     
        
                                              
                                                                                                         
        
   
  findFirstRecordByFilter(collectionModelOrIdentifier: any, filter: string, ...params: dbx.Params[]): (Record)
 }
 interface BaseApp {
   
                                                                      
   
  countRecords(collectionModelOrIdentifier: any, ...exprs: dbx.Expression[]): number
 }
 interface BaseApp {
   
                                                                                 
                                                                 
     
                                                                                   
     
                                                                                                    
   
  findAuthRecordByToken(token: string, ...validTypes: string[]): (Record)
 }
 interface BaseApp {
   
                                                                                    
     
                                                                        
                                                                          
     
                                                                                 
   
  findAuthRecordByEmail(collectionModelOrIdentifier: any, email: string): (Record)
 }
 interface BaseApp {
   
                                                                        
                                          
     
                                                                            
     
                                                                          
                                                    
     
                                                                      
     
             
     
        
                                       
                                                             
                                                                          
                                                                                         
     
                                                                            
        
   
  canAccessRecord(record: Record, requestInfo: RequestInfo, accessRule: string): boolean
 }
  
                                                                                             
  
 interface ExpandFetchFunc {(relCollection: Collection, relIds: Array<string>): Array<(Record | undefined)> }
 interface BaseApp {
   
                                                                 
     
                                                                     
                                       
     
                                                                      
   
  expandRecord(record: Record, expands: Array<string>, optFetchFunc: ExpandFetchFunc): _TygojaDict
 }
 interface BaseApp {
   
                                                                            
     
                                                                     
                                       
     
                                                                      
   
  expandRecords(records: Array<(Record | undefined)>, expands: Array<string>, optFetchFunc: ExpandFetchFunc): _TygojaDict
 }
 interface Record {
   
                                                                                       
     
                                                                       
                                                 
     
                                                                                               
   
  newStaticAuthToken(duration: time.Duration): string
 }
 interface Record {
   
                                                                          
   
  newAuthToken(): string
 }
 interface Record {
   
                                                                                
   
  newVerificationToken(): string
 }
 interface Record {
   
                                                                                                
   
  newPasswordResetToken(): string
 }
 interface Record {
   
                                                                                            
   
  newEmailChangeToken(newEmail: string): string
 }
 interface Record {
   
                                                                               
   
  newFileToken(): string
 }
 interface settings {
  smtp: SMTPConfig
  backups: BackupsConfig
  s3: S3Config
  meta: MetaConfig
  rateLimits: RateLimitsConfig
  trustedProxy: TrustedProxyConfig
  batch: BatchConfig
  logs: LogsConfig
 }
  
                                                 
  
 type _sdHSXeS = settings
 interface Settings extends _sdHSXeS {
 }
 interface Settings {
   
                                                             
   
  tableName(): string
 }
 interface Settings {
   
                                                        
   
  lastSavedPK(): any
 }
 interface Settings {
   
                                               
   
  pk(): any
 }
 interface Settings {
   
                                                     
   
  isNew(): boolean
 }
 interface Settings {
   
                                                             
   
  markAsNew(): void
 }
 interface Settings {
   
                                                                
   
  markAsNotNew(): void
 }
 interface Settings {
   
                                                           
   
  postScan(): void
 }
 interface Settings {
   
                                                                               
   
  string(): string
 }
 interface Settings {
   
                                                                           
   
  dbExport(app: App): _TygojaDict
 }
 interface Settings {
   
                                                                      
                                    
   
  postValidate(ctx: context.Context, app: App): void
 }
 interface Settings {
   
                                                            
   
  merge(other: Settings): void
 }
 interface Settings {
   
                                                           
   
  clone(): (Settings)
 }
 interface Settings {
   
                                                           
     
                                                                              
   
  marshalJSON(): string|Array<number>
 }
 interface SMTPConfig {
  enabled: boolean
  port: number
  host: string
  username: string
  password: string
   
                                         
   
  authMethod: string
   
                                                                      
     
                                                                   
                                                        
   
  tls: boolean
   
                                                                 
                                                                         
     
                                                                          
   
  localName: string
 }
 interface SMTPConfig {
   
                                                                                              
   
  validate(): void
 }
 interface S3Config {
  enabled: boolean
  bucket: string
  region: string
  endpoint: string
  accessKey: string
  secret: string
  forcePathStyle: boolean
 }
 interface S3Config {
   
                                                                                            
   
  validate(): void
 }
 interface BatchConfig {
  enabled: boolean
   
                                                                 
   
  maxRequests: number
   
                                                                                            
   
  timeout: number
   
                                                                         
     
                                         
   
  maxBodySize: number
 }
 interface BatchConfig {
   
                                                                                               
   
  validate(): void
 }
 interface BackupsConfig {
   
                                                                         
     
                                                              
   
  cron: string
   
                                                               
                                        
     
                                                                          
   
  cronMaxKeep: number
   
                                                                                   
   
  s3: S3Config
 }
 interface BackupsConfig {
   
                                                                                                 
   
  validate(): void
 }
 interface MetaConfig {
  appName: string
  appURL: string
  senderName: string
  senderAddress: string
  hideControls: boolean
 }
 interface MetaConfig {
   
                                                                                              
   
  validate(): void
 }
 interface LogsConfig {
  maxDays: number
  minLevel: number
  logIP: boolean
  logAuthId: boolean
 }
 interface LogsConfig {
   
                                                                                              
   
  validate(): void
 }
 interface TrustedProxyConfig {
   
                                                              
   
  headers: Array<string>
   
                                                                                 
     
                                                                           
                                                                                    
                                       
   
  useLeftmostIP: boolean
 }
 interface TrustedProxyConfig {
   
                                                           
   
  marshalJSON(): string|Array<number>
 }
 interface TrustedProxyConfig {
   
                                                                                                 
   
  validate(): void
 }
 interface RateLimitsConfig {
  rules: Array<RateLimitRule>
  enabled: boolean
 }
 interface RateLimitsConfig {
   
                                                                                    
     
                                                                                                                         
                                                                                 
   
  findRateLimitRule(searchLabels: Array<string>, ...optOnlyAudience: string[]): [RateLimitRule, boolean]
 }
 interface RateLimitsConfig {
   
                                                           
   
  marshalJSON(): string|Array<number>
 }
 interface RateLimitsConfig {
   
                                                                                                    
   
  validate(): void
 }
 interface RateLimitRule {
   
                                                 
     
                                                                            
     
                              
        
                                  
                     
                 
          
             
                               
        
   
  label: string
   
                                                                 
        
                                                                
                                   
                                                
        
   
  audience: string
   
                                                                    
                                                 
   
  duration: number
   
                                                                    
   
  maxRequests: number
 }
 interface RateLimitRule {
   
                                                                                                 
   
  validate(): void
 }
 interface RateLimitRule {
   
                                                                
   
  durationTime(): time.Duration
 }
 interface RateLimitRule {
   
                                                        
   
  string(): string
 }
 type _sJvlnvP = BaseModel
 interface Param extends _sJvlnvP {
  created: types.DateTime
  updated: types.DateTime
  value: types.JSONRaw
 }
 interface Param {
  tableName(): string
 }
 interface BaseApp {
   
                                                                            
     
                                                                     
   
  reloadSettings(): void
 }
 interface BaseApp {
   
                                              
     
                                                                           
     
                                                                         
                                                                    
   
  deleteView(dangerousViewName: string): void
 }
 interface BaseApp {
   
                                                                        
     
                                                                     
                                                     
   
  saveView(dangerousViewName: string, dangerousSelectQuery: string): void
 }
 interface BaseApp {
   
                                                                              
     
                            
                                                 
                                                                                             
     
                                                                         
                                                                       
   
  createViewFields(dangerousSelectQuery: string): FieldsList
 }
 interface BaseApp {
   
                                                                                           
   
  findRecordByViewFile(viewCollectionModelOrIdentifier: any, fileFieldName: string, filename: string): (Record)
 }
 interface queryField {
 }
 interface identifier {
 }
 interface identifiersParser {
 }
}

 
                                                                     
                                                     
 
namespace mails {
 interface sendRecordAuthAlert {
   
                                                                                     
   
  (app: CoreApp, authRecord: core.Record, info: string): void
 }
 interface sendRecordOTP {
   
                                                                
     
                                                                                                                                                        
   
  (app: CoreApp, authRecord: core.Record, otpId: string, pass: string): void
 }
 interface sendRecordPasswordReset {
   
                                                                                               
   
  (app: CoreApp, authRecord: core.Record): void
 }
 interface sendRecordVerification {
   
                                                                                            
   
  (app: CoreApp, authRecord: core.Record): void
 }
 interface sendRecordChangeEmail {
   
                                                                                                
   
  (app: CoreApp, authRecord: core.Record, newEmail: string): void
 }
}

namespace forms {
 
 import validation = ozzo_validation
  
                                                                                   
    
                                                                                                        
  
 interface AppleClientSecretCreate {
   
                                                              
   
  clientId: string
   
                                                                           
                                                                            
   
  teamId: string
   
                                                                                  
                                                        
   
  keyId: string
   
                                                          
                                                                                    
   
  privateKey: string
   
                                                                              
                                                                        
   
  duration: number
 }
 interface newAppleClientSecretCreate {
   
                                                                                             
                                                          
   
  (app: CoreApp): (AppleClientSecretCreate)
 }
 interface AppleClientSecretCreate {
   
                                                                                            
   
  validate(): void
 }
 interface AppleClientSecretCreate {
   
                                                                         
   
  submit(): string
 }
 interface RecordUpsert {
 }
 interface newRecordUpsert {
   
                                                                                                              
                                                                                           
   
  (app: CoreApp, record: core.Record): (RecordUpsert)
 }
 interface RecordUpsert {
   
                                                           
   
  setContext(ctx: context.Context): void
 }
 interface RecordUpsert {
   
                                                   
     
                                                                        
                                                                            
   
  setApp(app: CoreApp): void
 }
 interface RecordUpsert {
   
                                                         
   
  setRecord(record: core.Record): void
 }
 interface RecordUpsert {
   
                                                                        
   
  resetAccess(): void
 }
 interface RecordUpsert {
   
                                                                           
                                                                                           
   
  grantManagerAccess(): void
 }
 interface RecordUpsert {
   
                                                                               
                                                                                    
   
  grantSuperuserAccess(): void
 }
 interface RecordUpsert {
   
                                                                                        
   
  hasManageAccess(): boolean
 }
 interface RecordUpsert {
   
                                                                       
   
  load(data: _TygojaDict): void
 }
 interface RecordUpsert {
   
                                                                                                                                           
     
                                                                                          
                                                                             
     
                                                                                                     
   
  drySubmit(callback: (txApp: CoreApp, drySavedRecord: core.Record) => void): void
 }
 interface RecordUpsert {
   
                                                                                         
   
  submit(): void
 }
  
                                                        
  
 interface TestEmailSend {
  email: string
  template: string
  collection: string 
 }
 interface newTestEmailSend {
   
                                                                     
   
  (app: CoreApp): (TestEmailSend)
 }
 interface TestEmailSend {
   
                                                                                            
   
  validate(): void
 }
 interface TestEmailSend {
   
                                                                       
   
  submit(): void
 }
  
                                                             
  
 interface TestS3Filesystem {
   
                                                    
   
  filesystem: string
 }
 interface newTestS3Filesystem {
   
                                                                           
   
  (app: CoreApp): (TestS3Filesystem)
 }
 interface TestS3Filesystem {
   
                                                                                            
   
  validate(): void
 }
 interface TestS3Filesystem {
   
                                                                   
   
  submit(): void
 }
}

namespace apis {
 interface toApiError {
   
                                                                  
   
  (err: Error): (router.ApiError)
 }
 interface newApiError {
   
                                                      
   
  (status: number, message: string, errData: any): (router.ApiError)
 }
 interface newBadRequestError {
   
                                                                    
   
  (message: string, errData: any): (router.ApiError)
 }
 interface newNotFoundError {
   
                                                                
   
  (message: string, errData: any): (router.ApiError)
 }
 interface newForbiddenError {
   
                                                                  
   
  (message: string, errData: any): (router.ApiError)
 }
 interface newUnauthorizedError {
   
                                                                        
   
  (message: string, errData: any): (router.ApiError)
 }
 interface newTooManyRequestsError {
   
                                                                              
   
  (message: string, errData: any): (router.ApiError)
 }
 interface newInternalServerError {
   
                                                                            
   
  (message: string, errData: any): (router.ApiError)
 }
 interface backupFileInfo {
  modified: types.DateTime
  key: string
  size: number
 }
 
 import validation = ozzo_validation
 interface backupCreateForm {
  name: string
 }
 interface backupUploadForm {
  file?: filesystem.File
 }
 interface newRouter {
   
                                                                                                    
   
  (app: CoreApp): (router.Router<core.RequestEvent | undefined>)
 }
 interface wrapStdHandler {
   
                                                                           
   
  (h: http.Handler): (_arg0: core.RequestEvent) => void
 }
 interface wrapStdMiddleware {
   
                                                                                                   
   
  (m: (_arg0: http.Handler) => http.Handler): (_arg0: core.RequestEvent) => void
 }
 interface mustSubFS {
   
                                                                                    
     
                                                       
   
  (fsys: fs.FS, dir: string): fs.FS
 }
 interface _static {
   
                                                                              
     
                                                                        
                                                                                
     
                                                                    
     
                       
        
                                                                                                                                     
                                                                                       
                                                                                                      
        
     
             
     
        
                                     
                                                              
        
   
  (fsys: fs.FS, indexFallback: boolean): (_arg0: core.RequestEvent) => void
 }
 interface HandleFunc {(e: core.RequestEvent): void }
 interface BatchActionHandlerFunc {(app: CoreApp, ir: core.InternalRequest, params: _TygojaDict, next: (data: any) => void): HandleFunc }
 interface BatchRequestResult {
  body: any
  status: number
 }
 interface batchRequestsForm {
  requests: Array<(core.InternalRequest | undefined)>
 }
 interface batchProcessor {
 }
 interface batchProcessor {
  process(batch: Array<(core.InternalRequest | undefined)>, timeout: time.Duration): void
 }
 interface BatchResponseError {
 }
 interface BatchResponseError {
  error(): string
 }
 interface BatchResponseError {
  code(): string
 }
 interface BatchResponseError {
  resolve(errData: _TygojaDict): any
 }
 interface BatchResponseError {
  marshalJSON(): string|Array<number>
 }
 interface collectionsImportForm {
  collections: Array<_TygojaDict>
  deleteMissing: boolean
 }
 interface fileApi {
 }
 interface defaultInstallerFunc {
   
                                                                       
     
                                                                           
                                                                         
                                              
     
                                                                   
   
  (app: CoreApp, systemSuperuser: core.Record, baseURL: string): void
 }
 interface requireGuestOnly {
   
                                                                       
                          
     
                                                             
   
  (): (hook.Handler<core.RequestEvent | undefined>)
 }
 interface requireAuth {
   
                                                                                           
     
                                                  
                                                                                          
     
             
     
        
                                                                    
                                                                                  
        
   
  (...optCollectionNames: string[]): (hook.Handler<core.RequestEvent | undefined>)
 }
 interface requireSuperuserAuth {
   
                                                               
                                            
   
  (): (hook.Handler<core.RequestEvent | undefined>)
 }
 interface requireSuperuserOrOwnerAuth {
   
                                                                      
                                                                        
     
                                                           
                                                                      
                                                           
   
  (ownerIdPathParam: string): (hook.Handler<core.RequestEvent | undefined>)
 }
 interface requireSameCollectionContextAuth {
   
                                                                           
                                                                            
                                                                                                       
   
  (collectionPathParam: string): (hook.Handler<core.RequestEvent | undefined>)
 }
 interface skipSuccessActivityLog {
   
                                                                            
                                                                             
   
  (): (hook.Handler<core.RequestEvent | undefined>)
 }
 interface bodyLimit {
   
                                                                                             
     
                                             
     
                                                                           
                                 
   
  (limitBytes: number): (hook.Handler<core.RequestEvent | undefined>)
 }
 type _scKTXZU = io.ReadCloser
 interface limitedReader extends _scKTXZU {
 }
 interface limitedReader {
  read(b: string|Array<number>): number
 }
 interface limitedReader {
  reread(): void
 }
 interface limitedReader {
  close(): void
 }
  
                                                      
  
 interface CORSConfig {
   
                                                                         
                                                                                
                                                                         
                                                           
     
                                                                          
                                                                                   
                                                                                        
     
                                           
     
                                                                                                    
   
  allowOrigins: Array<string>
   
                                                                              
                                                                             
                                                                           
                                  
     
                                                                          
                                                                                   
                                                                                        
     
              
   
  allowOriginFunc: (origin: string) => boolean
   
                                                                          
                                                                             
                                                                              
     
                                                            
     
                                                                                                     
   
  allowMethods: Array<string>
   
                                                                          
                                                                                
                                                                            
     
                                        
     
                                                                                                     
   
  allowHeaders: Array<string>
   
                                                 
                                                                             
                                                                       
                                                                           
                                                                              
                                                     
                                             
     
                                                                        
     
                                                                             
                                                                       
                                                                                    
     
                                                                                                         
   
  allowCredentials: boolean
   
                                                                                                                          
                                                                                                                                
     
                                                                                                                                                           
                                                                                              
     
                                      
   
  unsafeWildcardOriginWithAllowCredentials: boolean
   
                                                                               
                                                                  
     
                                                                             
     
                                                                                                     
   
  exposeHeaders: Array<string>
   
                                                                               
                                                                           
                           
                                                                                                                         
     
                                                            
     
                                                                                               
   
  maxAge: number
 }
 interface cors {
   
                                    
   
  (config: CORSConfig): (hook.Handler<core.RequestEvent | undefined>)
 }
  
                                                      
  
 interface GzipConfig {
   
                            
                                
   
  level: number
   
                                                         
                               
     
                                                                          
                                                                        
                                                                         
                                                                            
                                                    
     
              
                                                                                                                               
   
  minLength: number
 }
 interface gzip {
   
                                                                                            
   
  (): (hook.Handler<core.RequestEvent | undefined>)
 }
 interface gzipWithConfig {
   
                                                                                                      
   
  (config: GzipConfig): (hook.Handler<core.RequestEvent | undefined>)
 }
 type _sXNNljx = http.ResponseWriter&io.Writer
 interface gzipResponseWriter extends _sXNNljx {
 }
 interface gzipResponseWriter {
  writeHeader(code: number): void
 }
 interface gzipResponseWriter {
  write(b: string|Array<number>): number
 }
 interface gzipResponseWriter {
  flush(): void
 }
 interface gzipResponseWriter {
  hijack(): [net.Conn, (bufio.ReadWriter)]
 }
 interface gzipResponseWriter {
  push(target: string, opts: http.PushOptions): void
 }
 interface gzipResponseWriter {
  unwrap(): http.ResponseWriter
 }
 type _saSDjvK = sync.RWMutex
 interface rateLimiter extends _saSDjvK {
 }
  
                                                                                               
    
                                                           
  
 type _sufklcW = sync.Mutex
 interface rateClient extends _sufklcW {
 }
 interface realtimeSubscribeForm {
  clientId: string
  subscriptions: Array<string>
 }
  
                                                                          
  
 interface recordData {
  record: any 
  action: string
 }
 interface EmailChangeConfirmForm {
  token: string
  password: string
 }
 interface emailChangeRequestForm {
  newEmail: string
 }
 interface impersonateForm {
   
                                                               
   
  duration: number
 }
 interface otpResponse {
  enabled: boolean
  duration: number 
 }
 interface mfaResponse {
  enabled: boolean
  duration: number 
 }
 interface passwordResponse {
  identityFields: Array<string>
  enabled: boolean
 }
 interface oauth2Response {
  providers: Array<providerInfo>
  enabled: boolean
 }
 interface providerInfo {
  name: string
  displayName: string
  state: string
  authURL: string
   
          
                                    
                                                         
   
  authUrl: string
   
                                                                       
                                                                                   
   
  codeVerifier: string
  codeChallenge: string
  codeChallengeMethod: string
 }
 interface authMethodsResponse {
  password: passwordResponse
  oauth2: oauth2Response
  mfa: mfaResponse
  otp: otpResponse
   
                  
                                              
   
  authProviders: Array<providerInfo>
  usernamePassword: boolean
  emailPassword: boolean
 }
 interface createOTPForm {
  email: string
 }
 interface recordConfirmPasswordResetForm {
  token: string
  password: string
  passwordConfirm: string
 }
 interface recordRequestPasswordResetForm {
  email: string
 }
 interface recordConfirmVerificationForm {
  token: string
 }
 interface recordRequestVerificationForm {
  email: string
 }
 interface recordOAuth2LoginForm {
   
                                                                     
                                                 
   
  createData: _TygojaDict
   
                                                          
   
  provider: string
   
                                                              
   
  code: string
   
                                                                                                 
   
  codeVerifier: string
   
                                                    
   
  redirectURL: string
   
          
                                        
                                                             
   
  redirectUrl: string
 }
 interface oauth2RedirectData {
  state: string
  code: string
  error: string
   
                           
   
  appleUser: string
 }
 interface authWithOTPForm {
  otpId: string
  password: string
 }
 interface authWithPasswordForm {
  identity: string
  password: string
   
                                                                        
                                           
   
  identityField: string
 }
 
 import cryptoRand = rand
 interface recordAuthResponse {
   
                                                                     
                                        
     
                                                                                                               
                                                                                     
     
                                                                                             
                                                                          
   
  (e: core.RequestEvent, authRecord: core.Record, authMethod: string, meta: any): void
 }
 interface enrichRecord {
   
                                                                            
        
                                                                                
                                                                                   
                                                                                                     
        
   
  (e: core.RequestEvent, record: core.Record, ...defaultExpands: string[]): void
 }
 interface enrichRecords {
   
                                                                                
        
                                                                                
                                                                                      
                                                                                                     
        
     
                                                              
   
  (e: core.RequestEvent, records: Array<(core.Record | undefined)>, ...defaultExpands: string[]): void
 }
 interface iterator<T> {
 }
  
                                                                
  
 interface ServeConfig {
   
                                                                                        
   
  showStartBanner: boolean
   
                                                                                    
   
  httpAddr: string
   
                                                                                       
   
  httpsAddr: string
   
                                                                   
     
                                                                     
     
                                                                 
                                          
   
  certificateDomains: Array<string>
   
                                                                         
   
  allowedOrigins: Array<string>
 }
 interface serve {
   
                                       
     
                                                                       
     
             
     
        
                     
                                       
                                         
                              
        
        
   
  (app: CoreApp, config: ServeConfig): void
 }
 interface serverErrorLogWriter {
 }
 interface serverErrorLogWriter {
  write(p: string|Array<number>): number
 }
}

namespace pocketbase {
  
                                                 
    
                                                                              
                                                                               
  
 type _sPBnYeF = CoreApp
 interface PocketBase extends _sPBnYeF {
   
                                        
   
  rootCmd?: cobra.Command
 }
  
                                                          
  
 interface Config {
   
                                                        
   
  hideStartBanner: boolean
   
                                                  
   
  defaultDev: boolean
  defaultDataDir: string 
  defaultEncryptionEnv: string
  defaultQueryTimeout: time.Duration 
   
                               
   
  dataMaxOpenConns: number 
  dataMaxIdleConns: number 
  auxMaxOpenConns: number 
  auxMaxIdleConns: number 
  dbConnect: core.DBConnectFunc 
 }
 interface _new {
   
                                                                          
                                                                       
     
                                                                        
                                                                                
                                                                        
                                                                                 
                                                              
   
  (): (PocketBase)
 }
 interface newWithConfig {
   
                                                                              
     
                                                                        
                                                                                
                                                                        
                                                                                 
                                                              
   
  (config: Config): (PocketBase)
 }
 interface PocketBase {
   
                                                                    
                                                                  
   
  start(): void
 }
 interface PocketBase {
   
                                                                      
                                                   
     
                                                                       
                     
   
  execute(): void
 }
  
                                                                                 
  
 interface coloredWriter {
 }
 interface coloredWriter {
   
                                                       
   
  write(p: string|Array<number>): number
 }
}

 
                                                                       
                                                                      
                                                    
   
                                                                                               
   
           
   
      
                                      
   
                                     
                                                             
                   
                    
                                            
   
                                     
                                                     
                   
                    
                                            
      
 
namespace template {
 interface newRegistry {
   
                                                                      
                                                                           
     
                                                                        
   
  (): (Registry)
 }
  
                                                                                         
    
                                                                       
  
 interface Registry {
 }
 interface Registry {
   
                                                      
     
                                                                                       
                                                                                               
     
                                                                      
                                                                                  
     
             
     
        
                                
                                            
                                        
          
           
        
        
   
  addFuncs(funcs: _TygojaDict): (Registry)
 }
 interface Registry {
   
                                                                       
                                                                  
     
                                                 
   
  loadFiles(...filenames: string[]): (Renderer)
 }
 interface Registry {
   
                                                                        
                                                                  
   
  loadString(text: string): (Renderer)
 }
 interface Registry {
   
                                                                     
                                                                          
     
                                                                       
                                                                             
   
  loadFS(fsys: fs.FS, ...globPatterns: string[]): (Renderer)
 }
  
                                              
  
 interface Renderer {
 }
 interface Renderer {
   
                                                                           
                                            
   
  render(data: any): string
 }
}

 
                                                                        
                                                                                  
                                                                         
                                              
   
                                                                            
 
namespace sync {
 
 import isync = sync
  
                                       
                                                    
    
                                               
    
                                                
                                                                                       
                  
                                                                         
                                                                         
                    
    
                                                 
  
 interface Mutex {
 }
 interface Mutex {
   
                  
                                                         
                                         
   
  lock(): void
 }
 interface Mutex {
   
                                                              
     
                                                                     
                                                           
                                    
   
  tryLock(): boolean
 }
 interface Mutex {
   
                      
                                                                  
     
                                                                    
                                                             
                                                
   
  unlock(): void
 }
  
                                                       
                                                                              
                                                      
    
                                                 
    
                                                                           
                                                                             
                                                                   
                                                        
                                                    
                                                               
                                                                  
    
                                                
                                                                                 
                                       
                                                      
                                                                     
                                                                         
                            
    
                                                 
  
 interface RWMutex {
 }
 interface RWMutex {
   
                                
     
                                                                     
                                                               
                                         
   
  rLock(): void
 }
 interface RWMutex {
   
                                                                            
     
                                                                      
                                                            
                                    
   
  tryRLock(): boolean
 }
 interface RWMutex {
   
                                                  
                                                   
                                                           
                         
   
  rUnlock(): void
 }
 interface RWMutex {
   
                               
                                                          
                                             
   
  lock(): void
 }
 interface RWMutex {
   
                                                                           
     
                                                                     
                                                           
                                    
   
  tryLock(): boolean
 }
 interface RWMutex {
   
                                                                   
                                               
     
                                                                            
                                                                                     
                                                                              
   
  unlock(): void
 }
 interface RWMutex {
   
                                                         
                                                                                      
   
  rLocker(): Locker
 }
}

 
                                                          
                                                                          
                                                                  
                                                                  
   
                                                                           
                                                                        
                                               
 
namespace io {
  
                                                             
    
                                                                        
                                                                   
                                                                             
                                                                       
                                                          
    
                                                                
                                                              
                                                                    
                                                            
                                                               
                                                                 
                                                                
                  
    
                                                                 
                                                                    
                                                             
                          
    
                                                                     
                                                                
    
                                                            
                                                              
                                                                 
                                                             
    
                                      
  
 interface Reader {
  [key:string]: any;
  read(p: string|Array<number>): number
 }
  
                                                              
    
                                                                   
                                                                    
                                                                  
                                                               
                                                           
    
                                      
  
 interface Writer {
  [key:string]: any;
  write(p: string|Array<number>): number
 }
  
                                                                             
  
 interface ReadCloser {
  [key:string]: any;
 }
  
                                                                              
            
  
 interface ReadSeekCloser {
  [key:string]: any;
 }
}

 
                                                                          
                                                              
 
namespace bytes {
  
                                                                                   
                                                                     
                 
                                                                  
                                                                       
  
 interface Reader {
 }
 interface Reader {
   
                                                                 
           
   
  len(): number
 }
 interface Reader {
   
                                                                   
                                                                           
                                                                        
   
  size(): number
 }
 interface Reader {
   
                                               
   
  read(b: string|Array<number>): number
 }
 interface Reader {
   
                                                   
   
  readAt(b: string|Array<number>, off: number): number
 }
 interface Reader {
   
                                                       
   
  readByte(): number
 }
 interface Reader {
   
                                                                                             
   
  unreadByte(): void
 }
 interface Reader {
   
                                                       
   
  readRune(): [number, number]
 }
 interface Reader {
   
                                                                                             
   
  unreadRune(): void
 }
 interface Reader {
   
                                               
   
  seek(offset: number, whence: number): number
 }
 interface Reader {
   
                                                    
   
  writeTo(w: io.Writer): number
 }
 interface Reader {
   
                                                    
   
  reset(b: string|Array<number>): void
 }
}

 
                                                                          
                                                                       
                                                                           
                                                                         
                                                                       
                                                                           
                                 
                                                                          
                                                                         
                                                  
                                                                      
                                                    
                                                               
                                                           
                                                
   
                                                               
                                                                     
                                                           
                                                               
                                                               
 
namespace syscall {
 
 import errpkg = errors
 interface SysProcAttr {
  chroot: string 
  credential?: Credential 
   
                                                           
                                                                       
                                                                       
   
  ptrace: boolean
  setsid: boolean 
   
                                                            
                                                     
   
  setpgid: boolean
   
                                                          
                                                           
                                                        
                                               
   
  setctty: boolean
  noctty: boolean 
  ctty: number 
   
                                                                 
                                                        
                                           
                                                           
                                  
   
  foreground: boolean
  pgid: number 
   
                                                                     
                                                                          
                                                                                
                                                          
   
  pdeathsig: Signal
  cloneflags: number 
  unshareflags: number 
  uidMappings: Array<SysProcIDMap> 
  gidMappings: Array<SysProcIDMap> 
   
                                                           
                                                                             
                                                                              
                                                         
   
  gidMappingsEnableSetgroups: boolean
  ambientCaps: Array<number> 
  useCgroupFD: boolean 
  cgroupFD: number 
   
                                                                     
                                                                    
                                                     
   
  pidFD?: number
 }
 
 import errorspkg = errors
  
                                          
  
 interface RawConn {
  [key:string]: any;
   
                                                          
                          
                                                               
                                        
   
  control(f: (fd: number) => void): void
   
                                                       
                                                                
                     
                                                           
                                                           
                            
                                                              
                                      
   
  read(f: (fd: number) => boolean): void
   
                                        
   
  write(f: (fd: number) => boolean): void
 }
 
 import runtimesyscall = syscall
  
                                                                 
                                                                      
                                                                   
    
       
              
                    
                 
      
       
    
                                                                      
                
    
       
                                      
                                          
       
  
 interface Errno extends Number{}
 interface Errno {
  error(): string
 }
 interface Errno {
  is(target: Error): boolean
 }
 interface Errno {
  temporary(): boolean
 }
 interface Errno {
  timeout(): boolean
 }
}

 
                                                                         
   
                                                                        
                   
   
                     
   
                                                                     
                                                                       
                                                                       
                                                                        
                                                                       
                                                                  
                                                                  
                                                                 
                           
   
                                                                    
                                                                          
                             
   
      
                       
                                                
                   
                           
      
   
                                                                         
                                                                       
          
   
                                                                       
                                                                        
                       
   
                                                                    
                                                                           
                                                                          
                                                                          
                                                                                  
                                                                                   
                                                                                    
                                                                                 
   
                                                                         
                                                                                  
                                                                    
                                                                        
                                                         
   
                                                                               
                                                                   
                                                                            
                                                                                      
                                                                                    
                                               
   
                                                             
                                                                      
                                                                       
                                                                        
                                                                                   
                                                              
                                                                
                              
   
                                                                      
                                                                       
           
   
                                                                      
                                                               
                                                               
                           
   
                                                                   
                                                                                     
                                                                           
   
                     
   
                                                                              
                               
                                   
                                                               
                                                                  
                                                                                         
 
namespace time {
 interface Time {
   
                                                              
     
        
                                               
        
     
                                                                   
                                                                      
                                                            
     
                                                                        
                                                                    
                                    
   
  string(): string
 }
 interface Time {
   
                                                                                  
          
   
  goString(): string
 }
 interface Time {
   
                                                                                  
                                                                         
                                                                        
     
                                                                      
                                                            
   
  format(layout: string): string
 }
 interface Time {
   
                                                               
                                                         
   
  appendFormat(b: string|Array<number>, layout: string): string|Array<number>
 }
  
                                                                   
    
                                                                        
                                                                        
                                     
    
                                                                         
                                                                                       
                                                  
    
                                                                                                  
                                                                         
                                                                       
    
                                                                             
                                                                                   
                                                                              
    
                                                                                                      
                                                                             
                                                                                 
                                  
    
                                                                                                             
                                                                                                            
                                                                                          
    
                                                                                    
                                                                                     
                                  
                                                                                
    
                                                                                
                                                                               
                                                                       
                                                                         
                                                                                
                                                                              
                                                                            
                                                                             
                  
  
 interface Time {
 }
 interface Time {
   
                                                               
                                     
   
  isZero(): boolean
 }
 interface Time {
   
                                                         
   
  after(u: Time): boolean
 }
 interface Time {
   
                                                           
   
  before(u: Time): boolean
 }
 interface Time {
   
                                                                                 
                                                                       
   
  compare(u: Time): number
 }
 interface Time {
   
                                                                   
                                                                    
                                                    
                                                                             
                                                     
   
  equal(u: Time): boolean
 }
 interface Time {
   
                                                             
   
  date(): [number, Month, number]
 }
 interface Time {
   
                                             
   
  year(): number
 }
 interface Time {
   
                                                        
   
  month(): Month
 }
 interface Time {
   
                                                     
   
  day(): number
 }
 interface Time {
   
                                                        
   
  weekday(): Weekday
 }
 interface Time {
   
                                                                         
                                                                         
                                                                           
                 
   
  isoWeek(): [number, number]
 }
 interface Time {
   
                                                                              
   
  clock(): [number, number, number]
 }
 interface Time {
   
                                                                               
   
  hour(): number
 }
 interface Time {
   
                                                                                           
   
  minute(): number
 }
 interface Time {
   
                                                                                             
   
  second(): number
 }
 interface Time {
   
                                                                               
                                 
   
  nanosecond(): number
 }
 interface Time {
   
                                                                                                 
                               
   
  yearDay(): number
 }
  
                                                               
                                                               
                                                              
  
 interface Duration extends Number{}
 interface Duration {
   
                                                                               
                                                                               
                                                                                
                                                                         
   
  string(): string
 }
 interface Duration {
   
                                                                     
   
  nanoseconds(): number
 }
 interface Duration {
   
                                                                       
   
  microseconds(): number
 }
 interface Duration {
   
                                                                       
   
  milliseconds(): number
 }
 interface Duration {
   
                                                                        
   
  seconds(): number
 }
 interface Duration {
   
                                                                        
   
  minutes(): number
 }
 interface Duration {
   
                                                                    
   
  hours(): number
 }
 interface Duration {
   
                                                                              
                                             
   
  truncate(m: Duration): Duration
 }
 interface Duration {
   
                                                                         
                                                                         
                                                   
                                              
                                                     
                                          
   
  round(m: Duration): Duration
 }
 interface Duration {
   
                                         
                                                                                            
                                            
   
  abs(): Duration
 }
 interface Time {
   
                              
   
  add(d: Duration): Time
 }
 interface Time {
   
                                                                                 
                                                                                
                      
                                                    
   
  sub(u: Time): Duration
 }
 interface Time {
   
                                                         
                                                  
                                                              
                           
     
                                                                            
                                                                               
                                                                          
                                                                                  
                                                                                
                                                                                 
                                                                                 
                                       
     
                                                                  
                                                           
                                                     
   
  addDate(years: number, months: number, days: number): Time
 }
 interface Time {
   
                                                
   
  utc(): Time
 }
 interface Time {
   
                                                         
   
  local(): Time
 }
 interface Time {
   
                                                                   
                                                                
              
     
                             
   
  in(loc: Location): Time
 }
 interface Time {
   
                                                                  
   
  location(): (Location)
 }
 interface Time {
   
                                                                               
                                                                            
   
  zone(): [string, number]
 }
 interface Time {
   
                                                                        
                                                              
                                                                                        
                                                                      
                                                              
   
  zoneBounds(): [Time, Time]
 }
 interface Time {
   
                                                                 
                                                                 
                                
                                                              
                                                                 
                                                                     
   
  unix(): number
 }
 interface Time {
   
                                                                                 
                                                                     
                                                                                 
                                                                   
                                
   
  unixMilli(): number
 }
 interface Time {
   
                                                                                 
                                                                     
                                                                                  
                                                                              
            
   
  unixMicro(): number
 }
 interface Time {
   
                                                                         
                                                                        
                                                                             
                                                                             
                                                                     
                                
   
  unixNano(): number
 }
 interface Time {
   
                                                                     
   
  appendBinary(b: string|Array<number>): string|Array<number>
 }
 interface Time {
   
                                                                       
   
  marshalBinary(): string|Array<number>
 }
 interface Time {
   
                                                                           
   
  unmarshalBinary(data: string|Array<number>): void
 }
 interface Time {
   
                                                       
   
  gobEncode(): string|Array<number>
 }
 interface Time {
   
                                                       
   
  gobDecode(data: string|Array<number>): void
 }
 interface Time {
   
                                                                    
                                                                                  
                                                             
                                                                 
   
  marshalJSON(): string|Array<number>
 }
 interface Time {
   
                                                                        
                                                             
   
  unmarshalJSON(data: string|Array<number>): void
 }
 interface Time {
   
                                                                 
                                                                        
                                                             
                                                                 
   
  appendText(b: string|Array<number>): string|Array<number>
 }
 interface Time {
   
                                                                              
                                                          
     
                                                
   
  marshalText(): string|Array<number>
 }
 interface Time {
   
                                                                       
                                             
   
  unmarshalText(data: string|Array<number>): void
 }
 interface Time {
   
                                                                                           
   
  isDST(): boolean
 }
 interface Time {
   
                                                                                             
                                                                                                   
     
                                                                    
                                                                   
                                                                 
                                              
   
  truncate(d: Duration): Time
 }
 interface Time {
   
                                                                                               
                                                             
                                                                                                
     
                                                                 
                                                                   
                                                              
                                              
   
  round(d: Duration): Time
 }
}

 
                                                                     
                                                                              
                         
   
                                                                        
                                                                  
                                                                      
                                                                        
                                 
   
                                                                                  
                                                                   
                                                                              
   
                                                                       
                                                                      
                                                                          
                                                                   
                                                                  
                                                                       
                                                              
   
                                                                               
                                                                     
                                                                  
                                                                        
                                                  
   
                                                                          
                                                                               
               
   
                                                                      
                                                                          
                                                                           
                                  
   
      
                                                          
                       
     
      
   
                                                                                  
                                                
   
                                                                              
                                                          
   
                                                                               
                                                                 
   
                                                                          
            
 
namespace context {
  
                                                                                
                   
    
                                                                          
  
 interface Context {
  [key:string]: any;
   
                                                                       
                                                                       
                                                               
   
  deadline(): [time.Time, boolean]
   
                                                                          
                                                                        
                                                                       
                                                             
                                       
     
                                                                     
                                                                  
                                                                         
             
     
                                                   
     
                                                                       
                                                                  
                                                                
            
                                  
                       
                   
         
                
                          
                         
                      
         
        
       
     
                                                                          
                                     
   
  done(): undefined
   
                                                
                                                                   
                                                       
                                                                   
                                                                                      
   
  err(): void
   
                                                                         
                                                                       
                                          
     
                                                                  
                                                                         
               
     
                                                                        
                                                                    
                                                                        
                                                                 
                                                               
                
     
                                                                          
                                          
     
        
                                                                    
                  
     
                      
     
                                                          
                            
     
                                                                    
                                                                      
                  
     
                                                                   
                                                                     
                                            
                     
     
                                                               
                                                                     
                                                
       
     
                                                                  
                                                           
                                          
                   
       
        
   
  value(key: any): any
 }
}

 
                                                        
                                                             
                              
   
                                                            
                                   
 
namespace fs {
  
                                                        
    
                                                                               
                                                      
                                                                           
    
                                                                            
                
  
 interface FS {
  [key:string]: any;
   
                               
                                                                     
     
                                                                
                                                                 
                                              
     
                                                                  
                                                            
                               
   
  open(name: string): File
 }
  
                                            
                                                                          
                                                        
                                                                       
  
 interface File {
  [key:string]: any;
  stat(): FileInfo
  read(_arg0: string|Array<number>): number
  close(): void
 }
  
                                                
                                                                       
  
 interface DirEntry {
  [key:string]: any;
   
                                                                                
                                                                                          
                                                                          
   
  name(): string
   
                                                           
   
  isDir(): boolean
   
                                              
                                                                                                       
   
  type(): FileMode
   
                                                                                   
                                                                              
                                                                                  
                                                                                               
                                                                                              
                           
   
  info(): FileInfo
 }
  
                                                          
  
 interface FileInfo {
  [key:string]: any;
  name(): string 
  size(): number 
  mode(): FileMode 
  modTime(): time.Time 
  isDir(): boolean 
  sys(): any 
 }
  
                                                            
                                                             
                                                        
                                                           
                                                       
  
 interface FileMode extends Number{}
 interface FileMode {
  string(): string
 }
 interface FileMode {
   
                                                   
                                                            
   
  isDir(): boolean
 }
 interface FileMode {
   
                                                          
                                                      
   
  isRegular(): boolean
 }
 interface FileMode {
   
                                                                 
   
  perm(): FileMode
 }
 interface FileMode {
   
                                                  
   
  type(): FileMode
 }
  
                                                                              
  
 interface PathError {
  op: string
  path: string
  err: Error
 }
 interface PathError {
  error(): string
 }
 interface PathError {
  unwrap(): void
 }
 interface PathError {
   
                                                             
   
  timeout(): boolean
 }
  
                                                                        
                           
    
                                                                     
                                                                           
                                                                      
                     
    
                                                        
    
                                                                    
                                                                           
                                                                     
                                                                       
                                                                            
                                                                       
                       
    
                                                                     
                                                                            
                                                                        
                                                  
    
                                                                          
    
                                                                     
                                                                          
                             
    
                                                                                        
                                                               
                                                                      
                                                                       
                                                                         
                                                                     
                                                                                 
                                                                 
                                                   
    
                                                                                 
    
       
                                                                      
                                                                             
                                                                                
                                           
                                                                       
                                               
       
  
 interface WalkDirFunc {(path: string, d: DirEntry, err: Error): void }
}

 
                                                                            
                                                                          
                                                                      
 
namespace bufio {
  
                                                            
                                  
  
 type _sDvsqSa = Reader&Writer
 interface ReadWriter extends _sDvsqSa {
 }
}

 
                                                                       
                                                                
   
                                                               
                                                                       
                                                                   
                                                                
                                                             
   
                                          
   
      
                                                 
                   
                    
     
                                               
                                                         
          
      
   
                                       
   
      
                                         
                   
                    
     
         
                             
                    
                     
      
                              
     
      
   
                    
   
                                                                                     
                                                                                             
   
                                                                     
                                                                                
                                                                              
                                                        
   
                                                                                         
                                                                                                 
                                                                                   
                                                                                   
                                                                        
                                                                         
                                                                        
                                                                                   
                                  
   
                                                                      
                                                                           
                                                                                          
   
                                                                             
                                                                          
   
      
                                                        
                                                                    
      
   
                                                                    
                                            
                                                                              
                                                            
                                                                                              
                                                                   
                                                                                      
   
                                                                        
                                                      
                                                                            
                                                                   
   
                                                                           
                                                              
                                                                      
                                                                      
                                 
   
                                                               
                                                                       
                                                     
   
                                                                
   
                                                                   
                                                       
 
namespace net {
  
                                                         
    
                                                                    
  
 interface Conn {
  [key:string]: any;
   
                                         
                                                                   
                                                     
   
  read(b: string|Array<number>): number
   
                                         
                                                                    
                                                      
   
  write(b: string|Array<number>): number
   
                                 
                                                                              
                                                                
                                                  
   
  close(): void
   
                                                           
   
  localAddr(): Addr
   
                                                             
   
  remoteAddr(): Addr
   
                                                             
                                                          
                                          
     
                                                              
                                                                 
                                                                
                                                           
                                                                     
     
                                                                    
                                                                        
                                                                     
                                                                     
                                                                
                                                            
     
                                                               
                                                       
     
                                                               
   
  setDeadline(t: time.Time): void
   
                                                            
                                         
                                                     
   
  setReadDeadline(t: time.Time): void
   
                                                              
                                          
                                                                  
                                               
                                                      
   
  setWriteDeadline(t: time.Time): void
 }
  
                                                                           
    
                                                                        
  
 interface Listener {
  [key:string]: any;
   
                                                                      
   
  accept(): Conn
   
                               
                                                                       
   
  close(): void
   
                                                 
   
  addr(): Addr
 }
 
 import _cgopackage = cgo
}

 
                                                                          
                                                                              
                                                                                                        
   
           
   
                                                                                                            
                                                                             
   
                     
   
      
                                                                          
                                  
                                          
                                       
                                               
                                        
                                                
                                                            
                                          
                                                                    
                                                  
      
   
              
   
      
                                  
                                    
      
   
               
   
      
                                              
                                             
                                            
                                                      
                                           
                              
                                               
                                              
                                             
                                                       
                                            
                              
      
   
                                                                         
                                                                             
                                                             
   
            
   
      
                                                      
                                                              
                                                              
                                      
                                                                
                                                     
   
                                                                                      
   
                                                   
                                                                                                              
                                                 
                                                                                        
      
   
                 
   
      
                                                             
                                                                        
                                       
                                                                                         
                                             
                                 
      
   
                    
   
      
                                 
                                      
                                           
                                    
                                            
                                                   
                                                             
                                                            
                                                          
                                     
                                                               
      
   
                            
   
      
                                   
                                              
                                       
                                            
                                              
                                                              
      
   
                                                       
   
      
                                 
                                     
                                     
                                         
                                                                         
                                                                                  
                                                                              
                                                                                      
      
   
                                           
   
      
                                    
                                         
                                              
                                                   
                                                    
                                                         
      
   
                           
   
      
                                                
                                           
                                         
                                   
                                               
                                    
                                                                                         
                                        
                                                       
                                                  
                                                
                                        
                                                    
                                             
      
   
                                                               
                                                    
 
namespace syntax {
  
                                                                                         
  
 interface Flags extends Number{}
}

 
                                                                                                      
                                                                                                                       
 
namespace cobra {
 interface Command {
   
                                                                                      
   
  genBashCompletion(w: io.Writer): void
 }
 interface Command {
   
                                                          
   
  genBashCompletionFile(filename: string): void
 }
 interface Command {
   
                                                                 
   
  genBashCompletionFileV2(filename: string, includeDesc: boolean): void
 }
 interface Command {
   
                                                                 
                                        
   
  genBashCompletionV2(w: io.Writer, includeDesc: boolean): void
 }
 
 import flag = pflag
  
                                                         
                                                             
                                                                   
                                   
  
 interface Command {
   
                                       
                                      
        
                                                                                                     
                                                                                    
                                                                                                                 
                                                                                                                
                                                                                                                     
                                                         
        
                                                           
   
  use: string
   
                                                                                      
   
  aliases: Array<string>
   
                                                                                       
                                          
   
  suggestFor: Array<string>
   
                                                               
   
  short: string
   
                                                                                            
   
  groupID: string
   
                                                                        
   
  long: string
   
                                                   
   
  example: string
   
                                                                                             
   
  validArgs: Array<Completion>
   
                                                                                                           
                                                
                                                                           
   
  validArgsFunction: CompletionFunc
   
                       
   
  args: PositionalArgs
   
                                                 
                                                                 
                                      
   
  argAliases: Array<string>
   
                                                                                                      
                                                                                          
   
  bashCompletionFunction: string
   
                                                                                              
   
  deprecated: string
   
                                                                                    
                                           
   
  annotations: _TygojaDict
   
                                                                                                      
                                                                                                      
                                                                                                 
                                 
   
  version: string
   
                                                            
        
                           
                 
              
                  
                            
        
                                                                           
                                                                                                
                               
     
                                                                         
   
  persistentPreRun: (cmd: Command, args: Array<string>) => void
   
                                                              
   
  persistentPreRunE: (cmd: Command, args: Array<string>) => void
   
                                                       
   
  preRun: (cmd: Command, args: Array<string>) => void
   
                                          
   
  preRunE: (cmd: Command, args: Array<string>) => void
   
                                                                                     
   
  run: (cmd: Command, args: Array<string>) => void
   
                                    
   
  runE: (cmd: Command, args: Array<string>) => void
   
                                        
   
  postRun: (cmd: Command, args: Array<string>) => void
   
                                            
   
  postRunE: (cmd: Command, args: Array<string>) => void
   
                                                                                        
   
  persistentPostRun: (cmd: Command, args: Array<string>) => void
   
                                                                
   
  persistentPostRunE: (cmd: Command, args: Array<string>) => void
   
                                                       
   
  fParseErrWhitelist: FParseErrWhitelist
   
                                                                                      
   
  completionOptions: CompletionOptions
   
                                                                                 
   
  traverseChildren: boolean
   
                                                                                                        
   
  hidden: boolean
   
                                                            
   
  silenceErrors: boolean
   
                                                                     
   
  silenceUsage: boolean
   
                                                  
                                                                          
   
  disableFlagParsing: boolean
   
                                                                               
                                                         
   
  disableAutoGenTag: boolean
   
                                                                            
                                                            
   
  disableFlagsInUseLine: boolean
   
                                                                              
                                                   
   
  disableSuggestions: boolean
   
                                                                                            
                 
   
  suggestionsMinimumDistance: number
 }
 interface Command {
   
                                                                        
                                                                    
                                                                         
     
                                                                             
                                                                         
                                                                      
   
  context(): context.Context
 }
 interface Command {
   
                                                                                 
                                                       
   
  setContext(ctx: context.Context): void
 }
 interface Command {
   
                                                                                                               
                                      
   
  setArgs(a: Array<string>): void
 }
 interface Command {
   
                                                                 
                                         
     
                                                 
   
  setOutput(output: io.Writer): void
 }
 interface Command {
   
                                                    
                                         
   
  setOut(newOut: io.Writer): void
 }
 interface Command {
   
                                                    
                                         
   
  setErr(newErr: io.Writer): void
 }
 interface Command {
   
                                         
                                       
   
  setIn(newIn: io.Reader): void
 }
 interface Command {
   
                                                                           
   
  setUsageFunc(f: (_arg0: Command) => void): void
 }
 interface Command {
   
                                                                         
   
  setUsageTemplate(s: string): void
 }
 interface Command {
   
                                                                            
           
   
  setFlagErrorFunc(f: (_arg0: Command, _arg1: Error) => void): void
 }
 interface Command {
   
                                                                   
   
  setHelpFunc(f: (_arg0: Command, _arg1: Array<string>) => void): void
 }
 interface Command {
   
                                      
   
  setHelpCommand(cmd: Command): void
 }
 interface Command {
   
                                                                 
   
  setHelpCommandGroupID(groupID: string): void
 }
 interface Command {
   
                                                                             
   
  setCompletionCommandGroupID(groupID: string): void
 }
 interface Command {
   
                                                                                                  
   
  setHelpTemplate(s: string): void
 }
 interface Command {
   
                                                                                                        
   
  setVersionTemplate(s: string): void
 }
 interface Command {
   
                                                                                                    
   
  setErrPrefix(s: string): void
 }
 interface Command {
   
                                                                                                          
                                                              
   
  setGlobalNormalizationFunc(n: (f: any, name: string) => any): void
 }
 interface Command {
   
                                          
   
  outOrStdout(): io.Writer
 }
 interface Command {
   
                                         
   
  outOrStderr(): io.Writer
 }
 interface Command {
   
                                         
   
  errOrStderr(): io.Writer
 }
 interface Command {
   
                                     
   
  inOrStdin(): io.Reader
 }
 interface Command {
   
                                                                               
                                                         
   
  usageFunc(): (_arg0: Command) => void
 }
 interface Command {
   
                                              
                                             
                                                    
   
  usage(): void
 }
 interface Command {
   
                                                                             
                                                                      
   
  helpFunc(): (_arg0: Command, _arg1: Array<string>) => void
 }
 interface Command {
   
                                            
                                           
                                                   
   
  help(): void
 }
 interface Command {
   
                                      
   
  usageString(): string
 }
 interface Command {
   
                                                                               
                                                                             
           
   
  flagErrorFunc(): (_arg0: Command, _arg1: Error) => void
 }
 interface Command {
   
                                               
   
  usagePadding(): number
 }
 interface Command {
   
                                                            
   
  commandPathPadding(): number
 }
 interface Command {
   
                                              
   
  namePadding(): number
 }
 interface Command {
   
                                                          
                                                               
   
  usageTemplate(): string
 }
 interface Command {
   
                                                       
                                                               
   
  helpTemplate(): string
 }
 interface Command {
   
                                                             
                                                               
   
  versionTemplate(): string
 }
 interface Command {
   
                                                          
   
  errPrefix(): string
 }
 interface Command {
   
                                                            
                                                             
   
  find(args: Array<string>): [(Command), Array<string>]
 }
 interface Command {
   
                                                                      
                 
   
  traverse(args: Array<string>): [(Command), Array<string>]
 }
 interface Command {
   
                                                           
   
  suggestionsFor(typedName: string): Array<string>
 }
 interface Command {
   
                                                                                  
   
  visitParents(fn: (_arg0: Command) => void): void
 }
 interface Command {
   
                             
   
  root(): (Command)
 }
 interface Command {
   
                                                                         
                                             
   
  argsLenAtDash(): number
 }
 interface Command {
   
                                                                              
                                                                                  
               
   
  executeContext(ctx: context.Context): void
 }
 interface Command {
   
                                                   
                                                                 
                                               
   
  execute(): void
 }
 interface Command {
   
                                                                                
                                                                                  
               
   
  executeContextC(ctx: context.Context): (Command)
 }
 interface Command {
   
                                   
   
  executeC(): (Command)
 }
 interface Command {
  validateArgs(args: Array<string>): void
 }
 interface Command {
   
                                                                                                  
   
  validateRequiredFlags(): void
 }
 interface Command {
   
                                                     
                                                                                
                                                    
   
  initDefaultHelpFlag(): void
 }
 interface Command {
   
                                                           
                                                   
                                                         
                                               
   
  initDefaultVersionFlag(): void
 }
 interface Command {
   
                                                       
                                                                                
                                                                               
   
  initDefaultHelpCmd(): void
 }
 interface Command {
   
                                                                     
   
  resetCommands(): void
 }
 interface Command {
   
                                                       
   
  commands(): Array<(Command | undefined)>
 }
 interface Command {
   
                                                                 
   
  addCommand(...cmds: (Command | undefined)[]): void
 }
 interface Command {
   
                                                    
   
  groups(): Array<(Group | undefined)>
 }
 interface Command {
   
                                                                                 
   
  allChildCommandsHaveGroup(): boolean
 }
 interface Command {
   
                                                                          
   
  containsGroup(groupID: string): boolean
 }
 interface Command {
   
                                                                     
   
  addGroup(...groups: (Group | undefined)[]): void
 }
 interface Command {
   
                                                                      
   
  removeCommand(...cmds: (Command | undefined)[]): void
 }
 interface Command {
   
                                                                                                 
   
  print(...i: {
   }[]): void
 }
 interface Command {
   
                                                                                                     
   
  println(...i: {
   }[]): void
 }
 interface Command {
   
                                                                                                   
   
  printf(format: string, ...i: {
   }[]): void
 }
 interface Command {
   
                                                                                                        
   
  printErr(...i: {
   }[]): void
 }
 interface Command {
   
                                                                                                            
   
  printErrln(...i: {
   }[]): void
 }
 interface Command {
   
                                                                                                          
   
  printErrf(format: string, ...i: {
   }[]): void
 }
 interface Command {
   
                                                       
   
  commandPath(): string
 }
 interface Command {
   
                                                                                 
                                              
   
  displayName(): string
 }
 interface Command {
   
                                                                             
   
  useLine(): string
 }
 interface Command {
   
                                                                                  
                       
   
  debugFlags(): void
 }
 interface Command {
   
                                                                     
   
  name(): string
 }
 interface Command {
   
                                                                      
   
  hasAlias(s: string): boolean
 }
 interface Command {
   
                                                                       
                                                                        
   
  calledAs(): string
 }
 interface Command {
   
                                                                      
   
  nameAndAliases(): string
 }
 interface Command {
   
                                                      
   
  hasExample(): boolean
 }
 interface Command {
   
                                                           
   
  runnable(): boolean
 }
 interface Command {
   
                                                                    
   
  hasSubCommands(): boolean
 }
 interface Command {
   
                                                                                  
                                                        
   
  isAvailableCommand(): boolean
 }
 interface Command {
   
                                                                          
                                                                           
                                                                                 
                                    
                                                                                        
   
  isAdditionalHelpTopicCommand(): boolean
 }
 interface Command {
   
                                                                                     
                                                                                    
             
   
  hasHelpSubCommands(): boolean
 }
 interface Command {
   
                                                                                    
                                                                                    
   
  hasAvailableSubCommands(): boolean
 }
 interface Command {
   
                                                            
   
  hasParent(): boolean
 }
 interface Command {
   
                                                                                                  
   
  globalNormalizationFunc(): (f: any, name: string) => any
 }
 interface Command {
   
                                                    
                                                                             
   
  flags(): (any)
 }
 interface Command {
   
                                                                                                      
                                                                                                                 
   
  localNonPersistentFlags(): (any)
 }
 interface Command {
   
                                                                                  
                                                                                                                 
   
  localFlags(): (any)
 }
 interface Command {
   
                                                                                
                                                                                                                 
   
  inheritedFlags(): (any)
 }
 interface Command {
   
                                                                                       
                                                                                                                 
   
  nonInheritedFlags(): (any)
 }
 interface Command {
   
                                                                                            
   
  persistentFlags(): (any)
 }
 interface Command {
   
                                               
   
  resetFlags(): void
 }
 interface Command {
   
                                                                                                         
   
  hasFlags(): boolean
 }
 interface Command {
   
                                                                        
   
  hasPersistentFlags(): boolean
 }
 interface Command {
   
                                                                                 
   
  hasLocalFlags(): boolean
 }
 interface Command {
   
                                                                                         
   
  hasInheritedFlags(): boolean
 }
 interface Command {
   
                                                                                                      
                                                   
   
  hasAvailableFlags(): boolean
 }
 interface Command {
   
                                                                                                                    
   
  hasAvailablePersistentFlags(): boolean
 }
 interface Command {
   
                                                                                                              
                   
   
  hasAvailableLocalFlags(): boolean
 }
 interface Command {
   
                                                                                                           
                              
   
  hasAvailableInheritedFlags(): boolean
 }
 interface Command {
   
                                                               
   
  flag(name: string): (any)
 }
 interface Command {
   
                                                            
   
  parseFlags(args: Array<string>): void
 }
 interface Command {
   
                                              
   
  parent(): (Command)
 }
 interface Command {
   
                                                                                                         
     
                                                                                                    
                                
   
  registerFlagCompletionFunc(flagName: string, f: CompletionFunc): void
 }
 interface Command {
   
                                                                                                           
   
  getFlagCompletionFunc(flagName: string): [CompletionFunc, boolean]
 }
 interface Command {
   
                                                                       
                                                                   
                                                                
                                                     
                                                                     
   
  initDefaultCompletionCmd(...args: string[]): void
 }
 interface Command {
   
                                                                                      
   
  genFishCompletion(w: io.Writer, includeDesc: boolean): void
 }
 interface Command {
   
                                                          
   
  genFishCompletionFile(filename: string, includeDesc: boolean): void
 }
 interface Command {
   
                                                                                          
                                                                              
   
  markFlagsRequiredTogether(...flagNames: string[]): void
 }
 interface Command {
   
                                                                                     
                                                                                     
   
  markFlagsOneRequired(...flagNames: string[]): void
 }
 interface Command {
   
                                                                                           
                                                                                   
   
  markFlagsMutuallyExclusive(...flagNames: string[]): void
 }
 interface Command {
   
                                                                                                         
                             
   
  validateFlagGroups(): void
 }
 interface Command {
   
                                                                                           
   
  genPowerShellCompletionFile(filename: string): void
 }
 interface Command {
   
                                                                                      
                                        
   
  genPowerShellCompletion(w: io.Writer): void
 }
 interface Command {
   
                                                                                                
   
  genPowerShellCompletionFileWithDesc(filename: string): void
 }
 interface Command {
   
                                                                                           
                                        
   
  genPowerShellCompletionWithDesc(w: io.Writer): void
 }
 interface Command {
   
                                                                               
                                                          
                                                                            
   
  markFlagRequired(name: string): void
 }
 interface Command {
   
                                                                                         
                                                                     
                                                                            
   
  markPersistentFlagRequired(name: string): void
 }
 interface Command {
   
                                                                               
                                                                           
   
  markFlagFilename(name: string, ...extensions: string[]): void
 }
 interface Command {
   
                                                                                       
                                                                           
     
                                             
                                                                                    
                                                                 
   
  markFlagCustom(name: string, f: string): void
 }
 interface Command {
   
                                                                      
                                                                              
                               
   
  markPersistentFlagFilename(name: string, ...extensions: string[]): void
 }
 interface Command {
   
                                                                              
                                                             
   
  markFlagDirname(name: string): void
 }
 interface Command {
   
                                                                     
                                                                          
                     
   
  markPersistentFlagDirname(name: string): void
 }
 interface Command {
   
                                                                               
   
  genZshCompletionFile(filename: string): void
 }
 interface Command {
   
                                                                          
                                        
   
  genZshCompletion(w: io.Writer): void
 }
 interface Command {
   
                                                                                   
   
  genZshCompletionFileNoDesc(filename: string): void
 }
 interface Command {
   
                                                                              
                                        
   
  genZshCompletionNoDesc(w: io.Writer): void
 }
 interface Command {
   
                                                                               
                                                                         
                                                                               
                                                                                  
                                                                       
                                                                           
                                     
     
               
   
  markZshCompPositionalArgumentFile(argPosition: number, ...patterns: string[]): void
 }
 interface Command {
   
                                                                             
                   
                                                                
                                                                     
                                                   
     
               
   
  markZshCompPositionalArgumentWords(argPosition: number, ...words: string[]): void
 }
}

namespace store {
  
                                                                   
  
 interface Store<K,T> {
 }
 interface Store<K, T> {
   
                                                              
                                          
   
  reset(newData: _TygojaDict): void
 }
 interface Store<K, T> {
   
                                                                
   
  length(): number
 }
 interface Store<K, T> {
   
                                                      
   
  removeAll(): void
 }
 interface Store<K, T> {
   
                                                  
     
                                                           
   
  remove(key: K): void
 }
 interface Store<K, T> {
   
                                                               
   
  has(key: K): boolean
 }
 interface Store<K, T> {
   
                                                       
     
                                                     
   
  get(key: K): T
 }
 interface Store<K, T> {
   
                                                                                                 
   
  getOk(key: K): [T, boolean]
 }
 interface Store<K, T> {
   
                                                             
   
  getAll(): _TygojaDict
 }
 interface Store<K, T> {
   
                                                                 
   
  values(): Array<T>
 }
 interface Store<K, T> {
   
                                                                   
   
  set(key: K, value: T): void
 }
 interface Store<K, T> {
   
                                                                       
                                                     
     
                                                                                        
                                                                             
     
             
     
        
                                      
                                            
                        
        
        
   
  setFunc(key: K, fn: (old: T) => T): void
 }
 interface Store<K, T> {
   
                                                                    
                                             
   
  getOrSet(key: K, setFunc: () => T): T
 }
 interface Store<K, T> {
   
                                                                                 
     
                                                                             
                                                                      
                                                              
   
  setIfLessThanLimit(key: K, value: T, maxAllowedElements: number): boolean
 }
 interface Store<K, T> {
   
                                                                
                                       
     
                                                                                                     
   
  unmarshalJSON(data: string|Array<number>): void
 }
 interface Store<K, T> {
   
                                                                   
                                
   
  marshalJSON(): string|Array<number>
 }
}

 
                                                                                                                      
   
                               
 
namespace jwt {
  
                                                                    
                                                                     
  
 interface MapClaims extends _TygojaDict{}
 interface MapClaims {
   
                                                       
   
  getExpirationTime(): (NumericDate)
 }
 interface MapClaims {
   
                                                  
   
  getNotBefore(): (NumericDate)
 }
 interface MapClaims {
   
                                                 
   
  getIssuedAt(): (NumericDate)
 }
 interface MapClaims {
   
                                                 
   
  getAudience(): ClaimStrings
 }
 interface MapClaims {
   
                                               
   
  getIssuer(): string
 }
 interface MapClaims {
   
                                                
   
  getSubject(): string
 }
}

namespace hook {
  
                                                                       
                                                                     
    
            
    
       
                              
                
    
                   
      
       
  
 interface Event {
 }
 interface Event {
   
                                      
   
  next(): void
 }
  
                                          
                                            
                                                                                         
  
 interface Handler<T> {
   
                                                  
     
                                                                   
                                     
   
  func: (_arg0: T) => void
   
                                                
     
                                                                                
     
                                                                    
                           
   
  id: string
   
                                                                                     
     
                                                                            
   
  priority: number
 }
  
                                                                              
    
                                                                
    
            
    
       
                              
                
                   
      
    
                              
    
                                            
                          
    
                     
       
    
                                              
       
  
 interface Hook<T> {
 }
 interface Hook<T> {
   
                                                                    
     
                                                                   
     
                                                                       
                                                       
   
  bind(handler: Handler<T>): string
 }
 interface Hook<T> {
   
                                                                                             
     
                                                                                                
     
                                                                                             
   
  bindFunc(fn: (e: T) => void): string
 }
 interface Hook<T> {
   
                                                         
   
  unbind(...idsToRemove: string[]): void
 }
 interface Hook<T> {
   
                                               
   
  unbindAll(): void
 }
 interface Hook<T> {
   
                                                                
   
  length(): number
 }
 interface Hook<T> {
   
                                                             
                                             
     
                                                                       
                                                                         
     
                                                                                     
   
  trigger(event: T, ...oneOffHandlerFuncs: ((_arg0: T) => void)[]): void
 }
  
                                                                                   
                                                                                       
  
 type _sCHNzyH<T> = mainHook<T>
 interface TaggedHook<T> extends _sCHNzyH<T> {
 }
 interface TaggedHook<T> {
   
                                                                        
                                  
     
                                                              
   
  canTriggerOn(tagsToCheck: Array<string>): boolean
 }
 interface TaggedHook<T> {
   
                                                                    
     
                                                                      
                                                                            
   
  bind(handler: Handler<T>): string
 }
 interface TaggedHook<T> {
   
                                                                  
     
                                                                      
                                                                            
   
  bindFunc(fn: (e: T) => void): string
 }
}

namespace exec {
  
                                                             
    
                                                                                            
            
  
 interface Cmd {
   
                                            
     
                                                          
                                                         
            
   
  path: string
   
                                                                         
                                                        
     
                                                                   
   
  args: Array<string>
   
                                                  
                                           
                                                              
                 
                                                              
                                                       
                                                                
                                                        
     
                                                                  
   
  env: Array<string>
   
                                                        
                                                            
                                         
     
                                                          
                                                              
                                                               
                                                              
                                                            
                                                              
                                                                
                                                             
                                                           
                                                   
                                                               
                                                           
                                                  
   
  dir: string
   
                                                  
     
                                                                          
     
                                                                       
                           
     
                                                              
                                                                     
                                                                          
                                                                  
                                                                             
                                                        
   
  stdin: io.Reader
   
                                                                       
     
                                                                     
                                     
     
                                                                        
                                        
     
                                                                        
                                                                     
                                                                         
                                                                        
             
     
                                                                       
                                                                          
   
  stdout: io.Writer
  stderr: io.Writer
   
                                                                      
                                                                         
                                                                     
     
                                            
   
  extraFiles: Array<(os.File | undefined)>
   
                                                                      
                                                                     
   
  sysProcAttr?: syscall.SysProcAttr
   
                                                     
   
  process?: os.Process
   
                                                               
                                                              
                                                          
   
  processState?: os.ProcessState
  err: Error 
   
                                                                  
                                                                
                                                               
                                                   
     
                                                                  
                                                                             
                                                                              
                    
     
                                                               
                                                              
                                                                           
                                                                
                                   
                                                               
                                                                            
                                                         
     
                                                                                
                                                                              
                                                                             
                                                                        
     
                                                                
   
  cancel: () => void
   
                                                                              
                                                                              
                                                                              
                            
     
                                                                               
                                                                              
                                                                                
                          
     
                                                                            
                                                                              
                                                                                
     
                                                                                
                                                                                
                            
     
                                                                       
                                                                            
                                                             
     
                                                                          
                                                                          
                                                 
   
  waitDelay: time.Duration
 }
 interface Cmd {
   
                                                      
                                       
                                                                   
                                                      
   
  string(): string
 }
 interface Cmd {
   
                                                                   
     
                                                                   
                                                                  
            
     
                                                                              
                                                                               
     
                                                                    
                                                                      
                                                                     
                                                    
   
  run(): void
 }
 interface Cmd {
   
                                                                             
     
                                                                    
     
                                                                             
                                                  
   
  start(): void
 }
 interface Cmd {
   
                                                                    
                                                        
     
                                                       
     
                                                                   
                                                                  
            
     
                                                                      
                                                            
                               
     
                                                                                   
                                                                            
     
                                                           
   
  wait(): void
 }
 interface Cmd {
   
                                                             
                                                             
                                                          
                                                           
                    
   
  output(): string|Array<number>
 }
 interface Cmd {
   
                                                                      
                               
   
  combinedOutput(): string|Array<number>
 }
 interface Cmd {
   
                                                                     
                                            
                                                                                  
                                                                     
                                                                             
                                               
   
  stdinPipe(): io.WriteCloser
 }
 interface Cmd {
   
                                                                      
                                             
     
                                                                                  
                                                                          
                                                   
                                                                                  
                                         
   
  stdoutPipe(): io.ReadCloser
 }
 interface Cmd {
   
                                                                      
                                            
     
                                                                                  
                                                                          
                                                   
                                                                                 
                                                    
   
  stderrPipe(): io.ReadCloser
 }
 interface Cmd {
   
                                                                                
                                   
   
  environ(): Array<string>
 }
}

namespace subscriptions {
  
                                                               
  
 interface Broker {
 }
 interface Broker {
   
                                                                     
                              
   
  clients(): _TygojaDict
 }
 interface Broker {
   
                                                                    
   
  chunkedClients(chunkSize: number): Array<Array<Client>>
 }
 interface Broker {
   
                                                                 
   
  totalClients(): number
 }
 interface Broker {
   
                                                    
     
                                                                       
   
  clientById(clientId: string): Client
 }
 interface Broker {
   
                                                       
   
  register(client: Client): void
 }
 interface Broker {
   
                                                                            
     
                                                                     
   
  unregister(clientId: string): void
 }
  
                                                             
  
 interface Client {
  [key:string]: any;
   
                                            
   
  id(): string
   
                                                        
     
                                                               
   
  channel(): undefined
   
                                                                                            
                                                          
   
  subscriptions(...prefixes: string[]): _TygojaDict
   
                                                                        
     
                                                                                                        
     
             
     
        
                
                          
                                                                                
       
        
   
  subscribe(...subs: string[]): void
   
                                                                              
   
  unsubscribe(...subs: string[]): void
   
                                                                 
   
  hasSubscription(sub: string): boolean
   
                                                  
   
  set(key: string, value: any): void
   
                                                            
   
  unset(key: string): void
   
                                                           
   
  get(key: string): any
   
                                                                      
                                                                        
     
                                                 
   
  discard(): void
   
                                                                  
                                  
   
  isDiscarded(): boolean
   
                                                                                 
   
  send(m: Message): void
 }
  
                                            
  
 interface Message {
  name: string
  data: string|Array<number>
 }
 interface Message {
   
                                                                                  
     
                                            
     
        
                                                           
                                           
               
        
   
  writeSSE(w: io.Writer, eventId: string): void
 }
}

 
                                                                         
                        
   
           
   
      
                   
                                                         
             
      
 
namespace cron {
  
                                                            
  
 interface Cron {
 }
 interface Cron {
   
                                                       
                                        
   
  setInterval(d: time.Duration): void
 }
 interface Cron {
   
                                                        
   
  setTimezone(l: time.Location): void
 }
 interface Cron {
   
                                                      
   
  mustAdd(jobId: string, cronExpr: string, run: () => void): void
 }
 interface Cron {
   
                                     
     
                                                                     
                                       
     
                                                                                                      
                                                       
   
  add(jobId: string, cronExpr: string, fn: () => void): void
 }
 interface Cron {
   
                                                
   
  remove(jobId: string): void
 }
 interface Cron {
   
                                                
   
  removeAll(): void
 }
 interface Cron {
   
                                                                    
   
  total(): number
 }
 interface Cron {
   
                                                                       
   
  jobs(): Array<(Job | undefined)>
 }
 interface Cron {
   
                                                         
     
                                                  
   
  stop(): void
 }
 interface Cron {
   
                                  
     
                                                                     
   
  start(): void
 }
 interface Cron {
   
                                                                        
   
  hasStarted(): boolean
 }
}

 
                                                                    
             
   
                                                                      
                                                             
   
                                                                         
                                
   
                                           
                                
 
namespace sql {
  
                                                                       
  
 interface TxOptions {
   
                                                  
                                                             
   
  isolation: IsolationLevel
  readOnly: boolean
 }
  
                                                    
                                                    
                                         
    
       
                     
                                                                       
        
                 
                       
             
                     
      
       
  
 interface NullString {
  string: string
  valid: boolean 
 }
 interface NullString {
   
                                             
   
  scan(value: any): void
 }
 interface NullString {
   
                                                    
   
  value(): any
 }
  
                                                               
                                                                    
               
    
                                                                   
                                                                       
                                                                          
                                                                                      
                                                                      
                                                                  
                                                                        
                                                
  
 interface DB {
 }
 interface DB {
   
                                                                      
                                            
   
  pingContext(ctx: context.Context): void
 }
 interface DB {
   
                                                               
                                            
     
                                                                           
                      
   
  ping(): void
 }
 interface DB {
   
                                                                      
                                                                                
               
     
                                                                  
                                                   
   
  close(): void
 }
 interface DB {
   
                                                                       
                     
     
                                                                          
                                                                               
     
                                                 
     
                                                                        
                      
   
  setMaxIdleConns(n: number): void
 }
 interface DB {
   
                                                                                 
     
                                                                            
                                                                     
                        
     
                                                                         
                                  
   
  setMaxOpenConns(n: number): void
 }
 interface DB {
   
                                                                                   
     
                                                           
     
                                                                     
   
  setConnMaxLifetime(d: time.Duration): void
 }
 interface DB {
   
                                                                                 
     
                                                           
     
                                                                           
   
  setConnMaxIdleTime(d: time.Duration): void
 }
 interface DB {
   
                                       
   
  stats(): DBStats
 }
 interface DB {
   
                                                                                 
                                                                    
                        
                                                              
                                            
     
                                                                                   
                                
   
  prepareContext(ctx: context.Context, query: string): (Stmt)
 }
 interface DB {
   
                                                                          
                                                                    
                        
                                                              
                                            
     
                                                                              
                         
   
  prepare(query: string): (Stmt)
 }
 interface DB {
   
                                                             
                                                              
   
  execContext(ctx: context.Context, query: string, ...args: any[]): Result
 }
 interface DB {
   
                                                      
                                                              
     
                                                                           
                      
   
  exec(query: string, ...args: any[]): Result
 }
 interface DB {
   
                                                                         
                                                              
   
  queryContext(ctx: context.Context, query: string, ...args: any[]): (Rows)
 }
 interface DB {
   
                                                                  
                                                              
     
                                                                            
                       
   
  query(query: string, ...args: any[]): (Rows)
 }
 interface DB {
   
                                                                                 
                                                                              
                                   
                                                                           
                                                                     
              
   
  queryRowContext(ctx: context.Context, query: string, ...args: any[]): (Row)
 }
 interface DB {
   
                                                                          
                                                                       
                                   
                                                                           
                                                                     
              
     
                                                                               
                          
   
  queryRow(query: string, ...args: any[]): (Row)
 }
 interface DB {
   
                                  
     
                                                                                    
                                                               
                                                                                 
                         
     
                                                                                    
                                                                              
                               
   
  beginTx(ctx: context.Context, opts: TxOptions): (Tx)
 }
 interface DB {
   
                                                                            
                
     
                                                                            
                  
   
  begin(): (Tx)
 }
 interface DB {
   
                                                     
   
  driver(): any
 }
 interface DB {
   
                                                                        
                                                                            
                                                                    
                                                                           
     
                                                                  
                          
   
  conn(ctx: context.Context): (Conn)
 }
  
                                              
    
                                                                       
    
                                                                       
                                      
    
                                                        
                                                                  
                                                
  
 interface Tx {
 }
 interface Tx {
   
                                    
   
  commit(): void
 }
 interface Tx {
   
                                     
   
  rollback(): void
 }
 interface Tx {
   
                                                                              
     
                                                                              
                                                            
     
                                                                              
     
                                                                              
                                                                        
                                         
   
  prepareContext(ctx: context.Context, query: string): (Stmt)
 }
 interface Tx {
   
                                                                       
     
                                                                              
                                                            
     
                                                                              
     
                                                                              
                         
   
  prepare(query: string): (Stmt)
 }
 interface Tx {
   
                                                                       
                           
     
             
     
        
                                                                                   
         
                           
         
                                                                         
        
     
                                                                                   
                                
     
                                                                              
                                                            
   
  stmtContext(ctx: context.Context, stmt: Stmt): (Stmt)
 }
 interface Tx {
   
                                                                
                           
     
             
     
        
                                                                                   
         
                           
         
                                                             
        
     
                                                                              
                                                            
     
                                                                           
                      
   
  stmt(stmt: Stmt): (Stmt)
 }
 interface Tx {
   
                                                           
                                       
   
  execContext(ctx: context.Context, query: string, ...args: any[]): Result
 }
 interface Tx {
   
                                                    
                                       
     
                                                                           
                      
   
  exec(query: string, ...args: any[]): Result
 }
 interface Tx {
   
                                                                         
   
  queryContext(ctx: context.Context, query: string, ...args: any[]): (Rows)
 }
 interface Tx {
   
                                                                  
     
                                                                            
                       
   
  query(query: string, ...args: any[]): (Rows)
 }
 interface Tx {
   
                                                                                 
                                                                              
                                   
                                                                           
                                                                         
              
   
  queryRowContext(ctx: context.Context, query: string, ...args: any[]): (Row)
 }
 interface Tx {
   
                                                                          
                                                                       
                                   
                                                                           
                                                                         
              
     
                                                                               
                          
   
  queryRow(query: string, ...args: any[]): (Row)
 }
  
                                 
                                                             
    
                                                                           
                                                                              
                                                            
                                                                                  
                                                                                
                                                       
  
 interface Stmt {
 }
 interface Stmt {
   
                                                                           
                                                                
   
  execContext(ctx: context.Context, ...args: any[]): Result
 }
 interface Stmt {
   
                                                                    
                                                                
     
                                                                           
                        
   
  exec(...args: any[]): Result
 }
 interface Stmt {
   
                                                                              
                                                
   
  queryContext(ctx: context.Context, ...args: any[]): (Rows)
 }
 interface Stmt {
   
                                                                       
                                              
     
                                                                            
                         
   
  query(...args: any[]): (Rows)
 }
 interface Stmt {
   
                                                                                  
                                                                              
                                                                                   
                                                                           
                                                                         
              
   
  queryRowContext(ctx: context.Context, ...args: any[]): (Row)
 }
 interface Stmt {
   
                                                                           
                                                                              
                                                                                   
                                                                           
                                                                         
              
     
                   
     
        
                     
                                                      
        
     
                                                                               
                            
   
  queryRow(...args: any[]): (Row)
 }
 interface Stmt {
   
                                
   
  close(): void
 }
  
                                                                         
                                                                  
  
 interface Rows {
 }
 interface Rows {
   
                                                                                  
                                                                                 
                                                                                       
                   
     
                                                                                              
   
  next(): boolean
 }
 interface Rows {
   
                                                                               
                                                                             
                                                                                       
                                          
     
                                                                                       
                                                                                    
         
   
  nextResultSet(): boolean
 }
 interface Rows {
   
                                                                          
                                                                  
   
  err(): void
 }
 interface Rows {
   
                                      
                                                     
   
  columns(): Array<string>
 }
 interface Rows {
   
                                                                        
                                                                           
   
  columnTypes(): Array<(ColumnType | undefined)>
 }
 interface Rows {
   
                                                                       
                                                                     
                                 
     
                                                                    
                                                                   
     
        
             
             
                                         
                                              
           
                        
                  
               
                          
                                                      
        
     
                                                                      
                                                                        
                                                       
     
                                                                       
                                                                  
                                                                   
                                                                        
                                                                       
                                                                   
                                                                  
                                                                     
                                          
     
                                                                       
                                                                        
                                                                      
                                                                         
                                                
     
                                                                
                                                                        
                                                                      
                                                  
     
                                                                         
                                                                      
                                                
     
                                                                
                                                    
     
                                                                     
                                                    
     
                                                                  
                                                              
                                                              
                                                                                
     
                                                                           
                                                      
   
  scan(...dest: any[]): void
 }
 interface Rows {
   
                                                                                      
                                                            
                                                                         
                                                                                            
   
  close(): void
 }
  
                                                
  
 interface Result {
  [key:string]: any;
   
                                                               
                                                             
                                                              
                                                           
                       
   
  lastInsertId(): number
   
                                                           
                                                              
                             
   
  rowsAffected(): number
 }
}

 
                                                                    
                            
 
namespace types {
  
                                                                     
                                                     
  
 interface DateTime {
 }
 interface DateTime {
   
                                                    
   
  time(): time.Time
 }
 interface DateTime {
   
                                                                                       
   
  add(duration: time.Duration): DateTime
 }
 interface DateTime {
   
                                                                                              
     
                                                                                                  
                                                        
   
  sub(u: DateTime): time.Duration
 }
 interface DateTime {
   
                                                                        
     
                                                 
   
  addDate(years: number, months: number, days: number): DateTime
 }
 interface DateTime {
   
                                                                    
   
  after(u: DateTime): boolean
 }
 interface DateTime {
   
                                                                      
   
  before(u: DateTime): boolean
 }
 interface DateTime {
   
                                                           
                                                        
                                                       
                                       
   
  compare(u: DateTime): number
 }
 interface DateTime {
   
                                                                                      
                                                                       
                                                    
   
  equal(u: DateTime): boolean
 }
 interface DateTime {
   
                                                           
                                                             
   
  unix(): number
 }
 interface DateTime {
   
                                                                             
   
  isZero(): boolean
 }
 interface DateTime {
   
                                                                     
                     
     
                                                     
   
  string(): string
 }
 interface DateTime {
   
                                                           
   
  marshalJSON(): string|Array<number>
 }
 interface DateTime {
   
                                                               
   
  unmarshalJSON(b: string|Array<number>): void
 }
 interface DateTime {
   
                                                    
   
  value(): any
 }
 interface DateTime {
   
                                                                       
                                        
   
  scan(value: any): void
 }
  
                                                                                   
                         
    
                                                                            
                                                                           
  
 interface GeoPoint {
  lon: number
  lat: number
 }
 interface GeoPoint {
   
                                                                               
   
  string(): string
 }
 interface GeoPoint {
   
                                                                      
                                          
   
  asMap(): _TygojaDict
 }
 interface GeoPoint {
   
                                                    
   
  value(): any
 }
 interface GeoPoint {
   
                                                                       
                                        
     
                                                                        
                                                      
   
  scan(value: any): void
 }
  
                                                                      
  
 interface JSONArray<T> extends Array<T>{}
 interface JSONArray<T> {
   
                                                           
   
  marshalJSON(): string|Array<number>
 }
 interface JSONArray<T> {
   
                                                                        
   
  string(): string
 }
 interface JSONArray<T> {
   
                                                    
   
  value(): any
 }
 interface JSONArray<T> {
   
                                                                       
                                            
   
  scan(value: any): void
 }
  
                                                                  
  
 interface JSONMap<T> extends _TygojaDict{}
 interface JSONMap<T> {
   
                                                           
   
  marshalJSON(): string|Array<number>
 }
 interface JSONMap<T> {
   
                                                                      
   
  string(): string
 }
 interface JSONMap<T> {
   
                                                              
     
                                                                                          
                                                                                                                
   
  get(key: string): T
 }
 interface JSONMap<T> {
   
                                                       
     
                                                                                          
                                                                                                                
   
  set(key: string, value: T): void
 }
 interface JSONMap<T> {
   
                                                    
   
  value(): any
 }
 interface JSONMap<T> {
   
                                                                       
                                          
   
  scan(value: any): void
 }
  
                                                                     
  
 interface JSONRaw extends Array<number>{}
 interface JSONRaw {
   
                                                                          
   
  string(): string
 }
 interface JSONRaw {
   
                                                           
   
  marshalJSON(): string|Array<number>
 }
 interface JSONRaw {
   
                                                               
   
  unmarshalJSON(b: string|Array<number>): void
 }
 interface JSONRaw {
   
                                                    
   
  value(): any
 }
 interface JSONRaw {
   
                                                                       
                                       
   
  scan(value: any): void
 }
}

namespace search {
  
                                                        
  
 interface Result {
  items: any
  page: number
  perPage: number
  totalItems: number
  totalPages: number
 }
  
                                                                                       
  
 interface ResolverResult {
   
                                                                    
                                                         
   
  identifier: string
   
                                                                     
                                            
     
                                                                           
                                                                                  
   
  nullFallback: NullFallbackPreference
   
                                                                        
                                                                                    
   
  params: dbx.Params
   
                                                                              
                                                                        
   
  multiMatchSubQuery?: MultiMatchSubquery
   
                                                                          
                                                                                     
   
  afterBuild: (expr: dbx.Expression) => dbx.Expression
 }
}

 
                                                                         
        
   
                                                                         
                                        
   
           
   
                                                                            
                                 
   
                                                                              
                                                                                
                        
                                                                             
           
   
                                                                        
                                                                        
           
 
namespace multipart {
  
                                                              
  
 interface FileHeader {
  filename: string
  header: textproto.MIMEHeader
  size: number
 }
 interface FileHeader {
   
                                                               
   
  open(): File
 }
}

 
                                                                
   
                                                                       
   
      
                                                
       
                                                                           
       
                                                         
                                                 
      
   
                                                                 
   
      
                                                
                   
                    
     
                           
                                      
          
      
   
                           
   
                                                                   
                               
   
      
                           
                                       
     
   
                                                 
          
   
                                                                 
          
                                                
                               
          
      
   
                                                            
                                                         
   
      
                          
                            
                                          
                              
     
                                         
                                                  
      
   
                                                                 
                                                                         
   
            
   
                                                                         
                                                                    
                                                               
   
      
                                   
   
                                                                          
                                                               
      
   
                                                
      
   
                                                                     
                 
   
      
                      
                             
                               
                                      
                                      
                             
     
                                 
      
   
           
   
                                                                         
                                                                      
                                                                 
                                                          
                                                         
                       
   
      
                                                          
                                                          
                                                             
                                                                    
      
   
                                                                                          
   
                                                                        
                                                                      
                                                                        
                                                                         
                                                                 
                                                                        
                                                                       
           
 
namespace http {
 
 import mathrand = rand
  
                                                    
  
 interface PushOptions {
   
                                                               
                                                           
   
  method: string
   
                                                                      
                                                                    
                                       
   
  header: Header
 }
 
 import urlpkg = url
  
                                                             
                              
    
                                                                 
                                                                
                                                         
  
 interface Request {
   
                                                             
                                                    
   
  method: string
   
                                                             
                                                          
     
                                                        
                                                               
                                                               
                                       
     
                                                                
                                                          
                                                        
             
   
  url?: url.URL
   
                                                       
     
                                                            
                                                       
                                           
   
  proto: string 
  protoMajor: number 
  protoMinor: number 
   
                                                              
                                               
     
                                                      
     
        
                       
                                    
                            
              
              
        
     
         
     
        
                                   
                                            
                                    
                             
       
        
     
                                                              
                                                        
     
                                                             
                                                                
                                                              
                                             
     
                                                                
                                                             
                                                           
                                  
   
  header: Header
   
                                
     
                                                             
                                                             
                                                 
     
                                                            
                                                             
                                                          
                              
     
                                                               
                                                               
               
   
  body: io.ReadCloser
   
                                                             
                                                                  
                                                          
                           
     
                                       
   
  getBody: () => io.ReadCloser
   
                                                                
                                                       
                                                            
                       
     
                                                             
                             
   
  contentLength: number
   
                                                                    
                                                              
                                                                 
                                                                  
                        
   
  transferEncoding: Array<string>
   
                                                          
                                                                 
                                                    
     
                                                                    
                                              
     
                                                               
                                                              
                                          
   
  close: boolean
   
                                                              
                                                                
                                                              
                                                                
                                      
                                                                
                                                        
                                                            
            
                                                             
                                                            
                                                         
                                                             
                                                     
     
                                                            
                                                            
                                                             
                 
   
  host: string
   
                                                               
                                                                    
                                                            
                                                        
   
  form: url.Values
   
                                                            
                            
     
                                                            
                                                            
   
  postForm: url.Values
   
                                                                        
                                                                     
                                                                 
   
  multipartForm?: multipart.Form
   
                                                                         
          
     
                                                                     
                                                                          
                                                                       
                                                                        
                                                                         
                   
     
                                                                         
                                                                         
                                                                          
                                                                       
                                                                         
                        
     
                                                                 
   
  trailer: Header
   
                                                                
                                                           
                                                            
                                                           
                                                              
             
                                              
   
  remoteAddr: string
   
                                                       
                                                                 
                                                               
                                                                
   
  requestURI: string
   
                                                         
                                                              
                                                              
                                                       
                                                       
                                       
                                              
   
  tls?: any
   
                                                                          
                                                                       
                                     
     
                                                       
     
                                                                     
                                                              
                                                      
   
  cancel: undefined
   
                                                                
                                                              
               
   
  response?: Response
   
                                                                
                                                                  
   
  pattern: string
 }
 interface Request {
   
                                                                      
                                              
     
                                                               
                        
     
                                                                     
     
                                                                   
                                                                       
                                          
   
  context(): context.Context
 }
 interface Request {
   
                                                                     
                                              
     
                                                                 
                                                                    
                                                                    
     
                                                                         
                                                                              
   
  withContext(ctx: context.Context): (Request)
 }
 interface Request {
   
                                                                    
                                      
     
                                                       
     
                                                                    
                                                                    
                                                                    
   
  clone(ctx: context.Context): (Request)
 }
 interface Request {
   
                                                        
                                            
   
  protoAtLeast(major: number, minor: number): boolean
 }
 interface Request {
   
                                                                       
   
  userAgent(): string
 }
 interface Request {
   
                                                                       
   
  cookies(): Array<(Cookie | undefined)>
 }
 interface Request {
   
                                                                                 
                                       
   
  cookiesNamed(name: string): Array<(Cookie | undefined)>
 }
 interface Request {
   
                                                               
                                
                                                                   
                 
   
  cookie(name: string): (Cookie)
 }
 interface Request {
   
                                                                      
                                                                        
                                                               
                            
                                                                       
                                                    
   
  addCookie(c: Cookie): void
 }
 interface Request {
   
                                                               
     
                                                                       
                                                                    
                                                                          
                                                                        
                                                                   
                                                   
   
  referer(): string
 }
 interface Request {
   
                                                                 
                                                                                          
                                                                 
                                          
   
  multipartReader(): (multipart.Reader)
 }
 interface Request {
   
                                                                                    
                                                              
     
        
          
         
                                
            
                   
                      
          
        
     
                                                                              
                                                                  
                                                             
   
  write(w: io.Writer): void
 }
 interface Request {
   
                                                                          
                                                                              
                                                                      
                                                            
                                                                
                                 
   
  writeProxy(w: io.Writer): void
 }
 interface Request {
   
                                                                          
                                                                         
                             
   
  basicAuth(): [string, string, boolean]
 }
 interface Request {
   
                                                                     
                                                                  
     
                                                                      
                                                                    
             
     
                                                                    
                                                             
                                                                       
                                                 
   
  setBasicAuth(username: string, password: string): void
 }
 interface Request {
   
                                               
     
                                                                              
            
     
                                                                                 
                                                                                 
                                                                       
     
                                                                                 
                                
     
                                                            
                                                                         
                                                         
     
                                                                
                             
   
  parseForm(): void
 }
 interface Request {
   
                                                                     
                                                                             
                                                                      
                             
                                                               
                                                                          
                                        
                                                                           
   
  parseMultipartForm(maxMemory: number): void
 }
 interface Request {
   
                                                                            
                          
                                                                            
                                  
                                               
     
                                                                         
                                                                     
                                                               
                                                                  
                                          
   
  formValue(key: string): string
 }
 interface Request {
   
                                                                               
                                                                  
                                                                                                      
                                            
                                                                   
   
  postFormValue(key: string): string
 }
 interface Request {
   
                                                               
                                                                                      
   
  formFile(key: string): [multipart.File, (multipart.FileHeader)]
 }
 interface Request {
   
                                                                                      
                              
                                                                                 
                                                 
   
  pathValue(name: string): string
 }
 interface Request {
   
                                                                                   
                  
   
  setPathValue(name: string, value: string): void
 }
  
                                          
    
                                                                                   
                                                                       
                                                             
                                                                   
                   
    
                                                                     
                                                                       
                                                                    
                                                                      
                          
    
                                                               
                     
    
                                                                     
                                                                    
                                                                      
                                                               
                                                                     
                                                                      
                                                     
  
 interface Handler {
  [key:string]: any;
  serveHTTP(_arg0: ResponseWriter, _arg1: Request): void
 }
  
                                                            
                               
    
                                                                            
  
 interface ResponseWriter {
  [key:string]: any;
   
                                                       
                                                                                    
                                                     
     
                                                                             
                                                                                 
                                                    
     
                                                                
                                                            
                                                             
                                                            
                                                       
                                                           
                                                                                  
                                                                
                    
     
                                                                 
                        
   
  header(): Header
   
                                                                      
     
                                                                         
                                                                      
                                                                        
                                                                      
                                                                        
                                                             
                                                  
     
                                                                   
                                                         
                                                                  
                                                                   
                                                                       
                                                                      
                                                                        
                                                                     
                                                                      
                                                                  
                                        
   
  write(_arg0: string|Array<number>): number
   
                                                                
                 
     
                                                                     
                                                         
                                                          
                                                     
     
                                                                
                                                                  
                                                                      
                                                               
                                                                      
                                    
     
                                                               
                                                               
                                      
   
  writeHeader(statusCode: number): void
 }
  
                                                           
                                                       
  
 interface Server {
   
                                                                           
                                                                  
                                                                    
                                                    
   
  addr: string
  handler: Handler 
   
                                                                                       
                                                          
   
  disableGeneralOptionsHandler: boolean
   
                                                              
                                                               
                                                          
                                                           
                                            
                                                               
             
   
  tlsConfig?: any
   
                                                               
                                                                
                              
     
                                                               
                                                            
                                               
                                                     
   
  readTimeout: time.Duration
   
                                                            
                                                             
                                                              
                                                               
                                                                 
                                              
   
  readHeaderTimeout: time.Duration
   
                                                           
                                                       
                                                            
                                                        
                                                             
   
  writeTimeout: time.Duration
   
                                                              
                                                                  
                                                                    
                                              
   
  idleTimeout: time.Duration
   
                                                            
                                                           
                                                              
                              
                                            
   
  maxHeaderBytes: number
   
                                                              
                                                          
                                                               
                                                            
                                                               
                                                         
                                                    
                                                              
                   
   
  tlsNextProto: _TygojaDict
   
                                                              
                                                           
                                                         
   
  connState: (_arg0: net.Conn, _arg1: ConnState) => void
   
                                                               
                                                        
                                  
                                                                   
   
  errorLog?: any
   
                                                             
                                                           
                                                          
                                       
                                                                
                                                  
   
  baseContext: (_arg0: net.Listener) => context.Context
   
                                                              
                                                              
                                                                
           
   
  connContext: (ctx: context.Context, c: net.Conn) => context.Context
   
                                         
     
                                             
                                    
   
  http2?: HTTP2Config
   
                                                              
     
                                                                   
                                                              
                                                                
     
                                                                   
                                                                   
                                
   
  protocols?: Protocols
 }
 interface Server {
   
                                                              
                                                                          
                                              
     
                                                                   
                                                  
     
                                                                 
                            
   
  close(): void
 }
 interface Server {
   
                                                                       
                                                                 
                                                                   
                                                                       
                                                                     
                                                                   
                                                                       
     
                                                                        
                                                                            
                                                                   
     
                                                             
                                                                  
                                                                       
                                                                                
                                              
     
                                                                     
                                                                       
   
  shutdown(ctx: context.Context): void
 }
 interface Server {
   
                                                                          
                                                                  
                                                                
                                                                    
                                                  
   
  registerOnShutdown(f: () => void): void
 }
 interface Server {
   
                                                                      
                                                              
                                                                   
     
                                         
     
                                                                                              
                                             
   
  listenAndServe(): void
 }
 interface Server {
   
                                                                     
                                                                             
                                          
     
                                                                       
                                                              
                       
     
                                                       
                                                                                        
   
  serve(l: net.Listener): void
 }
 interface Server {
   
                                                                        
                                                                       
                                                                      
     
                                                                    
                                                      
                                                         
                                             
                                                                 
                                                                      
                                                 
     
                                                                                            
                                         
   
  serveTLS(l: net.Listener, certFile: string, keyFile: string): void
 }
 interface Server {
   
                                                                        
                                                          
                                                                   
                                       
   
  setKeepAlivesEnabled(v: boolean): void
 }
 interface Server {
   
                                                                    
                                                                          
                                                                   
     
                                                                        
                                                                             
                                                                      
                                                                  
                                                                      
                          
     
                                          
     
                                                                                 
                                                             
   
  listenAndServeTLS(certFile: string, keyFile: string): void
 }
}

 
                                                                     
                                                         
   
      
                                                                    
                                                                      
                                                                               
                                                                               
                                                                     
                                                                 
                                                                         
                                                                   
                                                                 
 
namespace blob {
  
                                                           
  
 interface ListObject {
   
                                  
   
  key: string
   
                                                    
   
  modTime: time.Time
   
                                                     
   
  size: number
   
                                                                     
   
  md5: string|Array<number>
   
                                                                     
                                                                        
                                                                   
                                                                      
   
  isDir: boolean
 }
  
                                                
  
 interface Attributes {
   
                                                                    
                           
                                                                            
   
  cacheControl: string
   
                                                                            
                                          
                                                                                  
   
  contentDisposition: string
   
                                                                                
                                                                               
   
  contentEncoding: string
   
                                                                               
                                                                               
   
  contentLanguage: string
   
                                                                    
                                                                           
   
  contentType: string
   
                                                             
                                                                        
                                                                     
                                                                    
                                                                  
                                                 
   
  metadata: _TygojaDict
   
                                                                                 
                                      
   
  createTime: time.Time
   
                                                    
   
  modTime: time.Time
   
                                                     
   
  size: number
   
                                                                     
   
  md5: string|Array<number>
   
                                                                    
   
  eTag: string
 }
  
                                   
                                                                                 
  
 interface Reader {
 }
 interface Reader {
   
                                                                   
   
  read(p: string|Array<number>): number
 }
 interface Reader {
   
                                                                   
   
  seek(offset: number, whence: number): number
 }
 interface Reader {
   
                                                                    
   
  close(): void
 }
 interface Reader {
   
                                                   
   
  contentType(): string
 }
 interface Reader {
   
                                                         
   
  modTime(): time.Time
 }
 interface Reader {
   
                                                        
   
  size(): number
 }
 interface Reader {
   
                                                                       
                     
                                                          
     
                                             
   
  writeTo(w: io.Writer): number
 }
}

namespace auth {
  
                                                             
  
 interface Provider {
  [key:string]: any;
   
                                                                       
   
  context(): context.Context
   
                                                                      
   
  setContext(ctx: context.Context): void
   
                                                               
   
  pkce(): boolean
   
                                                                                 
   
  setPKCE(enable: boolean): void
   
                                                                          
                                             
   
  displayName(): string
   
                                                     
   
  setDisplayName(displayName: string): void
   
                                                                           
   
  scopes(): Array<string>
   
                                                                                 
   
  setScopes(scopes: Array<string>): void
   
                                                   
   
  clientId(): string
   
                                               
   
  setClientId(clientId: string): void
   
                                                           
   
  clientSecret(): string
   
                                                           
   
  setClientSecret(secret: string): void
   
                                                             
                                  
   
  redirectURL(): string
   
                                                    
   
  setRedirectURL(url: string): void
   
                                                              
   
  authURL(): string
   
                                            
   
  setAuthURL(url: string): void
   
                                                                
   
  tokenURL(): string
   
                                              
   
  setTokenURL(url: string): void
   
                                                          
   
  userInfoURL(): string
   
                                                    
   
  setUserInfoURL(url: string): void
   
                                                           
                                
   
  extra(): _TygojaDict
   
                                                        
   
  setExtra(data: _TygojaDict): void
   
                                                            
   
  client(token: oauth2.Token): (any)
   
                                                              
                                                                  
   
  buildAuthURL(state: string, ...opts: oauth2.AuthCodeOption[]): string
   
                                                        
   
  fetchToken(code: string, ...opts: oauth2.AuthCodeOption[]): (oauth2.Token)
   
                                                                
                                 
   
  fetchRawUserInfo(token: oauth2.Token): string|Array<number>
   
                                                                     
                                                                           
   
  fetchAuthUser(token: oauth2.Token): (AuthUser)
 }
  
                                                               
  
 interface AuthUser {
  expiry: types.DateTime
  rawUser: _TygojaDict
  id: string
  name: string
  username: string
  email: string
  avatarURL: string
  accessToken: string
  refreshToken: string
   
          
                                      
                                                           
   
  avatarUrl: string
 }
 interface AuthUser {
   
                                                           
     
                                              
   
  marshalJSON(): string|Array<number>
 }
}

namespace router {
 
 import validation = ozzo_validation
  
                                                               
  
 interface ApiError {
  data: _TygojaDict
  message: string
  status: number
 }
 interface ApiError {
   
                                                          
   
  error(): string
 }
 interface ApiError {
   
                                                                                        
   
  rawData(): any
 }
 interface ApiError {
   
                                                              
   
  is(target: Error): boolean
 }
  
                                                                      
                                                    
    
                                                                           
  
 type _soHKUUE = hook.Event
 interface Event extends _soHKUUE {
  response: http.ResponseWriter
  request?: http.Request
 }
 interface Event {
   
                                                                           
     
                                                                                                       
                                                                                                                              
   
  written(): boolean
 }
 interface Event {
   
                                                            
     
                                                                                             
                                                                                                                              
   
  status(): number
 }
 interface Event {
   
                                                         
     
                                                                                                
                                                                                                                              
   
  flush(): void
 }
 interface Event {
   
                                                                                   
   
  isTLS(): boolean
 }
 interface Event {
   
                                                
     
                                                                          
                                                
                                             
   
  setCookie(cookie: http.Cookie): void
 }
 interface Event {
   
                                                                         
     
                                          
                                                                                  
     
                                                                        
                                         
   
  remoteIP(): string
 }
 interface Event {
   
                                                                           
                                                                 
   
  findUploadedFiles(key: string): Array<(filesystem.File | undefined)>
 }
 interface Event {
   
                                                                  
   
  get(key: string): any
 }
 interface Event {
   
                                                           
   
  getAll(): _TygojaDict
 }
 interface Event {
   
                                                              
   
  set(key: string, value: any): void
 }
 interface Event {
   
                                                                     
   
  setAll(m: _TygojaDict): void
 }
 interface Event {
   
                                           
   
  string(status: number, data: string): void
 }
 interface Event {
   
                                  
   
  html(status: number, data: string): void
 }
 interface Event {
   
                                 
     
                                                                                                   
                                                                                                               
                                                                 
   
  json(status: number, data: any): void
 }
 interface Event {
   
                                
                                                                               
   
  xml(status: number, data: any): void
 }
 interface Event {
   
                                                           
   
  stream(status: number, contentType: string, reader: io.Reader): void
 }
 interface Event {
   
                                               
   
  blob(status: number, contentType: string, b: string|Array<number>): void
 }
 interface Event {
   
                                                    
     
                                                                          
   
  fileFS(fsys: fs.FS, filename: string): void
 }
 interface Event {
   
                                                        
   
  noContent(status: number): void
 }
 interface Event {
   
                                                              
                                                        
   
  redirect(status: number, url: string): void
 }
 interface Event {
  error(status: number, message: string, errData: any): (ApiError)
 }
 interface Event {
  badRequestError(message: string, errData: any): (ApiError)
 }
 interface Event {
  notFoundError(message: string, errData: any): (ApiError)
 }
 interface Event {
  forbiddenError(message: string, errData: any): (ApiError)
 }
 interface Event {
  unauthorizedError(message: string, errData: any): (ApiError)
 }
 interface Event {
  tooManyRequestsError(message: string, errData: any): (ApiError)
 }
 interface Event {
  internalServerError(message: string, errData: any): (ApiError)
 }
 interface Event {
   
                                                               
     
                                                           
     
                                                                                
     
                                                         
        
                         
                                  
                                                               
        
     
                                                                                                                      
        
                                                                               
                                                                             
                                                                                       
        
     
                                                                          
                                                                                
                                                                 
     
        
                     
                                
     
                                                 
                                                 
       
                              
        
   
  bindBody(dst: any): void
 }
  
                                                                           
                                                                              
    
            
    
       
                                           
    
                   
                       
    
              
                             
    
                          
                           
                                 
    
                                                                            
                           
    
                                               
       
  
 type _sFXRXIC<T> = RouterGroup<T>
 interface Router<T> extends _sFXRXIC<T> {
 }
 interface Router<T> {
   
                                                                                                  
   
  buildMux(): http.Handler
 }
}

namespace mailer {
  
                                                   
  
 interface Message {
  from: { address: string; name?: string; }
  to: Array<{ address: string; name?: string; }>
  bcc: Array<{ address: string; name?: string; }>
  cc: Array<{ address: string; name?: string; }>
  subject: string
  html: string
  text: string
  headers: _TygojaDict
  attachments: _TygojaDict
  inlineAttachments: _TygojaDict
 }
  
                                                
  
 interface Mailer {
  [key:string]: any;
   
                                                   
   
  send(message: Message): void
 }
}

 
                                            
                                          
                                                 
                                
   
                               
                                                                            
                                    
   
                                              
                                                                      
                                                                
                                                                   
                                                                           
   
                                                                              
                                                                       
                 
   
      
                                  
      
   
                                                    
                                                     
                                     
   
                                                                                      
                                                                                    
                                                       
                                                                            
                                                                             
                  
   
                                                                                    
                                                  
   
      
                                          
      
   
                                                                                     
                                                                        
                                                                 
   
      
                                                           
      
   
                                                                                  
                                     
   
      
                                    
      
   
                        
   
      
                                                                   
      
   
                                                                                
   
      
                                                           
                                    
      
   
                        
   
      
                                                                                         
      
   
                                                                                
                                                                       
                                                           
                                               
   
                                       
   
      
                           
      
   
                                                            
                                                                          
                                                                            
                                                                                 
   
                                                
                                                                                       
                                                
                                                                                  
                                                       
   
      
                                        
      
   
                                                                            
                                                                                   
                                                           
   
           
   
                                                                                  
                                                   
                                                             
                                      
   
                                                                                      
                                                                        
                                                
                                                                              
                                  
                                                     
                                  
   
                                                              
                                                             
                                                                        
                                                                      
              
                                                                        
                     
   
      
                                                            
      
   
                                                                         
   
      
                                                                                  
                                
      
   
                                                                        
   
      
                                     
      
   
           
   
                                           
                                                                          
                                                              
                                                                    
                                                                                             
   
                                                                                     
   
      
                         
                           
                     
      
   
                                          
   
      
                                                     
      
   
                                  
   
      
                                                         
      
   
                                                             
                                                                
                                                                 
                                              
   
                                                                   
                                            
                                                                         
                                      
   
      
                                                 
                                              
                                   
      
   
                                                                                    
                                                                                
   
             
   
                                                                                   
                                                              
                                                                  
   
                                                                           
                                                           
   
                                                                      
                                                                                   
                                
   
      
                                    
      
   
                                                                               
   
                     
   
                                                                                   
                                             
   
      
                                            
      
   
                      
   
      
                                  
      
   
                                                                                    
                                                                                
        
   
                                                      
                                                
                                                                          
                         
   
                                                            
                                                                        
                                                             
   
           
   
      
                                                                       
      
   
                                                          
   
      
                                              
      
   
                                          
   
                                                                                         
                                                                                 
                                                                                 
                                                                                 
           
   
                                                                                               
                                                                                         
                                                                                                   
   
                            
   
                                                                                
                                                                               
                                                                                  
                                         
   
      
                                                                 
                                                 
     
      
   
                                        
   
      
                                               
      
   
                                                                  
   
                                                                    
                                 
                                                                    
                               
   
                         
   
                                                   
                                                      
                                                                                  
                                                                              
                                                                  
                                                       
                                               
                                                   
                                                        
                                          
                                                                         
   
                               
   
                                                                                      
                                      
   
                                                                                       
                                                                                     
                                                                                         
                                                          
   
                                                                                        
                                                                                          
                                 
   
      
                                                                                             
      
   
                                                                                      
                                  
   
      
                                                                                   
      
   
                                                                   
                               
                                                                                    
                                                                                     
                                                                  
                                                                                 
                                                                                  
   
                                                                                       
                                                   
   
      
                                                               
      
   
                                                                       
                                                       
   
      
                                     
   
                                              
                                                          
     
      
   
                                              
   
      
                                                   
      
   
                                                                          
   
                                                                        
                                                                            
                                            
                                                                          
                                                                           
   
                      
   
                                                                                        
 
namespace slog {
 
 import loginternal = internal
  
                                                                  
                                              
                                                                      
    
                                                         
                       
  
 interface Logger {
 }
 interface Logger {
   
                                 
   
  handler(): Handler
 }
 interface Logger {
   
                                                             
                                                         
                                      
   
  with(...args: any[]): (Logger)
 }
 interface Logger {
   
                                                                          
                                                                                  
                                                                             
                                     
     
                                                      
   
  withGroup(name: string): (Logger)
 }
 interface Logger {
   
                                                                                
   
  enabled(ctx: context.Context, level: Level): boolean
 }
 interface Logger {
   
                                                                                  
                                                                      
                                 
     
                                                      
        
                                                     
                                                                      
                                                                                
                      
                                                                          
        
   
  log(ctx: context.Context, level: Level, msg: string, ...args: any[]): void
 }
 interface Logger {
   
                                                                                  
   
  logAttrs(ctx: context.Context, level: Level, msg: string, ...attrs: Attr[]): void
 }
 interface Logger {
   
                                
   
  debug(msg: string, ...args: any[]): void
 }
 interface Logger {
   
                                                              
   
  debugContext(ctx: context.Context, msg: string, ...args: any[]): void
 }
 interface Logger {
   
                              
   
  info(msg: string, ...args: any[]): void
 }
 interface Logger {
   
                                                            
   
  infoContext(ctx: context.Context, msg: string, ...args: any[]): void
 }
 interface Logger {
   
                              
   
  warn(msg: string, ...args: any[]): void
 }
 interface Logger {
   
                                                            
   
  warnContext(ctx: context.Context, msg: string, ...args: any[]): void
 }
 interface Logger {
   
                                
   
  error(msg: string, ...args: any[]): void
 }
 interface Logger {
   
                                                              
   
  errorContext(ctx: context.Context, msg: string, ...args: any[]): void
 }
}

namespace sync {
 
 import isync = sync
  
                                                                  
  
 interface Locker {
  [key:string]: any;
  lock(): void
  unlock(): void
 }
}

namespace io {
  
                                                                               
  
 interface WriteCloser {
  [key:string]: any;
 }
}

namespace bufio {
  
                                                        
                                                                      
                                                                              
          
  
 interface Reader {
 }
 interface Reader {
   
                                                             
   
  size(): number
 }
 interface Reader {
   
                                                                     
                                        
                                                                                
                         
                                                                               
   
  reset(r: io.Reader): void
 }
 interface Reader {
   
                                                                               
                                                                               
                                                                              
                                                                             
                                                                      
     
                                                                                            
                                   
   
  peek(n: number): string|Array<number>
 }
 interface Reader {
   
                                                                             
     
                                                                   
                                                                        
                                           
   
  discard(n: number): number
 }
 interface Reader {
   
                            
                                                
                                                                          
                                     
                                                         
                                                                        
                                                                       
   
  read(p: string|Array<number>): number
 }
 interface Reader {
   
                                              
                                               
   
  readByte(): number
 }
 interface Reader {
   
                                                                                      
     
                                                                        
                                                                                                              
                                
   
  unreadByte(): void
 }
 interface Reader {
   
                                                                            
                                                                                     
                                                                   
   
  readRune(): [number, number]
 }
 interface Reader {
   
                                                                          
                                                                                             
                                                                                    
                              
   
  unreadRune(): void
 }
 interface Reader {
   
                                                                                   
   
  buffered(): number
 }
 interface Reader {
   
                                                                      
                                                           
                                                 
                                                                 
                                                                               
                                                                                    
                                                                 
                                                       
                                              
                                                                            
   
  readSlice(delim: number): string|Array<number>
 }
 interface Reader {
   
                                                                            
                                                                                      
     
                                                                                 
                                                                         
                                                                             
                                                                               
                                                                          
                                                                             
                
     
                                                                                    
                                                                                
                                                                                     
                                                                              
                                           
   
  readLine(): [string|Array<number>, boolean]
 }
 interface Reader {
   
                                                                      
                                                                             
                                                                 
                                                                                   
                                                                                  
           
                                                       
   
  readBytes(delim: number): string|Array<number>
 }
 interface Reader {
   
                                                                       
                                                                              
                                                                  
                                                                                   
                                                                                   
           
                                                       
   
  readString(delim: number): string
 }
 interface Reader {
   
                                    
                                                                                         
                                                                   
                                                                  
   
  writeTo(w: io.Writer): number
 }
  
                                                          
                                                                  
                                                                                  
                                                               
                                                                     
                               
  
 interface Writer {
 }
 interface Writer {
   
                                                             
   
  size(): number
 }
 interface Writer {
   
                                                                      
                                       
                                                                                
                         
                                                                               
   
  reset(w: io.Writer): void
 }
 interface Writer {
   
                                                                  
   
  flush(): void
 }
 interface Writer {
   
                                                               
   
  available(): number
 }
 interface Writer {
   
                                                                         
                                                  
                                                             
                                                                  
   
  availableBuffer(): string|Array<number>
 }
 interface Writer {
   
                                                                                         
   
  buffered(): number
 }
 interface Writer {
   
                                                    
                                            
                                                        
                            
   
  write(p: string|Array<number>): number
 }
 interface Writer {
   
                                    
   
  writeByte(c: number): void
 }
 interface Writer {
   
                                                            
                                               
   
  writeRune(r: number): number
 }
 interface Writer {
   
                                 
                                            
                                                                          
                            
   
  writeString(s: string): number
 }
 interface Writer {
   
                                                                  
                                                                      
                                                                     
                                                      
   
  readFrom(r: io.Reader): number
 }
}

namespace syscall {
 
 import errpkg = errors
  
                                                                                          
                           
    
                                                                            
                                                                               
                                      
  
 interface SysProcIDMap {
  containerID: number 
  hostID: number 
  size: number 
 }
 
 import errorspkg = errors
  
                                                            
                                                 
  
 interface Credential {
  uid: number 
  gid: number 
  groups: Array<number> 
  noSetGroups: boolean 
 }
 
 import runtimesyscall = syscall
  
                                                     
                                            
  
 interface Signal extends Number{}
 interface Signal {
  signal(): void
 }
 interface Signal {
  string(): string
 }
}

namespace time {
  
                                                             
  
 interface Month extends Number{}
 interface Month {
   
                                                                               
   
  string(): string
 }
  
                                                            
  
 interface Weekday extends Number{}
 interface Weekday {
   
                                                                          
   
  string(): string
 }
  
                                                                  
                                                                     
                                                                            
                                                                             
    
                                                                           
                                                                         
               
  
 interface Location {
 }
 interface Location {
   
                                                                     
                                                                         
   
  string(): string
 }
}

namespace fs {
}

namespace context {
}

namespace net {
  
                                                
    
                                                                                  
                                                                     
                                                           
  
 interface Addr {
  [key:string]: any;
  network(): string 
  string(): string 
 }
 
 import _cgopackage = cgo
}

 
                                                                               
                                                  
   
                                                              
                                       
   
                        
   
                                                          
            
   
                                                         
               
   
                                                 
                                                        
                                                      
                                  
   
                                              
   
                                                                               
                                    
 
namespace textproto {
  
                                                       
                           
  
 interface MIMEHeader extends _TygojaDict{}
 interface MIMEHeader {
   
                                                
                                                           
   
  add(key: string, value: string): void
 }
 interface MIMEHeader {
   
                                                       
                                                       
                                
   
  set(key: string, value: string): void
 }
 interface MIMEHeader {
   
                                                            
                                                             
                                      
                                                                    
                                                        
   
  get(key: string): string
 }
 interface MIMEHeader {
   
                                                             
                                                        
                                                                
                                   
                                      
   
  values(key: string): Array<string>
 }
 interface MIMEHeader {
   
                                                
   
  del(key: string): void
 }
}

namespace slog {
  
                                
  
 interface Attr {
  key: string
  value: Value
 }
 interface Attr {
   
                                                              
   
  equal(b: Attr): boolean
 }
 interface Attr {
  string(): string
 }
  
                                                       
    
                                                              
                                                                
                                                                   
    
                                                                       
                                                                     
                            
    
                                                                         
                                                    
    
                                                                                      
  
 interface Handler {
  [key:string]: any;
   
                                                                            
                                                      
                                                            
                                                         
                                                                      
                                                                     
                                           
                                                        
                        
   
  enabled(_arg0: context.Context, _arg1: Level): boolean
   
                               
                                                      
                                            
                                                                             
                                                               
                                                                  
                                   
     
                                                                           
        
                                                     
                                    
                                          
                                                                             
                                                    
                                                             
                                                                  
                   
        
     
                                                                        
                                      
   
  handle(_arg0: context.Context, _arg1: Record): void
   
                                                                
                                                      
                                                                     
   
  withAttrs(attrs: Array<Attr>): Handler
   
                                                                     
                                    
                                                                         
                                                                
     
                                                                    
                                                                       
                                              
     
                                                                            
                                          
     
        
                                                                                            
        
     
                       
     
        
                                                                                              
        
     
                                                          
   
  withGroup(name: string): Handler
 }
  
                                                         
                                                                 
  
 interface Level extends Number{}
 interface Level {
   
                                         
                                            
                              
                                               
                                                   
              
     
        
                                  
                                        
        
   
  string(): string
 }
 interface Level {
   
                                                     
                                             
   
  marshalJSON(): string|Array<number>
 }
 interface Level {
   
                                                         
                                                           
                   
                                                                               
                                                            
   
  unmarshalJSON(data: string|Array<number>): void
 }
 interface Level {
   
                                                  
                               
   
  appendText(b: string|Array<number>): string|Array<number>
 }
 interface Level {
   
                                                    
                                   
   
  marshalText(): string|Array<number>
 }
 interface Level {
   
                                                         
                                                           
                   
                                                                               
                                                            
   
  unmarshalText(data: string|Array<number>): void
 }
 interface Level {
   
                                
                             
   
  level(): Level
 }
 
 import loginternal = internal
}

 
                                                         
   
                                                                      
                                         
                                            
 
namespace url {
  
                                                                 
    
                                    
    
       
                                                           
       
    
                                                                            
    
       
                                     
       
    
                                                                       
                                                                         
                                                                             
                                                                            
                                                                        
                            
    
                                                                                
                                                                                 
                                                                                    
                                                                                     
                                  
    
                                                                             
                                                                                   
                     
    
                                                                       
  
 interface URL {
  scheme: string
  opaque: string 
  user?: Userinfo 
  host: string 
  path: string 
  rawPath: string 
  omitHost: boolean 
  forceQuery: boolean 
  rawQuery: string 
  fragment: string 
  rawFragment: string 
 }
 interface URL {
   
                                                    
                                                                      
                                                                         
                                                                    
                     
                                                                               
                   
                                                        
                                
   
  escapedPath(): string
 }
 interface URL {
   
                                                            
                                                                          
                                                                                     
                                                                            
                     
                                                                          
                                                            
                                    
   
  escapedFragment(): string
 }
 interface URL {
   
                                                          
                                              
     
        
                                  
                                                
        
     
                                                          
                                       
                                                  
                                                     
     
                                                   
        
                                                  
                                                
                                              
                                                            
                                                       
                                                           
                                                   
                                                   
                                                      
        
   
  string(): string
 }
 interface URL {
   
                                                                          
                                             
   
  redacted(): string
 }
  
                                                 
                                                              
                                                           
                       
  
 interface Values extends _TygojaDict{}
 interface Values {
   
                                                            
                                                                
                                                             
              
   
  get(key: string): string
 }
 interface Values {
   
                                                        
            
   
  set(key: string, value: string): void
 }
 interface Values {
   
                                                          
                                
   
  add(key: string, value: string): void
 }
 interface Values {
   
                                                
   
  del(key: string): void
 }
 interface Values {
   
                                           
   
  has(key: string): boolean
 }
 interface Values {
   
                                                      
                                        
   
  encode(): string
 }
 interface URL {
   
                                                 
                                                   
   
  isAbs(): boolean
 }
 interface URL {
   
                                                                          
                                                                 
                                                                               
   
  parse(ref: string): (URL)
 }
 interface URL {
   
                                                                      
                                                                        
                                                                       
                                                                        
                                                                        
                                            
   
  resolveReference(ref: URL): (URL)
 }
 interface URL {
   
                                                                
                                                
                                      
   
  query(): Values
 }
 interface URL {
   
                                                              
                                                        
   
  requestURI(): string
 }
 interface URL {
   
                                                                         
     
                                                                                 
                                                     
   
  hostname(): string
 }
 interface URL {
   
                                                                     
     
                                                                                  
   
  port(): string
 }
 interface URL {
  marshalBinary(): string|Array<number>
 }
 interface URL {
  appendBinary(b: string|Array<number>): string|Array<number>
 }
 interface URL {
  unmarshalBinary(text: string|Array<number>): void
 }
 interface URL {
   
                                                                           
                                                                                
                                                                          
   
  joinPath(...elem: string[]): (URL)
 }
}

namespace cobra {
 interface PositionalArgs {(cmd: Command, args: Array<string>): void }
 
 import flag = pflag
  
                                                                 
  
 interface FParseErrWhitelist extends _TygojaAny{}
  
                                                 
  
 interface Group {
  id: string
  title: string
 }
  
                                                                 
  
 interface CompletionOptions {
   
                                                                                  
   
  disableDefaultCmd: boolean
   
                                                                                
                                                    
   
  disableNoDescFlag: boolean
   
                                                                         
                      
   
  disableDescriptions: boolean
   
                                                                   
   
  hiddenDefaultCmd: boolean
   
                                                                           
                                              
   
  defaultShellCompDirective?: ShellCompDirective
 }
 interface CompletionOptions {
  setDefaultShellCompDirective(directive: ShellCompDirective): void
 }
  
                                                           
    
                              
       
                             
                                                                              
       
    
                                                                                              
    
                                                                                                                    
  
 interface Completion extends String{}
  
                                                                  
  
 interface CompletionFunc {(cmd: Command, args: Array<string>, toComplete: string): [Array<Completion>, ShellCompDirective] }
}

namespace jwt {
  
                                                                      
                                                            
  
 type _sfcSdSz = time.Time
 interface NumericDate extends _sfcSdSz {
 }
 interface NumericDate {
   
                                                                                                    
                                                                                                
   
  marshalJSON(): string|Array<number>
 }
 interface NumericDate {
   
                                                                            
                                                                    
                                                                               
                         
   
  unmarshalJSON(b: string|Array<number>): void
 }
  
                                                                           
                                                                            
                                                                    
  
 interface ClaimStrings extends Array<string>{}
 interface ClaimStrings {
  unmarshalJSON(data: string|Array<number>): void
 }
 interface ClaimStrings {
  marshalJSON(): string|Array<number>
 }
}

namespace types {
}

namespace multipart {
 interface Reader {
   
                                                                 
                                          
                                                                         
                                                                            
                             
                                                                             
            
   
  readForm(maxMemory: number): (Form)
 }
  
                                    
                                                          
                                                           
                                          
                                 
  
 interface Form {
  value: _TygojaDict
  file: _TygojaDict
 }
 interface Form {
   
                                                                    
   
  removeAll(): void
 }
  
                                                                        
                                                           
                                                                               
  
 interface File {
  [key:string]: any;
 }
  
                                                              
                                                                    
                    
  
 interface Reader {
 }
 interface Reader {
   
                                                                 
                                                                  
     
                                                                 
                                                              
                                                                    
   
  nextPart(): (Part)
 }
 interface Reader {
   
                                                                    
                                                                  
     
                                                                    
                                                   
   
  nextRawPart(): (Part)
 }
}

namespace http {
  
                                                                             
                                                          
    
                                                        
  
 interface Cookie {
  name: string
  value: string
  quoted: boolean 
  path: string 
  domain: string 
  expires: time.Time 
  rawExpires: string 
   
                                                     
                                                                
                                                                  
   
  maxAge: number
  secure: boolean
  httpOnly: boolean
  sameSite: SameSite
  partitioned: boolean
  raw: string
  unparsed: Array<string> 
 }
 interface Cookie {
   
                                                                         
                                                                     
                                      
                                                                    
   
  string(): string
 }
 interface Cookie {
   
                                               
   
  valid(): void
 }
 
 import mathrand = rand
  
                                                              
    
                                                        
                         
  
 interface Header extends _TygojaDict{}
 interface Header {
   
                                                
                                                           
                                                        
                          
   
  add(key: string, value: string): void
 }
 interface Header {
   
                                                           
                                                          
                                                            
                                                         
                                                           
   
  set(key: string, value: string): void
 }
 interface Header {
   
                                                               
                                                                 
                                                                  
                                                                
                                                                  
                             
   
  get(key: string): string
 }
 interface Header {
   
                                                             
                                                                  
                                                                
                                   
                                      
   
  values(key: string): Array<string>
 }
 interface Header {
   
                                                
                                                        
                          
   
  del(key: string): void
 }
 interface Header {
   
                                          
   
  write(w: io.Writer): void
 }
 interface Header {
   
                                                  
   
  clone(): Header
 }
 interface Header {
   
                                                
                                                                            
                                                                
   
  writeSubset(w: io.Writer, exclude: _TygojaDict): void
 }
  
                                         
                                                
    
                                
    
       
                                                     
                                                                             
    
                                                          
    
                                                                                 
       
  
 interface Protocols {
 }
 interface Protocols {
   
                                             
   
  http1(): boolean
 }
 interface Protocols {
   
                                            
   
  setHTTP1(ok: boolean): void
 }
 interface Protocols {
   
                                             
   
  http2(): boolean
 }
 interface Protocols {
   
                                            
   
  setHTTP2(ok: boolean): void
 }
 interface Protocols {
   
                                                                    
   
  unencryptedHTTP2(): boolean
 }
 interface Protocols {
   
                                                                   
   
  setUnencryptedHTTP2(ok: boolean): void
 }
 interface Protocols {
  string(): string
 }
  
                                                                 
                                  
  
 interface HTTP2Config {
   
                                                            
                                                            
                                                            
   
  maxConcurrentStreams: number
   
                                                                          
                                                                        
                 
                                     
                                                 
   
  maxDecoderHeaderTableSize: number
   
                                                                          
                                                                   
                                     
                                                 
   
  maxEncoderHeaderTableSize: number
   
                                                            
                                      
                                                         
                                                 
   
  maxReadFrameSize: number
   
                                                             
                                                           
                                                        
                                         
   
  maxReceiveBufferPerConnection: number
   
                                                     
                                                                     
                                     
                                                 
   
  maxReceiveBufferPerStream: number
   
                                                                           
                                                                       
                                           
   
  sendPingTimeout: time.Duration
   
                                                                       
                                             
                                              
   
  pingTimeout: time.Duration
   
                                                                     
                                                                            
                                                                        
   
  writeByteTimeout: time.Duration
   
                                                              
                                                 
   
  permitProhibitedCipherSuites: boolean
   
                                                        
                                                         
                                                                         
                   
   
  countError: (errType: string) => void
 }
 
 import urlpkg = url
  
                                                          
    
                                                                   
                                                              
                                                    
  
 interface Response {
  status: string 
  statusCode: number 
  proto: string 
  protoMajor: number 
  protoMinor: number 
   
                                                                    
                                                                    
                                                                         
                                                                    
                                                                       
                                                                    
                   
     
                                                                
   
  header: Header
   
                                       
     
                                                              
                                                           
                                                              
     
                                                                
                                                                
                                                             
                                                            
                                                               
                                       
     
                                                              
                                        
     
                                                          
                                                        
                                                   
   
  body: io.ReadCloser
   
                                                                    
                                                                         
                                                                       
                       
   
  contentLength: number
   
                                                                        
                                                 
   
  transferEncoding: Array<string>
   
                                                                     
                                                                        
                                                              
   
  close: boolean
   
                                                                      
                                                                  
                                                                   
                                                                      
                                                                       
                                                               
                                                          
   
  uncompressed: boolean
   
                                                    
                      
     
                                                            
                                                        
                                                 
     
                                                              
                 
     
                                                              
                                           
   
  trailer: Header
   
                                                                  
                                                          
                                                
   
  request?: Request
   
                                                                   
                                                                
                                                              
              
   
  tls?: any
 }
 interface Response {
   
                                                                          
   
  cookies(): Array<(Cookie | undefined)>
 }
 interface Response {
   
                                                                  
                                                            
                                                          
                                
   
  location(): (url.URL)
 }
 interface Response {
   
                                                        
                                             
   
  protoAtLeast(major: number, minor: number): boolean
 }
 interface Response {
   
                                                                
                                                                    
     
                                                                 
     
        
                
                
                
                    
                      
             
          
                   
                                                                            
        
     
                                                  
   
  write(w: io.Writer): void
 }
  
                                                                        
                                                      
  
 interface ConnState extends Number{}
 interface ConnState {
  string(): string
 }
}

namespace cron {
  
                                             
  
 interface Job {
 }
 interface Job {
   
                                
   
  id(): string
 }
 interface Job {
   
                                                               
   
  expression(): string
 }
 interface Job {
   
                                    
   
  run(): void
 }
 interface Job {
   
                                                                   
                               
   
  marshalJSON(): string|Array<number>
 }
}

 
                                             
                                                     
                            
                                                           
 
namespace oauth2 {
  
                                                      
  
 interface AuthCodeOption {
  [key:string]: any;
 }
  
                                                      
                                                               
                       
    
                                                                
                                                                 
                                         
  
 interface Token {
   
                                                               
                  
   
  accessToken: string
   
                                    
                                                                  
   
  tokenType: string
   
                                                           
                                                         
                   
   
  refreshToken: string
   
                                                                
     
                                                               
                                                 
                                                      
   
  expiry: time.Time
   
                                                            
                                                              
                                                                 
                                                       
                                             
   
  expiresIn: number
 }
 interface Token {
   
                                                          
   
  type(): string
 }
 interface Token {
   
                                                                      
                
     
                                                                        
                              
   
  setAuthHeader(r: http.Request): void
 }
 interface Token {
   
                                                                       
                                                                      
                                          
   
  withExtra(extra: any): (Token)
 }
 interface Token {
   
                                  
                                                               
                                          
   
  extra(key: string): any
 }
 interface Token {
   
                                                                                
   
  valid(): boolean
 }
}

namespace sql {
  
                                                                          
  
 interface IsolationLevel extends Number{}
 interface IsolationLevel {
   
                                                                
   
  string(): string
 }
  
                                         
  
 interface DBStats {
  maxOpenConnections: number 
   
                
   
  openConnections: number 
  inUse: number 
  idle: number 
   
             
   
  waitCount: number 
  waitDuration: time.Duration 
  maxIdleClosed: number 
  maxIdleTimeClosed: number 
  maxLifetimeClosed: number 
 }
  
                                                                               
                                                                            
                                                     
    
                                                                               
                                                    
    
                                                       
                                       
  
 interface Conn {
 }
 interface Conn {
   
                                                                        
   
  pingContext(ctx: context.Context): void
 }
 interface Conn {
   
                                                             
                                                              
   
  execContext(ctx: context.Context, query: string, ...args: any[]): Result
 }
 interface Conn {
   
                                                                         
                                                              
   
  queryContext(ctx: context.Context, query: string, ...args: any[]): (Rows)
 }
 interface Conn {
   
                                                                                 
                                                                              
                                      
                                                                           
                                                                         
              
   
  queryRowContext(ctx: context.Context, query: string, ...args: any[]): (Row)
 }
 interface Conn {
   
                                                                                 
                                                                    
                        
                                                              
                                            
     
                                                                                   
                                
   
  prepareContext(ctx: context.Context, query: string): (Stmt)
 }
 interface Conn {
   
                                                                     
                                                                 
     
                                                                                             
                                  
   
  raw(f: (driverConn: any) => void): void
 }
 interface Conn {
   
                                  
     
                                                                                    
                                                               
                                                                                 
                         
     
                                                                                    
                                                                              
                               
   
  beginTx(ctx: context.Context, opts: TxOptions): (Tx)
 }
 interface Conn {
   
                                                         
                                                                 
                                                                      
                                                                       
                                                                
   
  close(): void
 }
  
                                                      
  
 interface ColumnType {
 }
 interface ColumnType {
   
                                                  
   
  name(): string
 }
 interface ColumnType {
   
                                                                                
                                                                                   
                                                               
                                                                                   
                               
   
  length(): [number, boolean]
 }
 interface ColumnType {
   
                                                                   
                                                       
   
  decimalSize(): [number, number, boolean]
 }
 interface ColumnType {
   
                                                                             
                                                                    
                                    
   
  scanType(): any
 }
 interface ColumnType {
   
                                                     
                                                                 
   
  nullable(): [boolean, boolean]
 }
 interface ColumnType {
   
                                                                                      
                                                                    
                                                                                                      
                      
                                                                                
                         
   
  databaseTypeName(): string
 }
  
                                                                      
  
 interface Row {
 }
 interface Row {
   
                                                                 
                                                                          
                                            
                                                                     
                                         
   
  scan(...dest: any[]): void
 }
 interface Row {
   
                                                          
                                             
                                                                                 
                                                                                
   
  err(): void
 }
}

namespace store {
}

namespace hook {
  
                                                                       
  
 type _sJrziLV<T> = Hook<T>
 interface mainHook<T> extends _sJrziLV<T> {
 }
}

namespace subscriptions {
}

namespace search {
  
                                                                        
  
 interface MultiMatchSubquery {
  targetTableAlias: string
  fromTableName: string
  fromTableAlias: string
  valueIdentifier: string
  joins: Array<(Join | undefined)>
  params: dbx.Params
 }
 interface MultiMatchSubquery {
   
                                                       
     
                                           
   
  build(db: dbx.DB, params: dbx.Params): string
 }
 interface NullFallbackPreference extends Number{}
}

namespace router {
 
 import validation = ozzo_validation
  
                                                                      
                                                     
  
 interface RouterGroup<T> {
  prefix: string
  middlewares: Array<(hook.Handler<T> | undefined)>
 }
 interface RouterGroup<T> {
   
                                                                      
                               
     
                                                                                          
                                                                                 
                                                                     
     
                                                                      
                                               
   
  group(prefix: string): (RouterGroup<T>)
 }
 interface RouterGroup<T> {
   
                                                                                  
     
                                                                                   
                                                     
     
                                                                              
                                                                             
   
  bindFunc(...middlewareFuncs: ((e: T) => void)[]): (RouterGroup<T>)
 }
 interface RouterGroup<T> {
   
                                                                             
   
  bind(...middlewares: (hook.Handler<T> | undefined)[]): (RouterGroup<T>)
 }
 interface RouterGroup<T> {
   
                                                                    
                                                      
     
                                                                           
                                             
   
  unbind(...middlewareIds: string[]): (RouterGroup<T>)
 }
 interface RouterGroup<T> {
   
                                                           
     
                                                                                                             
                                                                                 
                                                                                     
     
                                                                               
   
  route(method: string, path: string, action: (e: T) => void): (Route<T>)
 }
 interface RouterGroup<T> {
   
                                                                                                     
   
  any(path: string, action: (e: T) => void): (Route<T>)
 }
 interface RouterGroup<T> {
   
                                                                            
   
  get(path: string, action: (e: T) => void): (Route<T>)
 }
 interface RouterGroup<T> {
   
                                                                                  
   
  search(path: string, action: (e: T) => void): (Route<T>)
 }
 interface RouterGroup<T> {
   
                                                                              
   
  post(path: string, action: (e: T) => void): (Route<T>)
 }
 interface RouterGroup<T> {
   
                                                                                  
   
  delete(path: string, action: (e: T) => void): (Route<T>)
 }
 interface RouterGroup<T> {
   
                                                                                
   
  patch(path: string, action: (e: T) => void): (Route<T>)
 }
 interface RouterGroup<T> {
   
                                                                            
   
  put(path: string, action: (e: T) => void): (Route<T>)
 }
 interface RouterGroup<T> {
   
                                                                              
   
  head(path: string, action: (e: T) => void): (Route<T>)
 }
 interface RouterGroup<T> {
   
                                                                                    
   
  options(path: string, action: (e: T) => void): (Route<T>)
 }
 interface RouterGroup<T> {
   
                                                                        
                                                        
     
                                                                         
                                                 
     
                                                                                         
                                                                          
   
  hasRoute(method: string, path: string): boolean
 }
}

namespace url {
  
                                                                   
                                                                          
                                                                       
                              
  
 interface Userinfo {
 }
 interface Userinfo {
   
                                   
   
  username(): string
 }
 interface Userinfo {
   
                                                                            
   
  password(): [string, boolean]
 }
 interface Userinfo {
   
                                                                         
                              
   
  string(): string
 }
}

namespace search {
  
                                                                     
  
 interface Join {
  tableName: string
  tableAlias: string
  on: dbx.Expression
 }
}

namespace multipart {
  
                                                        
  
 interface Part {
   
                                                                 
                                                              
                                                     
   
  header: textproto.MIMEHeader
 }
 interface Part {
   
                                                                       
                                                                 
   
  formName(): string
 }
 interface Part {
   
                                                                                
                                                                                 
                                               
   
  fileName(): string
 }
 interface Part {
   
                                                                    
                               
   
  read(d: string|Array<number>): number
 }
 interface Part {
  close(): void
 }
}

namespace http {
  
                                                                                  
                                                                            
                                                                                 
                                                               
    
                                                                                       
  
 interface SameSite extends Number{}
 
 import mathrand = rand
 
 import urlpkg = url
}

namespace router {
 
 import validation = ozzo_validation
 interface Route<T> {
  action: (e: T) => void
  method: string
  path: string
  middlewares: Array<(hook.Handler<T> | undefined)>
 }
 interface Route<T> {
   
                                                                                  
     
                                                                                   
                                                     
     
                                                                              
                                                                           
   
  bindFunc(...middlewareFuncs: ((e: T) => void)[]): (Route<T>)
 }
 interface Route<T> {
   
                                                                             
   
  bind(...middlewares: (hook.Handler<T> | undefined)[]): (Route<T>)
 }
 interface Route<T> {
   
                                                                                            
     
                                                                                                  
                                                                                
     
                                                                         
                                                          
   
  unbind(...middlewareIds: string[]): (Route<T>)
 }
}

namespace slog {
 
 import loginternal = internal
  
                                                 
                                   
                                                          
                                            
                                                             
  
 interface Record {
   
                                                                      
   
  time: time.Time
   
                     
   
  message: string
   
                            
   
  level: Level
   
                                                                              
                                                                  
     
                                                           
                                                                     
                         
   
  pc: number
 }
 interface Record {
   
                                                             
                                                           
                                         
   
  clone(): Record
 }
 interface Record {
   
                                                               
   
  numAttrs(): number
 }
 interface Record {
   
                                                
                                        
   
  attrs(f: (_arg0: Attr) => boolean): void
 }
 interface Record {
   
                                                                      
                           
   
  addAttrs(...attrs: Attr[]): void
 }
 interface Record {
   
                                                                 
                                                            
                           
   
  add(...args: any[]): void
 }
 interface Record {
   
                                                                
                                                                                              
                                                          
   
  source(): (Source)
 }
  
                                                            
                                                             
                                      
  
 interface Value {
 }
 interface Value {
   
                           
   
  kind(): Kind
 }
 interface Value {
   
                                     
   
  any(): any
 }
 interface Value {
   
                                                                                  
                                                                      
                                     
   
  string(): string
 }
 interface Value {
   
                                                   
                                  
   
  int64(): number
 }
 interface Value {
   
                                                    
                                     
   
  uint64(): number
 }
 interface Value {
   
                                                
                        
   
  bool(): boolean
 }
 interface Value {
   
                                                               
                                 
   
  duration(): time.Duration
 }
 interface Value {
   
                                                      
                           
   
  float64(): number
 }
 interface Value {
   
                                                       
                             
   
  time(): time.Time
 }
 interface Value {
   
                                                          
                             
   
  logValuer(): LogValuer
 }
 interface Value {
   
                                         
                                                
   
  group(): Array<Attr>
 }
 interface Value {
   
                                                               
   
  equal(w: Value): boolean
 }
 interface Value {
   
                                                                            
                            
                                                                                 
              
                                                                               
                       
                                                                            
   
  resolve(): Value
 }
}

namespace cobra {
 
 import flag = pflag
  
                                                                                  
                                                                  
  
 interface ShellCompDirective extends Number{}
}

namespace oauth2 {
}

namespace router {
 
 import validation = ozzo_validation
}

namespace slog {
 
 import loginternal = internal
  
                                                           
  
 interface Source {
   
                                                                        
                                                                        
                                                                        
   
  function: string
   
                                                                            
                                                                              
   
  file: string
  line: number
 }
  
                                  
  
 interface Kind extends Number{}
 interface Kind {
  string(): string
 }
  
                                                                                 
    
                                                                           
                                                                      
  
 interface LogValuer {
  [key:string]: any;
  logValue(): Value
 }
}
