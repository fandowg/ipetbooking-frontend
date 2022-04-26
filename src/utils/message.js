import { Message } from 'element-ui';

export function messageStroe(state){
  if(state==='add'){
    Message({
      message:'已新增',
      type:'success'
    });
  }
  if(state==='edit'){
    Message({
      message:'已儲存',
      type:'success'
    });
  }
}

export function messageDelete(){

    Message({
      message:'已刪除',
      type:'success'
    });


}