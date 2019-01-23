//
//  couchbase_lite.m
//  OjoMetropolitano
//
//  Created by Jesus Reynaga Rodriguez on 22/01/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(couchbase_lite_native, NSObject)

+(BOOL)requiresMainQueueSetup{
  return YES;
}

@end
