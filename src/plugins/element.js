import Vue from 'vue'

import ZkTable from 'vue-table-with-tree-grid'

Vue.use(ZkTable)

import { Form, FormItem, Button, Input,Message,Header,Container,Aside,Main,Menu,Submenu,
  MenuItem,MenuItemGroup,Breadcrumb,BreadcrumbItem,Row, Col,Card,Table,
  TableColumn, Switch,Pagination,Dialog,Tag, MessageBox,Tree,Tooltip, Select, Option,
  Cascader} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Input)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Header)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(BreadcrumbItem)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Tooltip)
Vue.use( Select)
Vue.use(Option)
Vue.use(Cascader)
// Vue.use(MessageBox)
Vue.prototype.$message=Message
Vue.prototype.$confirm = MessageBox.confirm;
