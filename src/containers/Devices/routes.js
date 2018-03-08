import EmptyMessage from '../../components/EmptyMessage'
import DevicesContent from './components/DevicesContent'
import Enroll from './components/Enroll'
import DevicesEditOne from './components/DevicesEditOne'
import DevicesEdit from './components/DevicesEdit'

const routes = [
  {
    path: '/',
    name: 'No selected',
    component: EmptyMessage,
    exact: true
  },
  {
    path: '/add',
    name: 'Add',
    component: Enroll,
    exact: true
  },
  {
    path: '/edit',
    name: 'Edit',
    component: DevicesEdit,
    exact: true
  },
  {
    path: '/:id/edit',
    name: 'Edit one',
    component: DevicesEditOne,
    exact: true
  },
  {
    path: '/:id',
    name: 'Selected',
    component: DevicesContent,
    exact: false
  }
]

export default routes