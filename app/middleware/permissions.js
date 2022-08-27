import request from 'superagent'
import { permission } from '../store'

export default async () => {
  console.log('middleware:permissions');

  const member_id = localStorage.getItem('member_id');
  if (member_id) {
    await permission.getItems();
    await permission.getMenus();
  }
}