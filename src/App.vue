<template>
  <div class="container">
    <global-header :user="user" />
    <!-- <column-list :list="list" /> -->
    <validate-form action="" @validate-form="validateForm">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input
          :rule="emailRules" v-model="inputValue"
          placeholder="请输入邮箱地址"
          type="text"
        />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input
          type="password"
          placeholder="请输入密码"
          :rule="passwordRules"
          v-model="passwordVal"
        />
      </div>
    </validate-form>
  </div>
</template>

<script lang="ts">
import 'bootstrap/dist/css/bootstrap.min.css'
import { defineComponent, reactive, ref } from 'vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import validateInput, { InputRule } from './components/ValidateInput.vue'
import ValidateForm from './components/ValidateForm.vue'

const emailRules: InputRule[] = [
  { type: 'required', message: '电子邮箱地址不能为空' },
  { type: 'email', message: '请输入正确的电子邮箱格式' }
]

const testUser: UserProps = {
  isLogin: true,
  id: 1,
  name: 'liuyong'
}
export default defineComponent({
  name: 'App',
  components: {
    // ColumnList,
    GlobalHeader,
    validateInput,
    ValidateForm
  },
  setup () {
    const emailRef = reactive({
      val: '',
      error: false,
      message: ''
    })
    const inputValue = ref('')
    const passwordVal = ref('')
    const passwordRules: InputRule[] = [
      { type: 'required', message: '密码不能为空' }
    ]
    const validateForm = (result: boolean) :void => {
      console.log('result', result)
    }

    return {
      user: testUser,
      emailRef,
      emailRules,
      inputValue,
      passwordVal,
      passwordRules,
      validateForm
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
