import { Notification } from 'element-ui';
import router from '@router'

export function notification(from,to,link){
  Notification({
    title:'提示',
    dangerouslyUseHTMLString: true,
    message:`已更新${from}!
    <br>您可前往
    <a href="/${link}" style="cursor: pointer;">${to}</a>
    進行更多設定`,
    // onClick(){
    //   router.push({
    //         name:'staff'
    //       })
    // }
  })
}

