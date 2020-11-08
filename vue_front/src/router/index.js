import Vue from 'vue'
import VueRouter from 'vue-router'
import Alphabet from '../views/Alphabet.vue'
import About from '../views/About.vue'
import Contact from '../views/Contact.vue'
import Axios from '@/plugins/axios'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Alphabet,
    children: [
      {
        path: '',
        name: 'Alphabet',
        component: () => import('@/components/WordList.vue')
      },
      {
        path: '/word/:wordId',
        name: 'SingleWord',
        component: () => import('@/components/SingleWord.vue')
      },
      {
        path: '/user/list',
        name: 'UserWords',
        component: () => import('@/components/userCards/UserWords.vue'),
        // თუ მომხმარებელი არ არსებობს გადაამისამართოს მთავარ გვერდზე
        // if no user redirect to main
        beforeEnter: (to, from, next) => {
          let token = localStorage.getItem('emisToken')
          if (token) {
            next()
          } else {
            next({ path: '/' })
          }
        }
      },
      {
        path: 'user/word/:wordId',
        name: 'UserSingleWord',
        component: () => import('@/components/userCards/UserSingleWord.vue'),
        // თუ მომხმარებელი არ არსებობს გადაამისამართოს მთავარ გვერდზე
        // if no user redirect to main
        beforeEnter: (to, from, next) => {
          let user = localStorage.getItem('User')
          if (!user) {
            next()
          } else {
            next({ path: '/' })
          }
        }
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/signing',
    name: 'Signing',
    component: () => import('@/views/auth/Signing.vue')
  },
  {
    path: '/credentialsReset',
    name: 'reset',
    component: () => import('@/views/auth/Reset.vue')
  },
  {
    path: '/credentialsReset/:token',
    name: 'credentialsReset',
    component: () => import('@/views/auth/Reset.vue'),
    beforeEnter(to, from, next) {
      let token = to.params.token || null
      if (token) {
        Axios.post(`Account/MailConfirmation/${token}`).then(result => {
          store.commit('auth/SET_MESSAGE', result.data)
          if (result.data.success) {
            localStorage.setItem('emisReset', token)
            next('/credentialsReset')
          } else {
            next('/')
          }
        })
      }
    }
  },
  {
    path: '/confirmEmail',
    name: 'mailConfirm',
    component: () => import('@/views/auth/ConfirmEmail.vue')
  },
  {
    path: '/signing/:token',
    name: 'validation',
    beforeEnter(to, from, next) {
      let token = to.params.token || null
      if (token) {
        Axios.post(`Account/MailConfirmation/${token}`).then(result => {
          store.commit('auth/SET_MESSAGE', result.data)

          next('/signing')
        })
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
