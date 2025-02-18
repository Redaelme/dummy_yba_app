#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UNUserNotificationCenter.h>
#import "RNAppAuthAuthorizationFlowManager.h"

    //@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>
    @interface AppDelegate : UIResponder<UIApplicationDelegate, RNAppAuthAuthorizationFlowManager>

@property(nonatomic, weak)id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;

@property (nonatomic, strong) UIWindow *window;

@end
