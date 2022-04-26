// Browser Desktop Notification
// https://cythilya.github.io/2017/07/09/notification/?fbclid=IwAR3q1et26Xv-iCjjlh8fLg8dz5yeEUuBFjHG52xPdBpp77rXjUIPzHSiZvI
if(process.env.VUE_APP_BUILD_MODE !== 'admin-app-build') {
  if('Notification' in window){
    if (Notification.permission === 'default' || Notification.permission === 'undefined') {
      // console.log(Notification)
      Notification.requestPermission(function(permission) {
        console.log(permission)
        // permission 可為「granted」（同意）、「denied」（拒絕）和「default」（未授權）
        // 在這裡可針對使用者的授權做處理
      });
    }
  }
}

