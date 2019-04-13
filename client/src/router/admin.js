import Index from '@/pages/Admin/Index';
import New from '@/pages/Admin/New';
import Products from '@/pages/Admin/Products';
import Edit from '@/pages/Admin/Edit';

export default {
  path: '/admin',
  component: Index,
  children: [
    {
      path: 'new',
      name: 'New',
      component: New,
      meta: { 
        title: 'New Product'
      }, 
    },
    {
      path: '',
      name: 'Products',
      component: Products,
      meta: {
        title: 'All Products'
      },  
    },
    {
      path: 'edit/:id',
      name: 'Edit',
      component: Edit,
    },
  ],
};