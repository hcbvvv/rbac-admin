/*
 * @Author       : Cheng
 * @Date         : 2025-09-10 14:13:37
 * @LastEditors  : Cheng
 * @LastEditTime : 2025-09-10 14:13:41
 * @FilePath     : \rbac-admin\src\utils\antdGlobal.jsx
 * @description  : 
 */
/*
 * @Author       : Cheng
 * @Date         : 2025-09-10 13:46:23
 * @LastEditors  : Cheng
 * @LastEditTime : 2025-09-10 14:02:52
 * @FilePath     : \court-zfxt-admin\src\utils\AntdGlobal.jsx
 * @description  : 
 */
import { App } from "antd";

let message,notification,modal;

export default () =>{
    const staticFunction = App.useApp()
    message = staticFunction.message;
    notification = staticFunction.notification;
    modal = staticFunction.modal;
    return null;
}

export {message,notification,modal}