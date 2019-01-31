//
//  couchbase_lite_package.m
//  OjoMetropolitano
//
//  Created by Jesus Reynaga Rodriguez on 27/01/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(couchbase_lite_native, NSObject)

RCT_EXTERN_METHOD(userDataDocExist :(RCTResponseSenderBlock)errorCallback :(RCTResponseSenderBlock)successCallback)

RCT_EXTERN_METHOD(setUserdataDocTXT :(NSString *)userDataResponse :(NSString *)userName)

RCT_EXTERN_METHOD(deleteUserDataDoc :(RCTResponseSenderBlock)errorCallback :(RCTResponseSenderBlock)successCallback)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}
@end
