//
//  RCTMLModule.m
//  yesboss
//
//  Created by imac on 19/08/2021.
//

#import "RCTMLModule.h"
#import <React/RCTLog.h>
#import <yesboss-Swift.h>
#import <TensorFlowLiteTaskText/TFLNLClassifier.h>

@implementation RCTMLModule

// To export a module named RCTCalendarModule
{
  bool hasListeners;
}

RCT_EXPORT_MODULE();


// Will be called when this module's first listener is added.
-(void)startObserving {
    hasListeners = YES;
    // Set up any upstream listeners or background tasks as necessary
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
    // Remove upstream listeners, stop unnecessary background tasks
}

- (void)classificationEventReceived:(NSString *)result
{
  if (hasListeners) { // Only send events if anyone is listening
    [self sendEventWithName:@"ML_RESULT" body:@{@"RESULT": result}];
  }
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"ML_RESULT"];
}

RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location)
{
  
  RCTLogInfo(@"Pretending to create an event %@ at %@", name, location);
  RNTextClassification* classification = [[RNTextClassification alloc]init];
  
  [classification sayHello];
  RCTLogInfo(@"HELLO SAID");
}

RCT_EXPORT_METHOD(classify:(NSString *)text){
  
  RNTextClassification* classification = [[RNTextClassification alloc]init];
  NSString * results =[classification classifyWithData: text];
  NSLog(@"Classification result %@",results);
  
  [self classificationEventReceived:(results)];


  RCTLogInfo(@"Classifying text %@", text);
  
}

RCT_EXPORT_METHOD(loadModel:(NSString *)modelPath){
  
  RNTextClassification* classification = [[RNTextClassification alloc]init];
  [classification loadModelWithData: modelPath];


  RCTLogInfo(@"model loaded successfully");
}

@end
