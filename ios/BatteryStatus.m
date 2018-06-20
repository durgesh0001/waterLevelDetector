#import "BatteryStatus.h"

@implementation BatteryStatus
RCT_EXPORT_MODULE(BatteryStatus)

- (instancetype)init
{
 if ((self = [super init])) {

   [[UIDevice currentDevice] setBatteryMonitoringEnabled:YES];

 }
 return self;
}

RCT_EXPORT_METHOD(hide) {
}

RCT_EXPORT_METHOD(updateBatteryLevel:(RCTResponseSenderBlock)callback)
{
 callback(@[[self getBatteryStatus]]);
}

 //manually get battery status by calling following method

-(NSDictionary*)getBatteryStatus
{

 float batteryLevel = [UIDevice currentDevice].batteryLevel;

 NSObject* currentLevel = nil;

 currentLevel = [NSNumber numberWithFloat:(batteryLevel * 100)];

 NSMutableDictionary* batteryData = [NSMutableDictionary dictionaryWithCapacity:2];

 [batteryData setObject:currentLevel forKey:@"level"];
 return batteryData;

  }
-(NSArray<NSString *> *)supportedEvents{
  return @[@"level"];
}

@end
