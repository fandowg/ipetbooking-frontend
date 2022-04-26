import { MessageBox } from 'element-ui';

export function messageBoxLeave(pageTitle){
 return MessageBox.confirm(
    `尚未完成新增，請問是否確定離開新增${pageTitle}`,
    '您將離開此頁面',
    {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true,
      showClose: false,
    }
  )
}
export function messageBoxDelete(itemName){
  return MessageBox.confirm(
     `您確定要刪除${itemName}嗎？`,
     '確認刪除',
     {
       confirmButtonText: '刪除',
       cancelButtonText: '取消',
       type: 'warning',
       center: true,
       showClose: false,
     }
   )
 }
